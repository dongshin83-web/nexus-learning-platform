param(
    [string]$OutputPath = "dist/team-technical-assets-shared.zip"
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$manifest = Join-Path $root "sync/shared-files.txt"
$staging = Join-Path $root "dist/shared-package"
$archive = if ([System.IO.Path]::IsPathRooted($OutputPath)) {
    $OutputPath
} else {
    Join-Path $root $OutputPath
}
$resolvedRoot = [System.IO.Path]::GetFullPath($root).TrimEnd([System.IO.Path]::DirectorySeparatorChar)
$resolvedStaging = [System.IO.Path]::GetFullPath($staging)
if (-not $resolvedStaging.StartsWith("$resolvedRoot$([System.IO.Path]::DirectorySeparatorChar)", [System.StringComparison]::OrdinalIgnoreCase)) {
    throw "임시 패키지 경로가 저장소 밖을 가리킵니다: $resolvedStaging"
}

if (-not (Test-Path -LiteralPath $manifest)) {
    throw "공통 파일 목록을 찾을 수 없습니다: $manifest"
}

if (Test-Path -LiteralPath $staging) {
    Remove-Item -LiteralPath $staging -Recurse -Force
}
New-Item -ItemType Directory -Path $staging -Force | Out-Null

foreach ($entry in Get-Content -LiteralPath $manifest -Encoding utf8) {
    $relative = $entry.Trim()
    if (-not $relative -or $relative.StartsWith("#")) { continue }

    $source = Join-Path $root $relative
    if (-not (Test-Path -LiteralPath $source)) {
        throw "공통 파일 목록의 항목을 찾을 수 없습니다: $relative"
    }

    $destination = Join-Path $staging $relative
    $parent = Split-Path -Parent $destination
    if ($parent) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
    Copy-Item -LiteralPath $source -Destination $destination -Recurse -Force
}

$archiveParent = Split-Path -Parent $archive
if ($archiveParent) { New-Item -ItemType Directory -Path $archiveParent -Force | Out-Null }
if (Test-Path -LiteralPath $archive) { Remove-Item -LiteralPath $archive -Force }
Compress-Archive -Path (Join-Path $staging "*") -DestinationPath $archive -CompressionLevel Optimal
Write-Host "CREATED $archive"
Write-Host "EXCLUDED Library UI/data, Culture records/media, and GitLab CI files"
