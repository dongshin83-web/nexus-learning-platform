const TYPE_SPECIFIC_SCHEMAS = {
    "VD Request": {
        context: "확인 필요",
        primaryQuestion: "확인 필요",
        inputsAndConstraints: ["확인 필요"],
        approach: "확인 필요",
        result: "확인 필요",
        judgmentScope: "확인 필요",
        limitations: ["확인 필요"],
        followUp: ["확인 필요"],
        requesterFeedback: {
            channel: "확인 필요",
            summary: "확인 필요"
        },
        decisionImpact: {
            outcomes: ["확인 필요"],
            summary: "확인 필요"
        }
    },
    CoR: {
        backgroundAndGap: "확인 필요",
        objectiveAndSuccessCriteria: "확인 필요",
        scopeAndPlan: "확인 필요",
        validationDesign: "확인 필요",
        progressDecisions: ["확인 필요"],
        resultAndJudgment: "확인 필요",
        outputsAndFollowUp: ["확인 필요"],
        projectCompletionConfirmed: "확인 필요",
        goalAchievement: "확인 필요",
        businessContribution: {
            areas: ["확인 필요"],
            pathway: "확인 필요",
            quantitativeEffectConfirmed: "확인 필요"
        },
        processChange: {
            before: "확인 필요",
            after: "확인 필요",
            status: "확인 필요"
        },
        relatedDocuments: ["[사내에서 제안서·중간보고서·결과보고서·방법론 링크 복원]"]
    },
    "방법론": {
        problemAndPurpose: "확인 필요",
        technicalPrinciples: "확인 필요",
        inputsAndPrerequisites: ["확인 필요"],
        standardProcedure: ["확인 필요"],
        resultsAndCriteria: "확인 필요",
        scopeAndLimits: ["확인 필요"],
        validationAndReuse: {
            evidence: ["확인 필요"],
            methodologyStatus: "확인 필요",
            currentLevel: "확인 필요",
            levelBasis: "확인 필요",
            remainingGap: "확인 필요",
            technologyMapStatus: "확인 필요"
        }
    },
    BP: {
        businessContext: "확인 필요",
        simulationResponse: "확인 필요",
        businessFeedback: {
            status: "확인 필요",
            summary: "확인 필요",
            evidence: "확인 필요"
        },
        businessImpact: {
            areas: ["확인 필요"],
            pathway: "확인 필요",
            confirmationLevel: "확인 필요"
        },
        reproductionConditions: ["확인 필요"],
        evidence: ["확인 필요"]
    },
    "기술보고서": {
        questionAndPurpose: "확인 필요",
        scopeAndConditions: ["확인 필요"],
        methodAndEvidence: "확인 필요",
        findingsAndConclusion: "확인 필요",
        validConditionsAndDecisions: {
            validConditions: ["확인 필요"],
            supportedDecisions: ["확인 필요"],
            unsupportedDecisions: ["확인 필요"]
        },
        limitations: ["확인 필요"],
        officialSource: "[사내에서 공식 보고서 링크·버전 복원]"
    },
    "외부 보고 자료": {
        reportPurpose: "확인 필요",
        audienceAndDecision: "확인 필요",
        approvedMessages: ["확인 필요"],
        sourceAssetsAndEvidence: ["확인 필요"],
        disclosureScope: "확인 필요",
        versionAndValidity: {
            currentVersion: "[사내에서 버전 복원]",
            referenceDate: "[사내에서 기준일 복원]",
            reviewTrigger: "확인 필요"
        },
        limitationsAndNotes: ["확인 필요"]
    },
    "노하우": {
        knowhowCategory: "확인 필요",
        symptomAndConditions: {
            situationAndGoal: "확인 필요",
            triggerOrFrequency: "확인 필요"
        },
        causeAndDiagnosis: {
            keyDifficulty: "확인 필요",
            checksBeforeAction: ["확인 필요"],
            ineffectiveAttempts: ["확인 필요"]
        },
        resolution: [
            {
                step: 1,
                action: "확인 필요",
                judgment: "확인 필요"
            }
        ],
        effectAndEvidence: {
            completionCriteria: ["확인 필요"],
            result: "확인 필요",
            evidenceLevel: "확인 필요"
        },
        risksAndRecovery: {
            doNotApply: ["확인 필요"],
            risksOrFailureSignals: ["확인 필요"],
            escalationOrRecovery: ["확인 필요"]
        },
        versionsAndSources: ["[사내에서 Template·Checklist·SOP·사례·버전·근거 링크 복원]"]
    },
    "Tool Manual": {
        purposeAndOutput: "확인 필요",
        prerequisites: ["확인 필요"],
        procedure: ["확인 필요"],
        completionCheck: {
            expectedResult: "확인 필요",
            invalidSignals: ["확인 필요"]
        },
        errorsAndWarnings: {
            stopConditions: ["확인 필요"],
            commonRisks: ["확인 필요"]
        },
        versionsAndSources: ["[사내에서 Tool·Script 버전과 원문·예제 링크 복원]"]
    },
    "교육자료": {
        learningObjectives: ["확인 필요"],
        audienceAndPrerequisites: {
            audience: "확인 필요",
            prerequisites: ["확인 필요"]
        },
        outline: ["확인 필요"],
        activities: {
            methods: ["확인 필요"],
            expectedDuration: "확인 필요",
            materials: ["확인 필요"]
        },
        completionCriteria: ["확인 필요"],
        sourcesAndVersion: ["[사내에서 원문·관련 자산·버전 링크 복원]"]
    }
};

const CONTROLLED_VISIBLE_TAG_GROUPS = Object.freeze({
    "모델·해석": ["물성/재료모델", "경계조건", "접촉/계면", "비선형", "Mesh/요소", "수렴/안정화", "계산 효율화"],
    "검증·판단": ["실험 상관", "민감도 분석", "불확실성 검토", "설계안 비교", "원인 규명", "판단 기준", "최적화"],
    "재사용·확산": ["자동화/AI", "재사용 템플릿"]
});

const CONTROLLED_VISIBLE_TAGS = Object.freeze(Object.values(CONTROLLED_VISIBLE_TAG_GROUPS).flat());

