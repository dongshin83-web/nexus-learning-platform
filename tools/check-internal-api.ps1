param([int]$Port = 18787)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$tempRoot = Join-Path ([System.IO.Path]::GetTempPath()) "technical-assets-api-check"
$database = Join-Path $tempRoot "check.sqlite"
New-Item -ItemType Directory -Path $tempRoot -Force | Out-Null
if (Test-Path -LiteralPath $database) { Remove-Item -LiteralPath $database -Force }

& node --test (Join-Path $root "tests/backend-api.test.mjs")
if ($LASTEXITCODE -ne 0) { throw "Backend API 자동시험에 실패했습니다." }

$startInfo = New-Object System.Diagnostics.ProcessStartInfo
$startInfo.FileName = (Get-Command node).Source
$startInfo.Arguments = '"' + (Join-Path $root "server/index.mjs") + '"'
$startInfo.WorkingDirectory = $root
$startInfo.UseShellExecute = $false
$startInfo.CreateNoWindow = $true
$startInfo.Environment["TECH_ASSET_PORT"] = [string]$Port
$startInfo.Environment["TECH_ASSET_DB_PATH"] = $database
$startInfo.Environment["TECH_ASSET_AUTH_MODE"] = "development"
$process = [System.Diagnostics.Process]::Start($startInfo)
try {
    $ready = $false
    for ($attempt = 0; $attempt -lt 20; $attempt++) {
        try {
            $health = Invoke-RestMethod -Uri "http://127.0.0.1:$Port/healthz" -TimeoutSec 2
            if ($health.status -eq "ok") { $ready = $true; break }
        } catch { Start-Sleep -Milliseconds 250 }
    }
    if (-not $ready) { throw "서버 Health Check에 실패했습니다." }
    $runtime = Invoke-WebRequest -Uri "http://127.0.0.1:$Port/team_technical_assets_runtime_config.js" -UseBasicParsing
    if ($runtime.Content -notmatch '"mode":"api"') { throw "API Runtime 설정이 제공되지 않습니다." }
    Write-Host "PASS Backend tests, server startup, health check, runtime config"
} finally {
    if ($process -and -not $process.HasExited) { $process.Kill(); $process.WaitForExit() }
    if (Test-Path -LiteralPath $tempRoot) { Remove-Item -LiteralPath $tempRoot -Recurse -Force }
}
