# 기술자산 전용 Next.js Backend

AssetManagement에서 검증한 `Next.js Route Handler + Prisma + PostgreSQL/Supabase + NextAuth` 방식을 기술자산 사이트에 적용한 독립 실행 템플릿입니다.

## 왜 독립 서비스인가

- 기술 스택과 운영 패턴은 재사용합니다.
- AssetManagement의 금융 DB, 인증 허용목록, Vercel 프로젝트, 마이그레이션 이력은 공유하지 않습니다.
- 기술자산 장애·권한 변경·스키마 변경이 금융 시스템에 영향을 주지 않습니다.
- 사내 DB와 SSO가 확정되면 이 폴더의 환경변수와 인증 어댑터만 교체합니다.

## 구현된 흐름

1. 등록자가 Handoff JSON을 사내 등록 화면에 한 번 불러옵니다.
2. 실제 정보·내부 링크·Library 관계·Technology Map·Learning Path 연결을 보완합니다.
3. `POST /api/v1/asset-registration-requests` 한 번으로 자산과 모든 연결, 검토 요청, 감사 기록을 하나의 DB 트랜잭션에 저장합니다.
4. Reviewer가 `/api/v1/review-queue`에서 수정 요청 또는 게시를 선택합니다.
5. 게시된 자산만 `/api/v1/assets`에 나타납니다.
6. Culture & History는 `POST /api/v1/culture-records`로 이미지 경로와 결과물 링크를 직접 DB에 저장합니다. JSON 다운로드 단계는 없습니다.

## 로컬 준비

```powershell
cd backend-nextjs
Copy-Item .env.example .env.local
# .env.local의 DB URL과 인증 값을 수정
npm install
npx prisma migrate dev --name init_technical_assets
npm run dev
```

`npm run build`는 부모 저장소의 `team_technical_assets*.html/js/css`와 등록 안내 이미지를 `public/`에 복사하고 runtime config를 API 모드로 생성하므로 UI와 API를 같은 출처에서 실행할 수 있습니다.

확인 주소:

- Library: `http://localhost:3000/team_technical_assets_library.html`
- Culture & History: `http://localhost:3000/team_technical_assets_culture.html`
- Reviewer: `http://localhost:3000/team_technical_assets_reviews.html`

## DB 연결

- `DATABASE_URL`: 앱 런타임용 PostgreSQL 연결. Supabase라면 pooled URL을 사용합니다.
- `DIRECT_URL`: Prisma migration용 direct 연결입니다.
- 이 DB는 AssetManagement와 다른 프로젝트 또는 최소한 다른 DB와 계정을 사용합니다.
- 원본 문서와 이미지는 DB에 업로드하지 않고 승인된 사내 원본 시스템의 HTTPS 경로만 저장합니다.

## 인증 연결

현재 템플릿은 AssetManagement와 같은 NextAuth 세션 패턴을 제공합니다.

- 개발: `TECH_ASSET_DEV_USER_EMAIL`
- 허용 사용자: `TECH_ASSET_ALLOWED_EMAILS`
- Reviewer: `TECH_ASSET_REVIEWER_EMAILS`
- Admin: `TECH_ASSET_ADMIN_EMAILS`

사내 SSO가 Google이 아니면 `src/auth.ts`의 Provider만 교체합니다. 화면이나 API 계약은 바꾸지 않습니다.

## 운영 전 필수 확인

- 사내 클라우드에서 Next.js 서버 실행 또는 컨테이너 배포가 가능한가
- PostgreSQL/Supabase 호환 DB와 migration 계정이 제공되는가
- SSO Provider와 그룹/메일 Claim은 무엇인가
- Reviewer와 Admin 그룹의 실제 소유자는 누구인가
- DB 백업, 감사 로그 보존, 서비스 URL/TLS 정책은 무엇인가

이 값이 없더라도 외부에서는 UI, API 계약, Prisma schema, 트랜잭션과 권한 경계까지 준비할 수 있습니다. 실제 접속정보와 migration 실행만 사내에서 수행합니다.
