# 사내 Library 카드 등록 절차

## 목적

Library 등록 화면에서 다운로드한 카드 JSON을 사내 GitLab 저장소의 `data/cards/`에 안전하게 반입하고, 생성 데이터와 시험을 통과한 변경만 Merge하기 위한 절차다. Codex나 Cline 없이 PowerShell과 Node.js만으로 실행할 수 있다.

## 운영 원칙

- `data/cards/*.json`이 카드 원본이다.
- `team_technical_assets_data.js`는 생성 파일이므로 직접 수정하지 않는다.
- 등록 화면의 다운로드는 게시 완료가 아니라 게시 요청 JSON 생성이다.
- 실제 카드와 내부 링크는 사내 GitLab에만 저장한다.
- 등록은 `main` 직접 수정이 아니라 Branch와 Merge Request로 진행한다.
- AI 사용 여부와 무관하게 수동 구조화와 사람 확인만으로 등록할 수 있다.

## 1. Branch 생성

```powershell
$repo = "C:\path\to\team-technical-assets"
Set-Location $repo

git status --short --branch
git checkout main
git pull origin main

$branch = "register/$(Get-Date -Format yyyyMMdd)-asset-name"
git checkout -b $branch
```

작업 트리에 기존 변경이 있으면 새 등록과 섞지 않는다.

## 2. 다운로드 JSON 검사

```powershell
npm run register:check -- --file "$env:USERPROFILE\Downloads\asset-id.json"
```

검사 항목:

- 필수 공통 필드와 유형별 상태
- 카드 ID 형식과 기존 ID 중복
- Technology Map·Learning Path 연결 결정
- Framework 연결의 관계·설명·확인 여부
- 기존 Library 관계 대상과 검색·재사용 대상
- 게시 카드의 Reviewer·근거 링크·사람 확인

오류가 있으면 JSON을 수정하고 다시 검사한다. `WARN`은 확인이 필요한 항목이며 자동 반입을 막지는 않지만 Reviewer가 판단해야 한다.

## 3. `data/cards` 반입과 데이터 생성

```powershell
npm run register:import -- --file "$env:USERPROFILE\Downloads\asset-id.json"
```

정상 반입 시 다음이 함께 수행된다.

1. `data/cards/<asset-id>.json` 생성
2. 전체 Library 계약 재검사
3. `team_technical_assets_data.js` 재생성

기존 ID와 같은 카드가 있으면 자동으로 덮어쓰지 않는다. 기존 카드 수정은 원본 파일을 직접 수정하고 변경 이력을 갱신한다.

## 4. 전체 검사와 변경 확인

```powershell
npm run check
git status --short
git diff --stat
git diff --check
git diff -- data/cards team_technical_assets_data.js
```

확인 사항:

- 신규 카드 JSON 하나와 생성 데이터만 의도대로 변경됐는가
- 실제 Owner·Reviewer와 내부 링크가 확인됐는가
- Placeholder와 샘플 값이 게시 카드에 남지 않았는가
- Technology Map·Learning Path 연결을 빠뜨리지 않았는가
- 기존 카드·관계가 의도치 않게 바뀌지 않았는가

## 5. Commit과 Merge Request

```powershell
git add "data/cards/<asset-id>.json" team_technical_assets_data.js
git diff --cached --check
git commit -m "Register technical asset <asset-id>"
git push -u origin $branch
```

Merge Request에서 Reviewer가 내용, 근거 링크, 공개 범위, 관계와 Framework 연결을 확인한다. Merge 후 `pages`, `pages:deploy`와 실제 Library 검색 결과를 확인한다.

## 기존 카드 수정

기존 카드는 새 파일로 중복 등록하지 않는다.

1. `data/cards`에서 해당 ID를 가진 원본을 찾는다.
2. `updatedAt`, 본문, 관계와 `changeLog`를 함께 수정한다.
3. `npm run build:data`와 `npm run check`를 실행한다.
4. 별도 Branch와 Merge Request로 제출한다.

## 장애 시 판단

| 증상 | 판단 |
| --- | --- |
| `register:check` 오류 | 카드 JSON·계약 문제 |
| `build:data` 오류 | 전체 카드 원본 또는 중복 ID 문제 |
| `npm run check` 시험 실패 | 생성 결과·검색·계약 회귀 문제 |
| Pipeline 시작 전 실패 | GitLab Runner·CI 환경 문제 |
| Pipeline 성공 후 화면 미반영 | Pages Artifact·Cache·참조 경로 문제 |
