param(
    [Parameter(Mandatory = $true)][string]$PackagePath,
    [Parameter(Mandatory = $true)][string]$ServicePath,
    [Parameter(Mandatory = $true)][string]$ServiceName
)

$ErrorActionPreference = "Stop"
$package = (Resolve-Path -LiteralPath $PackagePath).Path
$destination = [System.IO.Path]::GetFullPath($ServicePath)
$releaseRoot = Join-Path $destination "releases"
$releaseName = Get-Date -Format "yyyyMMdd-HHmmss"
$releasePath = Join-Path $releaseRoot $releaseName

if (-not (Get-Service -Name $ServiceName -ErrorAction SilentlyContinue)) { throw "Windows Service를 찾을 수 없습니다: $ServiceName" }
New-Item -ItemType Directory -Path $releasePath -Force | Out-Null
Expand-Archive -LiteralPath $package -DestinationPath $releasePath -Force

& node --test (Join-Path $releasePath "tests/backend-api.test.mjs")
if ($LASTEXITCODE -ne 0) { throw "Release 자동시험에 실패했습니다." }

# current 전환 방식은 사내 표준(Directory Junction, 배포 도구, 서비스 Wrapper)에 맞춰 확정해야 합니다.
# 이 예제는 검증된 Release를 만들고 여기서 중단해, 미확정 서비스 경로를 자동 변경하지 않습니다.
Write-Host "VALIDATED RELEASE $releasePath"
Write-Host "DATA DB는 Release 밖의 TECH_ASSET_DB_PATH를 계속 사용해야 합니다. DB 파일을 Release에 복사하지 마세요."
Write-Host "NEXT 사내 표준에 따라 current를 이 Release로 전환한 뒤 Restart-Service $ServiceName"