const promptDefinitions = {
    "vd-request": {
        cardType: "VD Request",
        purpose: "개별 요청에서 요청자가 필요로 한 판단, Simulation이 제공한 근거, 요청자의 피드백과 실제 후속 행동을 정리합니다.",
        focus: "상황과 판단 질문, 비교·검토 방식, 핵심 경향, 피드백 확인 경로, 실제 의사결정 영향, 재사용 조건을 구분하세요. 영향이 확인되지 않았으면 추정하지 말고 확인 필요로 남기세요.",
        tagFocus: ["설계안 비교", "원인 규명", "판단 기준", "실험 상관", "불확실성 검토"]
    },
    cor: {
        cardType: "CoR",
        purpose: "완료된 CoR의 기술 Gap, 목표와 검증, 확보 기술, 경영성과 기여와 회사 프로세스 변화를 정리합니다.",
        focus: "과제 완료와 결과보고서 준비 여부, 목표 달성도, 주요 진행 판단, 검증 결과, 제안서·중간보고서·결과보고서·관련 방법론 존재 여부를 구분하세요. 미완료라면 완료된 것처럼 쓰지 마세요.",
        tagFocus: ["원인 규명", "판단 기준", "실험 상관", "최적화", "재사용 템플릿"]
    },
    methodology: {
        cardType: "방법론",
        purpose: "반복 적용 가능한 기술 원리, 표준 절차, 판단 기준, 적용범위와 검증 근거를 정리합니다.",
        focus: "최소 적용 근거, 후보·정식 방법론 상태, L1~L5 현재 Level과 근거·남은 Gap, Technology Map 등재·미등재 여부를 포함하세요. Map 미등재여도 Level은 반드시 근거에 따라 평가하세요.",
        tagFocus: ["물성/재료모델", "경계조건", "접촉/계면", "비선형", "Mesh/요소", "수렴/안정화", "계산 효율화", "실험 상관"]
    },
    bp: {
        cardType: "BP",
        purpose: "구체적인 사업 상황에서 Simulation이 가능하게 한 판단, 사업부의 행동, 경영성과와 재현 조건을 정리합니다.",
        focus: "사업 맥락, Simulation 대응, 피드백과 실제 행동, 비용·기간·품질·고객대응 등에 이른 영향 경로, 성과 확인 수준, 반복 가능한 성공요인을 구분하세요. 기대효과를 실측 성과처럼 쓰지 마세요.",
        tagFocus: ["설계안 비교", "원인 규명", "판단 기준", "최적화", "재사용 템플릿"]
    },
    "technical-report": {
        cardType: "기술보고서",
        purpose: "공식 기술 질문, 검토 범위, 분석·실험 근거, 결론과 판단 가능한 범위를 정리합니다.",
        focus: "관찰 결과·기술적 해석·최종 결론을 구분하고, 결론의 유효조건, 지원 가능한 판단과 지원할 수 없는 판단, 한계, 공식 원문과 버전 복원 항목을 포함하세요.",
        tagFocus: ["원인 규명", "판단 기준", "실험 상관", "민감도 분석", "불확실성 검토"]
    },
    knowhow: {
        cardType: "노하우",
        purpose: "기술 수행뿐 아니라 장표·보고서 작성, 요청 검토 SOP, 다른 조직과의 협업·소통에서 반복해 쓸 수 있는 판단과 실행 방식을 정리합니다.",
        focus: "knowhowCategory는 기술 수행·산출물 작성·업무 절차·협업·소통 중 하나를 선택하세요. 적용 상황과 목표, 핵심 난점과 사전 확인, 최대 7단계의 실행 순서와 판단 이유, 완료·품질 기준과 확인 근거, 예외·위험·중단·복구·Escalation 조건, 재사용 범위와 연결 자료를 구분하세요. 산출물 원문과 공식 SOP는 복사하지 말고 사내 연결 대상으로 남기며, 공식 여부가 확인되지 않은 실무 방식은 공식 절차처럼 표현하지 마세요.",
        tagFocus: ["수렴/안정화", "계산 효율화", "자동화/AI", "재사용 템플릿", "판단 기준"]
    },
    "tool-manual": {
        cardType: "Tool Manual",
        purpose: "특정 Tool에서 하나의 작업을 안전하고 일관되게 수행하는 정상 작업 흐름을 정리합니다.",
        focus: "작업 목적과 결과물, 권한·환경·입력의 사전조건, 3~10단계 실행 절차, 정상 완료와 잘못된 결과의 구분, 중단조건과 주요 위험, 사내에서 복원할 버전·예제·원문을 포함하세요.",
        tagFocus: ["Mesh/요소", "수렴/안정화", "계산 효율화", "자동화/AI", "재사용 템플릿"]
    },
    "education-material": {
        cardType: "교육자료",
        purpose: "개별 학습 콘텐츠의 학습목표, 대상, 구성, 활동과 완료 확인기준을 정리합니다.",
        focus: "관찰 가능한 학습목표 최대 3개, 대상과 사전지식, 다루는 내용과 제외 범위, 학습 방식·예상 시간·준비물, 이해·수행 확인기준, 관련 기술자산과 버전 복원 항목을 포함하세요.",
        tagFocus: ["물성/재료모델", "경계조건", "접촉/계면", "비선형", "실험 상관", "판단 기준"]
    },
    "external-report": {
        cardType: "외부 보고 자료",
        purpose: "확인된 기술 근거를 팀 외부 이해관계자의 의사결정 상황에 맞게 재구성한 보고 자료를 정리합니다.",
        focus: "보고 목적과 대상, 연결되는 의사결정, 근거가 확인된 핵심 메시지, 원천 자산, 공유 가능 범위와 제외 정보, 버전·기준일·재검토 조건, 전달 시 한계를 구분하세요.",
        tagFocus: ["설계안 비교", "원인 규명", "판단 기준", "실험 상관", "불확실성 검토"]
    }
};

const assetTypeGuideMeta = {
    "vd-request": {
        label: "VD Request",
        description: "판단 요청과 실제 영향",
        icon: "bx-message-square-detail"
    },
    cor: {
        label: "CoR",
        description: "기술 Gap과 확보 결과",
        icon: "bx-target-lock"
    },
    methodology: {
        label: "방법론",
        description: "반복 적용 절차와 판단 기준",
        icon: "bx-sitemap"
    },
    bp: {
        label: "BP",
        description: "사업 적용과 재현 가능한 성공 방식",
        icon: "bx-trending-up"
    },
    "technical-report": {
        label: "기술보고서",
        description: "공식 기술 결론과 유효 범위",
        icon: "bx-file"
    },
    knowhow: {
        label: "노하우",
        description: "반복 가능한 실행·판단 방식",
        icon: "bx-bulb"
    },
    "tool-manual": {
        label: "Tool Manual",
        description: "표준 작업 절차와 완료 기준",
        icon: "bx-wrench"
    },
    "education-material": {
        label: "교육자료",
        description: "학습 목표와 수행 확인",
        icon: "bx-book-open"
    },
    "external-report": {
        label: "외부 보고 자료",
        description: "승인된 메시지와 근거 자산",
        icon: "bx-presentation"
    }
};

function createInterviewStartPrompt(cardType) {
    return `당신은 Simulation/VDE 조직의 기술 경험을 사내 Wiki 등록용 기술자산으로 구조화하는 인터뷰 진행자입니다.

내가 등록하려는 자산유형은 \`${cardType}\`입니다.

이 대화의 목적은 단순 요약이 아니라, 해당 자산유형의 등록 필수정보와 검색 메타데이터를 빠짐없이 확보해 사내 반입용 JSON을 거의 완성하는 것입니다.

대화 규칙:
1. 먼저 내가 이 경험 또는 자료를 자유롭게 설명하게 해주세요.
2. 자유 설명에서 이미 확인된 내용은 다시 묻지 마세요.
3. 이 대화에서 제공하는 자산유형별 필수 질문 중 답이 없거나 불명확한 항목만 한 번에 1~2개씩 질문하세요.
4. 답변에서 확인된 사실, 기술적 해석, 제안, 미확인 사항을 구분하세요.
5. 답변에 없는 사실·성과·검증·관계를 추정하지 마세요.
6. 모르는 항목은 억지로 채우지 말고 \`확인 필요\`로 기록하세요.
7. 실제 회사·조직·고객·제품·과제·사람·보고서명·ID·URL·파일경로를 요구하거나 반복하지 마세요.
8. 정확한 치수·물성·조건·수치·일정은 요구하지 말고 상대적 경향이나 판단 가능한 범위로 일반화하세요.
9. 사내에서 복원해야 하는 값은 \`[제품군]\`, \`[과제]\`, \`[담당자]\`, \`[사내 보고서]\`, \`[실제 조건]\`처럼 Placeholder로 남기세요.
10. 사내 문서·모델·이미지·로그·파일을 업로드하라고 요청하지 마세요.
11. 모든 유형별 필수 질문과 공통 분류·검색 질문을 점검하기 전에는 최종 JSON을 만들지 마세요.
12. 질문이 끝나면 \`확보 완료 / 확인 필요 / 사내 복원\`으로 나눈 완료점검표를 먼저 보여주세요.`;
}

const interviewStartPrompts = Object.fromEntries(
    Object.entries(promptDefinitions).map(([key, definition]) => [key, createInterviewStartPrompt(definition.cardType)])
);

