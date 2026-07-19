import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";

const url = process.argv[2] || "http://127.0.0.1:8787/team_technical_assets_registration.html";
const screenshotPath = process.argv[3] ? path.resolve(process.argv[3]) : "";
const edge = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = 9300 + (process.pid % 500);
const profile = path.join(os.tmpdir(), `registration-guide-audit-${process.pid}`);
if (!fs.existsSync(edge)) throw new Error(`Edge executable not found: ${edge}`);

const browser = spawn(edge, [
  "--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`,
  `--user-data-dir=${profile}`, "about:blank",
], { stdio: "ignore" });
browser.unref();

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function waitForEndpoint() {
  for (let index = 0; index < 50; index += 1) {
    try { return await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); }
    catch { await pause(100); }
  }
  throw new Error("Edge debugging endpoint did not start.");
}

let socket;
try {
  await waitForEndpoint();
  const page = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let requestId = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(String(data));
    if (!message.id || !pending.has(message.id)) return;
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message)); else resolve(message.result);
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++requestId;
    pending.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  await command("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });

  for (let index = 0; index < 50; index += 1) {
    if (await evaluate("document.readyState === 'complete' && document.querySelectorAll('.registration-stage-list').length === 9")) break;
    await pause(100);
  }

  const report = await evaluate(`(async () => {
    const keys = ['vd-request','cor','methodology','bp','technical-report','knowhow','tool-manual','education-material','external-report'];
    const results = [];
    for (const key of keys) {
      document.querySelector('[data-asset-tab="' + key + '"]').click();
      await new Promise((resolve) => setTimeout(resolve, 20));
      const panel = document.getElementById('panel-' + key);
      const stages = [...panel.querySelectorAll(':scope > .registration-stage-list > .registration-stage-item')];
      stages[3].querySelector('.registration-stage-toggle').click();
      await new Promise((resolve) => setTimeout(resolve, 20));
      const cards = [...panel.querySelectorAll('.registration-walkthrough-step')];
      const images = cards.map((card) => card.querySelector('img'));
      images.forEach((image) => { image.loading = 'eager'; });
      await Promise.all(images.map((image) => image.complete ? null : new Promise((resolve) => {
        image.addEventListener('load', resolve, { once: true });
        image.addEventListener('error', resolve, { once: true });
        setTimeout(resolve, 2000);
      })));
      results.push({
        key,
        hidden: panel.hidden,
        stageCount: stages.length,
        heading: panel.querySelector('.registration-capture-heading p')?.innerText || '',
        captures: cards.map((card) => {
          const image = card.querySelector('img');
          const canvas = card.querySelector('.registration-capture-canvas').getBoundingClientRect();
          const regions = [...card.querySelectorAll('.registration-screen-region')].map((region) => {
            const rect = region.getBoundingClientRect();
            return {
              label: region.innerText.trim(),
              within: rect.left >= canvas.left - 1 && rect.top >= canvas.top - 1 && rect.right <= canvas.right + 1 && rect.bottom <= canvas.bottom + 1,
            };
          });
          return { src: image.getAttribute('src'), loaded: image.complete && image.naturalWidth === 1056 && image.naturalHeight === 968, regions };
        }),
      });
    }
    return results;
  })()`);

  const expectedRegions = [4, 2, 2, 3];
  assert.equal(report.length, 9);
  report.forEach((item) => {
    assert.equal(item.hidden, false, `${item.key}: selected panel is hidden`);
    assert.equal(item.stageCount, 4, `${item.key}: expected four registration stages`);
    assert.match(item.heading, /공통 화면/, `${item.key}: common-screen explanation is missing`);
    assert.equal(item.captures.length, 4, `${item.key}: expected four captures`);
    item.captures.forEach((capture, index) => {
      assert.equal(capture.loaded, true, `${item.key}: capture ${index + 1} did not load at 1056x968`);
      assert.equal(capture.regions.length, expectedRegions[index], `${item.key}: capture ${index + 1} region count mismatch`);
      assert.ok(capture.regions.every((region) => region.within), `${item.key}: capture ${index + 1} contains an out-of-bounds region`);
    });
  });
  if (screenshotPath) {
    const clip = await evaluate(`(() => {
      const rect = document.querySelector('#panel-external-report .registration-walkthrough-step:last-child .registration-capture-canvas').getBoundingClientRect();
      return { x: rect.left + scrollX, y: rect.top + scrollY, width: rect.width, height: rect.height, scale: 1 };
    })()`);
    const capture = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip });
    fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
    fs.writeFileSync(screenshotPath, Buffer.from(capture.data, "base64"));
  }
  process.stdout.write(`${JSON.stringify(report.map((item) => ({ type: item.key, stages: item.stageCount, captures: item.captures.length, regions: item.captures.map((capture) => capture.regions.length) })), null, 2)}\n`);
  process.stdout.write("REGISTRATION_GUIDE_UI_AUDIT_OK\n");
} finally {
  socket?.close();
  spawnSync("taskkill", ["/PID", String(browser.pid), "/T", "/F"], { stdio: "ignore" });
  await pause(500);
  if (profile.startsWith(os.tmpdir())) {
    try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); }
    catch (error) { process.stderr.write(`WARN audit profile cleanup: ${error.message}\n`); }
  }
}
