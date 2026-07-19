# AssetManagement 백엔드 패턴 적용 결정

## 결정

기술자산 사이트는 AssetManagement가 사용하는 Next.js Route Handler, Prisma, PostgreSQL/Supabase, NextAuth 패턴을 재사용한다. 단, 금융 서비스의 실제 DB·인증·배포 프로젝트는 공유하지 않고 `backend-nextjs/`의 독립 서비스로 운영한다.

## 등록 트랜잭션

`Library 등록 요청` 한 번에 아래 정보를 원자적으로 저장한다.

- 기술자산 본문과 공통 메타데이터
- 여러 개의 사내 원본/근거 링크
- 여러 개의 기존 Library 관계
- 여러 개의 Technology Map·Learning Path 연결
- 등록자와 `검토 요청` 상태
- Reviewer 작업 항목과 감사 이벤트

하나라도 실패하면 전체 트랜잭션을 취소한다. 등록자가 4단계에서 두 번째 JSON을 다운로드하거나 Git에 직접 반영하지 않는다.

## Culture & History

팀장레터 이미지 묶음, 워크샵 결과 링크와 후속 자료를 `CultureRecord`, `CultureMedia`, `CultureLink`에 직접 저장한다. Nexus는 저장되지 않는 검토 모드이고, 사내 API 모드에서만 실제 DB에 등록한다.

## 전환 순서

1. 외부/Nexus에서 화면과 등록 프로토콜을 검토한다.
2. 패키지의 `backend-nextjs/`를 사내 GitLab 프로젝트로 반입한다.
3. 사내에서 별도 DB와 서비스 계정을 만든다.
4. `.env.example`을 기준으로 GitLab CI 보호 변수 또는 사내 Secret Store에 값을 넣는다.
5. `prisma migrate deploy`로 기술자산 전용 schema를 만든다.
6. 사내 SSO Provider를 `src/auth.ts`에 연결하고 역할 매핑을 검증한다.
7. 등록 → 검토함 → 수정 요청 → 승인·게시 → Library 검색을 통합 시험한다.
8. 기존 JSON 카드는 최초 한 번만 DB로 이관한 뒤 DB를 단일 기준본으로 사용한다.

## 남은 사내 결정

백엔드 기술은 준비됐지만 DB 주소, SSO 방식, Reviewer 그룹, 배포 런타임, 백업 위치는 외부에서 확정할 수 없다. 이 다섯 값은 사내 담당자 확인 후 연결한다.
