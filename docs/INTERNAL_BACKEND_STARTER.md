# 사내 Library Backend Starter

## 1. 준비된 범위

이 Starter는 사내 백엔드 제품이 확정되지 않은 상태에서도 등록 흐름을 끝까지 검증할 수 있도록 만든 실행 기준본이다.

- `POST /api/v1/asset-registration-requests` 한 번으로 자산, 내부 링크, Library 관계, Technology Map·Learning Path 연결, 검토 요청, 감사 기록을 하나의 DB 트랜잭션에 저장한다.
- 등록 건은 `검토 요청` 상태로 저장되며 Library 검색에는 나타나지 않는다.
- Reviewer 검토함에서 `수정 요청` 또는 `승인·게시`를 선택한다.
- 승인된 `게시` 자산만 기존 Library 검색과 상세 화면에 나타난다.
- 브라우저가 보낸 등록자·게시 상태를 신뢰하지 않고 서버 인증 사용자와 권한으로 결정한다.
- 원본 보고서와 이미지 파일 자체는 DB에 넣지 않고 기존 사내 시스템의 HTTPS 링크만 저장한다.

## 2. 로컬 Pilot 실행

필수 조건은 Node.js 22 이상이다. 외부 패키지 설치는 필요하지 않다.

```powershell
node --version
powershell -ExecutionPolicy Bypass -File tools/check-internal-api.ps1
powershell -ExecutionPolicy Bypass -File tools/start-internal-api.ps1 -Port 8787
```

브라우저에서 다음 두 화면을 확인한다.

- Library: `http://127.0.0.1:8787/team_technical_assets_library.html`
- Reviewer 검토함: `http://127.0.0.1:8787/team_technical_assets_reviews.html`

로컬 Pilot은 `x-dev-user`, `x-dev-roles` 헤더 기반 개발 인증을 사용한다. 서버 기본 주소가 `127.0.0.1`인 이유는 이 인증을 다른 PC에 노출하지 않기 위해서다.

## 3. 기존 JSON 카드의 최초 1회 DB 이관

기존 사내 `data/cards/*.json`을 보존한 상태에서 실행한다.

```powershell
powershell -ExecutionPolicy Bypass -File tools/start-internal-api.ps1 -SeedExistingCards
```

`api:seed`는 ID가 이미 있는 카드는 건너뛰므로 반복 실행할 수 있다. 출력의 `unresolvedRelations`가 비어 있지 않으면 연결 대상 카드가 함께 이관되지 않은 것이므로 게시 전에 확인한다.

이관 완료 후에는 DB를 단일 기준본으로 사용한다. 신규 등록을 DB와 `data/cards` 양쪽에 병행 저장하지 않는다.

## 4. 사내 인증 연결 경계

사내 운영에서는 `development` 인증을 사용하지 않는다. 사내 Reverse Proxy 또는 SSO Gateway가 인증을 끝낸 뒤 아래 헤더를 서버에 전달하는 방식이 현재 준비된 연결점이다.

- `x-authenticated-user`: 변경되지 않는 사번 또는 계정 ID
- `x-authenticated-name`: 화면에 표시할 이름
- `x-authenticated-roles`: `registrant`, `reviewer`, `admin` 중 쉼표 구분 값

운영 실행 환경변수:

```text
TECH_ASSET_AUTH_MODE=trusted-header
TECH_ASSET_TRUST_PROXY=true
TECH_ASSET_TRUSTED_PROXY_IPS=127.0.0.1,::1
TECH_ASSET_ALLOW_REMOTE=true
TECH_ASSET_HOST=0.0.0.0
TECH_ASSET_PORT=8787
TECH_ASSET_DB_PATH=D:\approved-data\technical-assets.sqlite
```

중요: 위 헤더를 일반 사용자가 직접 넣을 수 없도록 API 서버는 반드시 인증 Proxy 뒤에 둔다. `TECH_ASSET_TRUSTED_PROXY_IPS`에는 실제 Proxy 주소만 등록한다. 사내 SSO 방식이 확정되면 `server/auth.mjs`의 어댑터만 교체한다.

## 5. SQLite와 PostgreSQL의 역할

현재 실행 구현은 별도 설치가 없는 SQLite Pilot이다. 다음 조건에서는 PostgreSQL 전환을 권장한다.

- 여러 서버 인스턴스를 동시에 실행해야 함
- 동시 등록·검토가 많음
- DB 백업, 접근통제, 감사 보존을 중앙에서 운영해야 함

운영 테이블 계약은 `database/library_schema.postgresql.sql`에 준비되어 있다. UI와 OpenAPI는 유지하고 저장소 구현만 PostgreSQL Adapter로 교체한다. 사내 DB 종류가 확인되기 전에는 외부에서 접속정보나 Driver를 임의로 포함하지 않는다.

## 6. 배포 구조

GitLab Pages는 정적 파일만 제공하므로 이 Node API를 실행할 수 없다. 운영은 다음 중 하나여야 한다.

1. 사내 VM/Windows Service에서 Node 서버가 UI와 API를 같은 주소로 제공
2. 사내 컨테이너 플랫폼에서 Node 서버 실행
3. 별도 API 서버를 운영하고 정적 UI의 `apiBaseUrl`을 해당 주소로 지정

가장 단순하고 CORS 문제가 없는 방식은 1 또는 2의 동일 출처 구성이다. 이 Starter 서버는 UI 파일과 `/api/v1`을 함께 제공한다.

`deploy/gitlab-ci.backend.example.yml`에는 Windows Runner 기준의 검증·패키징·수동 배포 Gate를 준비했다. 실제 `.gitlab-ci.yml`에 그대로 덮어쓰지 말고 기존 Pages Job과 합친다. 예제 배포 Script는 검증된 Release 폴더까지만 만들고 `current` 전환과 Service 재시작은 의도적으로 자동화하지 않았다. 이 두 동작은 사내 서비스 Wrapper와 롤백 기준을 확인한 뒤 확정한다.

## 7. 백업·복구 최소 기준

- 서버 중지 또는 SQLite Online Backup 절차로 `technical-assets.sqlite`를 매일 백업한다.
- DB와 원본 문서 시스템을 별도로 백업한다. DB에는 원본 파일이 아니라 링크만 있다.
- 복구 시험에서 자산 수, 게시 수, 검토 요청 수, `audit_events` 수를 비교한다.
- `var/`, `.env`, 실제 runtime config, 인증서와 비밀값은 Git에 커밋하지 않는다.

## 8. 사내에서 확정해야 하는 항목

- Node 서버 또는 컨테이너 실행 가능 여부
- Node.js 승인 버전
- SSO/Reverse Proxy의 사용자 및 그룹 헤더
- Reviewer 그룹의 실제 관리 주체
- SQLite Pilot 허용 여부와 PostgreSQL 제공 여부
- 서비스 URL, TLS 인증서, 방화벽
- DB 백업 위치와 보존기간

이 항목이 결정되기 전까지도 로컬 Pilot, 데이터 계약, UI, 등록·검토·게시 상태 전이와 자동시험은 그대로 사용할 수 있다.
