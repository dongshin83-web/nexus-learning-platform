import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const edge = process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const url = process.argv[2] || "http://127.0.0.1:8787/team_technical_assets_library.html#register";
const sample = path.join(root, "assets", "registration-guide", "technical-asset-multiple-connections-example.json");
const output = path.join(root, "assets", "registration-guide");
const port = 9400 + (process.pid % 400);
const profile = path.join(os.tmpdir(), `registration-guide-capture-${process.pid}`);
const browser = spawn(edge, ["--headless=new", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
browser.unref();
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function endpoint() {
  for (let index = 0; index < 50; index += 1) {
    try { return await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); }
    catch { await pause(100); }
  }
  throw new Error("Edge debugging endpoint did not start.");
}

let socket;
try {
  await endpoint();
  const page = await (await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent(url)}`, { method: "PUT" })).json();
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let id = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(String(data));
    if (!message.id || !pending.has(message.id)) return;
    const request = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) request.reject(new Error(message.error.message)); else request.resolve(message.result);
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    pending.set(requestId, { resolve, reject });
    socket.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };
  const waitFor = async (expression) => {
    for (let index = 0; index < 50; index += 1) {
      if (await evaluate(expression)) return;
      await pause(100);
    }
    throw new Error(`Timed out: ${expression}`);
  };
  const capture = async (name) => {
    await pause(150);
    const screenshot = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: false });
    fs.writeFileSync(path.join(output, name), Buffer.from(screenshot.data, "base64"));
  };

  await command("Emulation.setDeviceMetricsOverride", { width: 1056, height: 968, deviceScaleFactor: 1, mobile: false });
  await waitFor("document.readyState === 'complete' && document.getElementById('asset-registration-dialog')?.open");
  const documentNode = await command("DOM.getDocument", { depth: 1 });
  const fileNode = await command("DOM.querySelector", { nodeId: documentNode.root.nodeId, selector: "#registration-json-file" });
  await command("DOM.setFileInputFiles", { nodeId: fileNode.nodeId, files: [sample] });
  await waitFor("!document.getElementById('registration-next').disabled");

  await evaluate("document.getElementById('registration-next').click()");
  await waitFor("!document.querySelector('[data-registration-step=\"2\"]').hidden");
  await evaluate("document.querySelector('.asset-registration-body').scrollTop = 0");
  await capture("step4-01-basic-information.png");

  await evaluate("document.getElementById('registration-next').click()");
  await waitFor("!document.querySelector('[data-registration-step=\"3\"]').hidden");
  await evaluate("document.querySelector('.asset-registration-body').scrollTop = 0");
  await capture("step4-02-library-and-links.png");

  await evaluate("document.querySelector('[data-framework-panel=\"technology-map\"]').scrollIntoView({ block: 'start' })");
  await capture("step4-03-framework-connections.png");

  await evaluate("document.getElementById('registration-next').click()");
  await waitFor("!document.querySelector('[data-registration-step=\"4\"]').hidden");
  await evaluate("document.querySelector('.asset-registration-body').scrollTop = 0");
  await capture("step4-04-review-register.png");
  process.stdout.write("REGISTRATION_GUIDE_SCREENSHOTS_CAPTURED\n");
} finally {
  socket?.close();
  spawnSync("taskkill", ["/PID", String(browser.pid), "/T", "/F"], { stdio: "ignore" });
  await pause(500);
  try { fs.rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}
}