const registrationStepDefinitions = [
    {
        id: "conversation",
        number: "01",
        phase: "OUTSIDE SAFE",
        title: "AI와 대화하기",
        summary: "판단 맥락과 확인 필요 항목 확보",
        purpose: "등록에 필요한 판단 맥락을 빠짐없이 확보하되, 외부 AI에 사내 식별정보가 남지 않도록 경험을 일반화해 설명합니다.",
        actions: [
            "선택한 Asset type의 질문 순서에 따라 상황·목적·판단·근거·결과·한계를 설명합니다.",
            "회사·조직·고객·제품·과제·담당자·문서명은 [사업부], [제품군], [관련 보고서]처럼 치환합니다.",
            "정확한 치수·물성·조건·성과 수치는 증가·감소, 기준 이내·초과, 상대적으로 높음·낮음처럼 방향으로 표현합니다.",
            "확인된 사실, 기술적 해석, 제안, 아직 확인하지 못한 내용을 분리합니다.",
            "사내 문서·이미지·모델·로그·파일·링크는 업로드하지 않고, 사내에서 연결할 자료만 Placeholder로 남깁니다.",
            "내용 대화가 끝나면 자료유형·기술영역·업무단계·대응 대상, 검색 별칭·예상 검색문장·내용 기반 기술 태그·제외어 후보와 각 후보를 뒷받침한 답변 근거를 확인합니다."
        ],
        completion: [
            "유형별 필수 질문에 답했거나 모르는 항목을 ‘확인 필요’로 표시했습니다.",
            "실제 식별정보·정확한 수치·내부 링크가 포함되지 않았습니다.",
            "무엇을 판단했고 어떤 근거로 결론을 냈는지 설명됩니다.",
            "사내에서 복원해야 할 항목이 별도로 구분돼 있습니다.",
            "필수 분류 축과 검색 표현, 내용 기반 추가 태그 후보가 서로 섞이지 않고 구분돼 있으며 각 후보에 일반화된 답변 근거가 있습니다."
        ],
        caution: "일반화해도 특정 제품이나 과제를 쉽게 추정할 수 있는 내용은 외부 AI에서 다루지 않습니다. 확인되지 않은 성과나 공식 승인 상태도 추정하지 않습니다."
    },
    {
        id: "structure",
        number: "02",
        phase: "STRUCTURE",
        title: "반입용 JSON 파일 만들기",
        summary: "Prompt 복사 → AI에서 Handoff .json 다운로드",
        purpose: "같은 AI 대화창에 유형별 Prompt를 붙여 넣어, 앞선 대화를 사내 반입용 Handoff .json 파일로 저장합니다.",
        actions: [
            "아래 ‘JSON 파일 생성 Prompt 복사’를 누릅니다.",
            "경험을 설명한 같은 AI 대화창에 Prompt를 붙여 넣습니다.",
            "AI가 제시한 분류 후보·일반화된 답변 근거·누락 항목을 확인한 뒤 ‘최종 JSON 생성’을 지시합니다.",
            "AI 답변에 첨부된 .json 파일을 다운로드합니다.",
            "첨부 기능이 없는 AI에서만 json 코드 블록을 복사해 UTF-8 .json으로 저장합니다."
        ],
        completion: [
            "cardTypeCandidate가 선택한 Asset type과 일치합니다.",
            "유형별 필수 내용이 typeSpecific에 포함돼 있습니다.",
            "자료유형·기술영역·업무단계·대응 대상 후보와 내용 기반 추가 태그가 구분돼 있고, 자동 후보마다 answerEvidence가 기록돼 있습니다.",
            "답변 근거가 없는 분류 축은 임의값이나 기타로 채워지지 않고 빈 값과 사내 직접 선택 항목으로 남아 있습니다.",
            "placeholdersToRestoreInternally와 itemsToConfirm이 구분돼 있습니다.",
            "모르는 내용은 만들지 않고 ‘확인 필요’로 남아 있습니다.",
            "securitySelfCheck를 확인했고 JSON이 유효한 객체 형태입니다.",
            "다운로드한 파일의 확장자가 .json이고 코드 블록과 내용이 동일합니다."
        ],
        caution: "새 대화창이나 다른 AI로 옮기면 앞선 맥락이 누락될 수 있습니다. JSON을 보완하려고 실제 사내 정보를 외부 AI에 다시 입력하지 않습니다."
    },
    {
        id: "import",
        number: "03",
        phase: "IMPORT",
        title: "JSON 확인·사내 반입하기",
        summary: "다운로드 파일·AI 추천 태그·승인된 반입 경로 확인",
        purpose: "AI에서 다운로드했거나 코드 블록으로 직접 저장한 JSON을 점검하고, 승인된 경로를 통해 사내 Wiki 등록 초안으로 가져옵니다.",
        actions: [
            "AI가 첨부한 UTF-8 .json 파일을 다운로드합니다. 첨부가 없으면 코드 블록의 JSON 객체만 직접 저장합니다.",
            "파일을 다시 열어 코드 블록과 내용이 같고 Markdown 기호, 설명 문장, 주석, trailing comma가 섞이지 않았는지 확인합니다.",
            "실제 제품명이나 과제명을 파일명에 쓰지 않고 일반화된 파일명을 사용합니다.",
            "실제 회사·조직·사람·제품명, URL, 파일 경로, 정확한 수치가 남아 있지 않은지 다시 점검합니다.",
            "AI가 제안한 필수 분류 태그와 내용 기반 추가 태그의 answerEvidence·추천 이유를 확인하고, 근거가 없는 필수 축은 Wiki 등록 2단계에서 직접 선택할 항목으로 남았는지 점검합니다.",
            "승인된 메일 또는 파일 전달 방식으로 반입한 뒤 Wiki의 기술자산 등록 화면에서 파일을 불러옵니다."
        ],
        completion: [
            "JSON 파일이 정상적으로 열리고 등록 화면에서 초안 미리보기가 생성됩니다.",
            "JSON 파싱·필수값·허용값에 등록을 막는 오류가 없습니다.",
            "선택한 Asset type 후보가 맞는지 확인했습니다.",
            "중복 반입 여부를 확인했고 경고와 ‘확인 필요’ 항목이 보완 목록에 남아 있습니다."
        ],
        caution: "음성 파일, AI 대화 원문, 별도 전사본은 반입하지 않습니다. 워드프로세서로 JSON을 저장하거나 코드 펜스·설명·주석이 포함된 파일을 반입하지 않으며, 사내에서 복원한 실제 정보를 외부 대화로 되돌려 보내지 않습니다."
    },
    {
        id: "complete",
        number: "04",
        phase: "INSIDE ONLY",
        title: "사내 Wiki 등록 JSON 완성하기",
        summary: "사내 정보 보완 → 태그·연결 확인 → Wiki 바로 등록",
        purpose: "반입한 JSON 초안에 실제 사내 정보·검색 분류·근거·관계·Framework 판단을 보완하고, 등록 화면에서 GitLab 네이티브 Wiki 문서로 바로 등록합니다.",
        actions: [
            "실제 제목·조직·제품·과제 ID·조건·수치와 확인일을 사내에서 복원합니다.",
            "유형별 상세 JSON과 공통 메타데이터, Owner를 입력합니다. 별도 검토자를 기록할 필요가 있을 때만 Reviewer를 선택적으로 입력합니다.",
            "공식 원문·모델·데이터·회의·Template은 중복 업로드하지 않고 사내 원본 링크로 연결합니다.",
            "2단계에서 AI 후보의 답변 근거를 확인합니다. 후보가 없거나 근거가 충분하지 않으면 자료유형·주 기술영역·업무단계·대응대상을 직접 선택하고, 내용 기반 추가 태그는 선택·제외합니다.",
            "기존 Wiki의 중복 후보와 관계를 확인하고, Technology Map·Learning Path에는 ‘연결됨 / 해당 없음 / 대상 미등록’ 중 하나와 판단 사유를 기록합니다.",
            "등록 전 검증을 통과하면 현재 사용자 GitLab 권한으로 ‘Wiki에 바로 등록’을 실행합니다."
        ],
        completion: [
            "제목·요약·Asset type·게시 상태와 유형별 필수 내용이 완성됐습니다.",
            "실제 근거와 원본 링크, 적용범위·한계·주의사항이 있습니다.",
            "필수 분류 태그와 추가 추천 태그를 2단계에서 확정했고, 기존 자산 관계와 Technology Map·Learning Path 연결 판단이 확인됐습니다.",
            "Owner와 등록자의 최종 사실 확인을 완료했습니다. 별도 검토자 확인은 등록 필수조건이 아닙니다.",
            "등록 결과가 GitLab Wiki Markdown 문서로 생성됐습니다."
        ],
        caution: "GitLab Access Token은 페이지나 카드에 저장하지 않고 현재 등록 요청에만 사용합니다. 등록자는 대상 프로젝트의 Wiki 작성 권한이 있어야 합니다. Library와 Registration Guide의 예시 데이터에는 실제 등록 결과를 추가하지 않습니다."
    }
];

const libraryRegistrationStepOverrides = {
    import: {
        summary: "다운로드 파일과 Library 반입 형식 확인",
        purpose: "AI에서 다운로드한 JSON을 점검하고, 기존 Library 등록 화면에서 카드 초안으로 가져오는 예시 절차를 확인합니다.",
        actions: [
            "AI가 첨부한 UTF-8 .json 파일을 다운로드하고 JSON 객체만 포함됐는지 확인합니다.",
            "실제 식별정보·내부 링크·정확한 수치가 외부 Handoff에 남지 않았는지 점검합니다.",
            "Library 예시 화면에서 파일을 불러와 유형·오류·중복 후보를 확인합니다."
        ],
        completion: [
            "JSON 파일이 정상적으로 열리고 Library 카드 초안 미리보기가 생성됩니다.",
            "자산유형과 typeSpecific 구조가 등록 계약과 일치합니다.",
            "실제 사내 정보로 보완할 항목이 분리돼 있습니다."
        ],
        caution: "이 페이지는 기존 Library 등록 방식을 설명하는 정적 예시입니다. 생성한 JSON은 실제 운영 Wiki에 자동 등록되지 않습니다."
    },
    complete: {
        title: "사내 Library 등록 JSON 완성하기",
        summary: "사내 정보 보완 → 카드 검증 → JSON 다운로드 예시",
        purpose: "반입한 초안에 실제 사내 정보·검색 분류·근거·관계·Framework 판단을 보완하고 기존 Library 카드 JSON을 완성하는 예시입니다.",
        actions: [
            "실제 제목·조직·제품·과제 ID·조건·수치와 확인일을 사내에서 복원합니다.",
            "유형별 상세 JSON, 검색 분류, Owner와 원본 링크를 보완합니다.",
            "기존 Library 중복 후보와 Technology Map·Learning Path 연결 판단을 확인합니다.",
            "검증을 통과한 Library 카드 JSON을 다운로드합니다."
        ],
        completion: [
            "Library 카드의 공통·유형별 필수 내용이 완성됐습니다.",
            "태그·별칭·예상 검색문장과 관계 정보가 확인됐습니다.",
            "다운로드할 JSON이 카드 계약을 통과했습니다."
        ],
        caution: "정적 예시 페이지이므로 JSON 다운로드가 실제 게시를 의미하지 않습니다. 실제 신규 자산은 Wiki Guide에 따라 GitLab Wiki에 등록합니다."
    }
};

function getRegistrationContext() {
    return document.body?.dataset.registrationContext === "wiki" ? "wiki" : "library";
}

