# 기술자산화 사이트 사내 반입·GitLab 배포 SOP

## 1. 목적과 적용 범위

이 SOP는 외부 Nexus에서 검토한 기술자산화 사이트를 사내 GitLab 저장소와 기존 배포 페이지에 반영하는 표준 절차다.

- 외부 기준 저장소: `nexus-learning-platform`
- 사내 저장소 예시: `C:\Users\dongshin.choi\Documents\GitLab-work\team-technical-assets`
- 반입 파일: `team-technical-assets-internal-backend.zip`
- 기존 사내 Library 데이터, Culture 데이터, Runtime 설정과 `.gitlab-ci.yml`은 보존한다.
- GitLab Pages 화면 배포와 직접 등록 API 배포를 구분한다. Pages만으로 Node API는 실행할 수 없다.

## 2. 외부에서 반입할 파일

승인된 사내 반입 경로로 다음 두 파일만 옮긴다.

1. `team-technical-assets-internal-backend.zip`
2. `team-technical-assets-internal-backend.zip.sha256.txt`

ZIP에는 공통 UI, 사내 Library UI, 등록·검토 화면, 테스트, SQLite Pilot과 Next.js/PostgreSQL Starter가 포함된다. 다음 운영 파일은 의도적으로 제외되어 있다.

- `.gitlab-ci.yml`
- `team_technical_assets_runtime_config.js`
- `team_technical_assets_data.js`
- `team_technical_assets_culture_data.js`
- `data/cards/`
- `assets/culture/`
- `.env`, DB 파일, 비밀값

## 3. 사내 반입 파일 검증

VS Code에서 사내 GitLab 저장소를 열고 통합 PowerShell 터미널을 실행한다. 반입 ZIP 위치만 실제 경로로 바꾼다.

```powershell
$Repo = "C:\Users\dongshin.choi\Documents\GitLab-work\team-technical-assets"
$Incoming = "C:\Users\dongshin.choi\Downloads\team-technical-assets-internal-backend.zip"
$ChecksumFile = "$Incoming.sha256.txt"

Test-Path -LiteralPath $Repo
Test-Path -LiteralPath $Incoming
$Expected = (Get-Content -LiteralPath $ChecksumFile -Encoding UTF8).Split(' ')[0].Trim()
$Actual = (Get-FileHash -LiteralPath $Incoming -Algorithm SHA256).Hash
[pscustomobject]@{ Expected = $Expected; Actual = $Actual; Match = ($Expected -eq $Actual) }
```

`Match`가 `True`가 아니면 압축을 풀거나 저장소에 복사하지 않는다.

## 4. 저장소 시작 상태 확인

```powershell
Set-Location -LiteralPath $Repo
git status --short
git remote -v
git branch --show-current
```

판정 기준:

- `git status --short`가 비어 있으면 계속 진행한다.
- 변경 파일이 있으면 기존 사내 작업일 수 있으므로 중단하고 먼저 커밋·MR 또는 담당자 확인을 한다.
- `.git`, 저장소 폴더 전체 또는 사내 데이터 폴더를 삭제하지 않는다.

기본 Branch를 최신으로 맞춘 뒤 작업 Branch를 만든다. 아래 `main`은 실제 기본 Branch가 `master`라면 `master`로 바꾼다.

```powershell
git fetch origin
git checkout main
git pull --ff-only origin main
git checkout -b update-technical-assets-20260719
```

## 5. 임시 폴더에 압축 해제

기존 저장소에 바로 압축을 풀지 않는다.

```powershell
$Stage = Join-Path $env:TEMP ("team-technical-assets-" + [guid]::NewGuid())
New-Item -ItemType Directory -Path $Stage | Out-Null
Expand-Archive -LiteralPath $Incoming -DestinationPath $Stage
Get-ChildItem -LiteralPath $Stage | Select-Object Name
```

`team_technical_assets.html`, `team_technical_assets_library.html`, `server`, `backend-nextjs`, `docs`, `tests`가 보여야 한다.

