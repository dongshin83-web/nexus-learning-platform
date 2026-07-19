param(
    [string]$RepoPath = "C:\Users\dongshin.choi\Documents\GitLab-work\team-technical-assets"
)

$ErrorActionPreference = "Stop"
$results = [System.Collections.Generic.List[object]]::new()

function Add-Result([string]$Area, [string]$Status, [string]$Detail) {
    $results.Add([pscustomobject]@{ Area = $Area; Status = $Status; Detail = $Detail })
}

function Invoke-Git([string[]]$Arguments) {
    $output = & git -C $RepoPath @Arguments 2>&1
    if ($LASTEXITCODE -ne 0) { throw ($output -join "`n") }
    return @($output)
}

if (-not (Test-Path -LiteralPath $RepoPath -PathType Container)) {
    Add-Result "Repository" "BLOCK" "Repository path not found: $RepoPath"
    $results | Format-Table -AutoSize -Wrap
    exit 2
}
Add-Result "Repository" "PASS" "Repository path found"

$gitCommand = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitCommand) {
    Add-Result "Git" "BLOCK" "git command not found"
} else {
    Add-Result "Git" "PASS" ((& git --version) -join " ")
    try {
        $inside = @(Invoke-Git @("rev-parse", "--is-inside-work-tree"))[0]
        $insideStatus = if ($inside -eq "true") { "PASS" } else { "BLOCK" }
        Add-Result "Git repository" $insideStatus "Inside work tree: $inside"

        $branch = @(Invoke-Git @("branch", "--show-current"))[0]
        if (-not $branch) { $branch = "detached HEAD" }
        Add-Result "Current branch" "PASS" $branch

        $dirty = @(Invoke-Git @("status", "--porcelain")) | Where-Object { $_ }
        $dirtyStatus = if ($dirty.Count -eq 0) { "PASS" } else { "BLOCK" }
        $dirtyDetail = if ($dirty.Count -eq 0) { "Clean" } else { "Uncommitted changes: $($dirty.Count)" }
        Add-Result "Working tree" $dirtyStatus $dirtyDetail

        $remotes = @(Invoke-Git @("remote")) | Where-Object { $_ }
        $remoteStatus = if ($remotes.Count -gt 0) { "PASS" } else { "BLOCK" }
        Add-Result "Git remote" $remoteStatus "Configured remotes: $($remotes.Count)"
    } catch {
        Add-Result "Git repository" "BLOCK" $_.Exception.Message
    }
}

$protectedChecks = @(
    @{ Area = "GitLab CI"; Path = ".gitlab-ci.yml" },
    @{ Area = "Runtime config"; Path = "team_technical_assets_runtime_config.js" },
    @{ Area = "Library browser data"; Path = "team_technical_assets_data.js" },
    @{ Area = "Culture browser data"; Path = "team_technical_assets_culture_data.js" }
)
foreach ($check in $protectedChecks) {
    $exists = Test-Path -LiteralPath (Join-Path $RepoPath $check.Path)
    $status = if ($exists) { "PASS" } else { "WARN" }
    $detail = if ($exists) { "Internal-only file exists" } else { "Missing: $($check.Path)" }
    Add-Result $check.Area $status $detail
}

$ciPath = Join-Path $RepoPath ".gitlab-ci.yml"
if (Test-Path -LiteralPath $ciPath) {
    $ciText = Get-Content -LiteralPath $ciPath -Raw -Encoding UTF8
    $hasPages = $ciText -match "(?m)^pages\s*:"
    Add-Result "Pages job" ($(if ($hasPages) { "PASS" } else { "WARN" })) ($(if ($hasPages) { "Pages job found" } else { "Explicit pages job not found" }))
}

$indexPath = Join-Path $RepoPath "index.html"
if (Test-Path -LiteralPath $indexPath) {
    $indexText = Get-Content -LiteralPath $indexPath -Raw -Encoding UTF8
    $routesToOverview = $indexText -match "team_technical_assets\.html"
    Add-Result "Index route" ($(if ($routesToOverview) { "PASS" } else { "WARN" })) ($(if ($routesToOverview) { "Overview route found" } else { "Base URL may still show an old index page" }))
} else {
    Add-Result "Index route" "BLOCK" "index.html is missing"
}