function getRegistrationStepDefinitions() {
    if (getRegistrationContext() === "wiki") return registrationStepDefinitions;
    return registrationStepDefinitions.map((step) => ({ ...step, ...(libraryRegistrationStepOverrides[step.id] || {}) }));
}

function createSearchMetadataTemplate() {
    return {
        candidateStatus: "needs_user_confirmation",
        primaryDomainCandidate: "",
        secondaryDomainCandidates: [],
        workflowStageCandidates: [],
        responseTargetCandidates: [],
        visibleTags: [],
        aliases: [],
        expectedQueries: [],
        excludedTerms: [],
        candidateRationale: [],
        internalFinalizationRequired: true
    };
}

function createHandoffTemplate(cardType) {
    return {
        packetVersion: "0.2",
        cardTypeCandidate: cardType,
        workingTitle: "확인 필요",
        abstractContext: "확인 필요",
        primaryQuestion: "확인 필요",
        inputsAndConstraints: ["확인 필요"],
        approachOrContent: "확인 필요",
        observationsAndResult: "확인 필요",
        evidenceAvailable: ["확인 필요"],
        validConditions: ["확인 필요"],
        limitationsAndUnknowns: ["확인 필요"],
        reuseOrFollowUp: ["확인 필요"],
        searchTerms: [],
        searchMetadata: createSearchMetadataTemplate(),
        relatedAssetCandidates: ["확인 필요"],
        placeholdersToRestoreInternally: ["확인 필요"],
        itemsToConfirm: ["확인 필요"],
        securitySelfCheck: "pass",
        typeSpecific: TYPE_SPECIFIC_SCHEMAS[cardType]
    };
}

function createJsonConversionPrompt({ cardType, purpose, focus, tagFocus = [], outputFileName }) {
    const handoffTemplate = JSON.stringify(createHandoffTemplate(cardType), null, 2);
    const controlledTagList = Object.entries(CONTROLLED_VISIBLE_TAG_GROUPS)
        .map(([group, tags]) => `- ${group}: ${tags.join(", ")}`)
        .join("\n");
    const typeTagFocus = tagFocus.join(", ");

    return `당신은 앞선 대화 내용을 사내 기술자산 Wiki 등록용 Handoff Packet JSON으로 변환하는 정리자입니다.

[사용 맥락]
이 Prompt는 사용자와 기술 또는 업무 경험을 대화한 바로 그 대화창에 붙여 넣었습니다. 새 인터뷰를 시작하거나 이미 답한 내용을 다시 질문하지 말고, 이 창의 앞선 대화 전체만 읽어 정리하세요.

[대상 유형]
${cardType}: ${purpose}

[정리 기준]
${focus}

[절대 보안 규칙]
1. 앞선 대화에 실제 회사·조직·사업부·고객·협력사·제품·Project·과제·보고서명·ID가 있어도 그대로 반복하지 말고 [사업부], [제품군], [과제], [사내 보고서]처럼 일반화하세요.
2. 사람 이름, 메일주소, URL, 파일명, 내부 경로, 시스템명과 접근정보를 출력하지 말고 사내 복원용 Placeholder로 바꾸세요.
3. 정확한 치수·물성·공정조건·온도·성능·비용·기간·일정·비율 등은 출력하지 말고 증가·감소, 기준 이내·초과, 상대 비교와 경향으로 바꾸세요.
4. 앞선 대화에 없는 기술적 사실, 피드백, 성과, Level과 검증 근거를 추정하거나 만들어내지 마세요.
5. 모르는 일반 본문 문자열은 "확인 필요", 모르는 일반 본문 배열은 ["확인 필요"]로 남기고 확인할 사항을 itemsToConfirm에도 적으세요. 단, searchMetadata의 분류 후보는 근거가 없을 때 빈 문자열 "" 또는 빈 배열 []로 두고 임의값·"확인 필요"·"other"로 채우지 마세요.
6. 사내에서 실제 용어·수치·담당자·버전·문서 링크를 복원할 항목은 placeholdersToRestoreInternally에 일반명으로 적으세요.
7. 검색어도 실제 고유명 대신 외부에 노출 가능한 일반 기술어와 현상어만 사용하세요.

[검색 메타데이터 2단계 확인]
1. 외부 AI는 검색 메타데이터의 최종 확정자가 아닙니다. 앞선 대화에서 일반화된 후보만 제안하고, 사내 Wiki 등록 단계가 기존 통제어·중복·검색 별칭과 대조해 최종 확정합니다.
2. 이 Prompt를 받은 첫 응답에서는 JSON을 바로 출력하지 마세요. 먼저 다음 열을 가진 짧은 표를 보여주세요: 분류 축, 후보, 답변 근거(일반화), 매핑 이유, 사내 확인 필요. 표에는 자료유형, 주 기술영역, 보조 기술영역, 업무 단계, 대응 대상, 자동 분류 태그, 내용 기반 추가 태그, 검색 별칭, 예상 검색문장, 제외어를 포함하세요.
3. 후보는 반드시 이 대화에서 사용자가 실제로 말했거나 명시적으로 선택한 내용에 근거해야 합니다. Prompt의 예시·질문 문구·자산유형 설명·Placeholder·기본값만으로 주 기술영역, 보조 기술영역, 업무 단계나 대응 대상을 추론하지 마세요. 답변 근거는 민감정보를 제거한 짧은 일반화 문장으로 적으세요.
4. 자료유형은 사용자가 선택한 ${cardType}을 cardTypeCandidate로 사용합니다. 자료유형 태그의 답변 근거에는 "등록자가 선택한 자산유형: ${cardType}"이라고 기록하세요.
5. 주 기술영역 후보는 deformation(변형), delamination(박리), impact(충격), thermal-flow(열유동), fatigue(피로), vibration(진동), other(기타) 중 직접 근거가 있는 1개를 제안하세요. 보조 기술영역 후보는 같은 목록에서 직접 근거가 있는 값만 최대 2개 제안하세요. 매핑 기준은 변형·변위·강성·좌굴→deformation, 박리·접착·계면 분리·층간→delamination, 충격·낙하·충돌→impact, 열·유동·냉각·온도·압력손실→thermal-flow, 반복하중·내구·수명·피로→fatigue, 진동·NVH·모드·주파수→vibration입니다. other는 답변이 앞의 6개와 다른 기술영역을 명확히 설명할 때만 사용하며 근거 없음의 기본값으로 사용하지 마세요.
6. 업무 단계 후보는 연구·설계·개발·공정·제조·품질 중 답변에 직접 드러난 값만 제안하세요. 탐색·원리·가능성 검토→연구, 설계안 선택·설계 변경→설계, 시제품·요구사항·개발 의사결정→개발, 공정 조건·치공구·공정 최적화→공정, 양산 적용·생산 실행→제조, 결함·검사·품질 판정→품질로 매핑하되 단어가 아니라 실제 수행 맥락을 근거로 판단하세요.
7. 대응 대상 후보는 고객·사업부·CTO·AX·품질경영·생산기술 중 답변에서 요청자·의사결정자·활용 조직이 직접 드러난 값만 제안하세요. 외부 고객 요청·설명→고객, 사업 의사결정·사업부 요청→사업부, CTO 조직 의사결정·보고→CTO, 디지털 전환·AI 자동화 활용 조직→AX, 품질 기준·품질 거버넌스→품질경영, 양산·제조기술 적용 조직→생산기술로 매핑하세요.
8. 근거가 없는 주 기술영역은 "", 보조 기술영역·업무 단계·대응 대상은 []로 두고, 누락된 각 필수 축을 itemsToConfirm에 "사내 등록 단계에서 ○○ 직접 선택"이라고 별도로 기록하세요. 후보가 비어 있어도 임의 후보를 만들지 마세요. 사내 등록 화면은 자료유형·주 기술영역·업무 단계·대응 대상을 모두 선택하기 전까지 Wiki 등록을 허용하지 않습니다.
9. searchMetadata.visibleTags에는 자료유형 태그와, 근거가 있어 실제 후보로 제안한 주·보조 기술영역의 한글명, 업무 단계, 대응 대상만 자동 분류 태그로 넣으세요. 후보가 비어 있는 축의 태그는 만들지 마세요. 사내 등록 시 최종 선택값에서 자동 분류 태그가 다시 생성됩니다.
10. 내용 기반 추가 태그는 자동 분류 태그를 반복하지 않는 구체적인 기술 개념·검증 방법·판단 방식만 0~5개 추천하세요. 아래 표준 후보를 먼저 사용하고, 대화에 직접 근거가 없는 태그는 추천하지 마세요. ‘연계’, ‘대응’, ‘개선사항’, ‘기타’처럼 검색 범위가 모호한 표현이나 자료유형·기술영역·업무단계·대응 대상을 다시 말한 태그는 만들지 마세요.
현재 Wiki 내용 기반 표준 태그:
${controlledTagList}
${cardType}에서 우선 검토할 후보: ${typeTagFocus}. 이 목록은 자동 선택값이 아니며, 앞선 대화 내용이 직접 뒷받침할 때만 사용하세요.
11. 표준 후보에 정확히 맞는 태그가 없을 때만 신규 후보를 최대 2개 제안하세요. 신규 태그는 2~12자의 명사형 기술 용어로 만들고, visibleTags와 candidateRationale에 넣되 reason에 ‘신규 후보’라고 명시하세요. 사내 등록자는 추가 태그만 선택·제외하거나 직접 추가할 수 있습니다. 검색 별칭은 태그로 만들지 말고 한글·영문 동의어, 약어, 과거 명칭과 다른 표현으로 분리하세요.
12. 예상 검색문장은 제목을 모르는 동료가 입력할 법한 문제·상황·판단 목적의 짧은 질의로 제안하세요. 제외어는 비슷해 보이지만 이 자산과 매칭되면 안 되는 표현만 제안하세요.
13. 각 후보는 candidateRationale에 category, value, answerEvidence, reason을 기록하세요. answerEvidence에는 해당 후보를 뒷받침한 실제 사용자 답변을 민감정보 없이 일반화해 적으세요. category는 primaryDomainCandidate, secondaryDomainCandidates, workflowStageCandidates, responseTargetCandidates, visibleTags, aliases, expectedQueries, excludedTerms 중 하나만 사용하세요. 자동 분류 visibleTags의 answerEvidence는 원본 분류 후보의 답변 근거를 그대로 이어받고, reason에는 ‘자동 분류 태그’, ‘표준 추가 태그’ 또는 ‘신규 후보’를 구분해 적으세요. 답변 근거가 없는 항목은 candidateRationale에 만들지 마세요.
14. 표의 마지막에는 “이 분류와 답변 근거를 사내 확정 전 후보로 사용하는 데 동의하는지, 수정할 값이 있는지” 한 번만 질문하세요. 이미 같은 대화에서 명시적으로 후보 확인을 마쳤다면 이 단계를 반복하지 마세요.
15. 사용자가 후보 수준으로 확인하고 자료유형·주 기술영역·업무 단계·대응 대상에 모두 답변 근거가 있으면 candidateStatus를 "user_confirmed_candidate"로 기록하세요. 확인하지 않았거나 필수 축의 답변 근거가 하나라도 없으면 "needs_user_confirmation"을 유지하세요. 어느 경우에도 internalFinalizationRequired는 true입니다.
16. searchTerms는 v0.1 반입 호환용입니다. visibleTags와 aliases의 중복 없는 합집합만 넣고, 최종 분류 원본은 searchMetadata로 유지하세요.

[Handoff Packet 작성 규칙]
- 아래 공통 키와 typeSpecific의 모든 키를 삭제하거나 이름을 바꾸지 마세요.
- 공통 키에는 대화 전체의 핵심을 짧게 요약하고, typeSpecific에는 ${cardType} 등록 필수 내용을 서로 모순되지 않게 정리하세요.
- searchMetadata의 후보와 candidateRationale을 함께 작성하고, 모든 후보의 answerEvidence가 실제 답변을 뒷받침하는지 재검사하세요. 외부 단계의 후보를 확정 분류처럼 표현하지 마세요.
- evidenceAvailable에는 "회의에서 방향 확인", "비교 평가 근거 존재"처럼 근거의 종류만 쓰고 실제 문서명·링크는 쓰지 마세요.
- 같은 사실을 여러 필드에 장문으로 반복하지 마세요.
- 실제 식별정보와 정확한 수치가 모두 제거됐음을 재검사한 뒤에만 securitySelfCheck를 "pass"로 두세요. 안전 여부가 불확실하면 "recheck"로 바꾸세요.

[최종 전달 방식 · 실제 JSON 파일 생성]
검색 메타데이터 후보를 보여주고 사용자 확인 또는 수정을 받은 뒤에만 다음을 수행하세요.
1. 아래 구조를 지키는 유효한 JSON 객체를 완성하세요. 주석이나 trailing comma를 사용하지 말고 첫 문자는 {, 마지막 문자는 }가 되게 하세요.
2. 현재 AI 환경에 파일 생성·첨부 기능이 있다면 완성한 JSON을 UTF-8(BOM 없음) 파일로 직접 생성하고, 파일명을 반드시 \`${outputFileName}\`으로 지정하세요.
3. 생성한 파일을 사용자가 클릭해 저장할 수 있는 실제 첨부 파일 또는 다운로드 링크로 제공하세요. 존재하지 않는 링크를 만들지 마세요.
4. 파일 본문에는 JSON 객체만 저장하고 Markdown 코드 펜스, 인사말, 설명, 주의문구를 포함하지 마세요.
5. 다운로드 파일과 내용이 완전히 동일한 JSON을 Markdown의 json 코드 블록 정확히 한 개로도 제공하세요.
6. 파일 생성·첨부 기능이 없는 환경에서만 다운로드 링크를 생략하고 코드 블록을 제공하세요.
7. 파일명과 JSON 내용에는 실제 회사·조직·제품·과제명 등 식별정보를 넣지 마세요.

\`\`\`json
${handoffTemplate}
\`\`\``;
}