포함된 읽기 전용 진단 Script를 실행하면 저장소, 보호 파일, 도구, Runner와 API 상태를 한 번에 확인할 수 있다.

```powershell
powershell -ExecutionPolicy Bypass -File "$Stage\tools\audit-internal-deployment.ps1" -RepoPath $Repo
```

`BLOCK`이 1개 이상이면 덮어쓰기 전에 원인을 해결한다. `WARN`은 해당 항목이 실제로 불필요한지 확인한 뒤 진행한다.

## 6. 사내 전용 파일 보존 확인

복사 전에 사내 기준본이 존재하는지 확인한다. 없는 파일은 `없음`으로 기록하되 외부 샘플로 임의 생성하지 않는다.

```powershell
$Protected = @(
  ".gitlab-ci.yml",
  "team_technical_assets_runtime_config.js",
  "team_technical_assets_data.js",
  "team_technical_assets_culture_data.js",
  "data\cards",
  "assets\culture"
)
$Protected | ForEach-Object {
  [pscustomobject]@{ Path = $_; Exists = Test-Path -LiteralPath (Join-Path $Repo $_) }
}
```

## 7. 패키지 덮어쓰기

임시 폴더의 내용만 저장소 루트에 복사한다. 패키지에서 제외된 사내 전용 파일은 유지된다.

```powershell
Copy-Item -Path (Join-Path $Stage "*") -Destination $Repo -Recurse -Force
Set-Location -LiteralPath $Repo
git status --short
```

다음 보호 대상이 변경 목록에 나오면 커밋하지 말고 중단한다.

```powershell
git status --short | Select-String -Pattern "\.gitlab-ci\.yml|runtime_config\.js|team_technical_assets_data\.js|culture_data\.js|data/cards|assets/culture"
```

정상 결과는 출력 없음이다.

## 8. 기본 진입 페이지 확인

```powershell
Test-Path .\index.html
Select-String -Path .\index.html -Pattern "team_technical_assets.html"
```

- `index.html`이 `team_technical_assets.html`로 이동시키는 파일이면 그대로 둔다.
- `index.html`이 과거 Overview 전체를 복제한 파일이면 기본 URL만 과거 화면으로 남을 수 있다. 이 경우 MR 전에 `index.html` 운영 방식을 별도로 수정한다.

## 9. 로컬 검증

Node.js 22 이상이 있으면 전체 자동 검증을 실행한다.

```powershell
node --version
npm run check
```

`npm run check`는 모든 테스트가 통과해야 한다. 샘플 데이터와 Placeholder 링크 경고는 사내 운영 데이터로 교체하기 전까지 허용할 수 있지만, `FAIL`은 허용하지 않는다.

정적 화면은 사내에서 허용된 로컬 서버로 확인한다. Python이 있으면 다음과 같이 실행한다.

```powershell
python -m http.server 8080 --bind 127.0.0.1
```

브라우저 확인 주소:

- `http://127.0.0.1:8080/team_technical_assets.html`
- `http://127.0.0.1:8080/team_technical_assets_map.html`
- `http://127.0.0.1:8080/team_technical_assets_techtree.html`
- `http://127.0.0.1:8080/team_technical_assets_library.html`
- `http://127.0.0.1:8080/team_technical_assets_registration.html`
- `http://127.0.0.1:8080/team_technical_assets_culture.html`

확인 항목:

- 상단 메뉴가 모든 페이지에서 내부 페이지로 연결된다.
- Overview의 TOP 5 두 카드와 하단 두 카드가 같은 폭으로 표시된다.
- `예시 데이터` 표시가 보인다.
- Technology Map과 Learning Path가 기존 사내 데이터로 열린다.
- Library의 기존 카드와 Culture 기록이 사라지지 않았다.
- 등록 화면은 바깥 영역 클릭으로 닫히지 않는다.
- Registration Guide의 9개 자산 유형과 4단계가 열린다.

## 10. 변경 검토와 Git 커밋

