# 백엔드 미확정 상태의 사내 직접 등록 기반

## 결론

백엔드 제품을 모르는 상태에서 특정 DB나 프레임워크로 전체 기능을 먼저 만드는 것은 재작업 위험이 크다. 대신 다음 네 가지를 고정한다.

1. 브라우저와 서버가 주고받는 API 계약
2. Library 카드와 Culture 기록의 데이터 계약
3. 검토·게시 상태와 권한 규칙
4. DB가 바뀌어도 유지되는 저장소 인터페이스

이 저장소에는 위 기반을 다음 파일로 준비했다.

- `docs/internal-library-api.openapi.yaml`: REST API 계약
- `team_technical_assets_repository.js`: 정적/API 저장 방식 교체 어댑터
- `server/`: Node.js 22 내장 HTTP·SQLite 기반으로 실행 가능한 Pilot 서버
- `team_technical_assets_reviews.html`: Reviewer 수정 요청·승인·게시 화면
- `docs/INTERNAL_BACKEND_STARTER.md`: 사내 SSO·DB·배포 연결 절차
- `database/library_schema.postgresql.sql`: 다중 사용자 운영 권장 스키마
- `database/library_schema.sqlite.sql`: 단일 서버 파일럿 스키마
- `tools/card-contract.mjs`: 서버에서도 재사용할 카드 검증 규칙

## 무엇을 선택해야 하는가

| 확인된 사내 환경 | 권장 선택 |
| --- | --- |
| PostgreSQL 또는 관리형 관계형 DB 사용 가능 | PostgreSQL 스키마와 REST API로 운영 |
| 단일 서버만 있고 별도 DB 신청이 어려움 | SQLite로 파일럿 후 PostgreSQL 이관 |
| GitLab Pages만 있고 서버 실행 불가 | 직접 등록은 불가능하므로 API 실행 환경을 먼저 확보. JSON·Merge Request는 최초 이관 도구로만 사용 |
| 사내 Low-code 데이터 서비스가 있음 | OpenAPI와 데이터 계약을 해당 서비스에 매핑 |

IndexedDB나 LocalStorage는 사용자별 브라우저에 데이터가 분리되므로 팀 공동 Library의 운영 DB로 사용하지 않는다. 브라우저에서 GitLab Access Token을 보유하고 직접 커밋하는 방식도 사용하지 않는다.

## 프런트엔드 전환 방식

현재 Nexus와 정적 검토 환경은 다음 설정을 사용한다.

```javascript
window.TECHNICAL_ASSET_RUNTIME = {
    mode: "static"
};
```

사내 API가 준비되면 런타임 설정만 바꾼다.

```javascript
window.TECHNICAL_ASSET_RUNTIME = {
    mode: "api",
    apiBaseUrl: "https://internal-api.example.com/api/v1",
    credentials: "include"
};
```

페이지 코드는 `createTechnicalAssetRepository(window.TECHNICAL_ASSET_RUNTIME)`로 저장소를 만들고, 정적 전역 데이터나 REST API를 직접 구분하지 않는다.

## 팀원 직접 등록에 필요한 최소 기능

### 1차 배포

- 사내 로그인 사용자 식별
- 자산 초안 생성·수정
- 자동 임시 저장
- Library·Technology Map·Learning Path 추천과 직접 검색
- 검토 요청
- Reviewer 수정 요청·승인·게시
- 모든 변경의 감사 이력

### 2차 배포

- 이미지 및 첨부파일 저장소 연동
- 사용 과제 연결과 활용 횟수 집계
- Search Gap 기록
- 알림과 만료·개정 주기 관리

## 저장 원칙

- DB가 카드 메타데이터와 검토 이력의 단일 기준 정보다.
- 원본 보고서·워크샵 파일은 기존 사내 시스템에 두고 URL과 접근 범위만 저장한다.
- 이미지 파일은 사내 Object Storage 또는 문서 시스템에 두고 `culture_media.source_url`로 연결한다.
- 브라우저가 전달한 사용자 이름이나 게시 상태를 신뢰하지 않는다. 서버가 사내 로그인 세션과 권한으로 결정한다.
- 수정 요청에는 `version` 또는 `If-Match`를 사용해 동시 편집 충돌을 막는다.
- 게시 시 `tools/card-contract.mjs`와 같은 규칙을 서버에서 다시 검증한다.

## 사내 환경 확인 체크리스트

- Node.js, Java, Python 등 실행 가능한 서버 런타임
- PostgreSQL, MS SQL, Oracle, SQLite 등 사용 가능한 DB
- 사내 SSO 방식과 사용자·그룹 정보 조회 방법
- 이미지·첨부파일을 둘 수 있는 저장소
- GitLab Runner가 서버 또는 컨테이너를 배포할 수 있는지
- 프런트엔드에서 API 주소에 접근할 수 있는 네트워크와 CORS 정책

이 답을 확인한 뒤 REST API의 실제 구현체만 선택한다. 화면, 데이터 계약과 DB 구조는 그대로 유지할 수 있다.