const prompts = Object.fromEntries(
    Object.entries(promptDefinitions).map(([key, definition]) => [key, createJsonConversionPrompt({
        ...definition,
        outputFileName: `technical-asset-${key}.json`
    })])
);

function getPromptForCardType(cardType) {
    const entry = Object.entries(promptDefinitions).find(([, definition]) => definition.cardType === cardType);
    return entry ? prompts[entry[0]] : "";
}

window.TECHNICAL_ASSET_REGISTRATION = Object.freeze({
    controlledVisibleTagGroups: CONTROLLED_VISIBLE_TAG_GROUPS,
    controlledVisibleTags: CONTROLLED_VISIBLE_TAGS,
    promptDefinitions,
    prompts,
    interviewStartPrompts,
    createSearchMetadataTemplate,
    createHandoffTemplate,
    createInterviewStartPrompt,
    createJsonConversionPrompt,
    getPromptForCardType
});

function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand("copy");
    textarea.remove();
    return copied;
}

async function copyPrompt(promptKey, button) {
    const prompt = prompts[promptKey];
    if (!prompt) return;

    const statusId = promptKey === "vd-request" ? "copy-prompt-status" : `copy-${promptKey}-status`;
    const status = document.getElementById(statusId);
    const buttonLabel = button.querySelector("span");
    let copied = false;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(prompt);
            copied = true;
        } else {
            copied = fallbackCopy(prompt);
        }
    } catch {
        copied = fallbackCopy(prompt);
    }

    if (status) {
        status.textContent = copied
            ? "복사했습니다. 같은 AI 대화창에 붙여 넣고, 최종 확인 후 AI가 첨부한 .json 파일을 다운로드하세요."
            : "자동 복사가 되지 않았습니다. Prompt 영역을 선택해 직접 복사해 주세요.";
    }
    button.classList.toggle("is-copied", copied);
    if (buttonLabel) buttonLabel.textContent = copied ? "복사 완료" : "JSON 파일 생성 Prompt 복사";

    if (copied) {
        window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (buttonLabel) buttonLabel.textContent = "JSON 파일 생성 Prompt 복사";
        }, 2400);
    }
}

async function copyInterviewStartPrompt(assetKey, button) {
    const prompt = interviewStartPrompts[assetKey];
    if (!prompt) return;

    const status = document.getElementById(`copy-${assetKey}-interview-status`);
    const buttonLabel = button.querySelector("span");
    let copied = false;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(prompt);
            copied = true;
        } else {
            copied = fallbackCopy(prompt);
        }
    } catch {
        copied = fallbackCopy(prompt);
    }

    if (status) {
        status.textContent = copied
            ? "복사했습니다. 외부 AI의 새 대화창에 붙여 넣은 뒤 경험 또는 자료를 자유롭게 설명하세요."
            : "자동 복사가 되지 않았습니다. Prompt 영역을 선택해 직접 복사해 주세요.";
    }
    button.classList.toggle("is-copied", copied);
    if (buttonLabel) buttonLabel.textContent = copied ? "복사 완료" : "AI 대화 시작 Prompt 복사";

    if (copied) {
        window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (buttonLabel) buttonLabel.textContent = "AI 대화 시작 Prompt 복사";
        }, 2400);
    }
}

function createRegistrationGuideBlock(label, items, ordered = false, modifier = "") {
    const block = document.createElement("article");
    block.className = `registration-guide-block ${modifier}`.trim();
    const listTag = ordered ? "ol" : "ul";
    block.innerHTML = `
        <span class="registration-guide-label">${label}</span>
        <${listTag} class="registration-guide-checklist">
            ${items.map((item) => `<li>${item}</li>`).join("")}
        </${listTag}>
    `;
    return block;
}