```powershell
git diff --check
git diff --stat
git status --short
```

변경 목록을 확인한 뒤에만 전체 변경을 Stage한다.

```powershell
git add -A
git diff --cached --check
git diff --cached --stat
git commit -m "Update technical assetization site"
git push -u origin update-technical-assets-20260719
```

## 11. Merge Request와 GitLab Pages 배포

GitLab에서 다음 순서로 진행한다.

1. 방금 Push한 Branch의 `Create merge request`를 선택한다.
2. Source Branch가 `update-technical-assets-20260719`인지 확인한다.
3. Target Branch가 사내 기본 Branch인지 확인한다.
4. 변경 파일에서 사내 보호 대상이 덮어써지지 않았는지 다시 확인한다.
5. Pipeline의 정적 검증·Pages Job이 성공했는지 확인한다.
6. Reviewer 승인 후 Merge한다.
7. 기본 Branch Pipeline의 Pages Job이 성공할 때까지 기다린다.

Pipeline이 `pending`이면 코드를 다시 수정하기 전에 `Settings > CI/CD > Runners`에서 이 프로젝트를 실행할 활성 Runner가 있는지 확인한다. Runner가 활성인데 CI 기본 변수가 비어 있으면 저장소 YAML보다 GitLab 관리자 영역의 Runner/Coordinator 설정 문제일 수 있으므로 관리자에게 Escalation한다.

## 12. 배포 후 확인

사내 Pages URL에서 `Ctrl+F5`로 캐시를 갱신한다.

1. 기본 URL이 새 Overview로 열리는지 확인한다.
2. Overview TOP 5와 기여 상세가 보이는지 확인한다.
3. 여섯 개 상단 메뉴가 모두 사내 URL 안에서 이동하는지 확인한다.
4. Library의 기존 자산 수와 대표 카드 3개를 확인한다.
5. Culture & History의 기존 워크샵 결과와 이미지가 유지되는지 확인한다.
6. 데스크톱과 모바일 폭에서 메뉴와 카드가 깨지지 않는지 확인한다.

검증 결과와 배포 Commit SHA를 MR에 기록한다.

## 13. 직접 등록 API는 별도 Gate로 진행

이번 Pages 화면 배포만으로 Library 직접 등록 API가 운영되는 것은 아니다. 다음 조건이 확정되기 전에는 backend 코드는 저장소에 준비만 둔다.

- Node 서버 또는 사내 컨테이너 실행 위치
- SSO/Reverse Proxy 인증 헤더
- Reviewer/Admin 그룹
- SQLite Pilot 또는 PostgreSQL 운영 DB
- HTTPS, 방화벽, 백업과 복구 절차

Node.js 22 이상이 있는 한 PC에서 기능 Pilot만 확인하려면 다음을 실행한다.

```powershell
powershell -ExecutionPolicy Bypass -File tools/check-internal-api.ps1
powershell -ExecutionPolicy Bypass -File tools/start-internal-api.ps1 -Port 8787
```

Pilot 주소:

- Library: `http://127.0.0.1:8787/team_technical_assets_library.html`
- Reviewer 검토함: `http://127.0.0.1:8787/team_technical_assets_reviews.html`

Pilot DB와 개발 인증을 여러 사용자에게 공개하지 않는다. 운영 전환은 `docs/INTERNAL_BACKEND_STARTER.md`의 인증·DB·백업 Gate를 통과한 뒤 별도 MR로 진행한다.

## 14. 롤백

- Merge 전: MR을 닫고 작업 Branch를 보존한다.
- Merge 후 화면 문제: GitLab에서 해당 Merge Commit을 `Revert`하고 Pages Pipeline을 다시 실행한다.
- 데이터 문제: 화면 롤백과 DB 복구를 분리한다. Git으로 SQLite/PostgreSQL DB를 되돌리지 않는다.
- 사내 전용 파일이 덮어써진 경우: 배포를 중단하고 이전 Commit 또는 사내 백업에서 해당 파일만 복구한다.