$cardPath = Join-Path $RepoPath "data\cards"
$cardCount = if (Test-Path -LiteralPath $cardPath) { @(Get-ChildItem -LiteralPath $cardPath -Filter *.json -File).Count } else { 0 }
Add-Result "Library source cards" ($(if ($cardCount -gt 0) { "PASS" } else { "WARN" })) "data/cards JSON count: $cardCount"

$culturePath = Join-Path $RepoPath "assets\culture"
$cultureMediaCount = if (Test-Path -LiteralPath $culturePath) { @(Get-ChildItem -LiteralPath $culturePath -File -Recurse).Count } else { 0 }
Add-Result "Culture media" ($(if ($cultureMediaCount -gt 0) { "PASS" } else { "WARN" })) "Internal Culture media count: $cultureMediaCount"

$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) {
    $nodeVersion = (& node --version).Trim()
    $nodeMajor = [int](($nodeVersion -replace '^v', '').Split('.')[0])
    Add-Result "Node.js" ($(if ($nodeMajor -ge 22) { "PASS" } else { "WARN" })) "$nodeVersion (Backend Pilot recommends 22+)"
} else {
    Add-Result "Node.js" "WARN" "Not installed or not available on PATH"
}

$npm = Get-Command npm -ErrorAction SilentlyContinue
$npmDetail = if ($npm) { ((& npm --version).Trim()) } else { "npm command not found" }
Add-Result "npm" ($(if ($npm) { "PASS" } else { "WARN" })) $npmDetail

$python = Get-Command python -ErrorAction SilentlyContinue
$pythonDetail = if ($python) { ((& python --version 2>&1).Trim()) } else { "Python not found; VS Code Live Server can be used" }
Add-Result "Python preview" ($(if ($python) { "PASS" } else { "WARN" })) $pythonDetail

$backendPaths = @("server", "backend-nextjs", "database", "docs\internal-library-api.openapi.yaml")
$backendMissing = @($backendPaths | Where-Object { -not (Test-Path -LiteralPath (Join-Path $RepoPath $_)) })
$backendStatus = if ($backendMissing.Count -eq 0) { "PASS" } else { "WARN" }
$backendDetail = if ($backendMissing.Count -eq 0) { "Pilot and production candidate code found" } else { "Missing: $($backendMissing -join ', ')" }
Add-Result "Backend starter" $backendStatus $backendDetail

$runnerServices = @(Get-Service -ErrorAction SilentlyContinue | Where-Object { $_.Name -match "gitlab-runner" -or $_.DisplayName -match "GitLab Runner" })
if ($runnerServices.Count -eq 0) {
    Add-Result "GitLab Runner service" "WARN" "No local Runner service found; check project/shared Runner in GitLab"
} else {
    $runnerState = ($runnerServices | ForEach-Object { "$($_.Name):$($_.Status)" }) -join ", "
    $runnerStatus = if ($runnerServices.Status -contains "Running") { "PASS" } else { "WARN" }
    Add-Result "GitLab Runner service" $runnerStatus $runnerState
}

$port8787 = @(Get-NetTCPConnection -LocalPort 8787 -State Listen -ErrorAction SilentlyContinue)
$portStatus = if ($port8787.Count -gt 0) { "PASS" } else { "WARN" }
$portDetail = if ($port8787.Count -gt 0) { "Listening" } else { "No Pilot/API listener" }
Add-Result "Local API port 8787" $portStatus $portDetail

$results | Format-Table -AutoSize -Wrap
$pass = @($results | Where-Object Status -eq "PASS").Count
$warn = @($results | Where-Object Status -eq "WARN").Count
$block = @($results | Where-Object Status -eq "BLOCK").Count
Write-Host ""
Write-Host "SUMMARY PASS=$pass WARN=$warn BLOCK=$block"
Write-Host "No tokens, account values, or internal URLs were printed."

if ($block -gt 0) { exit 2 }
exit 0
