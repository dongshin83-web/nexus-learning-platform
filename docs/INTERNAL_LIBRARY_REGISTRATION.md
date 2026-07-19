# 사내 Library 카드 직접 등록 절차

## 목적

외부 AI에서 만든 Handoff JSON을 3단계에서 사내로 반입한 뒤, 4단계의 사내 Library 등록 화면에서 실제 정보와 관계를 완성하고 직접 등록·검토 요청하는 절차다. 사내 등록 화면에서 게시용 JSON을 다시 다운로드하지 않는다.

## 운영 원칙

- 외부 AI Handoff JSON은 환경 간 이동을 위한 반입 파일이며 Library 원본이 아니다.
- 사내 등록 화면은 검증 후 `POST /asset-registration-requests` 한 번으로 등록과 Reviewer 검토 요청을 원자적으로 처리한다.
- 사내 DB가 카드와 검토 이력의 단일 원본이다.
- 실제 카드와 내부 링크 메타데이터는 사내망 DB에만 저장하고, 원본 파일은 기존 사내 문서 시스템에 둔다.
- Reviewer 승인 후에만 게시한다.
- AI 사용 여부와 무관하게 수동 구조화와 사람 확인만으로 등록할 수 있다.

## 사전조건

- `team_technical_assets_runtime_config.js`가 `mode: "api"`로 설정돼 있다.
- `apiBaseUrl`의 사내 Library API가 OpenAPI 계약을 구현한다.
- 사내 로그인·등록자 식별과 Reviewer 권한 검사가 서버에서 동작한다.
- 위 조건이 없으면 화면에서 직접 등록할 수 없다. 이 경우 두 번째 JSON 다운로드로 우회하지 않고 사내 API 구축 전 상태로 명시한다.

## 1. 3단계 — Handoff JSON 사내 반입

외부 AI의 일반화 JSON을 승인된 방식으로 사내에 반입하고, 사내 Library의 `기술자산 등록` 화면에서 불러온다. 등록 화면이 JSON 파싱과 기본 계약을 검사하고 내부정보 보완 화면을 만든다.

검사 항목:

- 필수 공통 필드와 유형별 상태
- 카드 ID 형식과 기존 ID 중복
- Technology Map·Learning Path 연결 결정
- Framework 연결의 관계·설명·확인 여부
- 기존 Library 관계 대상과 검색·재사용 대상
- 게시 카드의 Reviewer·근거 링크·사람 확인

오류가 있으면 등록 화면에서 반입을 중단한다. 실제 정보는 외부 JSON을 다시 만들지 않고 사내 화면에서 보완한다.

## 2. 4단계 — 실제 정보 완성

등록자는 실제 제목·ID·Owner·Reviewer, 사내 원본 링크, 기존 Library 관계, Technology Map·Learning Path 연결 판단을 완성한다. 추천 결과와 직접 검색한 결과를 구분하고, 여러 링크와 관계를 빠짐없이 확인한다.

## 3. 검증·등록·검토 요청

`Library 등록 요청`을 누르면 다음을 수행한다.

1. 브라우저에서 필수정보와 관계를 검사한다.
2. `POST /asset-registration-requests`로 자산·연결·내부 링크·검토 요청을 한 트랜잭션에 저장한다.
3. 서버가 로그인 사용자를 등록자로 기록하고 `검토 요청` 상태와 감사 로그를 남긴다.
4. 어느 한 항목이라도 실패하면 전체 등록을 취소해 중간 상태가 남지 않게 한다.

확인 사항:

- 신규 카드 JSON 하나와 생성 데이터만 의도대로 변경됐는가
- 실제 Owner·Reviewer와 내부 링크가 확인됐는가
- Placeholder와 샘플 값이 게시 카드에 남지 않았는가
- Technology Map·Learning Path 연결을 빠뜨리지 않았는가
- 기존 카드·관계가 의도치 않게 바뀌지 않았는가

## 4. Reviewer 승인·게시

Reviewer는 사내 화면에서 내용, 근거 링크, 공개 범위, 관계와 Framework 연결을 확인한다. 수정이 필요하면 사유와 함께 반환하고, 승인할 때만 `/assets/{assetId}/publish`로 게시한다.

## 기존 카드 수정

기존 카드는 새 파일로 중복 등록하지 않는다.

1. 사내 Library에서 해당 ID를 연다.
2. 현재 `version`을 기준으로 본문·관계·링크를 수정한다.
3. 서버는 `If-Match` 또는 version으로 동시 편집 충돌을 막는다.
4. 변경 이력을 남기고 다시 Reviewer 검토를 요청한다.

## 정적 JSON CLI의 지위

`register:check`와 `register:import`는 기존 정적 데이터의 최초 이관과 관리자용 계약 검증에만 사용한다. 일반 등록자가 4단계에서 게시용 JSON을 다시 다운로드하는 표준 절차로 사용하지 않으며, DB와 Git JSON을 병행 기준본으로 운영하지 않는다.

## 장애 시 판단

| 증상 | 판단 |
| --- | --- |
| Handoff JSON 불러오기 실패 | 외부 반입 JSON 형식·계약 문제 |
| `POST /asset-registration-requests` 실패 | 인증·필수정보·중복 ID·연결 대상·API 문제 |
| 승인 후 화면 미반영 | 게시 Transaction·검색 색인·Cache 문제 |