const wikiRegistrationCompletionWalkthrough = [
    {
        number: "01",
        shortTitle: "검색 표현",
        title: "검색 별칭·예상 검색문장·제외어 보완",
        description: "캡처 상단은 태그 영역이 아니라 본문 검색을 보완하는 입력 영역입니다. 동의어와 실제 질문 문장을 보완하고, 혼동되는 표현은 제외어로 분리합니다.",
        src: "assets/registration-guide/step4-01-basic-information.png?v=20260721-tag-policy-1",
        alt: "기술자산 등록 모달의 내부정보 보완 전체 화면",
        regions: [
            ["1", "검색 별칭", "3.5%", "18.5%", "93%", "11%", "registrant"],
            ["2", "예상 검색문장", "3.5%", "30%", "93%", "15%", "registrant"],
            ["3", "검색 제외어", "3.5%", "46%", "93%", "11%", "registrant"]
        ],
        actions: ["검색 별칭에는 동의어·약어·과거 명칭만 입력", "예상 검색문장은 제목을 모르는 동료의 질문 형태로 작성", "비슷하지만 다른 자산을 찾는 표현은 제외어로 분리"]
    },
    {
        number: "02",
        shortTitle: "필수 분류",
        title: "답변 근거 확인 후 4개 필수 분류 축 확정",
        description: "AI는 실제 답변에 근거가 있는 값만 후보로 채웁니다. 후보가 비어 있거나 근거가 충분하지 않으면 자료유형·주 기술영역·업무단계·대응대상을 등록자가 직접 선택해야 다음 단계로 진행할 수 있습니다.",
        src: "assets/registration-guide/step4-01-basic-information.png?v=20260721-tag-policy-1",
        alt: "검색 표현과 자동 적용 분류 태그를 확인하는 등록 화면",
        regions: [
            ["1", "자료유형·기술영역·업무단계·대응 대상", "3.5%", "59.5%", "93%", "18.5%", "system"]
        ],
        actions: ["AI 후보의 일반화된 답변 근거가 실제 대화와 일치하는지 확인", "자료유형·주 기술영역·업무단계·대응대상 누락 시 사내에서 직접 선택", "최종 선택한 분류값이 자동 태그에 즉시 반영됐는지 확인"]
    },
    {
        number: "03",
        shortTitle: "추가 태그",
        title: "내용 기반 기술 태그 선택·제외",
        description: "AI가 본문에서 찾은 기술 개념·검증 방법·판단 방식만 선택합니다. 필수 분류 태그를 반복하거나 의미가 넓은 태그는 제외합니다.",
        src: "assets/registration-guide/step4-01-tag-selection.png?v=20260721-tag-policy-1",
        alt: "내용 기반 추가 추천 태그와 직접 입력 태그를 확정하는 화면",
        regions: [
            ["1", "표준 추가 태그 선택·제외", "3.5%", "26%", "68%", "33%", "registrant"],
            ["2", "필요한 사내 기술 용어 직접 추가", "3.5%", "61%", "93%", "13%", "registrant"]
        ],
        actions: ["대화 내용에 직접 근거가 있는 추천 태그만 유지", "자료유형·영역·단계·대상과 의미가 겹치는 태그 제외", "표준 목록에 없는 구체적인 사내 기술 용어만 직접 추가"]
    },
    {
        number: "04",
        shortTitle: "Wiki 후보",
        title: "기존 Wiki 자산 자동 추천·직접 검색",
        description: "현재 등록 내용을 기준으로 추천된 자산을 먼저 확인하고, 부족하면 제목·현상·태그·활용 상황으로 직접 검색합니다.",
        src: "assets/registration-guide/step4-02-wiki-and-links.png?v=20260721-wiki-2",
        alt: "기존 Wiki 자산 자동 추천과 직접 검색 화면",
        regions: [
            ["1", "자동 추천과 직접 검색", "3.5%", "22%", "44.2%", "69%", "registrant"]
        ],
        actions: ["추천 후보의 제목·유형·기술영역 확인", "관련 자산이면 관계 유형과 활용 내용을 기록", "적합한 후보가 없으면 직접 검색 후 없음 사유 기록"]
    },
    {
        number: "05",
        shortTitle: "사내 근거",
        title: "원본·결과·의사결정 근거 링크 확인",
        description: "Wiki에 파일을 중복 저장하지 않고 사내 원본 시스템의 위치와 접근 범위를 연결합니다.",
        src: "assets/registration-guide/step4-02-wiki-and-links.png?v=20260721-wiki-2",
        alt: "사내 원본과 결과 근거 링크를 추가하는 등록 화면",
        regions: [
            ["1", "사내 원본·근거 링크", "49.3%", "22%", "44.2%", "69%", "registrant"]
        ],
        actions: ["링크 이름·URL·자산유형·원본 시스템·역할 입력", "접근 범위가 실제 권한과 일치하는지 확인", "게시 전 링크 접근 가능 여부 확인"]
    },
    {
        number: "06",
        shortTitle: "Framework",
        title: "Technology Map·Learning Path를 각각 판정",
        description: "두 Framework를 한 번에 묶어 판단하지 않고, 각 연결 대상의 존재 여부와 관계를 별도로 기록합니다.",
        src: "assets/registration-guide/step4-03-framework-connections.png?v=20260721-wiki-2",
        alt: "Technology Map과 Learning Path 연결 판정 등록 화면",
        regions: [
            ["1", "Technology Map 연결", "5%", "61%", "43%", "36%", "registrant"],
            ["2", "Learning Path 연결", "49.3%", "61%", "43%", "36%", "registrant"]
        ],
        actions: ["각 Framework에 연결됨·해당 없음·대상 미등록 중 하나 선택", "연결됨이면 대상 ID·관계 유형·활용 설명 입력", "미연결이면 판단 사유 기록"]
    },
    {
        number: "07",
        shortTitle: "최종 검증",
        title: "검증 오류·확정 태그·등록 JSON 확인",
        description: "상위 등록 화면 2단계에서 확정한 분류·태그(아래 해설의 02~03), 관계 및 내부 링크가 최종 JSON에 정확히 반영됐는지 검토합니다.",
        src: "assets/registration-guide/step4-04-review-register.png?v=20260721-tag-policy-1",
        alt: "등록 전 검증과 최종 JSON 미리보기 화면",
        regions: [
            ["1", "검증 결과·확정 태그", "2%", "21%", "40%", "29%", "system"],
            ["2", "최종 등록 JSON", "43.5%", "21%", "54.5%", "47%", "registrant"]
        ],
        actions: ["오류 메시지가 있으면 이전 단계에서 수정", "자동 분류 태그와 선택한 추가 태그의 합집합 확인", "실제 사내 정보·관계·Framework 판정이 JSON에 반영됐는지 확인"]
    },
    {
        number: "08",
        shortTitle: "Wiki 등록",
        title: "GitLab 연결정보 확인 후 Wiki에 바로 등록",
        description: "서버·프로젝트·현재 사용자 토큰을 확인하고 GitLab 네이티브 Wiki 문서를 생성합니다.",
        src: "assets/registration-guide/step4-04-review-register.png?v=20260721-tag-policy-1",
        alt: "GitLab Wiki 연결정보와 직접 등록 버튼 화면",
        regions: [
            ["1", "GitLab Wiki 연결정보", "2%", "69%", "96%", "23%", "registrant"],
            ["2", "Wiki에 바로 등록", "83%", "93.3%", "15%", "5%", "registrant"]
        ],
        actions: ["GitLab 서버 주소와 프로젝트 경로 확인", "현재 사용자 Access Token 입력", "검증 통과 후 Wiki에 바로 등록 실행"]
    }
];

const libraryRegistrationCompletionWalkthrough = [
    {
        number: "01",
        shortTitle: "기본정보",
        title: "AI 후보를 확인하고 실제 기본정보로 교체",
        description: "자동 추천된 검색 분류를 확인한 뒤 실제 자산 정보와 책임정보를 입력합니다.",
        src: "assets/registration-guide/step4-01-library-basic-information.png",
        alt: "Library 예시 등록의 기본정보 보완 화면",
        regions: [
            ["1", "등록 ID", "3.5%", "20.7%", "90.2%", "7%", "system"],
            ["2", "AI 추천 검색 분류", "2%", "33%", "96%", "48%", "ai"]
        ],
        actions: ["AI 추천 분류와 표준 태그 확인", "아래 입력 영역에서 실제 제목·ID·Owner·Reviewer와 사내 맥락으로 교체"]
    },
    {
        number: "02",
        shortTitle: "Library·근거",
        title: "기존 Library와 사내 근거 연결",
        description: "중복 후보를 확인하고 원본·근거 위치를 연결합니다.",
        src: "assets/registration-guide/step4-02-library-and-links.png",
        alt: "기존 Library 검색과 회사 내부 자산 링크 등록 모달 전체 화면",
        regions: [
            ["1", "기존 Library 검색·관계", "3.5%", "20.7%", "44.2%", "70.6%", "registrant"],
            ["2", "사내 원본·근거 링크", "49.3%", "20.7%", "44.2%", "70.6%", "registrant"]
        ],
        actions: ["기존 자산을 연결하거나 후보 없음 사유 기록", "사내 링크 추가 후 접근 가능 여부 확인"]
    },
    {
        number: "03",
        shortTitle: "Framework",
        title: "Technology Map·Learning Path 판정",
        description: "두 Framework와의 관계를 각각 결정합니다.",
        src: "assets/registration-guide/step4-03-library-framework-connections.png",
        alt: "Technology Map과 Learning Path 연결 판정 예시 화면",
        regions: [
            ["1", "Technology Map 연결", "3.5%", "27%", "46%", "61%", "registrant"],
            ["2", "Learning Path 연결", "51%", "27%", "46%", "61%", "registrant"]
        ],
        actions: ["연결됨·해당 없음·대상 없음 중 하나 선택", "연결됨이면 대상·관계·설명을 추가"]
    },
    {
        number: "04",
        shortTitle: "검증·내보내기",
        title: "검증 후 Library 등록 JSON 내보내기",
        description: "기존 Library 카드 계약을 확인하고 정적 예시 JSON을 다운로드합니다.",
        src: "assets/registration-guide/step4-04-library-review-register.png",
        alt: "Library 등록 전 검증과 JSON 다운로드 예시 화면",
        regions: [
            ["1", "등록 전 검증", "3.5%", "32.4%", "38.9%", "35.6%", "system"],
            ["2", "최종 등록 내용 확인", "43.9%", "32.4%", "52.6%", "44.8%", "registrant"],
            ["3", "등록 JSON 다운로드", "81.7%", "80.7%", "14.7%", "4.5%", "registrant"]
        ],
        actions: ["검색 분류와 관계 정보 확인", "검증 오류 수정 후 최종 내용 확인", "Library 카드 JSON 다운로드"]
    }
];

