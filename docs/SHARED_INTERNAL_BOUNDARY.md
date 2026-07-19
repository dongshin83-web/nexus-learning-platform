# Nexus와 사내 사이트의 코드 경계

## 원칙

- Nexus는 공통 화면의 디자인과 등록 프로토콜을 검토하는 기준본이다.
- 사내 GitLab은 실제 Library 카드, 사내 링크, 검토·게시 이력의 기준본이다.
- Overview, Technology Map, Learning Path, Registration Guide, Culture & History는 공통 영역으로 유지한다.
- Library 화면과 Library 데이터는 환경별 영역으로 분리한다.

## 파일 경계

### 공통 동기화 대상

`sync/shared-files.txt`에 적힌 파일만 공통 패키지에 포함한다. 공통 화면을 수정한 뒤 다음 명령으로 단일 ZIP을 만든다.

```powershell
powershell -ExecutionPolicy Bypass -File tools/build-shared-package.ps1
```

생성물은 `dist/team-technical-assets-shared.zip`이다. 이 ZIP에는 공통 HTML·CSS·JavaScript와 Registration Guide 이미지가 들어간다.

### 사내 전용

- `team_technical_assets_library.html`
- `team_technical_assets_library.css`
- `team_technical_assets_library.js`
- `data/cards/*.json`
- `team_technical_assets_data.js`
- `team_technical_assets_culture_data.js`
- `team_technical_assets_runtime_config.js`
- `assets/culture/` 아래의 사내 이미지
- `.gitlab-ci.yml`과 사내 배포 설정

공통 패키지는 위 파일을 포함하지 않으므로, 사내 Library·Culture 데이터나 GitLab 설정을 덮어쓰지 않는다. Culture UI는 공통 파일이지만 기록 내용과 이미지 경로는 사내 전용 데이터 파일에서 관리한다.

## 사내 Library 등록 기반

다음 파일은 사내 저장소에 한 번 갖춰 둘 등록 도구다.

- `package.json`
- `tools/card-contract.mjs`
- `tools/build-library-data.mjs`
- `tools/register-card.mjs`
- `tests/card-pipeline.test.mjs`
- `tests/registration-import.test.mjs`
- `data/search-evaluation.json`

실제 등록 절차는 `docs/INTERNAL_LIBRARY_REGISTRATION.md`를 따른다. 카드 원본은 `data/cards/*.json`이고, 생성 파일인 `team_technical_assets_data.js`는 직접 편집하지 않는다.

## 변경 순서

1. Nexus에서 공통 화면과 등록 양식을 수정하고 검토한다.
2. 공통 ZIP을 생성한다.
3. 사내 GitLab의 작업 Branch에서 ZIP을 덮어쓴다.
4. 사내 전용 Library 파일과 `data/cards`가 변경되지 않았는지 확인한다.
5. 사내에서 `npm run check`를 실행하고 Merge Request로 반영한다.

Library 기능이나 카드 계약을 바꾸는 경우에는 공통 ZIP만으로 끝내지 않고, 사내 전용 파일과 등록 도구 변경을 별도 검토한다.
