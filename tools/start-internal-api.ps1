param(
    [int]$Port = 8787,
    [string]$DatabasePath = "var/technical-assets.sqlite",
    [ValidateSet("development", "trusted-header")]
    [string]$AuthMode = "development",
    [switch]$SeedExistingCards
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$nodeMajor = [int]((& node --version).TrimStart('v').Split('.')[0])
if ($nodeMajor -lt 22) { throw "이 Starter는 Node.js 22 이상이 필요합니다. 현재 버전: $(& node --version)" }

$resolvedDatabase = if ([System.IO.Path]::IsPathRooted($DatabasePath)) { $DatabasePath } else { Join-Path $root $DatabasePath }
$env:TECH_ASSET_PORT = [string]$Port
$env:TECH_ASSET_DB_PATH = $resolvedDatabase
$env:TECH_ASSET_AUTH_MODE = $AuthMode
$env:TECH_ASSET_HOST = "127.0.0.1"

if ($SeedExistingCards) {
    if (-not (Test-Path -LiteralPath (Join-Path $root "data/cards"))) { throw "기존 카드 폴더가 없습니다: data/cards" }
    & node (Join-Path $root "server/seed.mjs")
    if ($LASTEXITCODE -ne 0) { throw "기존 Library 카드 이관에 실패했습니다." }
}

Write-Host "Library: http://127.0.0.1:$Port/team_technical_assets_library.html"
Write-Host "Reviewer: http://127.0.0.1:$Port/team_technical_assets_reviews.html"
& node (Join-Path $root "server/index.mjs")
