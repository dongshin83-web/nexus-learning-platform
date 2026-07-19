# Culture & History 기록 등록

## 기록 단위

Culture & History에는 다음 기록을 등록한다.

- 팀장레터
- 조직문화·목표·비전 워크샵 결과
- 우리팀 일하는 원칙
- 회고와 변화 기록

각 기록은 제목과 요약뿐 아니라 여러 이미지와 여러 내부 자료 링크를 함께 가질 수 있다.

```javascript
{
    id: "culture-20260719180000",
    type: "워크샵 결과",
    title: "우리팀의 목표와 비전 워크샵",
    series: "워크샵 기록",
    status: "초안",
    date: "2026.07.19",
    summary: "워크샵의 목적과 다시 활용할 상황",
    tags: ["조직문화", "목표", "비전"],
    images: [
        { src: "사내 이미지 URL 또는 경로", alt: "이미지 핵심 내용" }
    ],
    links: [
        { label: "워크샵 결과 파일", href: "사내 URL", kind: "결과물" },
        { label: "후속 액션", href: "사내 URL", kind: "실행 기록" }
    ]
}
```

## 현재 정적 모드

Culture 페이지의 `기록 등록` 버튼을 누른다. 내용을 입력하고 `등록 JSON 다운로드`를 선택하면 위 형식의 JSON이 생성된다. 사내 데이터 담당자는 검토 후 `team_technical_assets_culture_data.js`에 반영한다.

등록 화면은 바깥 영역이나 Esc를 눌러도 닫히지 않는다. 우측 상단 X 또는 `취소` 버튼으로만 종료한다.

## 사내 API 모드

`team_technical_assets_runtime_config.js`를 사내에서 다음과 같이 설정한다.

```javascript
window.TECHNICAL_ASSET_RUNTIME = {
    mode: "api",
    apiBaseUrl: "https://사내-api/api/v1",
    credentials: "include"
};
```

그러면 같은 버튼이 `초안 저장`으로 바뀌고 `POST /culture-records`로 전송한다. API와 DB가 준비되기 전에는 `mode: "static"`을 유지한다.

## 파일 경계

- `team_technical_assets_culture.js`: 공통 UI와 등록 동작
- `team_technical_assets_culture_data.js`: 사내 전용 기록 데이터
- `assets/culture/`: 사내 전용 이미지
- `team_technical_assets_runtime_config.js`: 사내 API 주소와 실행 모드

공통 화면 ZIP은 사내 전용 데이터와 이미지를 포함하지 않는다.