function getRegistrationCompletionWalkthrough() {
    return getRegistrationContext() === "wiki"
        ? wikiRegistrationCompletionWalkthrough
        : libraryRegistrationCompletionWalkthrough;
}

function createRegistrationCompletionWalkthrough(assetMeta) {
    const registrationCompletionWalkthrough = getRegistrationCompletionWalkthrough();
    const wikiContext = getRegistrationContext() === "wiki";
    const roleLabels = {
        ai: "AI 초안",
        registrant: "등록자 입력·판정",
        system: "시스템 자동"
    };
    const walkthrough = document.createElement("section");
    walkthrough.className = "registration-capture-walkthrough";
    walkthrough.innerHTML = `
        <header class="registration-capture-heading">
            <span class="registration-guide-label">ACTUAL SCREEN WALKTHROUGH</span>
            <h3>반입한 JSON으로 ${wikiContext ? "사내 Wiki 등록을" : "Library 카드 예시를"} 완성하는 순서</h3>
            <p><strong>${wikiContext ? `상위 등록 화면의 4단계와 아래 캡처 해설 ${registrationCompletionWalkthrough.length}개는 서로 다른 구분입니다.` : `${assetMeta.label} 등록을 ${registrationCompletionWalkthrough.length}개 행동 단위로 설명합니다.`}</strong> ${wikiContext ? "상위 화면은 JSON 불러오기 → 분류·태그 확정 → 자산·근거 연결 → 검증·등록 순서이고, 아래에서는 한 화면 안의 입력 영역도 검색 표현·필수 분류·추가 태그처럼 필요한 만큼 나누어 설명합니다." : ""} 캡처의 입력값은 방법론 예시이며, 반투명 박스는 각 행동에서 실제로 확인하거나 입력할 영역만 표시합니다.</p>
            <ol class="registration-walkthrough-flow" aria-label="등록 완료 흐름">
                ${registrationCompletionWalkthrough.map((step) => `<li><b>${step.number}</b><span>${step.shortTitle}</span></li>`).join("")}
            </ol>
            <div class="registration-role-legend" aria-label="입력 역할 구분">
                ${Object.entries(roleLabels).map(([role, label]) => `<span class="is-${role}">${label}</span>`).join("")}
            </div>
            <p class="registration-save-note"><strong>반영 시점</strong> ${wikiContext ? "등록 성공 즉시 GitLab Wiki에 게시" : "JSON 다운로드까지 수행하는 정적 예시 · 실제 자산은 Wiki에서 등록"}</p>
        </header>
        <div class="registration-walkthrough-list">
            ${registrationCompletionWalkthrough.map((step) => `
                <article class="registration-walkthrough-step">
                    <header>
                        <span>${step.number}</span>
                        <div>
                            <h4>${step.title}</h4>
                            <p>${step.description}</p>
                        </div>
                    </header>
                    <div class="registration-capture-grid">
                        <figure class="registration-capture-figure">
                            <div class="registration-capture-canvas">
                                <img src="${step.src}" alt="${step.alt}" loading="lazy">
                                ${step.regions.map(([number, label, x, y, width, height, role]) => `
                                    <span class="registration-screen-region is-${role}" style="--region-x:${x}; --region-y:${y}; --region-width:${width}; --region-height:${height};" aria-hidden="true">
                                        <span class="registration-region-label"><b>${number}</b>${label}</span>
                                    </span>
                                `).join("")}
                            </div>
                        </figure>
                    </div>
                    <div class="registration-step-actions"><strong>등록자가 할 일</strong><ul>${step.actions.map((action) => `<li>${action}</li>`).join("")}</ul></div>
                </article>
            `).join("")}
        </div>
    `;
    return walkthrough;
}

function createRegistrationStepGuide(step, assetKey) {
    const definition = promptDefinitions[assetKey];
    const assetMeta = assetTypeGuideMeta[assetKey];
    const guide = document.createElement("div");
    guide.className = "registration-step-guide";

    const intro = document.createElement("header");
    intro.className = "registration-step-intro";
    intro.innerHTML = `
        <span class="registration-guide-label">이 단계의 목적</span>
        <p>${step.purpose}</p>
    `;
    guide.appendChild(intro);

    if (definition && (step.id === "conversation" || step.id === "structure")) {
        const focus = document.createElement("aside");
        focus.className = "registration-type-focus";
        focus.innerHTML = `
            <i class="bx bx-target-lock" aria-hidden="true"></i>
            <span>
                <strong>${assetMeta.label}에서 특히 확인할 내용</strong>
                <p>${step.id === "conversation" ? definition.purpose : definition.focus}</p>
            </span>
        `;
        guide.appendChild(focus);
    }

    if (step.id === "conversation" && definition) {
        const promptSection = document.createElement("section");
        promptSection.className = "registration-interview-prompt";
        promptSection.innerHTML = `
            <div class="registration-interview-prompt-heading">
                <span>
                    <span class="registration-guide-label">외부 AI 대화 시작</span>
                    <strong>${assetMeta.label} 공통 인트로 Prompt</strong>
                    <p>선택한 자산유형이 반영된 Prompt입니다. 외부 AI의 새 대화창에 먼저 붙여 넣으세요.</p>
                </span>
                <button class="btn btn-primary copy-prompt-button"
                        type="button"
                        data-copy-interview-prompt="${assetKey}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>AI 대화 시작 Prompt 복사</span>
                </button>
            </div>
            <pre class="prompt-preview registration-interview-prompt-preview"
                 id="${assetKey}-interview-prompt-preview"></pre>
            <p class="copy-status"
               id="copy-${assetKey}-interview-status"
               role="status"
               aria-live="polite"></p>
        `;
        const preview = promptSection.querySelector(".registration-interview-prompt-preview");
        if (preview) preview.textContent = interviewStartPrompts[assetKey];
        const copyButton = promptSection.querySelector("[data-copy-interview-prompt]");
        copyButton?.addEventListener("click", () => copyInterviewStartPrompt(assetKey, copyButton));
        guide.appendChild(promptSection);
    }

    const grid = document.createElement("div");
    grid.className = "registration-step-guide-grid";
    grid.appendChild(createRegistrationGuideBlock("해야 할 일", step.actions, true, "is-action"));
    grid.appendChild(createRegistrationGuideBlock("완료 기준", step.completion, false, "is-completion"));
    guide.appendChild(grid);

    if (step.id === "conversation" && definition) {
        const searchInterview = createRegistrationGuideBlock("대화 마지막에 확인할 검색·태그", [
            "자료유형 후보와 주 기술영역 1개·보조 기술영역 최대 2개를 이유와 함께 확인합니다.",
            "업무단계와 대응 대상을 정해 필수 분류 태그의 근거를 만듭니다.",
            "제목을 모르는 동료가 쓸 검색 별칭과 예상 검색문장을 확인합니다.",
            `내용에 직접 근거가 있을 때만 ${definition.tagFocus.join("·")} 중 맞는 기술 태그를 제안하고, 맞지 않으면 선택하지 않습니다.`,
            "비슷해 보이지만 다른 자산을 찾는 표현은 검색 제외어로 분리합니다."
        ], true, "is-search-metadata");
        guide.appendChild(searchInterview);
    }

    const caution = document.createElement("aside");
    caution.className = "registration-guide-caution";
    caution.innerHTML = `
        <i class="bx bx-shield-quarter" aria-hidden="true"></i>
        <span><strong>주의사항</strong>${step.caution}</span>
    `;
    guide.appendChild(caution);

    if (step.id === "structure") {
        const downloadGuide = document.createElement("div");
        downloadGuide.className = "registration-prompt-download-guide";
        downloadGuide.innerHTML = `
            <span>
                <strong>실제 파일은 어디서 받나요?</strong>
                아래 Prompt를 같은 AI 대화창에 붙여 넣으면, AI 답변에 <code>technical-asset-${assetKey}.json</code> 파일이 첨부됩니다.
            </span>
            <a class="registration-example-download"
               href="assets/registration-guide/technical-asset-multiple-connections-example.json"
               download="technical-asset-multiple-connections-example.json">
                <i class="bx bx-download" aria-hidden="true"></i>
                형식 예시 JSON
            </a>
        `;
        guide.appendChild(downloadGuide);
    }

    if (step.id === "import") {
        const wikiContext = getRegistrationContext() === "wiki";
        const actions = document.createElement("div");
        actions.className = "registration-import-actions";
        actions.innerHTML = `
            <span><strong>반입 후 이동</strong> ${wikiContext ? "Wiki 등록 창에서 실제 문서 등록정보를 보완합니다." : "Library 예시 화면에서 기존 카드 등록 형식을 확인합니다."}</span>
        <a class="btn btn-primary" href="team_technical_assets_wiki.html#register"><i class="bx bx-import" aria-hidden="true"></i>Wiki 등록 열기</a>
        `;
        guide.appendChild(actions);
    }

    if (step.id === "complete") {
        guide.appendChild(createRegistrationCompletionWalkthrough(assetMeta));
    }

    return guide;
}

function setRegistrationStageState(item, open) {
    const toggle = item.querySelector(":scope > .registration-stage-toggle");
    const content = item.querySelector(":scope > .registration-stage-content");
    const actionLabel = item.querySelector(":scope > .registration-stage-toggle .registration-stage-action-label");
    item.classList.toggle("is-open", open);
    if (toggle) toggle.setAttribute("aria-expanded", String(open));
    if (content) content.hidden = !open;
    if (actionLabel) actionLabel.textContent = open ? "접기" : "상세 보기";
}

function resetRegistrationStages(panel) {
    panel?.querySelectorAll(":scope > .registration-stage-list > .registration-stage-item")
        .forEach((item) => setRegistrationStageState(item, false));
}

function enhanceAssetGuidePanels() {
    document.querySelectorAll(".asset-guide-panel[role='tabpanel']").forEach((panel) => {
        if (panel.dataset.stagesEnhanced === "true") return;
        const assetKey = panel.id.replace(/^panel-/, "");
        if (!assetTypeGuideMeta[assetKey]) return;

        const children = [...panel.children];
        const heading = children.find((child) => child.classList.contains("asset-guide-heading"));
        const promptSection = children.find((child) => child.classList.contains("prompt-section"));
        const afterImportSections = children.filter((child) => child.classList.contains("after-import-section"));
        const finalSection = afterImportSections.at(-1);
        const conversationNodes = children.filter((child) => (
            child !== heading
            && child !== promptSection
            && child !== finalSection
        ));

        const stageList = document.createElement("div");
        stageList.className = "registration-stage-list";
        stageList.dataset.registrationAccordion = assetKey;

        getRegistrationStepDefinitions().forEach((step) => {
            const item = document.createElement("section");
            item.className = "registration-stage-item";
            item.dataset.registrationStage = step.id;

            const toggleId = `${assetKey}-stage-${step.id}-toggle`;
            const contentId = `${assetKey}-stage-${step.id}-content`;
            const toggle = document.createElement("button");
            toggle.type = "button";
            toggle.id = toggleId;
            toggle.className = "registration-stage-toggle";
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-controls", contentId);
            toggle.innerHTML = `
                <span class="registration-stage-index">STEP ${step.number}</span>
                <span class="registration-stage-heading">
                    <strong class="registration-stage-title">${step.title}</strong>
                    <small class="registration-stage-summary">${step.summary}</small>
                </span>
                <span class="registration-stage-phase">${step.phase}</span>
                <span class="registration-stage-action">
                    <span class="registration-stage-action-label">상세 보기</span>
                    <i class="bx bx-chevron-down registration-stage-chevron" aria-hidden="true"></i>
                </span>
            `;

            const content = document.createElement("div");
            content.id = contentId;
            content.className = "registration-stage-content";
            content.setAttribute("role", "region");
            content.setAttribute("aria-labelledby", toggleId);
            content.hidden = true;
            content.appendChild(createRegistrationStepGuide(step, assetKey));

            const sourceNodes = step.id === "conversation"
                ? conversationNodes
                : step.id === "structure" && promptSection
                    ? [promptSection]
                    : step.id === "complete" && finalSection
                        ? [finalSection]
                        : [];
            if (sourceNodes.length) {
                const source = document.createElement("div");
                source.className = "registration-stage-source";
                sourceNodes.forEach((node) => source.appendChild(node));
                content.appendChild(source);
            }

            toggle.addEventListener("click", () => {
                const wasOpen = item.classList.contains("is-open");
                stageList.querySelectorAll(":scope > .registration-stage-item")
                    .forEach((stageItem) => setRegistrationStageState(stageItem, false));
                if (!wasOpen) setRegistrationStageState(item, true);
            });

            item.append(toggle, content);
            stageList.appendChild(item);
        });

        if (heading) heading.insertAdjacentElement("afterend", stageList);
        else panel.prepend(stageList);
        panel.dataset.stagesEnhanced = "true";
    });
}

function getAssetTabs() {
    return [...document.querySelectorAll("[data-asset-tab]:not([disabled])")];
}

function activateAssetTab(tab, updateUrl = true) {
    const tabName = tab?.dataset.assetTab;
    if (!tabName) return;

    const previousTabName = getAssetTabs()
        .find((item) => item.getAttribute("aria-selected") === "true")
        ?.dataset.assetTab;

    getAssetTabs().forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll(".asset-guide-panel[role='tabpanel']").forEach((panel) => {
        panel.hidden = panel.id !== `panel-${tabName}`;
    });
    const selectedPanel = document.getElementById(`panel-${tabName}`);
    if (previousTabName !== tabName || !selectedPanel?.querySelector(".registration-stage-item.is-open")) {
        resetRegistrationStages(selectedPanel);
    }
    if (updateUrl) history.replaceState(null, "", `#${tabName}`);
}

function initRegistrationGuide() {
    Object.entries(prompts).forEach(([promptKey, prompt]) => {
        const preview = document.getElementById(`${promptKey}-prompt-preview`);
        if (preview) preview.textContent = prompt;
    });

    document.querySelectorAll("[data-copy-prompt], #copy-vd-request-prompt").forEach((button) => {
        const promptKey = button.dataset.copyPrompt || "vd-request";
        const buttonLabel = button.querySelector("span");
        if (buttonLabel) buttonLabel.textContent = "JSON 파일 생성 Prompt 복사";
        button.addEventListener("click", () => copyPrompt(promptKey, button));
    });

    document.querySelectorAll(".prompt-heading p").forEach((description) => {
        description.textContent = "이 Prompt를 같은 AI 대화창에 붙여 넣으면 실제 .json 첨부 파일과 복사용 코드가 생성됩니다.";
    });

    enhanceAssetGuidePanels();

    document.querySelectorAll(".registration-flow-with-tooltip").forEach((card) => {
        card.setAttribute("role", "button");
        card.setAttribute("aria-expanded", "false");
        const toggle = () => {
            const open = !card.classList.contains("is-tooltip-open");
            document.querySelectorAll(".registration-flow-with-tooltip.is-tooltip-open").forEach((item) => {
                item.classList.remove("is-tooltip-open");
                item.setAttribute("aria-expanded", "false");
            });
            card.classList.toggle("is-tooltip-open", open);
            card.setAttribute("aria-expanded", String(open));
        };
        card.addEventListener("click", toggle);
        card.addEventListener("keydown", (event) => {
            if (event.key !== "Enter" && event.key !== " ") return;
            event.preventDefault();
            toggle();
        });
    });

    const tabs = getAssetTabs();
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => activateAssetTab(tab));
        tab.addEventListener("keydown", (event) => {
            const keyDirections = { ArrowLeft: -1, ArrowRight: 1 };
            if (!(event.key in keyDirections) && event.key !== "Home" && event.key !== "End") return;
            event.preventDefault();
            const nextIndex = event.key === "Home"
                ? 0
                : event.key === "End"
                    ? tabs.length - 1
                    : (tabs.indexOf(tab) + keyDirections[event.key] + tabs.length) % tabs.length;
            const nextTab = tabs[nextIndex];
            activateAssetTab(nextTab);
            nextTab.focus();
        });
    });

    const initialTabName = window.location.hash.slice(1);
    const initialTab = tabs.find((tab) => tab.dataset.assetTab === initialTabName)
        || tabs.find((tab) => tab.getAttribute("aria-selected") === "true")
        || tabs[0];
    if (initialTab) activateAssetTab(initialTab, false);
}

document.addEventListener("DOMContentLoaded", initRegistrationGuide);
