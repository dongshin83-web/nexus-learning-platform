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
        outputsAndFollowUp: ["확인 필요"]
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
        sourceAndRelationRoles: ["[사내에서 원문·근거·관련 자산의 역할 복원]"]
    },
    "외부 보고 자료": {
        reportPurpose: "확인 필요",
        audienceAndDecision: "확인 필요",
        approvedMessages: ["확인 필요"],
        sourceAssetsAndEvidence: ["확인 필요"],
        disclosureScope: "확인 필요",
        versionAndValidity: {
            validityConditions: ["확인 필요"],
            reviewTriggers: ["확인 필요"]
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
        purpose: "종료된 CoR에서 기술 Gap, 목표와 성공기준, 수행·검증 과정, 핵심 판단, 결과와 후속 연결을 일곱 영역으로 정리합니다.",
        focus: "Wiki에는 종료 근거가 있는 CoR을 신규 등록합니다. 과제 상태는 사내 등록 화면에서 등록자가 완료 또는 Drop으로 직접 선택하며 외부 AI는 상태를 추론하지 않습니다. 사업 기여와 프로세스 변화는 직접 확인된 근거가 있을 때만 결과 또는 후속 영역에 선택적으로 서술하고, 실제 과제명·ID·관련 문서 링크는 사내 등록 화면에서 복원합니다.",
        tagFocus: ["원인 규명", "판단 기준", "실험 상관", "최적화", "재사용 템플릿"]
    },
    methodology: {
        cardType: "방법론",
        purpose: "반복 적용 가능한 기술 원리, 표준 절차, 판단 기준, 적용범위와 검증 근거를 정리합니다.",
        focus: "최소 적용 근거와 L1~L5 후보를 뒷받침하는 사실·남은 Gap을 정리하세요. 후보·정식 방법론 자격, 공식 Level, 실제 Technology Map 연결은 확정하지 않습니다. 새 방법론이거나 기존 분류에서 생략되어 Map에 없을 수 있으므로, Map 상태는 Wiki와 Map을 조회할 수 있는 사내 등록 단계에서 확정합니다.",
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

const STEP01_TYPE_QUESTIONS = Object.freeze({
    "vd-request": [
        {
            id: "VDR01",
            question: "어떤 상황에서 요청이 발생했고, 요청자는 언제까지 어떤 결정을 내려야 했나요?",
            captures: "요청 상황, 의사결정 시점, 판단 질문",
            targets: ["content.context", "content.primaryQuestion"]
        },
        {
            id: "VDR02",
            question: "요청 시 제공된 입력, 부족했던 정보, 반드시 지켜야 했던 조건·제약은 무엇이었나요?",
            captures: "입력, 부족 정보, 전제조건, 제약",
            targets: ["content.inputsAndConstraints", "internalCompletion.factsToConfirm"]
        },
        {
            id: "VDR03",
            question: "어떤 대안이나 조건을 어떤 방식으로 비교·검토했나요?",
            captures: "비교 대상, Simulation 대응 방식",
            targets: ["content.approach"]
        },
        {
            id: "VDR04",
            question: "관찰된 사실은 무엇이며, 그 결과 어떤 판단까지 가능했고 무엇은 판단할 수 없었나요?",
            captures: "관찰 결과, 판단 가능 범위, 판단 불가능 범위",
            targets: ["content.result", "content.applicability.judgmentScope", "content.evidenceSummary"]
        },
        {
            id: "VDR05",
            question: "요청자가 결과에서 도움이 됐거나 부족하다고 직접 말한 내용과 추가 요청은 무엇이었나요? 아직 피드백을 받지 못했다면 추후 확인 예정인지, 업무상 해당하지 않는지도 구분해 주세요.",
            captures: "직접 확인된 피드백과 추가 요청, 추후 확인 또는 해당 없음",
            targets: ["content.requesterFeedback"]
        },
        {
            id: "VDR06",
            question: "그 결과 실제 의사결정이나 후속 행동이 어떻게 달라졌나요? 아직 반영 여부를 확인하지 못했다면 추후 확인 예정인지, 업무상 해당하지 않는지도 구분해 주세요.",
            captures: "실제 결정 결과, 후속 행동, 의사결정 영향, 추후 확인 또는 해당 없음",
            targets: ["content.decisionImpact.outcomes", "content.decisionImpact.summary"]
        },
        {
            id: "VDR07",
            question: "이 결과를 재사용할 수 있는 범위와 남은 한계, 추가 확인사항, 후속조치는 각각 무엇인가요?",
            captures: "재사용 범위, 한계, 추가 확인사항, 후속조치",
            targets: [
                "content.applicability.validConditions",
                "content.applicability.limitations",
                "content.followUp",
                "internalCompletion.factsToConfirm"
            ]
        }
    ],
    cor: [
        { id: "COR01", question: "어떤 반복 문제 또는 미래 필요가 있었고, 기존 개별 대응으로 해결되지 않은 기술·데이터·검증 Gap은 무엇이었나요?", captures: "발굴 배경, 기술 Gap" },
        { id: "COR02", question: "주 기술 질문은 무엇이며, 어느 수준까지 달성하면 성공이라고 판단하나요?", captures: "목표, 성공기준" },
        { id: "COR03", question: "포함·제외 범위, 주요 Work Package, 마일스톤과 협업 역할은 어떻게 구성했나요? 실제 조직명과 사람 이름은 일반화하세요.", captures: "범위, 계획, 책임" },
        { id: "COR04", question: "어떤 가설을 어떤 Baseline·Simulation·실험·데이터와 비교해 검증했나요? 성공·실패·중단 기준은 무엇이었나요?", captures: "검증 설계" },
        { id: "COR05", question: "수행 중 새롭게 확인된 사실과 방향을 바꾼 핵심 판단은 무엇이었나요?", captures: "진행 판단, 변경 이유" },
        { id: "COR06", question: "성공기준별 결과는 무엇이고, 새롭게 가능해진 판단과 아직 판단할 수 없는 범위는 무엇인가요?", captures: "결과, 달성도, 판단 범위" },
        { id: "COR07", question: "어떤 산출물·파생 자산이 남았고 후속 과제·적용·검증은 무엇인가요?", captures: "산출물, 파생 자산, 후속조치" }
    ],
    methodology: [
        { id: "MTH01", question: "이 방법론은 어떤 반복 문제에서 어떤 판단을 하기 위해 사용하나요? 반대로 이 방법론의 목적이 아닌 것은 무엇인가요?", captures: "해결 문제, 활용 목적, 제외 목적" },
        { id: "MTH02", question: "결과가 달라지는 핵심 물리 원리·메커니즘은 무엇이며, 어떤 가정이나 단순화를 사용하나요?", captures: "기술 원리, 가정" },
        { id: "MTH03", question: "시작 전에 필요한 입력·물성·모델·조건과 반드시 확인할 전제조건은 무엇인가요?", captures: "입력, 사전조건" },
        { id: "MTH04", question: "다른 사람이 재현하려면 어떤 순서로 수행하고, 각 단계에서 무엇을 확인해야 하나요?", captures: "표준 절차, 중간 확인점" },
        { id: "MTH05", question: "어떤 결과를 보고 어떤 판단을 내리며, 신뢰할 수 없는 신호나 중단조건은 무엇인가요?", captures: "결과, 판단기준" },
        { id: "MTH06", question: "어떤 대상·조건까지 적용할 수 있고, 어떤 조건에서는 추가 검증 없이 사용하면 안 되나요?", captures: "적용범위, 한계" },
        { id: "MTH07", question: "이 절차가 유효하다고 확인한 근거는 무엇이며, 다른 사람이 재현하거나 다른 업무에 사용한 경험이 있나요?", captures: "검증·재사용 근거" }
    ],
    bp: [
        { id: "BP01", question: "어떤 사업 또는 개발 상황에서, 누가 언제까지 무엇을 결정해야 했나요?", captures: "사업 맥락, 판단 질문, 시점" },
        { id: "BP02", question: "Simulation은 어떤 선택지·조건을 어떤 방식으로 비교하거나 검토했나요?", captures: "Simulation 대응" },
        { id: "BP03", question: "어떤 결과와 근거를 전달했고, 그것이 의사결정에 어떤 의미가 있었나요?", captures: "판단 근거" },
        { id: "BP04", question: "사업부 또는 요청자는 어떤 피드백을 주었고 실제로 어떤 행동을 했나요?", captures: "피드백, 실제 행동" },
        { id: "BP05", question: "비용·기간·품질·고객 대응·Risk 저감 등에 어떤 영향이 있었으며, 어디까지 확인된 사실인가요?", captures: "경영성과, 확인 수준" },
        { id: "BP06", question: "이 성공방식을 다시 재현하려면 어떤 조건·역할·시점·준비 자산이 필요하고, 어디에는 적용하면 안 되나요?", captures: "재현 조건, 한계" },
        { id: "BP07", question: "위 판단·행동·성과를 확인할 수 있는 근거의 종류는 무엇인가요? 실제 문서명이나 링크는 말하지 마세요.", captures: "근거 역할" }
    ],
    "technical-report": [
        { id: "TR01", question: "이 보고서가 답하려는 핵심 기술 질문은 무엇이며, 그 답을 어떤 판단에 사용하나요?", captures: "기술 질문, 작성 목적" },
        { id: "TR02", question: "검토 대상·범위·핵심 입력·조건·가정은 무엇인가요?", captures: "검토 범위, 핵심 조건" },
        { id: "TR03", question: "어떤 분석·실험 방법을 사용했고, 무엇을 Baseline으로 어떤 방식으로 검증했나요?", captures: "방법, 검증 근거" },
        { id: "TR04", question: "관찰된 결과, 기술적 해석, 최종 결론을 각각 구분해 설명해 주세요.", captures: "발견, 해석, 결론" },
        { id: "TR05", question: "결론은 어떤 조건에서 유효하며, 어떤 판단에는 사용할 수 있고 어떤 판단에는 사용할 수 없나요?", captures: "유효조건, 사용 가능한 판단" },
        { id: "TR06", question: "부족한 입력, 가정, 오차원인과 추가로 확인해야 할 사항은 무엇인가요?", captures: "한계, 추가 확인" },
        { id: "TR07", question: "이 보고서가 근거로 삼거나 근거가 되는 요청·과제·방법론·후속 자산의 종류는 무엇인가요? 실제 ID와 링크는 사내에서 복원합니다.", captures: "관련 자산·원본 역할" }
    ],
    knowhow: [
        { id: "KH01", question: "이 노하우는 기술 수행·산출물 작성·업무 절차·협업·소통 중 어디에 해당하나요?", captures: "노하우 범주" },
        { id: "KH02", question: "어떤 업무 시점에 어떤 문제 신호가 나타날 때, 어떤 결과나 품질을 만들기 위해 사용하나요?", captures: "적용 상황, 목표" },
        { id: "KH03", question: "반복해서 어려운 지점은 무엇이고, 시작 전에 반드시 확인해야 할 조건은 무엇인가요?", captures: "핵심 난점, 사전 확인" },
        { id: "KH04", question: "효과가 없었던 방식이 있다면 무엇이며 왜 효과가 없었다고 보나요?", captures: "실패 시도, 판단 근거" },
        { id: "KH05", question: "실행 순서와 각 단계에서의 판단기준·이유를 최대 7단계로 설명해 주세요.", captures: "실행 절차, 판단 이유" },
        { id: "KH06", question: "무엇을 보면 완료 또는 좋은 품질이라고 판단하며, 실제 효과를 어떤 근거로 확인했나요?", captures: "완료·품질 기준, 근거" },
        { id: "KH07", question: "적용하면 안 되는 조건, 실패 신호, 중단·복구·Escalation 조건은 무엇인가요?", captures: "예외, 위험, 대응" },
        { id: "KH08", question: "어디까지 재사용할 수 있고 어떤 Template·Checklist·SOP·사례와 연결해야 하나요? 실제 링크는 사내에서 복원합니다.", captures: "재사용 범위, 연결 자료" }
    ],
    "tool-manual": [
        { id: "TM01", question: "누가 어떤 상황에서 어떤 한 가지 작업을 수행하며, 완료되면 어떤 결과물을 얻나요?", captures: "작업 목적, 결과물" },
        { id: "TM02", question: "필요한 Tool·환경·권한·입력 형식과 시작 전 확인사항은 무엇인가요? 실제 버전과 경로는 사내에서 복원합니다.", captures: "사전 준비, 입력" },
        { id: "TM03", question: "작업 성공에 필요한 실행 순서와 단계별 예상 결과를 3~10단계로 설명해 주세요.", captures: "표준 실행 절차" },
        { id: "TM04", question: "사용자가 선택해야 하는 주요 옵션과 선택기준, 저장·백업·되돌리기 지점은 무엇인가요?", captures: "판단점, 복구 지점" },
        { id: "TM05", question: "정상 완료를 무엇으로 확인하며, 실행은 끝났지만 결과가 잘못된 경우의 신호는 무엇인가요?", captures: "정상 완료, 품질 확인" },
        { id: "TM06", question: "자주 발생하는 오류·위험·중단조건과 기본 복구원칙은 무엇인가요?", captures: "오류, 주의사항" },
        { id: "TM07", question: "어떤 공식 Manual·예제·Script·노하우와 연결해야 하나요? 실제 버전과 링크는 사내에서 복원합니다.", captures: "버전·예제·원문 역할" }
    ],
    "education-material": [
        { id: "EDU01", question: "학습 후 학습자가 무엇을 설명·구분·선택·실행·판단할 수 있어야 하나요? 최대 3개로 답해 주세요.", captures: "학습목표" },
        { id: "EDU02", question: "대상 역할·경험 수준과 필요한 사전지식·선행 자산·실습환경은 무엇인가요?", captures: "대상, 사전지식" },
        { id: "EDU03", question: "어떤 문제와 핵심 개념을 어떤 순서로 학습하며, 다루지 않는 범위는 무엇인가요?", captures: "핵심 내용, 구성" },
        { id: "EDU04", question: "읽기·강의·토론·실습 등 어떤 방식으로 학습하고, 예상 시간과 준비물은 무엇인가요? 정확한 내부 자료명은 일반화하세요.", captures: "활동, 시간, 준비물" },
        { id: "EDU05", question: "학습목표 달성을 어떤 설명·결과·실습·과제로 확인하나요?", captures: "완료·이해 확인기준" },
        { id: "EDU06", question: "어떤 방법론·보고서·BP·Manual을 학습하며 어떤 원문·실습자료·버전과 연결해야 하나요? 실제 ID와 링크는 사내에서 복원합니다.", captures: "관련 자산, 원문·버전 역할" }
    ],
    "external-report": [
        { id: "ER01", question: "어떤 배경에서 왜 이 보고가 필요했나요?", captures: "보고 목적" },
        { id: "ER02", question: "누가 자료를 보고 어떤 결정을 내려야 하나요?", captures: "보고 대상, 의사결정" },
        { id: "ER03", question: "근거 확인이 끝난 핵심 메시지와 아직 확인되지 않은 메시지는 무엇인가요?", captures: "승인된 메시지, 미확인 사항" },
        { id: "ER04", question: "각 메시지는 어떤 종류의 기술자산·원자료에 근거하나요? 실제 문서명과 링크는 말하지 마세요.", captures: "근거 자산, 원자료 역할" },
        { id: "ER05", question: "누구에게 무엇까지 공유할 수 있고 어떤 정보는 제외·익명화해야 하나요?", captures: "공유범위, 제외정보" },
        { id: "ER06", question: "현재 자료의 기준 시점과 재검토가 필요한 변경조건은 무엇인가요?", captures: "버전·기준일 후보, 재검토 조건" },
        { id: "ER07", question: "대상이 오해하지 않도록 어떤 해석 한계와 전달 주의점을 밝혀야 하나요?", captures: "한계, 전달 주의" }
    ]
});

const VD_REQUEST_STEP02_CONTEXT_BLOCKS = Object.freeze([
    Object.freeze({
        id: "CTX01",
        title: "요청 배경과 판단 질문",
        question: "어떤 상황에서 요청이 발생했고, 요청자는 개발이나 평가의 어느 시점까지 어떤 선택 또는 결정을 내려야 했나요? 그 판단이 왜 중요했고, 이를 위해 Simulation으로 답하려던 핵심 질문은 무엇이었는지도 함께 설명해 주세요.",
        requiredItems: Object.freeze([
            "요청이 발생한 상황과 문제",
            "요청자가 내려야 했던 선택 또는 결정",
            "판단이 필요했던 시점과 중요 이유",
            "Simulation으로 답하려던 핵심 판단 질문"
        ]),
        followUpQuestions: Object.freeze([
            "결과를 받은 뒤 요청자가 실제로 선택하거나 확정해야 했던 것은 무엇이었나요?",
            "그 판단은 개발·설계·평가 과정의 어느 시점 전에 필요했나요?",
            "그 결정을 돕기 위해 Simulation으로 비교하거나 확인하려던 핵심 질문을 한 문장으로 표현하면 무엇인가요?"
        ]),
        covers: Object.freeze(["VDR01"])
    }),
    Object.freeze({
        id: "CTX02",
        title: "Simulation 대응",
        question: "당시 어떤 정보가 주어졌고 무엇이 부족했으며, 비교 대상의 공통 조건과 변경 조건을 어떻게 정해 무엇을 검토했나요?",
        requiredItems: Object.freeze([
            "주어진 입력과 부족했던 정보",
            "반드시 지켜야 했던 조건과 제약",
            "동일하게 유지한 조건과 의도적으로 바꾼 조건",
            "비교 대상과 Simulation 검토 방법",
            "판단에 사용한 지표 또는 관점"
        ]),
        followUpQuestions: Object.freeze([
            "비교 대상 사이에서 동일하게 유지한 조건과 의도적으로 바꾼 조건은 각각 무엇이었나요?",
            "절대값·상대 경향·취약 위치·하중 전달 경로 중 무엇을 판단 지표로 사용했나요?",
            "부족한 입력이나 검증 때문에 검토 범위를 제한한 점이 있었나요?"
        ]),
        covers: Object.freeze(["VDR02", "VDR03"])
    }),
    Object.freeze({
        id: "CTX03",
        title: "판단 근거",
        question: "비교 결과에서 실제로 관찰한 차이와 그 차이에 대한 기술적 해석을 구분해 설명하고, 요청자에게 어떤 결론이나 선택 기준을 전달했는지 말씀해 주세요.",
        requiredItems: Object.freeze([
            "실제로 관찰한 결과와 변화 경향",
            "관찰 결과에 대한 기술적 해석",
            "요청자에게 전달한 결론·제안 또는 선택 기준",
            "판단할 수 있었던 범위와 판단할 수 없었던 범위"
        ]),
        followUpQuestions: Object.freeze([
            "관찰된 결과와 그 원인에 대한 해석을 나누어 설명해 주세요.",
            "이 결과로 확실히 판단할 수 있었던 것과 판단할 수 없었던 것은 각각 무엇인가요?",
            "요청자에게 단순 결과가 아니라 어떤 행동이나 선택을 제안했나요?"
        ]),
        covers: Object.freeze(["VDR04"])
    }),
    Object.freeze({
        id: "CTX04",
        title: "요청자 피드백",
        question: "요청자가 결과에서 무엇이 도움이 됐거나 부족하다고 직접 말했고, 어떤 질문·이견·추가 요청을 남겼나요? 아직 피드백을 받지 못했다면 추후 확인 예정인지, 업무상 해당하지 않는지도 구분해 주세요.",
        requiredItems: Object.freeze([
            "요청자가 직접 확인한 평가·질문 또는 이견",
            "추가 요청의 내용",
            "피드백이 아직 없을 경우 추후 확인 또는 해당 없음과 그 이유"
        ]),
        followUpQuestions: Object.freeze([
            "요청자가 직접 말한 내용과 우리가 추정한 반응을 구분할 수 있나요?",
            "도움이 됐다는 평가 외에 부족한 점·질문·이견·추가 요청도 있었나요?",
            "피드백을 아직 받지 못한 것인가요, 아니면 업무상 요청자 피드백이 해당하지 않는 것인가요?"
        ]),
        covers: Object.freeze(["VDR05"])
    }),
    Object.freeze({
        id: "CTX05",
        title: "실제 영향",
        question: "그 결과 이후 실제로 유지·변경·추가 검증·보류된 것은 무엇이며, 계획이나 제안이 아니라 실제로 실행됐다고 확인한 근거는 무엇인가요?",
        requiredItems: Object.freeze([
            "결정된 행동",
            "실제 실행 여부와 현재 상태",
            "실행 또는 반영을 확인한 근거"
        ]),
        followUpQuestions: Object.freeze([
            "결정된 것과 실제 실행된 것을 나누어 말씀해 주세요.",
            "결과 전달만 확인됐나요, 아니면 설계·평가·개발 행동이 달라진 것도 확인됐나요?",
            "아직 실행 여부를 확인하지 못했다면 추후 확인 예정인지, 업무상 해당하지 않는지도 구분해 주세요."
        ]),
        covers: Object.freeze(["VDR06"])
    }),
    Object.freeze({
        id: "CTX06",
        title: "적용범위와 한계",
        question: "이 판단을 다시 사용할 수 있는 조건과 그대로 적용하면 안 되는 조건은 무엇이며, 확대 적용 전에 무엇을 추가로 확인해야 하나요?",
        requiredItems: Object.freeze([
            "재사용할 수 있는 조건과 범위",
            "그대로 적용하면 안 되는 조건",
            "추가 검증 또는 확인할 내용",
            "후속조치와 그 상태"
        ]),
        followUpQuestions: Object.freeze([
            "‘동일한 수준의 입력 조건’이 어떤 종류의 조건을 뜻하는지 실제 값 없이 설명해 주세요.",
            "다른 모델이나 조건에서도 유지될 가능성이 있는 판단과 반드시 재검증할 부분은 각각 무엇인가요?",
            "후속 검증은 이미 결정됨·제안됨·미정 중 어느 상태인가요?"
        ]),
        covers: Object.freeze(["VDR07"])
    })
]);

const COR_STEP02_CONTEXT_BLOCKS = Object.freeze([
    Object.freeze({
        id: "COR01",
        title: "발굴 배경과 기술 Gap",
        question: "어떤 반복 문제 또는 미래 필요 때문에 CoR이 필요했고, 기존 개별 대응으로 해결되지 않은 기술·데이터·검증 Gap은 무엇이었나요?",
        requiredItems: Object.freeze([
            "반복되거나 예상된 문제와 영향",
            "기존 대응으로 해결되지 않은 이유",
            "부족했던 기술·데이터·검증체계",
            "개별 VD Request가 아닌 계획 과제로 다룬 이유"
        ]),
        followUpQuestions: Object.freeze([
            "기존 방식으로 해결되지 않은 핵심 원인을 한 가지로 좁히면 무엇이었나요?",
            "이 문제를 개별 요청이 아니라 계획된 CoR로 다뤄야 했던 이유는 무엇이었나요?"
        ])
    }),
    Object.freeze({
        id: "COR02",
        title: "과제 목표와 성공기준",
        question: "이 CoR의 핵심 기술 질문과 확보하려던 판단·역량은 무엇이었고, 어느 수준까지 달성하면 성공이라고 정했나요?",
        requiredItems: Object.freeze([
            "핵심 기술 질문",
            "확보하려던 판단 또는 역량",
            "정량·정성 성공기준",
            "목표에서 제외한 범위"
        ]),
        followUpQuestions: Object.freeze([
            "산출물 이름이 아니라 무엇을 판단할 수 있게 되는지를 성공기준으로 표현하면 무엇인가요?",
            "완료 시점에 달성 여부를 판단할 수 있었던 구체적인 기준은 무엇이었나요?"
        ])
    }),
    Object.freeze({
        id: "COR03",
        title: "범위·수행계획·책임",
        question: "과제에 포함하거나 제외한 범위, 주요 수행 묶음과 마일스톤, 참여 역할과 핵심 리스크는 어떻게 구성했나요?",
        requiredItems: Object.freeze([
            "포함 범위와 제외 범위",
            "주요 수행 묶음과 마일스톤",
            "일반화한 역할과 협업 구조",
            "주요 기술·일정 리스크와 대응"
        ]),
        followUpQuestions: Object.freeze([
            "완료 시점에 실제 수행 범위가 최초 계획과 달라진 부분은 무엇이었나요?",
            "실명 없이 역할 중심으로 설명하면 누가 무엇을 책임졌나요?"
        ])
    }),
    Object.freeze({
        id: "COR04",
        title: "검증 설계",
        question: "어떤 기술 주장이나 가설을 어떤 Baseline·Simulation·실험·데이터와 비교해 검증했고, 성공·실패·중단 기준은 무엇이었나요?",
        requiredItems: Object.freeze([
            "핵심 기술 주장 또는 가설",
            "비교 기준과 Baseline",
            "Simulation·실험·데이터의 역할",
            "성공·실패·중단 또는 범위 축소 기준"
        ]),
        followUpQuestions: Object.freeze([
            "결과가 나온 뒤 고른 근거가 아니라 처음부터 비교하려던 기준은 무엇이었나요?",
            "검증 결과를 신뢰하지 않거나 범위를 줄여야 하는 조건은 무엇이었나요?"
        ])
    }),
    Object.freeze({
        id: "COR05",
        title: "진행 중 판단과 변경",
        question: "수행 중 새로 확인한 사실과 과제 방향·범위·검증계획을 바꾼 핵심 판단은 무엇이었으며, 왜 그렇게 바꿨나요?",
        requiredItems: Object.freeze([
            "진행 중 새로 확인한 사실",
            "바뀐 가설·범위·계획 또는 바꾸지 않은 핵심 판단",
            "변경 또는 유지 이유",
            "결과와 일정에 미친 영향"
        ]),
        followUpQuestions: Object.freeze([
            "단순 진행 이력이 아니라 결론이나 과제 방향을 바꾼 판단은 무엇이었나요?",
            "중요한 변경이 없었다면 최초 계획을 유지할 수 있었던 확인 근거는 무엇이었나요?"
        ])
    }),
    Object.freeze({
        id: "COR06",
        title: "결과와 판단 가능 범위",
        question: "성공기준별 결과와 목표 달성도는 무엇이었고, 새롭게 가능해진 판단과 아직 판단할 수 없는 범위는 무엇인가요?",
        requiredItems: Object.freeze([
            "핵심 발견과 기술 결론",
            "성공기준별 결과와 목표 달성도",
            "새롭게 가능해진 판단",
            "적용 가능한 조건과 판단할 수 없는 범위"
        ]),
        followUpQuestions: Object.freeze([
            "목표 달성 여부와 그 판단 근거를 성공기준별로 나누면 어떻게 되나요?",
            "기술 결과와 별개로 직접 확인된 사업 기여가 있다면 근거와 함께 무엇인가요? 확인되지 않았다면 생략하세요.",
            "CoR 결과로 확실히 말할 수 없는 조건이나 남은 불확실성은 무엇인가요?"
        ])
    }),
    Object.freeze({
        id: "COR07",
        title: "산출물·파생 자산·후속조치",
        question: "공식 종료 근거와 남은 산출물·파생 자산은 무엇이며, 후속 적용·검증·과제는 무엇인가요?",
        requiredItems: Object.freeze([
            "공식 종료 또는 결과 근거의 종류",
            "남은 산출물과 파생 자산",
            "재사용·적용 가능한 다음 업무",
            "후속조치와 현재 상태"
        ]),
        followUpQuestions: Object.freeze([
            "실제 문서명이나 링크를 말하지 않고 종료를 증명하는 자료의 종류만 설명하면 무엇인가요?",
            "직접 확인된 프로세스 변화가 있다면 기존과 변경된 방식을 근거와 함께 설명해 주세요. 확인되지 않았다면 생략하세요.",
            "결정된 후속조치와 제안 또는 미정인 후속조치를 구분하면 어떻게 되나요?"
        ])
    })
]);

const METHODOLOGY_STEP02_CONTEXT_BLOCKS = Object.freeze([
    Object.freeze({
        id: "MTH01",
        title: "해결 문제와 활용 목적",
        question: "이 방법론은 어떤 반복 문제에서 어떤 판단을 하기 위해 사용하며, 반대로 이 방법론으로 판단하지 않는 것은 무엇인가요?",
        requiredItems: Object.freeze([
            "반복되는 기술 문제 또는 현상",
            "이 방법론으로 답하려는 판단 질문과 활용 목적",
            "현재 근거로 가능한 판단 수준",
            "목적에서 제외하는 판단"
        ]),
        followUpQuestions: Object.freeze([
            "산출물 이름이 아니라 이 방법론으로 가능하게 하려는 판단을 한 문장으로 말하면 무엇인가요?",
            "이 방법론을 사용해도 답할 수 없거나 답하면 안 되는 질문은 무엇인가요?"
        ])
    }),
    Object.freeze({
        id: "MTH02",
        title: "기술 원리와 가정",
        question: "결과가 달라지는 핵심 물리 원리와 메커니즘은 무엇이며, 모델에서 어떤 가정과 단순화를 사용하고 결과를 어떻게 해석하나요?",
        requiredItems: Object.freeze([
            "핵심 물리 원리 또는 메커니즘",
            "모델에서 단순화한 부분",
            "결과에 큰 영향을 주는 가정",
            "절대값·상대 비교·경향성 중 적합한 해석 방식"
        ]),
        followUpQuestions: Object.freeze([
            "결과의 방향이나 순위를 바꾸는 가장 중요한 가정은 무엇인가요?",
            "이 결과는 절대값, 상대 비교, 경향성 중 어느 수준으로 해석해야 하나요?"
        ])
    }),
    Object.freeze({
        id: "MTH03",
        title: "입력과 전제조건",
        question: "시작 전에 어떤 입력·모델·물성·조건·데이터가 필요하며, 각각 필수인지 권장인지 없어도 가능한지 설명해 주세요.",
        requiredItems: Object.freeze([
            "필수 입력과 사전조건",
            "필요한 모델·물성·경계조건·하중조건",
            "필요한 실험 또는 측정 데이터",
            "입력별 필수·권장·없어도 가능 구분"
        ]),
        followUpQuestions: Object.freeze([
            "입력 중 하나만 빠져도 판단을 중단해야 하는 필수항목은 무엇인가요?",
            "부족해도 제한된 판단은 가능한 입력과 그때의 제한은 무엇인가요?"
        ])
    }),
    Object.freeze({
        id: "MTH04",
        title: "표준 절차와 판단 흐름",
        question: "다른 사람이 재현하려면 어떤 순서로 수행하고, 각 단계에서 무엇을 확인하거나 분기하며, 언제 중단해야 하나요?",
        requiredItems: Object.freeze([
            "재현 가능한 수행 순서",
            "입력 검증과 모델 수준 선택 기준",
            "단계별 중간 확인점과 판단 분기",
            "오류 또는 신뢰도 부족으로 중단하는 조건"
        ]),
        followUpQuestions: Object.freeze([
            "단순 실행 순서가 아니라 결과의 신뢰도를 판단하는 중간 확인점은 무엇인가요?",
            "어떤 신호가 나타나면 다음 단계로 넘어가지 않고 중단하거나 되돌아가야 하나요?"
        ])
    }),
    Object.freeze({
        id: "MTH05",
        title: "결과와 판단기준",
        question: "어떤 결과와 비교 기준을 보고 무엇을 판단하며, 수치적 특이점이나 신뢰할 수 없는 결과를 어떻게 구분하나요?",
        requiredItems: Object.freeze([
            "확인해야 할 결과와 유효한 비교 기준",
            "수치적 특이점과 실제 위험의 구분 방법",
            "실험·평가 또는 기준값과 비교하는 방법",
            "가능한 판단과 불가능한 판단"
        ]),
        followUpQuestions: Object.freeze([
            "결과가 나왔다는 사실 외에 결론으로 채택하기 위한 최소 판단기준은 무엇인가요?",
            "어떤 결과는 계산됐더라도 의사결정에 사용하면 안 되나요?"
        ])
    }),
    Object.freeze({
        id: "MTH06",
        title: "적용범위와 한계",
        question: "어떤 대상과 조건에는 직접 적용할 수 있고, 어떤 조건은 추가 검증이 필요하거나 적용하면 안 되며, 알려진 오차와 Data Gap은 무엇인가요?",
        requiredItems: Object.freeze([
            "직접 적용 가능한 대상과 조건",
            "추가 검증 후 적용할 조건",
            "적용하지 않아야 할 조건",
            "알려진 오차·수렴성·계산시간·Data Gap"
        ]),
        followUpQuestions: Object.freeze([
            "유사해 보이지만 이 방법론을 그대로 적용하면 안 되는 조건은 무엇인가요?",
            "확대 적용 전에 반드시 다시 검증해야 하는 가정이나 입력은 무엇인가요?"
        ])
    }),
    Object.freeze({
        id: "MTH07",
        title: "검증·재사용 근거",
        question: "이 방법론의 유효성을 확인한 적용·검증·재현 근거는 무엇이며, 다른 조건이나 사용자가 재사용한 결과와 다음 수준에 부족한 근거는 무엇인가요?",
        requiredItems: Object.freeze([
            "최초 개발·적용 또는 검증 근거의 종류",
            "Simulation·실험·평가 비교와 확인 결과",
            "다른 사용자 또는 다른 업무의 재현·재사용 결과",
            "성공·부분 성공·실패 이력과 적용 당시 버전",
            "현재 확보된 판단 수준과 다음 수준에 부족한 근거"
        ]),
        followUpQuestions: Object.freeze([
            "개발자가 아닌 다른 사람이 입력과 조건을 직접 설정하고 결과를 해석한 적이 있나요?",
            "한 조건의 초기 경향, 직접 검증 기반 판단, 교차 검증과 오차 범위, 지속 피드백 중 어디까지 근거가 있나요?",
            "다음 수준을 주장하려면 어떤 독립 재현·교차 검증·오차 정보가 더 필요하나요?"
        ])
    })
]);

function defineLeanContextBlock(id, title, question, requiredItems, followUpQuestions, targets = []) {
    return Object.freeze({
        id,
        title,
        question,
        requiredItems: Object.freeze(requiredItems),
        followUpQuestions: Object.freeze(followUpQuestions),
        targets: Object.freeze(targets)
    });
}

const BP_STEP02_CONTEXT_BLOCKS = Object.freeze([
    defineLeanContextBlock(
        "BP01",
        "사업 맥락",
        "어떤 사업·개발 상황에서 누가 언제까지 무엇을 결정해야 했고, 그 판단이 왜 중요했나요?",
        ["사업 또는 개발 배경", "결정해야 했던 내용", "판단 시점과 중요 이유"],
        ["결과를 받는 사람이 실제로 선택하거나 확정해야 했던 것은 무엇이었나요?", "그 판단이 늦어질 때 예상되는 영향은 무엇이었나요?"],
        ["content.businessContext", "workingTitle"]
    ),
    defineLeanContextBlock(
        "BP02",
        "Simulation 대응",
        "Simulation은 어떤 선택지와 조건을 무엇으로 비교했고, 어떤 결과와 근거를 전달했으며 그것이 의사결정에 어떤 의미가 있었나요?",
        ["비교 대상과 공통·변경 조건", "검토 방법과 판단 지표", "전달한 결과와 근거", "의사결정에 준 의미"],
        ["비교에서 동일하게 유지한 조건과 바꾼 조건은 무엇이었나요?", "관찰 사실과 그에 대한 해석을 구분하면 각각 무엇이었나요?"],
        ["content.simulationResponse"]
    ),
    defineLeanContextBlock(
        "BP03",
        "사업 피드백",
        "사업부 또는 요청자가 결과에 대해 직접 확인한 피드백은 무엇이며, 그 뒤 실제로 어떤 행동을 했나요? 아직 확인하지 못했다면 그 상태도 구분해 주세요.",
        ["피드백 확인 상태", "직접 확인된 피드백", "피드백 근거 또는 확인 경로"],
        ["직접 들은 내용과 우리가 추정한 반응을 구분할 수 있나요?", "아직 결과가 오지 않은 것인지, 업무상 해당하지 않는 것인지 구분해 주세요."],
        ["content.businessFeedback"]
    ),
    defineLeanContextBlock(
        "BP04",
        "사업 영향",
        "비용·기간·품질·고객 대응·Risk 저감 중 무엇에 어떤 경로로 영향을 주었고, 그 영향은 확인됨·부분 확인·추후 확인 중 어디까지인가요?",
        ["영향 영역", "Simulation 결과에서 사업 영향으로 이어진 경로", "영향의 확인 수준"],
        ["성과 수치가 아니라 무엇이 어떻게 달라졌는지 설명해 주세요.", "확인된 영향과 기대하거나 추정한 영향을 나누면 각각 무엇인가요?"],
        ["content.businessImpact"]
    ),
    defineLeanContextBlock(
        "BP05",
        "재현 조건과 한계",
        "이 성공방식을 다시 재현하려면 어떤 조건·역할·시점·준비 자산이 필요하고, 어떤 조건에는 그대로 적용하면 안 되나요?",
        ["재현에 필요한 조건", "필요한 역할과 적용 시점", "필요한 준비 자산의 역할", "적용 제외 또는 주의 조건"],
        ["결과가 달라질 수 있어 다시 확인해야 하는 조건은 무엇인가요?", "다른 조직이나 대상에 적용할 때 반드시 유지해야 할 조건은 무엇인가요?"],
        ["content.reproductionConditions", "internalCompletion.factsToConfirm"]
    ),
    defineLeanContextBlock(
        "BP06",
        "근거",
        "앞에서 말한 판단·피드백·행동·영향을 뒷받침하는 근거의 종류와 각 근거의 역할은 무엇인가요? 실제 문서명과 링크는 말하지 마세요.",
        ["근거의 일반화된 종류", "각 근거가 확인하는 내용", "근거가 부족하거나 추후 확인할 항목"],
        ["결과 근거와 실제 행동·영향 근거를 나누면 각각 무엇인가요?", "직접 확인하지 못한 주장은 무엇이며 사내에서 무엇을 확인해야 하나요?"],
        ["content.evidence", "internalCompletion.factsToConfirm"]
    )
]);

const TECHNICAL_REPORT_STEP02_CONTEXT_BLOCKS = Object.freeze([
    defineLeanContextBlock("TR01", "기술 질문과 목적", "이 보고서가 답하려는 핵심 기술 질문은 무엇이며, 그 답을 어떤 판단에 사용하나요?", ["핵심 기술 질문", "작성 목적", "결론을 사용할 판단"], ["보고서 제목이 아니라 답하려는 질문을 한 문장으로 표현하면 무엇인가요?", "이 결론을 누가 어떤 판단에 사용하나요?"], ["content.questionAndPurpose", "workingTitle"]),
    defineLeanContextBlock("TR02", "범위와 조건", "검토 대상·포함 및 제외 범위·핵심 입력·조건·가정은 무엇인가요?", ["검토 대상과 범위", "핵심 입력과 조건", "주요 가정", "제외 범위"], ["결론이 유효하려면 유지돼야 하는 조건은 무엇인가요?", "검토하지 않았거나 의도적으로 제외한 범위는 무엇인가요?"], ["content.scopeAndConditions"]),
    defineLeanContextBlock("TR03", "방법과 근거", "어떤 분석·Simulation·실험 방법을 사용했고, 무엇을 Baseline으로 어떤 방식으로 검증했나요?", ["사용한 방법", "Baseline 또는 비교 기준", "검증 방법", "사용한 근거의 역할"], ["분석 결과의 신뢰도를 확인한 비교 또는 검증은 무엇이었나요?", "근거의 종류와 그 근거가 확인하는 내용을 구분해 주세요."], ["content.methodAndEvidence"]),
    defineLeanContextBlock("TR04", "발견과 결론", "실제로 관찰된 결과, 그 결과에 대한 기술적 해석, 최종 결론을 서로 구분해 설명해 주세요.", ["관찰 결과", "기술적 해석", "최종 결론"], ["관찰한 사실과 원인에 대한 해석을 나누면 각각 무엇인가요?", "보고서가 최종적으로 전달하는 판단을 한 문장으로 표현하면 무엇인가요?"], ["content.findingsAndConclusion"]),
    defineLeanContextBlock("TR05", "유효조건과 의사결정", "결론은 어떤 조건에서 유효하며, 어떤 판단에는 사용할 수 있고 어떤 판단에는 사용할 수 없나요?", ["결론의 유효조건", "지원하는 의사결정", "지원하지 않는 의사결정"], ["같은 결론을 재사용할 수 있는 최소 조건은 무엇인가요?", "이 결과만으로 결정하면 안 되는 사항은 무엇인가요?"], ["content.validConditionsAndDecisions"]),
    defineLeanContextBlock("TR06", "한계", "부족한 입력·가정·오차 원인·미확인 사항과 추가로 확인해야 할 내용은 무엇인가요?", ["부족한 입력 또는 데이터", "주요 가정과 오차 원인", "현재 판단 한계", "추가 확인사항"], ["결론을 바꿀 가능성이 가장 큰 미확인 요소는 무엇인가요?", "추가 검증 전까지 사용자가 주의해야 할 점은 무엇인가요?"], ["content.limitations", "internalCompletion.factsToConfirm"]),
    defineLeanContextBlock("TR07", "원본과 관계 역할", "이 보고서가 근거로 삼거나, 반대로 이 보고서를 근거로 사용하는 요청·과제·방법론·후속 자산의 종류와 역할은 무엇인가요? 실제 ID와 링크는 사내에서 복원합니다.", ["원본 또는 근거 자산의 종류와 역할", "이 보고서와 연결될 후속 자산의 종류와 역할", "사내에서 복원할 관계"], ["실제 문서명이 아니라 각 자산이 어떤 근거 역할을 하는지 설명해 주세요.", "필수로 연결해야 하지만 외부에서 확인할 수 없는 관계는 무엇인가요?"], ["content.sourceAndRelationRoles", "internalCompletion.factsToConfirm"])
]);

const EXTERNAL_REPORT_STEP02_CONTEXT_BLOCKS = Object.freeze([
    defineLeanContextBlock("ER01", "보고 목적", "어떤 배경에서 왜 이 외부 보고가 필요했고, 보고를 통해 해결하려는 문제는 무엇인가요?", ["보고 배경", "보고 목적", "해결하려는 문제"], ["단순 정보 공유가 아니라 이 보고가 필요한 이유는 무엇인가요?", "보고가 없을 때 생길 수 있는 오해나 판단 공백은 무엇인가요?"], ["content.reportPurpose", "workingTitle"]),
    defineLeanContextBlock("ER02", "대상과 의사결정", "누가 이 자료를 보고 어떤 판단·승인·행동을 해야 하나요?", ["주요 독자 또는 청중", "독자가 내려야 할 결정", "기대하는 후속 행동"], ["같은 자료라도 가장 우선하는 독자는 누구인가요?", "보고 후 독자가 실제로 결정하거나 승인해야 하는 것은 무엇인가요?"], ["content.audienceAndDecision"]),
    defineLeanContextBlock("ER03", "승인 메시지", "근거 확인이 끝나 외부에 전달할 수 있는 핵심 메시지는 무엇이며, 아직 전달하면 안 되는 내용은 무엇인가요?", ["확인된 핵심 메시지", "메시지를 뒷받침하는 근거 수준", "미확인 또는 전달 금지 메시지"], ["사실·해석·제안을 나누어 승인된 메시지를 설명해 주세요.", "근거 부족으로 보류해야 하는 표현은 무엇인가요?"], ["content.approvedMessages", "internalCompletion.factsToConfirm"]),
    defineLeanContextBlock("ER04", "근거 자산", "각 핵심 메시지는 어떤 종류의 기술자산·원자료·검증 결과에 근거하며, 각각 어떤 역할을 하나요? 실제 문서명과 링크는 말하지 마세요.", ["근거 자산의 일반화된 종류", "각 근거가 뒷받침하는 메시지", "근거의 한계 또는 부족한 근거"], ["메시지마다 직접 근거와 보조 근거를 나누면 무엇인가요?", "사내에서 실제 링크를 복원해야 할 근거 역할은 무엇인가요?"], ["content.sourceAssetsAndEvidence", "internalCompletion.factsToConfirm"]),
    defineLeanContextBlock("ER05", "공개 범위", "누구에게 무엇까지 공유할 수 있고, 어떤 정보는 제외·일반화·익명화해야 하나요?", ["공유 가능한 대상", "공유 가능한 내용 범위", "제외·일반화·익명화할 정보"], ["외부 독자에게 반드시 숨기거나 일반화해야 하는 정보의 종류는 무엇인가요?", "대상에 따라 메시지의 상세 수준이 달라져야 하나요?"], ["content.disclosureScope"]),
    defineLeanContextBlock("ER06", "유효조건과 재검토", "이 자료를 그대로 사용할 수 있는 유효조건과, 내용 재검토가 필요한 변경 신호는 무엇인가요? 실제 버전과 날짜는 사내에서 관리합니다.", ["자료가 유효한 조건", "재검토를 촉발하는 변경조건", "사내에서 복원할 버전·기준일"], ["어떤 가정이나 환경이 바뀌면 메시지를 다시 검토해야 하나요?", "정기 검토가 아니라 내용 변경을 촉발하는 사건은 무엇인가요?"], ["content.versionAndValidity", "internalCompletion.factsToConfirm"]),
    defineLeanContextBlock("ER07", "한계와 전달 주의", "대상이 결론을 과도하게 일반화하거나 오해하지 않도록 밝혀야 할 한계와 전달 주의점은 무엇인가요?", ["해석 한계", "오해 가능성이 있는 표현", "전달 시 주의사항"], ["이 자료만으로 판단하면 안 되는 것은 무엇인가요?", "메시지를 단정적으로 표현하면 안 되는 이유는 무엇인가요?"], ["content.limitationsAndNotes"])
]);

const KNOWHOW_STEP02_CONTEXT_BLOCKS = Object.freeze([
    defineLeanContextBlock("KH01", "노하우 범주", "이 노하우는 기술 수행·산출물 작성·업무 절차·협업·소통 중 어디에 해당하며, 어떤 반복 문제를 줄이기 위한 것인가요?", ["노하우 범주", "해결하려는 반복 문제"], ["이 노하우가 가장 직접적으로 개선하는 업무는 무엇인가요?", "비슷한 노하우와 구분되는 핵심은 무엇인가요?"], ["content.knowhowCategory", "workingTitle"]),
    defineLeanContextBlock("KH02", "상황과 목표", "어떤 업무 시점에 어떤 문제 신호가 나타날 때, 어떤 결과나 품질을 만들기 위해 사용하나요?", ["적용 시점과 상황", "문제 신호 또는 발생 빈도", "목표 결과 또는 품질"], ["이 노하우를 적용해야 한다고 판단하는 가장 이른 신호는 무엇인가요?", "잘 적용했을 때 기대하는 결과는 무엇인가요?"], ["content.symptomAndConditions"]),
    defineLeanContextBlock("KH03", "원인 진단과 실패 시도", "반복해서 어려운 지점과 시작 전 확인사항은 무엇이며, 효과가 없었던 방식과 그 이유는 무엇인가요?", ["핵심 난점", "실행 전 확인사항", "효과가 없었던 방식", "효과가 없다고 판단한 이유"], ["작업을 시작하기 전에 놓치면 실패하기 쉬운 조건은 무엇인가요?", "이전에 시도했지만 효과가 없었던 접근에서 배운 점은 무엇인가요?"], ["content.causeAndDiagnosis"]),
    defineLeanContextBlock("KH04", "실행 절차", "다른 사람이 재현할 수 있도록 실행 순서와 각 단계의 행동·판단기준·이유를 최대 7단계로 설명해 주세요.", ["순서가 있는 실행 단계", "각 단계의 행동", "단계별 판단기준 또는 이유"], ["단순 행동 목록이 아니라 다음 단계로 넘어가는 판단점은 무엇인가요?", "순서를 바꾸면 안 되는 단계와 이유는 무엇인가요?"], ["content.resolution"]),
    defineLeanContextBlock("KH05", "효과와 근거", "무엇을 보면 완료 또는 좋은 품질이라고 판단하며, 실제 효과를 어떤 결과와 근거로 확인했나요?", ["완료 또는 품질 기준", "확인된 결과", "근거 수준"], ["좋아 보이는 것과 완료됐다고 판단하는 기준은 어떻게 다른가요?", "효과는 직접 확인·부분 확인·경험적 판단 중 어느 수준인가요?"], ["content.effectAndEvidence"]),
    defineLeanContextBlock("KH06", "위험과 복구", "적용하면 안 되는 조건, 실패 신호, 중단·복구·Escalation 조건은 무엇인가요?", ["적용 금지 조건", "위험 또는 실패 신호", "중단 기준", "복구 또는 상위 판단 요청 기준"], ["계속 진행하면 손실이 커지는 중단 신호는 무엇인가요?", "사용자가 스스로 복구할 범위와 도움을 요청할 범위는 어떻게 구분하나요?"], ["content.risksAndRecovery"]),
    defineLeanContextBlock("KH07", "재사용 자료", "어디까지 재사용할 수 있고 어떤 Template·Checklist·SOP·사례·버전과 연결해야 하나요? 실제 이름과 링크는 사내에서 복원합니다.", ["재사용 가능한 범위", "연결 자료의 종류와 역할", "버전 또는 변경 시 재검토 조건", "사내에서 복원할 항목"], ["이 노하우를 적용할 때 함께 봐야 하는 자료의 역할은 무엇인가요?", "환경이나 버전이 바뀌면 다시 확인해야 하는 부분은 무엇인가요?"], ["content.versionsAndSources", "internalCompletion.factsToConfirm"])
]);

const TOOL_MANUAL_STEP02_CONTEXT_BLOCKS = Object.freeze([
    defineLeanContextBlock("TM01", "목적과 결과", "누가 어떤 상황에서 어떤 한 가지 작업을 수행하며, 정상 완료되면 어떤 결과물을 얻나요?", ["사용자 역할", "사용 상황", "수행할 작업", "정상 결과물"], ["이 Manual이 끝까지 안내해야 하는 한 가지 작업은 무엇인가요?", "사용자가 정상 완료 후 확인할 결과물은 무엇인가요?"], ["content.purposeAndOutput", "workingTitle"]),
    defineLeanContextBlock("TM02", "사전 준비", "필요한 Tool·환경·권한·입력 형식과 시작 전 확인사항은 무엇인가요? 실제 버전과 경로는 사내에서 복원합니다.", ["필요한 도구와 환경", "필요 권한", "입력 형식", "시작 전 확인사항", "사내 복원할 버전·경로"], ["하나라도 없으면 시작하면 안 되는 필수조건은 무엇인가요?", "버전이나 환경 차이로 결과가 달라질 수 있는 부분은 무엇인가요?"], ["content.prerequisites", "internalCompletion.factsToConfirm"]),
    defineLeanContextBlock("TM03", "실행 절차와 판단점", "작업 성공에 필요한 실행 순서, 단계별 예상 결과, 주요 옵션 선택기준과 저장·백업·되돌리기 지점을 설명해 주세요.", ["순서가 있는 실행 단계", "단계별 예상 결과", "주요 옵션과 선택기준", "저장·백업·되돌리기 지점"], ["사용자가 선택해야 하는 옵션과 기본값을 그대로 쓰면 안 되는 조건은 무엇인가요?", "실패 시 되돌아갈 수 있도록 언제 저장하거나 백업해야 하나요?"], ["content.procedure"]),
    defineLeanContextBlock("TM04", "완료 확인", "정상 완료를 무엇으로 확인하며, 실행은 끝났지만 결과가 잘못된 경우의 신호는 무엇인가요?", ["정상 완료 기준", "예상 결과", "겉보기 완료지만 잘못된 결과의 신호"], ["단순히 오류가 없다는 것 외에 결과의 유효성을 무엇으로 확인하나요?", "사용자가 잘못된 결과를 조기에 발견할 수 있는 신호는 무엇인가요?"], ["content.completionCheck"]),
    defineLeanContextBlock("TM05", "오류와 경고", "자주 발생하는 오류·위험·중단조건과 기본 복구원칙은 무엇인가요?", ["자주 발생하는 오류", "주요 위험", "즉시 중단할 조건", "기본 복구원칙"], ["계속 진행하면 데이터나 결과를 훼손할 수 있는 신호는 무엇인가요?", "사용자가 직접 복구하지 말고 도움을 요청해야 하는 경우는 무엇인가요?"], ["content.errorsAndWarnings"]),
    defineLeanContextBlock("TM06", "버전과 원본", "어떤 공식 Manual·예제·Script·노하우와 연결해야 하며, 버전이 바뀌면 무엇을 다시 확인해야 하나요? 실제 이름과 링크는 사내에서 복원합니다.", ["연결 자료의 종류와 역할", "버전 적용 범위", "변경 시 재검토 항목", "사내에서 복원할 원본"], ["이 Manual보다 우선하는 공식 원본은 어떤 역할의 자료인가요?", "Tool 또는 Script 버전이 달라질 때 가장 먼저 검증할 단계는 무엇인가요?"], ["content.versionsAndSources", "internalCompletion.factsToConfirm"])
]);

const EDUCATION_MATERIAL_STEP02_CONTEXT_BLOCKS = Object.freeze([
    defineLeanContextBlock("EDU01", "학습 목표", "학습 후 학습자가 무엇을 설명·구분·선택·실행·판단할 수 있어야 하나요? 핵심 목표는 최대 3개로 말해 주세요.", ["행동으로 확인 가능한 학습 목표", "목표의 우선순위"], ["단순히 안다가 아니라 학습 후 실제로 무엇을 할 수 있어야 하나요?", "가장 중요한 목표 하나를 고르면 무엇인가요?"], ["content.learningObjectives", "workingTitle"]),
    defineLeanContextBlock("EDU02", "대상과 사전지식", "대상 역할·경험 수준과 필요한 사전지식·선행 자산·실습환경은 무엇인가요?", ["학습 대상", "경험 수준", "필요한 사전지식", "선행 자산 또는 실습환경"], ["이 교육을 바로 듣기 어려운 대상은 누구이며 무엇이 부족한가요?", "실습을 위해 반드시 준비돼야 하는 환경은 무엇인가요?"], ["content.audienceAndPrerequisites"]),
    defineLeanContextBlock("EDU03", "구성", "어떤 문제와 핵심 개념을 어떤 순서로 학습하며, 의도적으로 다루지 않는 범위는 무엇인가요?", ["학습 흐름", "핵심 개념", "각 순서의 이유", "제외 범위"], ["개념 설명과 실제 적용은 어떤 순서로 연결되나요?", "교육 범위를 벗어나 별도 자산으로 넘겨야 하는 내용은 무엇인가요?"], ["content.outline"]),
    defineLeanContextBlock("EDU04", "학습 활동", "읽기·강의·토론·실습 중 어떤 방식으로 학습하고, 예상 시간과 준비물은 무엇인가요? 실제 내부 자료명은 일반화하세요.", ["학습 방법", "예상 소요시간", "준비물 또는 실습자료", "활동별 목적"], ["학습자가 직접 수행해야 하는 활동과 관찰만 하면 되는 활동을 구분해 주세요.", "시간이 제한될 때 반드시 유지해야 하는 활동은 무엇인가요?"], ["content.activities"]),
    defineLeanContextBlock("EDU05", "완료 기준", "학습 목표 달성을 어떤 설명·결과·실습·과제로 확인하나요?", ["목표별 확인 방법", "완료 또는 통과 기준", "추가 학습이 필요한 신호"], ["정답 확인이 아니라 실제 판단 능력을 무엇으로 확인하나요?", "목표를 달성하지 못했을 때 어떤 보완 학습이 필요한가요?"], ["content.completionCriteria"]),
    defineLeanContextBlock("EDU06", "원본과 버전", "어떤 방법론·보고서·BP·Manual·원문·실습자료와 연결해야 하며, 버전이 바뀌면 무엇을 갱신해야 하나요? 실제 ID와 링크는 사내에서 복원합니다.", ["연결 자산의 종류와 학습 역할", "원문·실습자료의 역할", "버전 적용 범위와 갱신 조건", "사내에서 복원할 항목"], ["학습자가 반드시 함께 확인해야 하는 원본 자료는 어떤 역할인가요?", "관련 방법론이나 Tool이 바뀌면 교육자료에서 다시 확인할 부분은 무엇인가요?"], ["content.sourcesAndVersion", "internalCompletion.factsToConfirm"])
]);

const LEAN_STEP02_CONTEXT_BLOCKS = Object.freeze({
    "vd-request": VD_REQUEST_STEP02_CONTEXT_BLOCKS,
    cor: COR_STEP02_CONTEXT_BLOCKS,
    methodology: METHODOLOGY_STEP02_CONTEXT_BLOCKS,
    bp: BP_STEP02_CONTEXT_BLOCKS,
    "technical-report": TECHNICAL_REPORT_STEP02_CONTEXT_BLOCKS,
    "external-report": EXTERNAL_REPORT_STEP02_CONTEXT_BLOCKS,
    knowhow: KNOWHOW_STEP02_CONTEXT_BLOCKS,
    "tool-manual": TOOL_MANUAL_STEP02_CONTEXT_BLOCKS,
    "education-material": EDUCATION_MATERIAL_STEP02_CONTEXT_BLOCKS
});

// 긴 답변 예시는 Prompt 계약과 분리해 Guide에서만 사용합니다.
// 예시 파일이 로드되지 않은 VM·테스트 환경에서도 Prompt 생성은 그대로 동작해야 합니다.
const LEAN_STEP02_GUIDE_EXAMPLES = window.TECHNICAL_ASSET_STEP02_GUIDE_EXAMPLES || Object.freeze({});

const LEAN_ASSET_PROMPT_CONFIG = Object.freeze({
    "vd-request": Object.freeze({ cardType: "VD Request", completionMarker: "[VD Request Step 02 맥락 인터뷰 완료]", fileName: "technical-asset-vd-request.json" }),
    cor: Object.freeze({ cardType: "CoR", completionMarker: "[CoR Step 02 맥락 인터뷰 완료]", fileName: "technical-asset-cor.json" }),
    methodology: Object.freeze({ cardType: "방법론", completionMarker: "[방법론 Step 02 맥락 인터뷰 완료]", fileName: "technical-asset-methodology.json" }),
    bp: Object.freeze({ cardType: "BP", completionMarker: "[BP Step 02 맥락 인터뷰 완료]", fileName: "technical-asset-bp.json" }),
    "technical-report": Object.freeze({ cardType: "기술보고서", completionMarker: "[기술보고서 Step 02 맥락 인터뷰 완료]", fileName: "technical-asset-technical-report.json" }),
    "external-report": Object.freeze({ cardType: "외부 보고 자료", completionMarker: "[외부 보고 자료 Step 02 맥락 인터뷰 완료]", fileName: "technical-asset-external-report.json" }),
    knowhow: Object.freeze({ cardType: "노하우", completionMarker: "[노하우 Step 02 맥락 인터뷰 완료]", fileName: "technical-asset-knowhow.json" }),
    "tool-manual": Object.freeze({ cardType: "Tool Manual", completionMarker: "[Tool Manual Step 02 맥락 인터뷰 완료]", fileName: "technical-asset-tool-manual.json" }),
    "education-material": Object.freeze({ cardType: "교육자료", completionMarker: "[교육자료 Step 02 맥락 인터뷰 완료]", fileName: "technical-asset-education-material.json" })
});

const LEAN_ASSET_KEYS = Object.freeze(Object.keys(LEAN_ASSET_PROMPT_CONFIG));

function isLeanV03Asset(assetKey) {
    return LEAN_ASSET_KEYS.includes(assetKey);
}

function getLeanAssetKeyForCardType(cardType) {
    return LEAN_ASSET_KEYS.find((assetKey) => LEAN_ASSET_PROMPT_CONFIG[assetKey].cardType === cardType) || "";
}

const META02_TECHNOLOGY_DOMAIN_GUIDANCE = Object.freeze({
    title: "기술영역 선택 안내",
    intro: "아래 7개 중 이 자산의 핵심 판단을 가장 직접적으로 설명하는 주 기술영역 1개와, 필요하면 원인·조건·연성 거동을 설명하는 보조 기술영역 최대 2개를 선택합니다.",
    options: [
        { value: "deformation", label: "변형", description: "형상 변화, 처짐, 뒤틀림, 응력, 강성, 좌굴" },
        { value: "delamination", label: "박리", description: "접착, 계면, 층간 분리, 접합부 파손" },
        { value: "impact", label: "충격", description: "낙하, 충돌, 순간 하중, 충격 취약부" },
        { value: "thermal-flow", label: "열유동", description: "온도 분포, 냉각, 열전달, 유동, 압력손실, 열-구조 연계" },
        { value: "fatigue", label: "피로", description: "반복하중, 열사이클, 손상 누적, 수명" },
        { value: "vibration", label: "진동", description: "모드, 가진, 주파수, 공진, 소음·진동" },
        { value: "other", label: "기타", description: "앞의 6개 영역으로 분류할 수 없는 명확한 기술영역" }
    ],
    rules: [
        "주 기술영역은 최종적으로 판단하려는 대상을 가장 직접적으로 설명하는 1개입니다.",
        "보조 기술영역은 그 판단의 원인·조건·연성 거동을 설명하는 영역으로 최대 2개입니다."
    ],
    examples: [
        "낙하 후 구조 취약 위치 판단 → 주 충격, 보조 변형",
        "온도 변화에 따른 뒤틀림 판단 → 주 변형, 보조 열유동",
        "반복하중에 따른 수명 판단 → 주 피로, 보조 변형",
        "낙하 조건에서 계면 박리 가능성 판단 → 주 박리, 보조 충격"
    ],
    caution: "예시는 선택 기준일 뿐입니다. 실제 답변에 근거가 없는 영역은 선택하지 말고, 판단이 어렵다면 사내 확인 필요로 남깁니다. 기타는 근거가 없을 때의 기본값으로 사용하지 않습니다."
});

const WORKFLOW_STAGE_TAG_OPTIONS = Object.freeze([
    { value: "연구", description: "원리·가능성·선행 기술을 검토하는 단계" },
    { value: "설계", description: "설계안을 선택하거나 설계를 변경하는 단계" },
    { value: "개발", description: "시제품·요구사항·개발 방향을 판단하는 단계" },
    { value: "공정", description: "공정 조건·치공구·공법을 검토하거나 최적화하는 단계" },
    { value: "제조", description: "양산 적용·생산 실행·제조 현장에 활용하는 단계" },
    { value: "품질", description: "결함·검사·신뢰성·품질을 판단하는 단계" }
]);

const RESPONSE_TARGET_TAG_OPTIONS = Object.freeze([
    { value: "고객", description: "외부 고객의 요구·평가·설명에 필요한 판단" },
    { value: "사업부", description: "제품·설계·개발 또는 사업 실행에 필요한 판단" },
    { value: "CTO", description: "선행·공통기술 또는 조직 간 기술 의사결정" },
    { value: "AX", description: "AI·데이터·자동화 적용에 필요한 판단" },
    { value: "품질경영", description: "품질·신뢰성·검사·승인에 필요한 판단" },
    { value: "생산기술", description: "공정·설비·제조기술·양산 적용에 필요한 판단" }
]);

const STEP01_SEARCH_METADATA_QUESTIONS = Object.freeze([
    {
        id: "META01",
        reviewLabel: "핵심 문제·현상",
        collectionMode: "auto_extract_then_review",
        autoExtractFirst: true,
        askIfNeeded: true,
        allowConfirmedEmpty: true,
        question: "이 자산이 해결하거나 설명하는 핵심 문제·현상을 일반 기술어 1~3개로 표현하면 무엇인가요?",
        captures: "문제·현상 검색 분류",
        answerGuide: "일반 기술어 1~3개. 예: 국부 응답 집중, 상대 취약 순위",
        targets: ["searchMetadata.searchFacets.problemPhenomena"]
    },
    {
        id: "META02",
        reviewLabel: "주·보조 기술영역",
        collectionMode: "auto_extract_then_review",
        autoExtractFirst: true,
        askIfNeeded: true,
        allowConfirmedEmpty: false,
        requiredTargets: ["searchMetadata.primaryDomainCandidate"],
        question: "아래 기술영역 중 이 자산의 핵심 판단을 가장 직접적으로 설명하는 주 기술영역 1개와, 필요하면 보조 기술영역 최대 2개를 선택하고 각 선택의 근거를 설명해 주세요.",
        captures: "주·보조 기술영역 후보와 답변 근거",
        answerGuide: "주 영역 1개는 필수, 보조 영역은 최대 2개. 각 선택의 답변 근거 포함",
        targets: ["searchMetadata.primaryDomainCandidate", "searchMetadata.secondaryDomainCandidates", "searchMetadata.candidateRationale"],
        guidance: META02_TECHNOLOGY_DOMAIN_GUIDANCE
    },
    {
        id: "META03",
        reviewLabel: "제품·구조·공정 범주",
        collectionMode: "auto_extract_then_review",
        autoExtractFirst: true,
        askIfNeeded: true,
        allowConfirmedEmpty: true,
        question: "실제 제품명과 과제명을 제외하고, 이 자산이 관련된 제품·구조·공정 범주를 일반화하면 무엇인가요?",
        captures: "제품·구조·공정 검색 분류",
        answerGuide: "고유명사를 제외한 일반 범주. 예: 체결형 조립 구조, 연결부",
        targets: ["searchMetadata.searchFacets.productStructureProcess"]
    },
    {
        id: "META04",
        reviewLabel: "업무 단계",
        collectionMode: "auto_extract_then_review",
        autoExtractFirst: true,
        askIfNeeded: true,
        allowConfirmedEmpty: false,
        requiredTargets: ["searchMetadata.workflowStageCandidates"],
        question: "이 자산을 사용하는 업무 단계는 연구·설계·개발·공정·제조·품질 중 무엇인가요? 복수 단계라면 실제로 활용되는 단계만 선택해 주세요.",
        captures: "업무 단계 후보와 근거",
        answerGuide: "연구·설계·개발·공정·제조·품질 중 실제 활용 단계만 선택",
        targets: ["searchMetadata.workflowStageCandidates", "searchMetadata.candidateRationale"]
    },
    {
        id: "META05",
        reviewLabel: "대응 대상",
        collectionMode: "auto_extract_then_review",
        autoExtractFirst: true,
        askIfNeeded: true,
        allowConfirmedEmpty: false,
        requiredTargets: ["searchMetadata.responseTargetCandidates"],
        question: "이 자산의 판단 결과를 실제로 활용하는 대상은 고객·사업부·CTO·AX·품질경영·생산기술 중 누구인가요? 요청 전달자보다 결과를 의사결정에 사용하는 대상을 기준으로 선택해 주세요.",
        captures: "대응 대상 후보와 근거",
        answerGuide: "고객·사업부·CTO·AX·품질경영·생산기술 중 실제 판단 활용 대상 선택",
        targets: ["searchMetadata.responseTargetCandidates", "searchMetadata.candidateRationale"]
    },
    {
        id: "META06",
        reviewLabel: "Tool·모델·데이터",
        collectionMode: "auto_extract_then_review",
        autoExtractFirst: true,
        askIfNeeded: true,
        allowConfirmedEmpty: true,
        question: "검색과 재사용에 중요한 Tool·모델·데이터의 일반 분류는 무엇인가요? 실제 이름과 버전은 사내에서 복원합니다.",
        captures: "Tool·모델·데이터 검색 분류",
        answerGuide: "실제 이름·버전 없이 일반 분류. 예: 수치 해석 모델, 조건 비교 결과",
        targets: ["searchMetadata.searchFacets.toolModelData"]
    },
    {
        id: "META07",
        reviewLabel: "내용 기반 추가 태그",
        collectionMode: "auto_extract_then_review",
        autoExtractFirst: true,
        askIfNeeded: true,
        allowConfirmedEmpty: true,
        question: "본문에서 직접 확인되는 기술 개념·검증 방법·판단 방식 중 검색 태그로 남길 항목은 무엇인가요? 표준 태그를 우선 검토하고 근거가 있는 항목만 최대 5개 선택해 주세요.",
        captures: "내용 기반 추가 태그 후보와 근거",
        answerGuide: "답변에 직접 근거가 있는 명사형 태그 0~5개. 필수 분류 태그와 중복 금지",
        targets: ["searchMetadata.visibleTags", "searchMetadata.candidateRationale"]
    },
    {
        id: "META08",
        reviewLabel: "검색 별칭",
        collectionMode: "auto_extract_then_review",
        autoExtractFirst: true,
        askIfNeeded: true,
        allowConfirmedEmpty: true,
        question: "제목을 모르는 동료가 사용할 한글·영문 동의어, 약어, 과거 명칭은 무엇인가요?",
        captures: "검색 별칭",
        answerGuide: "한글·영문 동의어, 약어, 과거 명칭. 태그와 구분",
        targets: ["searchMetadata.aliases", "searchMetadata.candidateRationale"]
    },
    {
        id: "META09",
        reviewLabel: "예상 검색문장",
        collectionMode: "auto_extract_then_review",
        autoExtractFirst: true,
        askIfNeeded: true,
        allowConfirmedEmpty: true,
        question: "제목을 모르는 동료가 실제로 입력할 문제·상황·판단 목적의 검색문장 2~3개는 무엇인가요?",
        captures: "예상 검색문장",
        answerGuide: "문제·상황·판단 목적이 드러나는 자연어 검색문장 2~3개",
        targets: ["searchMetadata.expectedQueries", "searchMetadata.candidateRationale"]
    }
]);

const STEP01_RELATION_EVIDENCE_QUESTIONS = Object.freeze([
    {
        id: "REL01",
        collectionMode: "internal_restore",
        question: "이 대응에서 실제로 사용한 기존 Wiki 자산, 새로 등록할 자산, 추가로 연결할 자산의 종류와 각각의 관계 이유는 무엇인가요? 실제 자산 ID는 사내 등록 단계에서 선택합니다.",
        captures: "기존 자산 활용, 신규·연결 자산 후보, 관계 이유",
        targets: ["relatedAssetCandidates", "reuseOrFollowUp"]
    },
    {
        id: "EVD01",
        collectionMode: "auto_extract_or_internal",
        question: "근거가 되는 원본 자료의 종류와 각 자료가 증명하는 내용은 무엇인가요? 실제 파일명과 링크는 사내에서 입력합니다.",
        captures: "원본 근거 종류와 증명 역할",
        targets: ["evidenceAvailable", "placeholdersToRestoreInternally"]
    }
]);

const STEP01_COMMON_METADATA_QUESTIONS = Object.freeze([
    ...STEP01_SEARCH_METADATA_QUESTIONS,
    ...STEP01_RELATION_EVIDENCE_QUESTIONS
]);

const STEP01_METADATA_FIELD_SPECS = STEP01_COMMON_METADATA_QUESTIONS;

const STEP01_REQUIRED_METADATA_QUESTIONS = Object.freeze(
    STEP01_SEARCH_METADATA_QUESTIONS.filter(({ allowConfirmedEmpty }) => !allowConfirmedEmpty)
);

const STEP01_ASKABLE_METADATA_QUESTIONS = STEP01_SEARCH_METADATA_QUESTIONS;

const STEP01_AUTO_METADATA_FIELDS = Object.freeze(
    [
        ...STEP01_SEARCH_METADATA_QUESTIONS,
        ...STEP01_RELATION_EVIDENCE_QUESTIONS.filter(({ collectionMode }) => collectionMode === "auto_extract_or_internal")
    ]
);

const STEP01_MANUAL_TEST_FIXTURES = Object.freeze({
    "vd-request": Object.freeze({
        title: "VD Request · 후보안 상대 위험 비교",
        prompt1Answer: `기술영역=주: 충격 / 보조: 변형, 박리
업무 단계=설계, 개발
대응 대상=사업부`,
        step02VoiceAnswers: Object.freeze([
            "후보안을 확정하기 전에 상대적으로 취약한 위치를 판단해야 하는 상황에서 요청이 발생했고, 평가 착수 전에 다음 설계 방향을 정해야 했습니다.",
            "확보된 기본 입력을 사용하되 일부 물성 정보는 부족했습니다. 두 후보에 공통 조건을 유지하고 형상 차이만 바꿔 취약 위치와 상대 응답 경향을 비교했습니다.",
            "한 후보에서 기존 집중 위치가 낮아지는 경향을 관찰했고 하중 전달 경로 변화로 해석했습니다. 상대 비교는 가능했지만 절대 수명이나 인증 여부까지는 판단할 수 없었습니다.",
            "요청자는 검토 회의에서 비교 결과와 한계를 확인했고, 보완 위치를 추가로 검토해 달라고 요청했습니다.",
            "상대 위험이 높은 후보는 보류하고 보완한 후보를 다음 평가 대상으로 정했습니다. 실제 평가 대상 변경은 확인했지만 이후 결과는 아직 확인하지 못했습니다.",
            "유사한 구조와 하중 조건의 후보 비교에는 재사용할 수 있지만, 재료 구성이나 구속 조건이 달라지면 다시 검증해야 합니다. 확대 적용 검증은 아직 미정입니다."
        ]),
        expectedChecks: Object.freeze([
            "Prompt 1을 붙이면 상세 설명이나 선택지를 반복하지 않고 Wiki Guide를 확인하라는 안내와 세 줄의 답변 형식만 표시됩니다.",
            "시험 답변을 한 메시지로 붙이면 기술영역, 업무 단계, 대응 대상이 같은 값으로 ‘입력 확인 완료’ 결과에 표시됩니다.",
            "허용값 밖의 값이나 필수값 누락이 있으면 잘못된 항목만 짧게 알려주고 해당 줄만 다시 받습니다.",
            "Prompt 1에서는 태그 추천·추가 맥락 질문·TAG_PROFILE·JSON을 만들지 않습니다.",
            "Prompt 2는 여섯 맥락 영역을 한 번에 하나씩 진행하고, 필수 세부항목이 빠지면 같은 영역에서 보완 질문을 합니다.",
            "Prompt 2 완료 시 사용자가 최종 확인한 여섯 맥락 요약만 남기며 META·Handoff·JSON을 만들지 않습니다."
        ])
    })
});

function formatInterviewGuidance(guidance) {
    if (!guidance) return "";
    return [
        `  선택 안내: ${guidance.intro}`,
        ...guidance.options.map(({ label, description }) => `  - ${label}: ${description}`),
        "  선택 기준:",
        ...guidance.rules.map((rule) => `  - ${rule}`),
        "  선택 예시:",
        ...guidance.examples.map((example) => `  - ${example}`),
        `  주의: ${guidance.caution}`
    ].join("\n");
}

function formatInterviewQuestions(questions) {
    return questions
        .map(({ id, question, captures, guidance }) => [
            `- ${id} | 질문: ${question} | 완료판단: ‘${captures}’ 정보가 답변에 직접 확인됨`,
            formatInterviewGuidance(guidance)
        ].filter(Boolean).join("\n"))
        .join("\n");
}

function formatMetadataFieldSpecs(specs) {
    return specs
        .map(({ id, captures, targets, collectionMode, reviewLabel = captures }) => (
            `- ${id} | ${reviewLabel} | ${collectionMode} | 추출값: ${captures} | 저장: ${targets.join(", ")}`
        ))
        .join("\n");
}

function formatMetadataReviewQuestions(questions) {
    return questions
        .map(({
            id,
            reviewLabel,
            question,
            captures,
            answerGuide,
            allowConfirmedEmpty,
            guidance
        }) => [
            `- ${id} | 항목: ${reviewLabel} | 질문: ${question}`,
            `  답변 안내: ${answerGuide}`,
            `  완료판단: ‘${captures}’ 정보가 답변에 직접 확인됨`,
            `  빈 값 처리: ${allowConfirmedEmpty ? "사용자가 ‘없음’ 또는 빈 값 유지를 확인하면 허용" : "필수값이므로 후보가 없으면 원본 질문을 한 번에 하나씩 진행"}`,
            formatInterviewGuidance(guidance)
        ].filter(Boolean).join("\n"))
        .join("\n");
}

function createClassificationTagDefinitionPrompt(cardType) {
    const technologyDomainValues = META02_TECHNOLOGY_DOMAIN_GUIDANCE.options
        .map(({ label }) => label)
        .join(", ");
    const workflowStageValues = WORKFLOW_STAGE_TAG_OPTIONS.map(({ value }) => value).join(", ");
    const responseTargetValues = RESPONSE_TARGET_TAG_OPTIONS.map(({ value }) => value).join(", ");

    return `당신은 ${cardType} 등록용 태그 입력 검증자입니다.

선택지의 뜻·선정 기준·예시는 사용자가 현재 열어 둔 사내 Wiki Guide에서 확인합니다. 당신은 그 내용을 다시 설명하거나 추천하지 말고, 사이트에 직접 접속하거나 내용을 조회할 수 있다고 말하지 마세요.

[첫 응답]
아래 문장과 세 줄만 출력하세요.

Wiki Guide의 ‘${cardType} Prompt 1 작성 안내’에서 기준과 선택지를 확인한 뒤, 다음 세 항목을 입력란에 한 번에 작성해 주세요.
기술영역=주: [1개] / 보조: [최대 2개 또는 없음]
업무 단계=[1개 이상]
대응 대상=[1개 이상]

[검증에만 사용할 허용값 — 사용자에게 다시 나열하거나 설명하지 않음]
- 기술영역: ${technologyDomainValues}
- 업무 단계: ${workflowStageValues}
- 대응 대상: ${responseTargetValues}

[검증 규칙]
1. 기술영역은 주 1개가 필수이고, 보조는 주와 겹치지 않는 최대 2개 또는 없음입니다.
2. 기술영역은 위 우리말 허용값만 인정합니다. 영문 코드로 바꾸거나 함께 표시하지 마세요.
3. 기타를 선택하면 실제 기술영역명을 함께 받아야 합니다.
4. 업무 단계와 대응 대상은 각각 허용값 중 1개 이상이어야 합니다.
5. 값을 추천·추정·추가하지 마세요. 상세 이유, 선택 기준, 예시, 보안 안내, 추가 맥락도 설명하지 마세요.
6. 누락·허용값 밖의 값·주/보조 중복이 있으면 \`[수정 필요]\`와 잘못된 항목 및 짧은 이유만 출력하고, 그 줄만 다시 입력해 달라고 하세요. 이미 유효한 값은 다시 묻지 마세요.
7. 세 항목이 모두 유효하면 설명이나 Markdown 코드블록 없이 아래 네 줄만 출력하세요.

[입력 확인 완료]
기술영역=주: [확인한 우리말] / 보조: [확인한 우리말 또는 없음]
업무 단계=[확인한 값]
대응 대상=[확인한 값]

이 단계에서는 TAG_PROFILE, JSON, 태그 추천, 추가 질문을 만들지 마세요.`;
}

function createVdRequestTagDefinitionPrompt() {
    return createClassificationTagDefinitionPrompt("VD Request");
}

function createCorTagDefinitionPrompt() {
    return createClassificationTagDefinitionPrompt("CoR");
}

function createMethodologyTagDefinitionPrompt() {
    return createClassificationTagDefinitionPrompt("방법론");
}

function createSequentialInterviewTransitionContract({ cardType, totalAreas, deferredLabel }) {
    return `[공통 답변 처리·상태 전환 — 반드시 준수]
1. 한 AI 응답에는 질문을 최대 1개만 포함하세요. 영역 정리 문장은 질문으로 세지 않습니다.
2. 한 영역의 보완 질문은 최대 2회까지만 하세요. 사용자 답변을 받은 뒤 필수 세부항목이 부족하고 현재 영역의 보완 질문이 2회 미만이면, \`[${cardType} Step 02 · 영역 n/${totalAreas} · 보완 질문]\`과 가장 중요한 누락 항목을 확인하는 질문 1개만 출력하세요. 이때 영역 정리나 다음 영역 질문을 함께 출력하지 마세요.
3. 필수 세부항목이 모두 처리됐거나 보완 질문을 2회 마쳤으면 현재 영역을 완료하세요. 끝까지 확인되지 않은 내용은 만들지 말고 \`${deferredLabel}\`으로 남기세요.
4. 현재 영역이 마지막 전 영역이면 같은 응답에서 아래 순서로 연속 출력하세요.
   - \`정리 n/${totalAreas}:\`와 현재 영역의 완결된 정리
   - \`[${cardType} Step 02 · 영역 n+1/${totalAreas} · 다음 영역 제목]\`
   - 다음 영역의 기본 질문 1개
   정리 뒤에 멈추거나 사용자에게 \`다음\`·\`확인\`을 요구하지 마세요. 사용자는 같은 응답에 표시된 다음 질문에 바로 답합니다.
5. 사용자가 직전 정리의 오류만 수정하면 해당 정리만 고치고, 이미 대기 중인 현재 영역 질문 1개를 다시 제시하세요. 영역을 추가로 넘기거나 질문을 건너뛰지 마세요. 사용자가 수정과 현재 질문의 답을 함께 말했다면 둘 다 반영한 뒤 현재 영역을 정상 처리하세요.
6. 마지막 영역이 완료되면 별도의 \`정리 ${totalAreas}/${totalAreas}\`을 출력하지 말고, 이 Prompt 뒤쪽에 정의된 \`[${cardType} Step 02 · 최종 확인]\` 전체를 바로 출력한 뒤 대기하세요.
7. 최종 확인 직후 사용자가 입력한 \`완료\`만 인터뷰 완료 명령으로 해석하세요. 중간 답변의 ‘완료’나 CoR의 과제 상태값을 인터뷰 완료 명령으로 해석하지 마세요.`;
}

function createVdRequestContextInterviewPrompt() {
    const jsonCompletionContract = createStep02JsonCompletionContract("vd-request");
    return `당신은 VD Request를 사내 기술자산으로 남기기 위해 필요한 맥락을 순서대로 확인하는 인터뷰 진행자입니다.

이것은 무료 Gemini용 등록 흐름의 2번째이자 마지막 Prompt입니다.
사용자는 Gemini 입력창의 마이크 기능을 사용해 질문에 말로 답합니다.
당신은 여섯 맥락 영역을 순서대로 확인하되 질문은 한 번에 정확히 하나만 보여줍니다.
사용자가 배경·판단 이유·확인 상태를 필요한 만큼 충분히 설명하도록 기다리고, 필수 세부항목이 빠졌을 때만 같은 영역의 보완 질문을 하나씩 제시합니다.

[선행조건]
- 같은 대화에 \`[입력 확인 완료]\`가 있어야 합니다.
- 완료표시가 없으면 질문을 시작하지 말고 아래 두 줄만 출력하세요.
  "[2/2 진행 불가 · Prompt 1 대화가 없습니다]"
  "Prompt 1을 완료한 기존 대화창으로 돌아가세요."
- Prompt 1에서 확정한 기술영역·업무 단계·대응 대상은 그대로 유지합니다. 다시 추천·분류·질문하지 마세요.

[첫 응답]
설명, 전체 질문 목록, 예시, 중간 요약을 먼저 보여주지 말고 아래 두 줄만 출력하세요.

[VD Request Step 02 · 영역 1/6 · 요청 배경과 판단 질문]
${VD_REQUEST_STEP02_CONTEXT_BLOCKS[0].question}

[대화 진행 규칙]
1. 여섯 영역을 아래 순서대로 확인하되, 사용자에게는 항상 현재 질문 하나만 보여주세요.
2. 답변 길이를 제한하지 마세요. 사용자가 편하게 여러 문장으로 설명하도록 기다리세요.
3. 현재 영역의 각 필수 세부항목을 \`확인됨 / 추후 확인 / 해당 없음\` 중 하나로 내부 관리하세요.
4. 한 답변에서 뒤 영역의 내용까지 말했다면 내부적으로 보존하고, 해당 영역에서 이미 확인한 내용은 다시 묻지 마세요.

${createSequentialInterviewTransitionContract({ cardType: "VD Request", totalAreas: 6, deferredLabel: "추후 확인" })}

[VD Request 해석 규칙]
1. 사용자가 말한 우려를 확정된 후속조치로 바꾸지 말고, 제안·결정·실행 완료·확인 필요를 구분하세요.
2. 요청자의 직접 피드백과 인터뷰 진행자의 추론을 구분하세요.
3. 각 \`정리 n/6\`은 완료 직후 JSON으로 변환할 수 있는 완결된 문장으로 작성하세요. 관찰 사실, 기술적 해석, 결론, 한계와 후속조치를 서로 섞지 마세요.
4. 여섯 영역을 모두 처리할 때까지 분류 후보, 검색용 정보, 등록 파일 또는 다음 단계용 전달 형식을 만들지 마세요.

[영역 원본 · 내부 진행 순서]
${VD_REQUEST_STEP02_CONTEXT_BLOCKS.map(({ title, question, requiredItems, followUpQuestions }, index) => (
        `${index + 1}. ${title}
   기본 질문: ${question}
   완료 전 필수 세부항목:
${requiredItems.map((item) => `   - ${item}`).join("\n")}
   보완 질문 후보:
${followUpQuestions.map((followUp) => `   - ${followUp}`).join("\n")}`
    )).join("\n")}

[사실·보안 규칙]
1. 답변에 없는 사실·성과·검증·관계를 추정하지 마세요.
2. 사실, 기술적 해석, 제안, 미확인 사항을 구분하세요.
3. 실제 회사·조직·고객·제품·과제·사람·문서명·ID·URL·파일경로를 요구하거나 반복하지 마세요.
4. 정확한 치수·물성·조건·비용·일정·성과 수치는 요구하지 말고 상대 비교와 경향으로 일반화하세요.
5. 아직 받지 못한 피드백이나 확인되지 않은 영향은 \`추후 확인\`으로 정리하세요. 업무상 정말 발생하지 않는 경우만 구체적 이유와 함께 \`해당 없음\`으로 정리하세요.
6. 사내 문서·모델·이미지·로그·파일을 업로드하라고 요청하지 마세요.
7. 불필요한 영문 표현은 우리말로 바꾸세요. 단, VD Request와 Simulation처럼 조직에서 사용하는 표준 용어는 유지할 수 있습니다.

[최종 확인]
영역 6의 답변과 필요한 보완 질문까지 처리한 뒤 별도의 \`정리 6/6:\`을 반복하지 말고, 아래 형식으로 여섯 영역 전체를 먼저 보여주세요.

[VD Request Step 02 · 최종 확인]

1. 요청 배경과 판단 질문
- 상황:
- 판단 질문:
- 필요 시점:

2. Simulation 대응
- 입력·제약:
- 비교 대상과 조건:
- 검토 방법·판단 지표:

3. 판단 근거
- 관찰 사실:
- 기술적 해석:
- 전달한 결론·제안:
- 판단 가능·불가능 범위:

4. 요청자 피드백
- 확인된 피드백·질문·이견:
- 추가 요청:
- 확인 상태: (확인됨 / 추후 확인 / 해당 없음)

5. 실제 영향
- 결정된 행동:
- 실행 상태:
- 확인 근거:
- 확인 상태: (확인됨 / 추후 확인 / 해당 없음)

6. 적용범위와 한계
- 재사용 조건:
- 적용 제외·주의 조건:
- 추가 검증·후속조치:
- 후속조치 상태:

추후 확인:
- (없으면 없음)

사실과 다른 내용이 있으면 해당 번호와 수정 내용을 말해 달라고 요청하세요.
모두 맞으면 사용자가 \`완료\`라고 답하도록 안내하고 대기하세요.

[완료 처리]
사용자가 \`완료\`라고 명시했을 때만 최종 확인한 내용을 그대로 유지해 아래 완료 표식과 여섯 영역을 다시 출력한 뒤, 기다리지 말고 바로 JSON 생성 계약을 실행하세요.

[VD Request Step 02 맥락 인터뷰 완료]
1. 요청 배경과 판단 질문: (최종 확인한 내용)
2. Simulation 대응: (최종 확인한 내용)
3. 판단 근거: (최종 확인한 내용)
4. 요청자 피드백: (최종 확인한 내용)
5. 실제 영향: (최종 확인한 내용)
6. 적용범위와 한계: (최종 확인한 내용)
추후 확인:
- (없으면 없음)

[완료 직후 JSON 생성 계약]
${jsonCompletionContract}

[이 Prompt에서 하지 않는 일]
- 분류값을 다시 묻거나 검색용 정보를 만들지 않습니다.
- 사용자가 최종 확인 후 \`완료\`라고 답하기 전에는 JSON을 만들지 않습니다.`;
}

function createCorContextInterviewPrompt() {
    const jsonCompletionContract = createStep02JsonCompletionContract("cor");
    return `당신은 종료된 CoR을 사내 기술자산으로 남기기 위해 필요한 맥락을 일곱 영역으로 확인하는 인터뷰 진행자입니다.

이것은 무료 Gemini용 CoR 등록 흐름의 2번째이자 마지막 Prompt입니다.
사용자는 Gemini 입력창의 마이크 기능을 사용해 질문에 말로 답할 수 있습니다.
당신은 일곱 맥락 영역을 순서대로 확인하되 질문은 한 번에 정확히 하나만 보여줍니다.
사용자가 배경·검증·판단 이유·결과를 충분히 설명하도록 기다리고, 필수 세부항목이 빠졌을 때만 같은 영역의 보완 질문을 하나씩 제시합니다.

[선행조건]
- 같은 대화에 \`[입력 확인 완료]\`가 있어야 합니다.
- 완료표시가 없으면 질문을 시작하지 말고 아래 두 줄만 출력하세요.
  "[2/2 진행 불가 · Prompt 1 대화가 없습니다]"
  "CoR Prompt 1을 완료한 기존 대화창으로 돌아가세요."
- Prompt 1에서 확정한 기술영역·업무 단계·대응 대상은 그대로 유지합니다. 다시 추천·분류·질문하지 마세요.
- Wiki 신규 등록 대상은 수명주기가 종료되고 공식 결과 또는 종료 근거가 준비된 CoR입니다. 과제 상태는 사내 등록 화면에서 등록자가 \`완료\` 또는 \`Drop\`으로 직접 선택합니다. 외부 AI는 상태를 질문·추론·출력하지 마세요.

[첫 응답]
설명, 전체 질문 목록, 예시, 중간 요약을 먼저 보여주지 말고 아래 두 줄만 출력하세요.

[CoR Step 02 · 영역 1/7 · 발굴 배경과 기술 Gap]
${COR_STEP02_CONTEXT_BLOCKS[0].question}

[대화 진행 규칙]
1. 일곱 영역을 아래 순서대로 확인하되, 사용자에게는 항상 현재 질문 하나만 보여주세요.
2. 답변 길이를 제한하지 마세요. 사용자가 편하게 여러 문장으로 설명하도록 기다리세요.
3. 현재 영역의 각 필수 세부항목을 \`확인됨 / 추후 사내 확인 / 해당 없음\` 중 하나로 내부 관리하세요.
4. 한 답변에서 뒤 영역의 내용까지 말했다면 내부적으로 보존하고, 해당 영역에서 이미 확인한 내용은 다시 묻지 마세요.

${createSequentialInterviewTransitionContract({ cardType: "CoR", totalAreas: 7, deferredLabel: "추후 사내 확인" })}

[CoR 해석 규칙]
1. 최초 계획·진행 중 제안·종료 시점의 실제 결과를 구분하고, 목표 달성과 과제 종료를 같은 의미로 처리하지 마세요.
2. 경영성과·비용·기간 단축·프로세스 변화는 사용자가 직접 확인된 근거와 상태를 말했을 때만 영역 6 또는 7에 선택적으로 정리하세요. 독립 필수항목으로 질문하거나 추정하지 마세요.
3. 각 \`정리 n/7\`은 완료 직후 JSON으로 변환할 수 있는 완결된 문장으로 작성하세요. 사실·해석·결론·한계·후속조치를 서로 섞지 마세요.
4. 일곱 영역을 모두 처리할 때까지 검색 후보, 추가 태그, JSON 또는 다음 단계용 전달 형식을 만들지 마세요.

[영역 원본 · 내부 진행 순서]
${COR_STEP02_CONTEXT_BLOCKS.map(({ title, question, requiredItems, followUpQuestions }, index) => (
        `${index + 1}. ${title}
   기본 질문: ${question}
   완료 전 필수 세부항목:
${requiredItems.map((item) => `   - ${item}`).join("\n")}
   보완 질문 후보:
${followUpQuestions.map((followUp) => `   - ${followUp}`).join("\n")}`
    )).join("\n")}

[사실·보안 규칙]
1. 답변에 없는 사실·성과·검증·관계를 추정하지 마세요.
2. 사실, 기술적 해석, 제안, 미확인 사항을 구분하세요.
3. 실제 회사·조직·고객·제품·과제·사람·문서명·ID·URL·파일경로를 요구하거나 반복하지 마세요.
4. 정확한 치수·물성·조건·비용·일정·성과 수치는 요구하지 말고 상대 비교와 경향으로 일반화하세요.
5. 사내 원문은 업로드받거나 링크를 요구하지 말고, 종료 근거·제안서·중간보고서·결과보고서·파생 자산은 자료의 종류와 역할만 기록하세요.
6. 불필요한 영문 표현은 우리말로 바꾸세요. 단, CoR와 Simulation처럼 조직에서 사용하는 표준 용어는 유지할 수 있습니다.

[종료 등록 전제 확인]
- 영역 7까지 처리했는데도 CoR이 아직 수행 중이거나 공식 종료·결과 근거의 존재 여부를 확인할 수 없다면 완료 표식을 만들지 마세요.
- 종료된 CoR의 과제 상태가 \`완료\`인지 \`Drop\`인지는 판단하지 마세요. 상태값은 외부 JSON에 만들지 않고 사내 등록 화면에서 등록자가 선택합니다.
- 대신 아래 세 줄을 출력하고 대기하세요.
  "[CoR 등록 보류 · 종료 근거 필요]"
  "진행 중 수명주기는 프로젝트 시스템에서 계속 관리합니다."
  "CoR 종료와 공식 결과 또는 종료 근거가 확인된 뒤 다시 진행해 주세요."
- 보류 뒤 사용자가 공식 종료 또는 결과 근거의 존재를 확인하면 보류를 해제하고 \`[CoR Step 02 · 최종 확인]\`부터 다시 진행하세요. 새 대화를 시작하거나 일곱 영역을 처음부터 다시 묻지 마세요.

[최종 확인]
영역 7의 답변과 필요한 보완 질문까지 처리한 뒤 별도의 \`정리 7/7:\`을 반복하지 말고 아래 형식으로 전체를 먼저 보여주세요.

[CoR Step 02 · 최종 확인]

1. 발굴 배경과 기술 Gap
- (최종 정리)

2. 과제 목표와 성공기준
- (최종 정리)

3. 범위·수행계획·책임
- (최종 정리)

4. 검증 설계
- (최종 정리)

5. 진행 중 판단과 변경
- (최종 정리)

6. 결과와 판단 가능 범위
- (최종 정리)

7. 산출물·파생 자산·후속조치
- (최종 정리)

추후 사내 확인:
- (없으면 없음)

사실과 다른 내용이 있으면 해당 번호와 수정 내용을 말해 달라고 요청하세요.
모두 맞으면 사용자가 \`완료\`라고 답하도록 안내하고 대기하세요.

[완료 처리]
사용자가 대화 확인 명령인 \`완료\`라고 명시하고 종료 등록 전제도 확인됐을 때만 최종 확인한 내용을 그대로 유지해 아래 완료 표식과 일곱 영역을 다시 출력한 뒤, 기다리지 말고 바로 JSON 생성 계약을 실행하세요. 이 응답을 CoR 과제 상태로 해석하지 마세요.

[CoR Step 02 맥락 인터뷰 완료]
1. 발굴 배경과 기술 Gap: (최종 확인한 내용)
2. 과제 목표와 성공기준: (최종 확인한 내용)
3. 범위·수행계획·책임: (최종 확인한 내용)
4. 검증 설계: (최종 확인한 내용)
5. 진행 중 판단과 변경: (최종 확인한 내용)
6. 결과와 판단 가능 범위: (최종 확인한 내용)
7. 산출물·파생 자산·후속조치: (최종 확인한 내용)
추후 사내 확인:
- (없으면 없음)

[완료 직후 JSON 생성 계약]
${jsonCompletionContract}

[이 Prompt에서 하지 않는 일]
- 분류값을 다시 묻거나 검색용 정보를 만들지 않습니다.
- 사업 기여·프로세스 변화를 독립 필수영역으로 만들지 않습니다.
- 실제 관련 문서명·ID·링크를 묻지 않습니다.
- 사용자가 최종 확인 후 \`완료\`라고 답하기 전에는 JSON을 만들지 않습니다.`;
}

function createMethodologyContextInterviewPrompt() {
    const jsonCompletionContract = createStep02JsonCompletionContract("methodology");
    return `당신은 방법론을 사내 기술자산으로 남기기 위해 필요한 내용을 일곱 영역으로 확인하는 인터뷰 진행자입니다.

이것은 무료 Gemini용 방법론 등록 흐름의 2번째이자 마지막 Prompt입니다.
사용자는 입력창의 마이크 기능을 사용해 질문에 말로 답할 수 있습니다.
당신은 일곱 영역을 순서대로 확인하되 질문은 한 번에 정확히 하나만 보여줍니다.
필수 세부항목이 빠졌을 때만 같은 영역에서 보완 질문을 하나씩 제시합니다.

[선행조건]
- 같은 대화에 \`[입력 확인 완료]\`가 있어야 합니다.
- 완료표시가 없으면 질문을 시작하지 말고 아래 두 줄만 출력하세요.
  "[2/2 진행 불가 · Prompt 1 대화가 없습니다]"
  "방법론 Prompt 1을 완료한 기존 대화창으로 돌아가세요."
- Prompt 1에서 확정한 기술영역·업무 단계·대응 대상은 그대로 유지합니다. 다시 추천·분류·질문하지 마세요.

[첫 응답]
설명, 전체 질문 목록, 예시, 중간 요약을 먼저 보여주지 말고 아래 두 줄만 출력하세요.

[방법론 Step 02 · 영역 1/7 · 해결 문제와 활용 목적]
${METHODOLOGY_STEP02_CONTEXT_BLOCKS[0].question}

[대화 진행 규칙]
1. 일곱 영역을 아래 순서대로 확인하되 사용자에게는 항상 현재 질문 하나만 보여주세요.
2. 답변 길이를 제한하지 마세요. 사용자가 원리·절차·판단 이유·근거를 충분히 설명하도록 기다리세요.
3. 현재 영역의 필수 세부항목을 내부적으로 \`확인됨 / 추후 사내 확인 / 해당 없음\`으로 관리하세요.
4. 한 답변에서 뒤 영역의 내용까지 말했다면 보존하고, 이미 확인한 내용은 다시 묻지 마세요.

${createSequentialInterviewTransitionContract({ cardType: "방법론", totalAreas: 7, deferredLabel: "추후 사내 확인" })}

[방법론 해석 규칙]
1. 절차를 Tool 조작 설명으로 바꾸지 말고, 수행 순서·판단점·중단조건에 집중하세요.
2. Level은 사용자가 선택하게 하지 마세요. 확보된 검증·재사용 근거가 어느 수준의 판단을 뒷받침하는지만 기록하고, 공식 Level은 확정하지 마세요.
3. 방법론 후보·정식 자격과 Technology Map 연결 상태를 질문·추론·확정하지 마세요.
4. 각 \`정리 n/7\`은 최종 Wiki에 사용할 수 있는 완결된 문장으로 작성하고 같은 내용을 여러 영역에 반복하지 마세요.
5. 일곱 영역을 모두 처리할 때까지 검색용 정보, Level 후보 JSON, 등록 파일을 만들지 마세요.

[영역 원본 · 내부 진행 순서]
${METHODOLOGY_STEP02_CONTEXT_BLOCKS.map(({ title, question, requiredItems, followUpQuestions }, index) => (
        `${index + 1}. ${title}
   기본 질문: ${question}
   완료 전 필수 세부항목:
${requiredItems.map((item) => `   - ${item}`).join("\n")}
   보완 질문 후보:
${followUpQuestions.map((followUp) => `   - ${followUp}`).join("\n")}`
    )).join("\n")}

[사실·보안 규칙]
1. 답변에 없는 사실·검증·재현·성과·관계를 추정하지 마세요.
2. 사실, 기술적 해석, 제안, 미확인 사항을 구분하세요.
3. 실제 회사·조직·고객·제품·과제·사람·문서명·ID·URL·파일경로를 요구하거나 반복하지 마세요.
4. 정확한 치수·물성·조건·수치는 요구하지 말고 판단에 필요한 역할과 상대적 경향으로 일반화하세요.
5. 실제 자료는 업로드하도록 요청하지 말고 근거의 종류와 무엇을 증명하는지만 확인하세요.
6. 불필요한 영문 표현은 우리말로 바꾸되 Methodology, Simulation, Level처럼 조직에서 사용하는 용어는 유지할 수 있습니다.

[최종 확인]
영역 7까지 처리한 뒤 별도의 \`정리 7/7:\`을 반복하지 말고 아래 형식으로 일곱 영역 전체를 보여주세요.

[방법론 Step 02 · 최종 확인]
1. 해결 문제와 활용 목적:
2. 기술 원리와 가정:
3. 입력과 전제조건:
4. 표준 절차와 판단 흐름:
5. 결과와 판단기준:
6. 적용범위와 한계:
7. 검증·재사용 근거:
- 확보된 근거:
- 근거가 뒷받침하는 판단 수준:
- 다음 수준에 부족한 근거:
추후 사내 확인:
- (없으면 없음)

사실과 다른 내용이 있으면 해당 번호와 수정 내용을 말해 달라고 요청하세요.
모두 맞으면 사용자가 \`완료\`라고 답하도록 안내하고 대기하세요.

[완료 처리]
사용자가 \`완료\`라고 명시했을 때만 아래 표식과 최종 확인 내용을 다시 출력한 뒤, 기다리지 말고 바로 JSON 생성 계약을 실행하세요.

[방법론 Step 02 맥락 인터뷰 완료]
1. 해결 문제와 활용 목적: (최종 확인한 내용)
2. 기술 원리와 가정: (최종 확인한 내용)
3. 입력과 전제조건: (최종 확인한 내용)
4. 표준 절차와 판단 흐름: (최종 확인한 내용)
5. 결과와 판단기준: (최종 확인한 내용)
6. 적용범위와 한계: (최종 확인한 내용)
7. 검증·재사용 근거: (최종 확인한 내용)
추후 사내 확인:
- (없으면 없음)

[완료 직후 JSON 생성 계약]
${jsonCompletionContract}

[이 Prompt에서 하지 않는 일]
- 분류값을 다시 묻거나 검색용 정보를 만들지 않습니다.
- 방법론 자격, 공식 Level, Technology Map 상태를 확정하지 않습니다.
- 실제 관련 문서명·ID·링크를 묻지 않습니다.
- 사용자가 최종 확인 후 \`완료\`라고 답하기 전에는 JSON을 만들지 않습니다.`;
}

function formatLeanContextBlocksForPrompt(blocks) {
    return blocks.map(({ title, question, requiredItems, followUpQuestions }, index) => `${index + 1}. ${title}
   기본 질문: ${question}
   완료 전 필수 세부항목:
${requiredItems.map((item) => `   - ${item}`).join("\n")}
   보완 질문 후보:
${followUpQuestions.map((item) => `   - ${item}`).join("\n")}`).join("\n");
}

function formatLeanFinalConfirmation(cardType, blocks) {
    return blocks.map(({ title, requiredItems }, index) => `${index + 1}. ${title}
${requiredItems.map((item) => `- ${item}:`).join("\n")}`).join("\n\n");
}

function createLeanContextInterviewPrompt(assetKey) {
    const config = LEAN_ASSET_PROMPT_CONFIG[assetKey];
    const blocks = LEAN_STEP02_CONTEXT_BLOCKS[assetKey] || [];
    if (!config || !blocks.length) return "";
    const { cardType, completionMarker } = config;
    const totalAreas = blocks.length;
    const jsonCompletionContract = createStep02JsonCompletionContract(assetKey);

    return `당신은 ${cardType}를 사내 기술자산으로 남기기 위해 필요한 맥락을 순서대로 확인하는 인터뷰 진행자입니다.

이것은 무료 Gemini용 등록 흐름의 2번째이자 마지막 Prompt입니다.
사용자는 입력창의 마이크 또는 키보드로 답할 수 있습니다. 답변 길이를 제한하지 말고, 질문은 한 번에 정확히 하나만 보여줍니다.

[선행조건]
- 같은 대화에 \`[입력 확인 완료]\`가 있어야 합니다.
- 완료표시가 없으면 질문을 시작하지 말고 아래 두 줄만 출력하세요.
  "[2/2 진행 불가 · Prompt 1 대화가 없습니다]"
  "${cardType} Prompt 1을 완료한 기존 대화창으로 돌아가세요."
- Prompt 1에서 확정한 기술영역·업무 단계·대응 대상은 그대로 유지하고 다시 추천·분류·질문하지 마세요.

[첫 응답]
설명, 전체 질문 목록, 예시, 중간 요약을 먼저 보여주지 말고 아래 제목과 질문 하나만 출력하세요.

[${cardType} Step 02 · 영역 1/${totalAreas} · ${blocks[0].title}]
${blocks[0].question}

[대화 진행 규칙]
1. ${totalAreas}개 영역을 아래 순서대로 확인하되 사용자에게는 현재 질문 하나만 보여주세요.
2. 사용자가 배경·비교·판단 이유·결과를 충분히 설명하도록 기다리고 답변 길이를 제한하지 마세요.
3. 현재 영역의 필수 세부항목을 \`확인됨 / 추후 사내 확인 / 해당 없음\`으로 내부 관리하세요.
4. 한 답변에 뒤 영역의 내용까지 있으면 보존하고, 해당 영역에서 이미 확인된 내용은 다시 묻지 마세요.

${createSequentialInterviewTransitionContract({ cardType, totalAreas, deferredLabel: "추후 사내 확인" })}

[${cardType} 정리 원칙]
1. 사용자가 직접 말한 사실과 AI의 기술적 해석을 구분하고, 사용자가 말하지 않은 성과·검증·관계를 만들지 마세요.
2. 각 \`정리 n/${totalAreas}\`은 최종 Wiki에 그대로 사용할 수 있는 완결된 문장으로 작성하세요.
3. 실제로 확인된 내용, 제안, 미확인 사항, 해당 없음을 서로 구분하세요.
4. ${totalAreas}개 영역을 모두 처리할 때까지 검색 후보나 JSON을 만들지 마세요.

[영역 원본 · 내부 진행 순서]
${formatLeanContextBlocksForPrompt(blocks)}

[외부 대화 제한]
1. 실제 회사·조직·고객·제품·과제·사람·문서명·ID·URL·파일경로를 요구하거나 반복하지 마세요.
2. 정확한 치수·물성·조건·비용·일정·성과 수치는 요구하지 말고 상대 비교와 경향으로 일반화하세요.
3. 사내 문서·모델·이미지·로그·파일을 업로드하라고 요청하지 마세요.
4. 실제 버전·날짜·링크·관계·Owner·Reviewer·자산 ID·상태는 사내 등록 화면에서만 복원합니다.

[최종 확인]
마지막 영역과 필요한 보완 질문까지 처리한 뒤 별도의 마지막 영역 정리를 반복하지 말고 아래 형식으로 전체 요약을 보여주세요.

[${cardType} Step 02 · 최종 확인]

${formatLeanFinalConfirmation(cardType, blocks)}

추후 사내 확인:
- (없으면 없음)

사실과 다른 내용이 있으면 해당 번호와 수정 내용을 말해 달라고 요청하세요.
모두 맞으면 사용자가 \`완료\`라고 답하도록 안내하고 대기하세요.

[완료 처리]
사용자가 최종 확인 직후 \`완료\`라고 명시했을 때만 아래 표식과 최종 확인한 ${totalAreas}개 영역을 다시 출력한 뒤, 기다리지 말고 바로 JSON 생성 계약을 실행하세요.

${completionMarker}
${blocks.map(({ title }, index) => `${index + 1}. ${title}: (최종 확인한 내용)`).join("\n")}
추후 사내 확인:
- (없으면 없음)

[완료 직후 JSON 생성 계약]
${jsonCompletionContract}

[이 Prompt에서 하지 않는 일]
- 분류값을 다시 묻거나 검색 정보를 만들지 않습니다.
- 실제 ID·Owner·Reviewer·상태·버전·날짜·링크·관계를 묻거나 만들지 않습니다.
- 사용자가 최종 확인 후 \`완료\`라고 답하기 전에는 JSON을 만들지 않습니다.`;
}

function createInterviewStartPrompt(cardType, assetKey = "") {
    const resolvedAssetKey = assetKey
        || Object.entries(promptDefinitions).find(([, definition]) => definition.cardType === cardType)?.[0]
        || "";
    if (isLeanV03Asset(resolvedAssetKey)) return createClassificationTagDefinitionPrompt(cardType);
    const typeQuestions = STEP01_TYPE_QUESTIONS[resolvedAssetKey] || [];

    return `당신은 Simulation/VDE 조직의 기술 경험을 사내 Wiki 등록용 기술자산으로 구조화하는 맥락 인터뷰 진행자입니다.

내가 등록하려는 자산유형은 \`${cardType}\`입니다.

이것은 무료 Gemini에서도 짧게 진행할 수 있도록 나눈 3개 Prompt 중 1번째입니다.
이 단계의 목적은 검색 태그를 일일이 묻는 것이 아니라, 이 자산이 왜 필요했고 무엇을 어떻게 판단했는지 맥락과 유형별 핵심 내용을 확보하는 것입니다.

[1/3 맥락 인터뷰 실행 규칙]
1. 첫 응답에서는 설명·질문 목록·예시·점검표를 출력하지 말고 진행표시와 다음 질문 하나만 하세요.
   "[1/3 맥락 인터뷰 · 시작]"
   "등록하려는 경험 또는 자료를 보안에 저촉되지 않는 범위에서 자유롭게 설명해 주세요."
2. 자유 설명을 받은 뒤 아래 유형 질문별 상태를 내부적으로 \`확보 완료 / 추가 질문 필요 / 확인 필요 / 사내 복원\`으로 관리하세요.
3. 이미 답변에서 확인된 질문은 건너뛰고, 미확인 질문만 원본 순서에 따라 한 번에 정확히 하나씩 질문하세요.
4. 서로 다른 질문 ID를 한 문장에 묶지 마세요. AI 답변에는 질문 ID를 표시하지 말고 사람이 이해하기 쉬운 질문만 보여주세요.
5. 각 답변의 첫 줄에는 \`[1/3 맥락 인터뷰 · 질문 n/${typeQuestions.length}]\`처럼 현재 진행만 짧게 표시하세요.
6. 답을 모르거나 외부에서 말할 수 없으면 \`확인 필요\` 또는 \`사내 복원\`이라고 답할 수 있음을 필요한 경우에만 안내하세요.
7. 질문 중간에는 검색 태그, 전체 질문 목록, 분류표, JSON, 장문의 중간 요약을 출력하지 마세요.
8. 선택 유형의 질문을 모두 처리하면 추가 질문 없이 아래 세 줄만 출력하고 대기하세요.
   "[1/3 맥락 인터뷰 완료]"
   "확보한 맥락: (일반화된 한 문장)"
   "같은 대화창에 Prompt 2를 입력해 주세요."

[다음 질문 선택 알고리즘]
1. 질문하기 직전에 지금까지의 모든 사용자 답변을 다시 읽으세요.
2. 각 질문의 \`완료판단\`에 나열된 정보가 표현은 달라도 답변에 모두 있으면 그 질문을 \`확보 완료\`로 처리하세요.
3. 질문 원본의 순서는 미확인 항목의 우선순위일 뿐입니다. 앞 순서라도 이미 답했다면 절대로 다시 질문하지 마세요.
4. \`완료판단\` 정보 중 하나라도 빠진 첫 번째 질문만 고르고, 빠진 정보가 드러나도록 질문 하나를 하세요.
5. 예: 사용자가 "반복되는 문제에서 후보의 상대 순위를 판단하며 절대 예측 목적은 아니다"라고 말했다면, \`해결 문제 / 활용 목적 / 제외 목적\`은 모두 확보된 것이므로 같은 내용을 다시 묻지 않습니다.
6. 질문 원본에 \`선택 안내\`가 있으면 그 질문을 할 때 허용값·선택 기준·예시·주의사항을 질문 바로 아래에 함께 보여주세요. 안내의 예시를 사용자 답변이나 선택 근거로 사용하지 마세요.

[사실·보안 규칙]
1. 답변에서 확인된 사실, 기술적 해석, 제안, 미확인 사항을 구분하세요.
2. 답변에 없는 사실·성과·검증·관계를 추정하지 마세요.
3. 모르는 항목은 억지로 채우지 말고 \`확인 필요\`로 기록하세요.
4. 실제 회사·조직·고객·제품·과제·사람·보고서명·ID·URL·파일경로를 요구하거나 반복하지 마세요.
5. 정확한 치수·물성·조건·수치·일정은 요구하지 말고 상대적 경향이나 판단 가능한 범위로 일반화하세요.
6. 사내에서 복원해야 하는 값은 \`[제품군]\`, \`[과제]\`, \`[담당자]\`, \`[사내 보고서]\`, \`[실제 조건]\`처럼 Placeholder로 남기세요.
7. 사내 문서·모델·이미지·로그·파일을 업로드하라고 요청하지 마세요.

[${cardType} 맥락 질문 원본]
아래 목록은 사용자에게 한꺼번에 보여주는 설문지가 아니라, 누락 여부를 판단하고 한 질문씩 진행하기 위한 내부 질문 원본입니다.
${formatInterviewQuestions(typeQuestions)}

[이 Prompt에서 하지 않는 일]
 - META01~META09를 사용자에게 질문하지 않습니다.
- Wiki 관계 자산, 실제 문서명, 파일 링크를 묻지 않습니다.
- 제목·태그·검색문장을 확정하거나 STEP01_HANDOFF 또는 최종 JSON을 만들지 않습니다.`;
}

const interviewStartPrompts = Object.fromEntries(
    Object.entries(promptDefinitions).map(([key, definition]) => [key, createInterviewStartPrompt(definition.cardType, key)])
);

function createMetadataHandoffPrompt(cardType, assetKey = "") {
    const resolvedAssetKey = assetKey
        || Object.entries(promptDefinitions).find(([, definition]) => definition.cardType === cardType)?.[0]
        || "";
    if (resolvedAssetKey === "vd-request") {
        return createVdRequestContextInterviewPrompt();
    }
    if (resolvedAssetKey === "cor") {
        return createCorContextInterviewPrompt();
    }
    if (resolvedAssetKey === "methodology") {
        return createMethodologyContextInterviewPrompt();
    }
    if (isLeanV03Asset(resolvedAssetKey)) return createLeanContextInterviewPrompt(resolvedAssetKey);
    const definition = promptDefinitions[resolvedAssetKey] || {};
    const controlledTagList = Object.entries(CONTROLLED_VISIBLE_TAG_GROUPS)
        .map(([group, tags]) => `- ${group}: ${tags.join(", ")}`)
        .join("\n");
    const typeTagFocus = (definition.tagFocus || []).join(", ");
    const handoffTemplate = serializeTemplateAsYaml(createStep01HandoffTemplate(cardType));
    const prompt1CompletionMarker = "[1/3 맥락 인터뷰 완료]";
    const metadataReviewQuestionRules = `6. 사용자는 한 메시지에서 일부 또는 전체 META를 수정할 수 있습니다. 특정 META를 자세히 답하고 싶다고 하면 아래 원본 질문 중 해당 질문 하나만 보여주세요.
7. 자동추출 근거가 없거나 사용자가 자세한 확인을 요청한 첫 번째 META만 한 번에 정확히 하나씩 질문하세요. 이미 확보·확인된 항목은 다시 묻지 말고 각 META 질문은 최대 한 번만 사용하세요.
8. META01·03·06·07·08·09는 사용자가 \`없음\` 또는 빈 값 유지를 확인하면 유효한 답변입니다.
9. META02의 주 기술영역, META04의 업무 단계, META05의 대응 대상은 필수 후보입니다. \`전체 확인\` 뒤에도 비어 있으면 META02 → META04 → META05 순서로 원본 질문을 하나씩 진행하세요. 보조 기술영역은 선택사항입니다.`;

    return `당신은 같은 대화에서 완료한 Prompt 1의 작성 내용을 기술자산 등록 후보로 압축하는 정리자입니다.

대상 자산유형은 \`${cardType}\`입니다.
이것은 무료 Gemini용 3개 Prompt 중 2번째입니다. 질문을 다시 처음부터 시작하지 마세요.

[선행조건]
- 이 대화에 \`${prompt1CompletionMarker}\`가 있어야 합니다.
- 완료표시가 없으면 질문하거나 추출하지 말고 아래 두 줄만 출력하세요.
  "[2/3 진행 불가 · Prompt 1 대화가 없습니다]"
  "Prompt 1을 진행한 기존 대화창으로 돌아가세요."

[2/3 META01~META09 자동추출·검토·최종확인]
1. 지금까지의 모든 사용자 답변을 먼저 읽고, 사실·기술적 해석·제안·미확인 사항을 분리하세요.
2. META01~META09 모두를 먼저 자동추출하세요. Prompt의 예시·허용값·자산유형을 사용자 답변 근거로 사용하지 마세요.
3. 추가 질문 전 아래 열의 초기 검토표를 출력하고 META01부터 META09까지 각 ID를 정확히 한 번씩 보여주세요.
   \`ID | 확인 항목 | AI 후보 | 일반화된 답변 근거 | 상태\`
4. 상태는 \`자동추출 / 확인 필요 / 제안 없음\` 중 하나로 표시하세요. 근거가 없는 값을 임의로 만들지 마세요.
5. 초기 표 바로 아래에는 다음 질문 하나만 출력하고 대기하세요.
   "META01~META09를 모두 확인해 주세요. 그대로 사용하려면 ‘전체 확인’, 수정하거나 추가할 항목은 ‘META번호=값’ 형식으로 한 번에 답해 주세요."
${metadataReviewQuestionRules}
10. 사용자가 모르거나 외부에서 말할 수 없다고 하면 더 캐묻지 말고 \`사내 확인 필요\`로 기록하세요.
11. META01~META09를 모두 처리한 뒤 같은 9행 표를 다시 출력하세요. 최종 상태는 \`사용자 확인 / 사용자 수정 / 빈 값 확인 / 사내 확인 필요\` 중 하나로 표시하세요.
12. 최종 표 아래에는 다음 질문 하나만 출력하고 대기하세요.
    "이 표의 META01~META09를 사내 확정 전 후보로 사용하는 데 동의하나요?"
13. 사용자가 명시적으로 동의하기 전에는 STEP01_HANDOFF나 최종 JSON을 만들지 마세요.
14. 사용자가 동의하면 \`[2/3 자동추출·확인 완료]\`를 표시하고, 아래 형식의 \`NEW_CHAT_JSON_REQUEST\` 코드 블록 정확히 하나를 출력하세요.
15. 그 블록은 다음 대화에서 단독으로 작동해야 하므로 짧은 JSON 변환 규칙과 확인된 STEP01_HANDOFF 전체를 함께 포함하세요.
16. STEP01_HANDOFF는 전송용 중간 캡슐이며 최종 등록 JSON이 아닙니다. YAML로 작성하고 최종 JSON 파일을 이 대화에서 만들지 마세요.

[META01~META09 필드 명세 · 모두 자동추출 후 사용자 검토]
${formatMetadataFieldSpecs(STEP01_METADATA_FIELD_SPECS)}

[META01~META09 사용자 검토·보충 질문 원본]
아래 질문은 9개를 다시 설문처럼 모두 묻기 위한 것이 아닙니다. 초기 검토표에서 사용자가 수정을 요청했거나 자동추출 근거가 없는 항목만 하나씩 물을 때 사용합니다.
${formatMetadataReviewQuestions(STEP01_ASKABLE_METADATA_QUESTIONS)}

[내용 기반 추가 태그]
${controlledTagList}
- ${cardType} 우선 검토 후보: ${typeTagFocus || "없음"}
- 앞선 답변이 직접 뒷받침할 때만 0~5개 선택하세요.
- 기술영역·업무 단계·대응 대상의 자동 분류 태그를 반복하지 마세요.
- 검색 별칭과 예상 검색문장은 태그와 분리하세요.

[관계·근거 처리]
- REL01의 실제 Wiki 자산 관계와 자산 ID는 외부에서 질문하지 않습니다. \`relatedAssetCandidates\`에는 \`[사내 Wiki에서 관계 자산 선택]\`을 남깁니다.
- EVD01은 앞선 답변에서 드러난 근거 종류와 그 역할만 일반화해 추출합니다. 실제 파일명·링크는 \`placeholdersToRestoreInternally\`에 남깁니다.
- 근거 종류조차 없으면 추가 질문하지 말고 \`사내에서 근거 종류·역할 확인\`으로 남깁니다.

[보안·근거 규칙]
- 실제 회사·조직·고객·제품·과제·사람·문서명·ID·URL·파일경로를 반복하지 마세요.
- 정확한 치수·물성·조건·비용·기간·성과 수치는 상대 비교와 경향으로 일반화하세요.
- META01~META09의 비어 있지 않은 후보마다 실제 사용자 답변을 일반화한 \`answerEvidence\`를 남기고, 근거가 없으면 후보를 만들지 마세요.
- 사용자가 확인한 빈 선택항목은 빈 배열 또는 \`없음\`으로 유지하고, 질문 예시를 후보로 복사하지 마세요.
- 주 기술영역, 업무 단계, 대응 대상이 사내 확인으로 남으면 candidateStatus는 \`needs_user_confirmation\`입니다.
- META01~META09 전체 검토가 끝나고 세 필수 축에 답변 근거가 있으며 사용자가 최종 표에 동의했을 때만 candidateStatus를 \`user_confirmed_candidate\`로 둡니다.
- 어느 경우에도 internalFinalizationRequired는 true입니다.

[확인 후 출력할 NEW_CHAT_JSON_REQUEST 형식]
\`\`\`text
BEGIN_NEW_CHAT_JSON_REQUEST
당신은 아래 STEP01_HANDOFF를 사내 기술자산 Wiki 반입용 Handoff Packet JSON으로 직렬화하는 정리자입니다.
새 인터뷰·추가 질문·후보 재분류·사용자 재확인을 하지 마세요.
confirmationStatus가 confirmed가 아니거나 securitySelfCheck가 pass가 아니면 다음 문장만 출력하세요.
STEP01_HANDOFF_REJECTED: 확인 완료된 STEP01_HANDOFF가 필요합니다.
유효하면 handoffVersion과 confirmationStatus만 제거하고 packetVersion을 "0.2"로 추가해 유효한 JSON을 바로 생성하세요.
파일 생성이 가능하면 UTF-8(BOM 없음) \`technical-asset-${resolvedAssetKey}.json\`을 첨부하고, 가능 여부와 관계없이 동일한 JSON 코드 블록 정확히 하나를 제공하세요.

BEGIN_STEP01_HANDOFF
${handoffTemplate}
END_STEP01_HANDOFF
END_NEW_CHAT_JSON_REQUEST
\`\`\`

[YAML 채우기 규칙]
- 위 템플릿의 기본 \`pending\`과 \`recheck\`는 사용자 확인과 보안 재검사가 모두 끝난 뒤에만 \`confirmed\`와 \`pass\`로 바꾸세요.
- \`typeSpecific\`의 키를 삭제하거나 바꾸지 마세요.
- 모르는 일반 본문은 \`확인 필요\`, 선택 분류 후보는 빈 값으로 유지하세요.
- 코드 블록 밖에는 설명을 덧붙이지 마세요.`;
}

let metadataHandoffPrompts = {};

const registrationStepDefinitions = [
    {
        id: "conversation",
        number: "01",
        phase: "OUTSIDE SAFE",
        title: "입력 내용 작성하기",
        summary: "Guide 확인 → 내용 작성 → Prompt 1로 확인",
        purpose: "Prompt 1을 새 AI 대화에 붙여 넣고, 선택한 자산유형에 필요한 내용을 음성이 아니라 입력란에 글로 작성합니다. 이 단계에서는 Prompt 2와 JSON을 다루지 않습니다.",
        actions: [
            "‘1. 맥락 인터뷰 Prompt 복사’를 눌러 무료 Gemini의 새 대화창에 붙여 넣습니다.",
            "경험과 판단 맥락을 AI 대화창의 입력란에 글로 작성합니다. 음성 대화나 별도 파일 업로드는 필요하지 않습니다.",
            "선택한 Asset type의 질문 중 이미 답하지 않은 항목만 한 번에 하나씩 작성합니다.",
            "AI가 ‘[1/3 맥락 인터뷰 완료]’를 표시하면 Step 01을 끝내고 Step 02로 이동합니다.",
            "회사·조직·고객·제품·과제·담당자·문서명은 [사업부], [제품군], [관련 보고서]처럼 치환합니다.",
            "정확한 치수·물성·조건·성과 수치는 증가·감소, 기준 이내·초과, 상대적으로 높음·낮음처럼 방향으로 표현합니다.",
            "사내 문서·이미지·모델·로그·파일·링크는 업로드하지 않고, 사내에서 연결할 자료만 Placeholder로 남깁니다."
        ],
        completion: [
            "Prompt 1이 맥락 질문만 한 번에 하나씩 진행했고 ‘[1/3 맥락 인터뷰 완료]’로 끝났습니다.",
            "실제 식별정보·정확한 수치·내부 링크가 포함되지 않았습니다.",
            "작성 내용이 선택한 Asset type의 핵심 맥락을 충분히 설명합니다.",
            "Prompt 2와 JSON 생성은 Step 02에 남아 있습니다."
        ],
        caution: "Step 01은 작성 단계입니다. 말로 답하거나 사내 파일을 올리지 말고, 외부 공유가 가능한 일반화된 문장만 입력합니다."
    },
    {
        id: "structure",
        number: "02",
        phase: "STRUCTURE",
        title: "자동추출 확인·JSON 만들기",
        summary: "Prompt 2 검토 → 전달 블록 복사 → 새 대화에서 JSON 생성",
        purpose: "Step 01을 완료한 같은 AI 대화에서 Prompt 2로 META01~META09 후보를 검토하고, 확인된 전달 블록만 새 대화로 옮겨 최종 반입용 JSON을 생성합니다.",
        actions: [
            "‘2. 자동추출·최종확인 Prompt 복사’를 눌러 Prompt 1을 완료한 같은 AI 대화창에 붙여 넣습니다.",
            "AI가 META01~META09 후보를 자동추출한 검토표를 보여주면, 그대로 사용할 항목과 수정할 항목을 확인합니다.",
            "그대로 쓰려면 ‘전체 확인’, 수정할 값은 ‘META번호=값’ 형식으로 한 메시지에 작성합니다.",
            "최종 후보표에 동의하고 ‘[2/3 자동추출·확인 완료]’와 NEW_CHAT_JSON_REQUEST가 생성됐는지 확인합니다.",
            "Prompt 2 답변의 BEGIN_NEW_CHAT_JSON_REQUEST부터 END_NEW_CHAT_JSON_REQUEST까지 코드 블록 전체를 복사합니다.",
            "무료 Gemini의 새 대화창을 열어 해당 블록을 붙여 넣습니다. 별도 설명이나 사내 정보를 추가하지 않습니다.",
            "AI는 확인·질문·재분류를 반복하지 않고 첫 응답에서 바로 최종 JSON을 생성해야 합니다.",
            "AI 답변에 첨부된 .json 파일을 다운로드합니다.",
            "무료 환경에서 파일 첨부가 제공되지 않으면 json 코드 블록 하나만 복사해 UTF-8 .json으로 저장합니다.",
            "아래 정적 JSON Prompt는 전달 블록이 잘렸을 때만 사용하는 복구용입니다. 이 경우 확인된 STEP01_HANDOFF도 같은 입력에 함께 붙여야 합니다."
        ],
        completion: [
            "Prompt 2의 초기·최종 검토표에 META01~META09가 각각 한 번씩 표시됐습니다.",
            "최종 후보표에 동의한 뒤 ‘[2/3 자동추출·확인 완료]’와 NEW_CHAT_JSON_REQUEST가 표시됐습니다.",
            "cardTypeCandidate가 선택한 Asset type과 일치합니다.",
            "유형별 필수 내용이 typeSpecific에 포함돼 있습니다.",
            "자료유형·기술영역·업무단계·대응 대상 후보와 내용 기반 추가 태그가 구분돼 있고, 자동 후보마다 answerEvidence가 기록돼 있습니다.",
            "답변 근거가 없는 분류 축은 임의값이나 기타로 채워지지 않고 빈 값과 사내 직접 선택 항목으로 남아 있습니다.",
            "placeholdersToRestoreInternally와 itemsToConfirm이 구분돼 있습니다.",
            "모르는 내용은 만들지 않고 ‘확인 필요’로 남아 있습니다.",
            "securitySelfCheck가 pass이고 JSON이 유효한 객체 형태입니다.",
            "다운로드한 파일의 확장자가 .json이고 코드 블록과 내용이 동일합니다."
        ],
        caution: "Prompt 2는 반드시 Prompt 1을 완료한 같은 대화창에서 사용합니다. 새 대화에는 확인된 NEW_CHAT_JSON_REQUEST 전체만 전달하며, STEP01_HANDOFF가 잘렸으면 Prompt 2로 돌아갑니다."
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
            "프로젝트 참여 시 ‘GitLab 사용자 연결’을 한 번 완료합니다. 이후 Owner·등록자는 연결된 현재 사용자로 자동 채우고, 등록자와 다른 Peer를 Reviewer로 지정합니다.",
            "공식 원문·모델·데이터·회의·Template은 중복 업로드하지 않고 사내 원본 링크로 연결합니다.",
            "2단계에서 AI 후보의 답변 근거를 확인합니다. 후보가 없거나 근거가 충분하지 않으면 자료유형·주 기술영역·업무단계·대응대상을 직접 선택하고, 내용 기반 추가 태그는 선택·제외합니다.",
            "기존 Wiki의 중복 후보와 관계를 확인하고, Technology Map·Learning Path에는 ‘연결됨 / 해당 없음 / 대상 미등록’ 중 하나와 판단 사유를 기록합니다.",
            "등록 전 검증을 통과하면 별도 서버·프로젝트·토큰 입력 없이 연결된 현재 사용자 권한으로 ‘Wiki에 바로 등록’을 실행합니다."
        ],
        completion: [
            "제목·요약·Asset type·게시 상태와 유형별 필수 내용이 완성됐습니다.",
            "실제 근거와 원본 링크, 적용범위·한계·주의사항이 있습니다.",
            "필수 분류 태그와 추가 추천 태그를 2단계에서 확정했고, 기존 자산 관계와 Technology Map·Learning Path 연결 판단이 확인됐습니다.",
            "Owner·등록자가 확인됐고 등록자와 다른 Peer Reviewer가 지정됐습니다.",
            "등록 결과가 GitLab Wiki Markdown 문서로 생성됐습니다."
        ],
        caution: "GitLab Access Token은 자산 등록 화면에서 받지 않습니다. 로컬 프로토타입은 프로젝트 사용자 연결 시 현재 탭 세션에만 보관하고, 운영 환경은 GitLab OAuth 또는 사내 SSO 세션으로 대체합니다. 등록자는 대상 프로젝트의 Wiki 작성 권한이 있어야 합니다."
    }
];

const assetRegistrationStepOverrides = Object.freeze({
    "vd-request": Object.freeze({
        conversation: Object.freeze({
            title: "세 가지 분류값 작성·확인",
            summary: "3개 분류 선택 → 입력란에 세 줄 작성 → Prompt 1로 확인",
            purpose: "Step 01은 말로 대화하는 단계가 아닙니다. 기술영역·업무 단계·대응 대상을 Guide에서 고른 뒤, AI 입력란에 세 줄로 작성하고 허용값·개수·중복만 확인합니다.",
            actions: Object.freeze([
                "기술영역·업무 단계·대응 대상 카드에서 해당 값을 고릅니다.",
                "화면의 작성 형식에 맞춰 세 줄을 준비합니다.",
                "Prompt 1을 새 AI 대화에 붙이고 준비한 세 줄을 입력란에 한 번에 작성합니다.",
                "‘입력 확인 완료’가 나오면 Step 01을 끝내고 Step 02로 이동합니다."
            ]),
            completion: Object.freeze([
                "세 분류값을 우리말로 작성했습니다.",
                "AI가 허용값·개수·중복을 확인했습니다.",
                "Prompt 2와 JSON은 Step 01에 표시되지 않습니다."
            ]),
            caution: "길게 설명하거나 말로 답할 필요가 없습니다. 세 분류값만 글로 작성하며, 의미 적합성은 등록자가 Guide를 보고 판단합니다."
        }),
        structure: Object.freeze({
            title: "필요한 맥락 말로 설명하기",
            summary: "Prompt 2 복사 → 6개 맥락 영역과 보완 질문에 답변 → 전체 요약 확인",
            purpose: "Step 01의 세 분류값만으로는 자산의 의미를 이해할 수 없습니다. Prompt 2를 통해 요청 배경과 판단 질문, Simulation 대응, 판단 근거, 요청자 피드백, 실제 영향, 적용범위와 한계를 충분히 설명하고 AI의 정리를 확인합니다.",
            actions: Object.freeze([
                "Prompt 2를 Prompt 1과 같은 AI 대화에 붙여 넣습니다.",
                "AI가 현재 맥락의 질문 하나만 보여주면 입력창의 마이크 기능으로 배경과 판단 이유까지 충분히 설명합니다.",
                "필수 세부항목이 빠지면 같은 맥락에서 보완 질문에 답합니다. 아직 받지 못한 피드백이나 확인되지 않은 영향은 ‘추후 확인’, 업무상 정말 발생하지 않는 항목은 이유와 함께 ‘해당 없음’이라고 말합니다.",
                "AI는 각 맥락을 정리하고 같은 응답에 다음 질문을 바로 표시합니다. 정리가 맞으면 ‘다음’이나 ‘확인’을 입력하지 말고 새 질문에 바로 답하며, 틀린 경우에만 수정합니다.",
                "여섯 영역의 전체 요약이 나오면 틀린 부분을 수정하고, 모두 맞을 때만 ‘완료’라고 답합니다.",
                "Step 01의 세 분류값은 다시 선택하거나 추천받지 않습니다.",
                "마지막에 나온 여섯 맥락 요약과 분리된 ‘추후 확인’ 목록을 검토합니다."
            ]),
            completion: Object.freeze([
                "요청 배경·판단 질문, Simulation 대응, 판단 근거, 요청자 피드백, 실제 영향, 적용범위·한계가 각각 확인됨·추후 확인·해당 없음으로 구분됐습니다.",
                "입력·제약, 관찰 사실·기술적 해석, 결정·실행 상태처럼 서로 다른 정보가 섞이지 않았습니다.",
                "AI가 한 번에 질문 하나만 제시하고, 빠진 필수항목에는 같은 영역의 보완 질문을 했습니다.",
                "전체 요약을 확인하고 ‘완료’라고 답한 뒤 ‘[VD Request Step 02 맥락 인터뷰 완료]’가 표시됐습니다.",
                "META, 검색 후보, JSON은 이 단계에서 생성되지 않았습니다.",
                "실제 식별정보와 내부 링크는 외부 대화에 포함하지 않았고, 사내 등록 화면에서 별도로 입력합니다."
            ]),
            caution: "답변을 짧게 끝낼 필요는 없습니다. 실제 식별정보와 정확한 수치는 말하지 않되, 무엇을 비교했고 왜 판단했으며 실제로 무엇이 달라졌는지는 충분히 설명합니다. JSON 생성은 다음 단계에서 진행합니다."
        }),
        import: Object.freeze({
            title: "확정 내용으로 JSON 생성하기",
            summary: "Prompt 3 복사 → 같은 AI 대화에서 JSON 생성 → 파일 확인",
            phase: "OUTPUT",
            purpose: "Step 01에서 확정한 세 분류값과 Step 02에서 확인한 여섯 맥락을 VD Request Handoff Packet JSON으로 변환합니다. Prompt 3는 같은 대화의 완료 결과만 사용하며 새로운 질문이나 분류 재선택을 하지 않습니다.",
            actions: Object.freeze([
                "같은 대화에 ‘[입력 확인 완료]’와 ‘[VD Request Step 02 맥락 인터뷰 완료]’가 모두 있는지 확인합니다.",
                "Prompt 3를 복사해 Step 01·02를 진행한 같은 AI 대화창에 붙여 넣습니다.",
                "AI가 추가 질문 없이 첫 응답에서 JSON 코드 블록과 가능한 경우 UTF-8 파일을 만드는지 확인합니다.",
                "JSON의 세 분류값, 여섯 맥락, factsToConfirm 목록이 최종 확인 내용과 일치하는지 점검합니다.",
                "파일 첨부가 없으면 동일한 json 코드 블록을 복사해 technical-asset-vd-request.json으로 저장합니다."
            ]),
            completion: Object.freeze([
                "packetVersion이 0.3이고 cardType이 VD Request입니다.",
                "주·보조 기술영역, 업무 단계, 대응 대상이 Step 01 확정값과 일치합니다.",
                "요청 배경, Simulation 대응, 판단 근거, 요청자 피드백, 실제 영향, 적용범위·한계가 누락 없이 JSON에 반영됐습니다.",
                "확인되지 않은 피드백·영향·후속조치가 만들어지지 않았고, 미확인 사실만 internalCompletion.factsToConfirm에 남았습니다.",
                "동일한 JSON 코드 블록이 하나만 표시되고 ‘[VD Request Step 03 JSON 생성 완료]’가 출력됐습니다."
            ]),
            caution: "Prompt 3에 사내 파일이나 실제 식별정보를 추가하지 않습니다. JSON이 생성돼도 검색 분류의 최종 확정, 관계·내부 링크·Owner·Reviewer·자산 ID 입력은 Step 04의 사내 Wiki에서 수행합니다."
        })
    }),
    cor: Object.freeze({
        conversation: Object.freeze({
            title: "CoR 세 가지 분류값 작성·확인",
            summary: "3개 분류 선택 → 입력란에 세 줄 작성 → Prompt 1로 확인",
            purpose: "종료된 CoR을 등록하기 전에 기술영역·업무 단계·대응 대상을 Guide에서 고른 뒤, AI 입력란에 세 줄로 작성하고 허용값·개수·중복만 확인합니다.",
            actions: Object.freeze([
                "CoR이 종료됐고 공식 결과 또는 종료 근거가 준비됐는지 먼저 확인합니다. 진행 중이면 프로젝트 시스템에서 계속 관리합니다.",
                "기술영역·업무 단계·대응 대상 카드에서 해당 값을 고릅니다.",
                "Prompt 1을 새 AI 대화에 붙이고 준비한 세 줄을 입력란에 한 번에 작성합니다.",
                "‘입력 확인 완료’가 나오면 Step 01을 끝내고 Step 02로 이동합니다."
            ]),
            completion: Object.freeze([
                "수명주기가 종료되고 공식 결과 또는 종료 근거가 준비된 CoR이라는 등록 자격을 확인했습니다.",
                "세 분류값을 우리말로 작성하고 AI가 허용값·개수·중복을 확인했습니다.",
                "Prompt 2와 JSON은 Step 01에 표시되지 않습니다."
            ]),
            caution: "CoR의 진행 이력은 외부 AI가 아니라 프로젝트 시스템에서 관리합니다. Step 01에서는 긴 설명 없이 세 분류값만 글로 작성합니다."
        }),
        structure: Object.freeze({
            title: "CoR 일곱 영역 말로 설명하기",
            summary: "Prompt 2 복사 → 7개 영역과 보완 질문에 답변 → 전체 요약 확인",
            purpose: "Prompt 2를 통해 발굴 배경과 기술 Gap부터 산출물·후속조치까지 종료된 CoR의 일곱 영역을 충분히 설명하고 AI의 정리를 확인합니다.",
            actions: Object.freeze([
                "Prompt 2를 Prompt 1과 같은 AI 대화에 붙여 넣습니다.",
                "AI가 현재 영역의 질문 하나만 보여주면 배경·검증·판단 이유·결과가 드러나도록 충분히 설명합니다.",
                "필수 세부항목이 빠지면 같은 영역의 보완 질문에 답합니다. 모르는 내용은 ‘추후 사내 확인’으로 남깁니다.",
                "사업 기여와 프로세스 변화는 직접 확인된 근거가 있을 때만 결과 또는 후속 영역에서 선택적으로 설명합니다.",
                "AI는 영역 정리와 다음 질문을 같은 응답에 연속 표시합니다. 정리가 맞으면 별도 확인 없이 새 질문에 바로 답하고, 틀린 경우에만 수정합니다.",
                "일곱 영역의 전체 요약이 나오면 사실과 다른 부분을 수정하고, 모두 맞을 때만 ‘완료’라고 답합니다.",
                "Step 01의 세 분류값은 다시 선택하거나 추천받지 않습니다."
            ]),
            completion: Object.freeze([
                "발굴 배경·Gap, 목표·성공기준, 범위·계획·책임, 검증 설계, 진행 판단, 결과·판단 범위, 산출물·후속조치가 모두 정리됐습니다.",
                "AI가 한 번에 질문 하나만 제시하고 누락된 필수항목에는 같은 영역의 보완 질문을 했습니다.",
                "CoR 종료와 공식 결과 또는 종료 근거의 존재가 확인됐습니다.",
                "전체 요약을 확인하고 ‘완료’라고 답한 뒤 ‘[CoR Step 02 맥락 인터뷰 완료]’가 표시됐습니다.",
                "검색 후보와 JSON, 실제 관련 문서명·ID·링크는 이 단계에서 생성되지 않았습니다."
            ]),
            caution: "목표 달성과 과제 종료를 같은 의미로 쓰지 않습니다. 외부 AI는 과제 상태를 추론하지 않으며 완료·Drop 선택은 사내 등록 단계에서 합니다. 확인되지 않은 경영성과나 프로세스 변화를 만들지 않으며 JSON 생성은 다음 단계에서 진행합니다."
        }),
        import: Object.freeze({
            title: "확정 내용으로 CoR JSON 생성하기",
            summary: "Prompt 3 복사 → 같은 AI 대화에서 Lean v0.3 JSON 생성 → 파일 확인",
            phase: "OUTPUT",
            purpose: "Step 01에서 확정한 세 분류값과 Step 02에서 확인한 일곱 영역을 CoR Lean v0.3 Handoff JSON으로 변환합니다. Prompt 3는 추가 질문 없이 같은 대화의 확정값만 사용합니다.",
            actions: Object.freeze([
                "같은 대화에 ‘[입력 확인 완료]’와 ‘[CoR Step 02 맥락 인터뷰 완료]’가 모두 있는지 확인합니다.",
                "Prompt 3를 Step 01·02를 진행한 같은 AI 대화창에 붙여 넣습니다.",
                "AI가 추가 질문 없이 첫 응답에서 JSON 코드 블록과 가능한 경우 UTF-8 파일을 만드는지 확인합니다.",
                "JSON의 세 분류값, 일곱 영역, 검색 후보와 factsToConfirm이 최종 확인 내용과 일치하는지 점검합니다.",
                "파일 첨부가 없으면 동일한 json 코드 블록을 복사해 technical-asset-cor.json으로 저장합니다."
            ]),
            completion: Object.freeze([
                "packetVersion이 0.3이고 cardType이 CoR입니다.",
                "주·보조 기술영역, 업무 단계, 대응 대상이 Step 01 확정값과 일치합니다.",
                "CoR 공식 본문 일곱 영역이 평면 구조로 누락 없이 반영됐습니다.",
                "사업 기여·프로세스 변화는 별도 필드가 아니며 확인 근거가 있을 때만 결과·후속 영역에 포함됐습니다.",
                "실제 관련 문서와 내부 링크는 JSON에 없고, 미확인 사실만 internalCompletion.factsToConfirm에 남았습니다.",
                "동일한 JSON 코드 블록이 하나만 표시되고 ‘[CoR Step 03 JSON 생성 완료]’가 출력됐습니다."
            ]),
            caution: "Prompt 3에 사내 파일이나 실제 식별정보를 추가하지 않습니다. JSON 생성 후 실제 CoR ID·종료 근거 링크·관계·Owner·Reviewer는 Step 04의 사내 Wiki에서 보완합니다."
        })
    }),
    methodology: Object.freeze({
        conversation: Object.freeze({
            title: "방법론 세 가지 분류값 작성·확인",
            summary: "3개 분류 선택 → 입력란에 세 줄 작성 → Prompt 1로 확인",
            purpose: "방법론의 기술영역·업무 단계·대응 대상을 Guide에서 고른 뒤, AI 입력란에 세 줄로 작성하고 허용값·개수·중복만 확인합니다.",
            actions: Object.freeze([
                "기술영역·업무 단계·대응 대상 카드에서 해당 값을 고릅니다.",
                "Prompt 1을 새 AI 대화에 붙이고 준비한 세 줄을 입력란에 한 번에 작성합니다.",
                "‘입력 확인 완료’가 나오면 Step 01을 끝내고 Step 02로 이동합니다."
            ]),
            completion: Object.freeze([
                "세 분류값을 우리말로 작성했습니다.",
                "AI가 허용값·개수·중복을 확인했습니다."
            ]),
            caution: "긴 설명이나 방법론 Level 판정은 하지 않습니다. Step 01은 세 분류값만 글로 확인합니다."
        }),
        structure: Object.freeze({
            title: "방법론 일곱 영역 말로 설명하기",
            summary: "Prompt 2 복사 → 7개 영역과 보완 질문에 답변 → 전체 요약 확인",
            purpose: "Prompt 2를 통해 해결 문제부터 검증·재사용 근거까지 방법론의 일곱 영역을 충분히 설명하고 AI의 정리를 확인합니다.",
            actions: Object.freeze([
                "Prompt 2를 Prompt 1과 같은 AI 대화에 붙여 넣습니다.",
                "AI가 현재 영역의 질문 하나만 보여주면 배경·원리·판단 이유가 드러나도록 충분히 설명합니다.",
                "필수 세부항목이 빠지면 같은 영역의 보완 질문에 답하고, 모르는 내용은 ‘추후 사내 확인’으로 남깁니다.",
                "AI는 영역 정리와 다음 질문을 같은 응답에 연속 표시합니다. 정리가 맞으면 별도 확인 없이 새 질문에 바로 답하고, 틀린 경우에만 수정합니다.",
                "일곱 영역의 전체 요약이 나오면 사실과 다른 부분만 수정하고, 모두 맞을 때 ‘완료’라고 답합니다."
            ]),
            completion: Object.freeze([
                "해결 문제·활용 목적, 기술 원리·가정, 입력·전제조건, 표준 절차·판단 흐름, 결과·판단기준, 적용범위·한계, 검증·재사용 근거가 정리됐습니다.",
                "전체 요약을 확인하고 ‘완료’라고 답한 뒤 ‘[방법론 Step 02 맥락 인터뷰 완료]’가 표시됐습니다.",
                "방법론 자격, 공식 Level, Technology Map 상태는 이 단계에서 확정하지 않았습니다."
            ]),
            caution: "Step 01의 분류값을 다시 묻거나 Level을 확정하지 않습니다. 실제 사내 자산명·ID·URL은 입력하지 않습니다."
        }),
        import: Object.freeze({
            title: "확정 내용으로 방법론 JSON 생성하기",
            summary: "Prompt 3 복사 → 같은 AI 대화에서 Lean v0.3 JSON 생성 → 파일 확인",
            phase: "OUTPUT",
            purpose: "Step 01의 세 분류값과 Step 02의 일곱 영역을 방법론 Lean v0.3 Handoff JSON으로 변환합니다. 새로운 질문이나 분류 재선택은 하지 않습니다.",
            actions: Object.freeze([
                "같은 대화에 ‘[입력 확인 완료]’와 ‘[방법론 Step 02 맥락 인터뷰 완료]’가 모두 있는지 확인합니다.",
                "Prompt 3를 같은 AI 대화에 붙여 넣고 첫 응답에서 JSON이 생성되는지 확인합니다.",
                "세 분류값, 일곱 본문 영역, Level 후보와 근거·남은 Gap이 최종 확인 내용과 일치하는지만 점검합니다.",
                "파일 첨부가 없으면 JSON 코드 블록을 technical-asset-methodology.json으로 저장합니다."
            ]),
            completion: Object.freeze([
                "packetVersion이 0.3이고 cardType이 방법론입니다.",
                "세 분류값과 일곱 본문 영역이 누락 없이 반영됐습니다.",
                "방법론 자격·공식 Level·Technology Map 상태·내부 링크·Owner·Reviewer는 JSON에 확정값으로 들어가지 않았습니다.",
                "‘[방법론 Step 03 JSON 생성 완료]’가 출력됐습니다."
            ]),
            caution: "AI가 제안한 Level은 사내 확인용 후보일 뿐입니다. 현재 Level과 변경 이력, Technology Map 상태는 Step 04에서 확정합니다."
        })
    })
});

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

function createLeanRegistrationStepOverride(step, assetKey) {
    const config = LEAN_ASSET_PROMPT_CONFIG[assetKey];
    const blocks = LEAN_STEP02_CONTEXT_BLOCKS[assetKey] || [];
    if (!config || assetRegistrationStepOverrides[assetKey]?.[step.id]) return null;
    const { cardType, completionMarker, fileName } = config;
    const areaNames = blocks.map(({ title }) => title).join("·");

    if (step.id === "conversation") {
        return {
            title: `${cardType} 세 가지 분류값 작성·확인`,
            summary: "3개 분류 선택 → 입력란에 세 줄 작성 → Prompt 1로 확인",
            purpose: `${cardType}의 기술영역·업무 단계·대응 대상을 Guide에서 고른 뒤 AI 입력란에 세 줄로 작성하고 허용값·개수·중복만 확인합니다.`,
            actions: [
                "기술영역·업무 단계·대응 대상 카드에서 해당 값을 고릅니다.",
                "Prompt 1을 새 AI 대화에 붙이고 준비한 세 줄을 한 번에 작성합니다.",
                "‘[입력 확인 완료]’가 나오면 Step 02로 이동합니다."
            ],
            completion: ["세 분류값을 우리말로 작성했습니다.", "AI가 허용값·개수·중복만 확인했습니다."],
            caution: "이 단계에서는 긴 맥락을 설명하지 않습니다. 세 분류값만 글로 작성합니다."
        };
    }
    if (step.id === "structure") {
        return {
            title: `${cardType} 맥락 말로 설명하기`,
            summary: `Prompt 2 복사 → ${blocks.length}개 영역과 필요한 보완 질문에 답변 → 전체 요약 확인`,
            purpose: `${areaNames}의 ${blocks.length}개 영역을 질문 하나씩 충분히 설명하고 AI의 정리를 확인합니다.`,
            actions: [
                "Prompt 2를 Prompt 1과 같은 AI 대화에 붙여 넣습니다.",
                "현재 영역의 질문 하나에 필요한 만큼 충분히 답합니다.",
                "빠진 필수항목에만 최대 2회의 보완 질문을 받고, 모르는 사실은 ‘추후 사내 확인’으로 남깁니다.",
                "전체 요약이 맞으면 ‘완료’라고 답합니다."
            ],
            completion: [`${blocks.length}개 영역이 각각 완결된 문장으로 정리됐습니다.`, `‘${completionMarker}’가 표시됐습니다.`],
            caution: "실제 식별정보와 내부 링크는 말하지 않습니다. JSON은 Step 03에서 생성합니다."
        };
    }
    if (step.id === "import") {
        return {
            title: `${cardType} JSON 확인·사내 반입하기`,
            summary: "Prompt 2 완료 JSON 확인 → 파일 저장 → 사내 Wiki 등록 화면에 불러오기",
            phase: "IMPORT",
            purpose: `Prompt 2가 생성한 ${cardType} Lean v0.3 Handoff JSON을 확인하고 사내 Wiki 등록 화면에 가져옵니다.`,
            actions: [
                `Prompt 2의 완료 응답에 ‘${completionMarker}’와 JSON 코드 블록이 표시됐는지 확인합니다.`,
                `파일 첨부가 있으면 다운로드하고, 없으면 JSON 코드 블록만 ${fileName}으로 저장합니다.`,
                "JSON의 자산유형·분류값·맥락 필드가 최종 확인 내용과 일치하는지 확인합니다.",
                "사내 Wiki 등록 화면에서 JSON을 불러옵니다."
            ],
            completion: [`packetVersion이 0.3이고 cardType이 ${cardType}입니다.`, `${blocks.length}개 본문 영역과 분류값이 누락 없이 반영됐습니다.`, "등록 화면에서 JSON 초안 미리보기가 생성됐습니다."],
            caution: "실제 ID·Owner·Reviewer·상태·버전·날짜·링크·관계는 외부 JSON에 넣지 않고 Step 04에서 보완합니다. Prompt 3는 사용하지 않습니다."
        };
    }
    return null;
}

function getAssetRegistrationStepDefinition(step, assetKey) {
    const leanOverride = createLeanRegistrationStepOverride(step, assetKey);
    const assetOverride = isLeanV03Asset(assetKey) && step.id === "import"
        ? {}
        : (assetRegistrationStepOverrides[assetKey]?.[step.id] || {});
    const merged = {
        ...step,
        ...(leanOverride || {}),
        ...assetOverride
    };
    if (isLeanV03Asset(assetKey) && step.id === "structure") {
        const config = LEAN_ASSET_PROMPT_CONFIG[assetKey];
        return {
            ...merged,
            summary: `${merged.summary} → 완료 후 JSON 생성`,
            actions: [
                ...merged.actions,
                "전체 요약을 확인하고 ‘완료’라고 답하면, Prompt 2가 같은 응답에서 JSON 코드 블록과 가능한 경우 파일을 생성합니다."
            ],
            completion: [
                ...merged.completion.filter((item) => !item.includes("JSON은 이 단계에서 생성되지") && !item.includes("META, 검색 후보, JSON은 이 단계에서")),
                `같은 응답에서 ${config.fileName} JSON이 생성됐습니다.`
            ],
            caution: "실제 식별정보와 내부 링크는 말하지 않습니다. JSON은 다른 Prompt를 복사하지 않고 Prompt 2의 완료 응답에서 생성합니다."
        };
    }
    return merged;
}

function createSearchMetadataTemplate() {
    return {
        candidateStatus: "needs_user_confirmation",
        primaryDomainCandidate: "",
        secondaryDomainCandidates: [],
        workflowStageCandidates: [],
        responseTargetCandidates: [],
        searchFacets: {
            problemPhenomena: [],
            productStructureProcess: [],
            toolModelData: []
        },
        visibleTags: [],
        aliases: [],
        expectedQueries: [],
        candidateRationale: [],
        internalFinalizationRequired: true
    };
}

function createVdRequestHandoffTemplateV03() {
    return {
        packetVersion: "0.3",
        cardType: "VD Request",
        workingTitle: "",
        content: {
            context: "",
            primaryQuestion: "",
            inputsAndConstraints: [],
            approach: "",
            result: "",
            applicability: {
                judgmentScope: "",
                validConditions: [],
                limitations: []
            },
            evidenceSummary: [],
            requesterFeedback: null,
            decisionImpact: null,
            followUp: []
        },
        searchMetadata: {
            classification: {
                primaryDomain: "",
                secondaryDomains: [],
                workflowStages: [],
                responseTargets: []
            },
            facets: {
                problemPhenomena: [],
                productStructureProcess: [],
                toolModelData: []
            },
            additionalTags: [],
            aliases: [],
            expectedQueries: []
        },
        internalCompletion: {
            factsToConfirm: []
        }
    };
}

function createCorHandoffTemplateV03() {
    return {
        packetVersion: "0.3",
        cardType: "CoR",
        workingTitle: "",
        content: {
            backgroundAndGap: "",
            objectiveAndSuccessCriteria: "",
            scopeAndPlan: "",
            validationDesign: "",
            progressDecisions: [],
            resultAndJudgment: "",
            outputsAndFollowUp: []
        },
        searchMetadata: {
            classification: {
                primaryDomain: "",
                secondaryDomains: [],
                workflowStages: [],
                responseTargets: []
            },
            facets: {
                problemPhenomena: [],
                productStructureProcess: [],
                toolModelData: []
            },
            additionalTags: [],
            aliases: [],
            expectedQueries: []
        },
        internalCompletion: {
            factsToConfirm: []
        }
    };
}

function createMethodologyHandoffTemplateV03() {
    return {
        packetVersion: "0.3",
        cardType: "방법론",
        workingTitle: "",
        content: {
            problemAndPurpose: "",
            technicalPrinciples: "",
            inputsAndPrerequisites: [],
            standardProcedure: [],
            resultsAndCriteria: "",
            scopeAndLimits: [],
            validationAndReuse: []
        },
        searchMetadata: {
            classification: {
                primaryDomain: "",
                secondaryDomains: [],
                workflowStages: [],
                responseTargets: []
            },
            facets: {
                problemPhenomena: [],
                productStructureProcess: [],
                toolModelData: []
            },
            additionalTags: [],
            aliases: [],
            expectedQueries: []
        },
        levelAssessmentCandidate: {
            proposedLevel: null,
            rationale: "",
            evidenceCandidates: [],
            remainingGap: []
        },
        internalCompletion: {
            factsToConfirm: []
        }
    };
}

const LEAN_CONTENT_TEMPLATES = Object.freeze({
    BP: Object.freeze({
        businessContext: "",
        simulationResponse: "",
        businessFeedback: Object.freeze({ status: "", summary: "", evidence: "" }),
        businessImpact: Object.freeze({ areas: Object.freeze([]), pathway: "", confirmationLevel: "" }),
        reproductionConditions: Object.freeze([]),
        evidence: Object.freeze([])
    }),
    "기술보고서": Object.freeze({
        questionAndPurpose: "",
        scopeAndConditions: Object.freeze([]),
        methodAndEvidence: "",
        findingsAndConclusion: "",
        validConditionsAndDecisions: Object.freeze({
            validConditions: Object.freeze([]),
            supportedDecisions: Object.freeze([]),
            unsupportedDecisions: Object.freeze([])
        }),
        limitations: Object.freeze([]),
        sourceAndRelationRoles: Object.freeze([])
    }),
    "외부 보고 자료": Object.freeze({
        reportPurpose: "",
        audienceAndDecision: "",
        approvedMessages: Object.freeze([]),
        sourceAssetsAndEvidence: Object.freeze([]),
        disclosureScope: "",
        versionAndValidity: Object.freeze({
            validityConditions: Object.freeze([]),
            reviewTriggers: Object.freeze([])
        }),
        limitationsAndNotes: Object.freeze([])
    }),
    "노하우": Object.freeze({
        knowhowCategory: "",
        symptomAndConditions: Object.freeze({ situationAndGoal: "", triggerOrFrequency: "" }),
        causeAndDiagnosis: Object.freeze({
            keyDifficulty: "",
            checksBeforeAction: Object.freeze([]),
            ineffectiveAttempts: Object.freeze([])
        }),
        resolution: Object.freeze([{ step: 1, action: "", judgment: "" }]),
        effectAndEvidence: Object.freeze({ completionCriteria: Object.freeze([]), result: "", evidenceLevel: "" }),
        risksAndRecovery: Object.freeze({
            doNotApply: Object.freeze([]),
            risksOrFailureSignals: Object.freeze([]),
            escalationOrRecovery: Object.freeze([])
        }),
        versionsAndSources: Object.freeze([])
    }),
    "Tool Manual": Object.freeze({
        purposeAndOutput: "",
        prerequisites: Object.freeze([]),
        procedure: Object.freeze([]),
        completionCheck: Object.freeze({ expectedResult: "", invalidSignals: Object.freeze([]) }),
        errorsAndWarnings: Object.freeze({ stopConditions: Object.freeze([]), commonRisks: Object.freeze([]) }),
        versionsAndSources: Object.freeze([])
    }),
    "교육자료": Object.freeze({
        learningObjectives: Object.freeze([]),
        audienceAndPrerequisites: Object.freeze({ audience: "", prerequisites: Object.freeze([]) }),
        outline: Object.freeze([]),
        activities: Object.freeze({ methods: Object.freeze([]), expectedDuration: "", materials: Object.freeze([]) }),
        completionCriteria: Object.freeze([]),
        sourcesAndVersion: Object.freeze([])
    })
});

function cloneRegistrationTemplate(value) {
    return JSON.parse(JSON.stringify(value));
}

function createLeanSearchMetadataTemplate() {
    return {
        classification: {
            primaryDomain: "",
            secondaryDomains: [],
            workflowStages: [],
            responseTargets: []
        },
        facets: {
            problemPhenomena: [],
            productStructureProcess: [],
            toolModelData: []
        },
        additionalTags: [],
        aliases: [],
        expectedQueries: []
    };
}

function createLeanHandoffTemplateV03(cardType) {
    if (cardType === "VD Request") return createVdRequestHandoffTemplateV03();
    if (cardType === "CoR") return createCorHandoffTemplateV03();
    if (cardType === "방법론") return createMethodologyHandoffTemplateV03();
    if (!LEAN_CONTENT_TEMPLATES[cardType]) return null;
    return {
        packetVersion: "0.3",
        cardType,
        workingTitle: "",
        content: cloneRegistrationTemplate(LEAN_CONTENT_TEMPLATES[cardType]),
        searchMetadata: createLeanSearchMetadataTemplate(),
        internalCompletion: {
            factsToConfirm: []
        }
    };
}

function serializeYamlScalar(value) {
    if (typeof value === "boolean" || typeof value === "number") return String(value);
    if (value === null) return "null";
    return JSON.stringify(String(value));
}

function serializeTemplateAsYaml(value, indent = 0) {
    const padding = " ".repeat(indent);

    if (Array.isArray(value)) {
        if (value.length === 0) return "[]";
        return value.map((item) => {
            if (item && typeof item === "object") {
                const serialized = serializeTemplateAsYaml(item, indent + 2);
                const [firstLine, ...rest] = serialized.split("\n");
                return `${padding}- ${firstLine.trimStart()}${rest.length ? `\n${rest.join("\n")}` : ""}`;
            }
            return `${padding}- ${serializeYamlScalar(item)}`;
        }).join("\n");
    }

    if (value && typeof value === "object") {
        return Object.entries(value).map(([key, item]) => {
            if (Array.isArray(item)) {
                if (item.length === 0) return `${padding}${key}: []`;
                return `${padding}${key}:\n${serializeTemplateAsYaml(item, indent + 2)}`;
            }
            if (item && typeof item === "object") {
                return `${padding}${key}:\n${serializeTemplateAsYaml(item, indent + 2)}`;
            }
            return `${padding}${key}: ${serializeYamlScalar(item)}`;
        }).join("\n");
    }

    return `${padding}${serializeYamlScalar(value)}`;
}

function createLegacyHandoffTemplate(cardType) {
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
        searchMetadata: createSearchMetadataTemplate(),
        relatedAssetCandidates: ["확인 필요"],
        placeholdersToRestoreInternally: ["확인 필요"],
        itemsToConfirm: ["확인 필요"],
        securitySelfCheck: "pass",
        typeSpecific: TYPE_SPECIFIC_SCHEMAS[cardType]
    };
}

function createHandoffTemplate(cardType) {
    return createLeanHandoffTemplateV03(cardType) || createLegacyHandoffTemplate(cardType);
}

function createStep01HandoffTemplate(cardType) {
    const { packetVersion: _packetVersion, ...packetDraft } = createHandoffTemplate(cardType);
    const assetKey = getLeanAssetKeyForCardType(cardType);
    if (assetKey) {
        return {
            handoffVersion: `${assetKey}-step01-1.0`,
            confirmationStatus: "pending",
            ...packetDraft
        };
    }
    return {
        handoffVersion: "step01-1.0",
        confirmationStatus: "pending",
        ...packetDraft,
        securitySelfCheck: "recheck"
    };
}

function createJsonConversionPrompt({ cardType, purpose, focus, tagFocus = [], outputFileName }) {
    const handoffTemplate = JSON.stringify(createLegacyHandoffTemplate(cardType), null, 2);
    return `당신은 확인 완료된 STEP01_HANDOFF를 사내 기술자산 Wiki 반입용 Handoff Packet JSON으로 직렬화하는 정리자입니다.

[사용 맥락]
- 이 Prompt는 무료 Gemini의 새 대화창에서 사용하는 복구용 Prompt 3입니다.
- 기본 흐름에서는 Prompt 2가 만든 \`BEGIN_NEW_CHAT_JSON_REQUEST ... END_NEW_CHAT_JSON_REQUEST\` 전체를 세 번째로 복사하므로 이 Prompt를 따로 복사할 필요가 없습니다.
- 이 Prompt를 직접 사용할 때는 확인된 \`BEGIN_STEP01_HANDOFF ... END_STEP01_HANDOFF\` 블록을 같은 입력에 함께 붙여야 합니다.

[입력 검증]
1. STEP01_HANDOFF가 정확히 한 개 있어야 합니다.
2. confirmationStatus는 \`confirmed\`, securitySelfCheck는 \`pass\`여야 합니다.
3. cardTypeCandidate는 \`${cardType}\`과 일치해야 합니다.
4. 하나라도 충족하지 않으면 질문·표·JSON을 만들지 말고 다음 문장만 출력하세요.
   \`STEP01_HANDOFF_REJECTED: 확인 완료된 STEP01_HANDOFF가 필요합니다.\`

[3/3 JSON 생성]
1. 새 인터뷰, 추가 질문, 후보 재분류, 사용자 재확인을 하지 마세요.
2. Handoff에 이미 확인된 값만 아래 Schema로 옮기고 새로운 사실이나 후보를 만들지 마세요.
3. \`handoffVersion\`과 \`confirmationStatus\`를 제거하고 \`packetVersion: "0.2"\`를 사용하세요.
4. 첫 응답에서 유효한 JSON을 바로 생성하세요. 주석과 trailing comma를 사용하지 마세요.
5. 파일 생성이 가능하면 UTF-8(BOM 없음) \`${outputFileName}\`을 첨부하세요. 존재하지 않는 다운로드 링크는 만들지 마세요.
6. 파일 생성 가능 여부와 관계없이 동일한 JSON을 Markdown의 json 코드 블록 정확히 하나로 제공하세요.
7. 완료 표시는 코드 블록 뒤에 \`[3/3 JSON 생성 완료]\` 한 줄만 사용하세요.

\`\`\`json
${handoffTemplate}
\`\`\``;
}

function createVdRequestJsonGenerationPrompt() {
    const handoffTemplate = JSON.stringify(createVdRequestHandoffTemplateV03(), null, 2);
    return `당신은 같은 대화에서 사용자가 확인한 VD Request 분류값과 판단 맥락을 Lean v0.3 Handoff JSON으로 정리하는 역할입니다.

[선행조건]
- 같은 대화에 \`[입력 확인 완료]\`와 \`[VD Request Step 02 맥락 인터뷰 완료]\`가 각각 있어야 합니다.
- 하나라도 없으면 다른 설명 없이 \`VD_REQUEST_JSON_REJECTED: Prompt 1과 Step 02의 확인 완료 결과가 필요합니다.\`만 출력하세요.

[작성 원칙]
1. Prompt 1의 최종 세 줄과 Prompt 2의 최종 확인 내용만 사용하세요. 추가 질문이나 새 추론을 하지 마세요.
2. 사용자가 말하지 않은 사실·피드백·성과·의사결정·후속조치를 만들지 마세요.
3. 모르는 사실은 본문에 \`확인 필요\`라고 쓰지 말고 \`internalCompletion.factsToConfirm\`에 구체적인 확인 문장으로 옮기세요.
4. 직접 확인한 요청자 피드백이 없으면 \`requesterFeedback\`은 null, 실제 결정 영향을 확인하지 못했다면 \`decisionImpact\`는 null로 두세요. 두 항목의 \`추후 확인 / 해당 없음\` 상태는 일반 \`factsToConfirm\`과 섞지 말고 사내 등록 화면에서 확정하도록 남겨 두세요.
5. 회사·조직·고객·제품·과제·사람·문서명·ID·URL·파일경로와 정확한 사내 수치를 JSON에 넣지 마세요.
6. Owner, 등록자, Reviewer, 자산 ID, 상태, 관계 자산, 내부 링크는 사내 등록 화면에서 채우므로 만들지 마세요.
7. 아래 Schema에 없는 키를 추가하지 말고 같은 맥락을 다른 위치에 중복하지 마세요.

[Wiki 게시용 문장 품질]
1. 문자열 필드는 사내 등록 화면과 최종 Wiki에 그대로 표시할 수 있는 완결된 문장으로 작성하세요.
2. \`content.context\`는 요청 배경과 필요한 결정을 설명하는 2~4문장, \`content.primaryQuestion\`은 핵심 판단 질문 한 문장으로 작성하세요.
3. 배열의 각 항목도 그 항목만 읽어 의미가 완결되는 한 문장으로 작성하세요.
4. \`inputsAndConstraints\`, \`evidenceSummary\`, \`applicability.validConditions\`, \`applicability.limitations\`은 각각 최소 1개 이상 작성하세요.
5. \`evidenceSummary\`에는 Simulation에서 직접 관찰하거나 비교한 사실만 넣으세요.
6. \`result\`에는 관찰 사실의 기술적 해석과 요청자에게 전달한 결론을 넣으세요.
7. \`applicability.judgmentScope\`에는 판단할 수 있는 범위와 판단할 수 없는 범위를 함께 명시하세요.
8. 같은 문장을 여러 필드에 반복하지 말고 관찰·해석·결론·한계·후속조치를 각각의 필드에 분리하세요.

[분류값]
- 기술영역은 다음 ID로 변환하세요: 변형=deformation, 박리=delamination, 충격=impact, 열유동=thermal-flow, 피로=fatigue, 진동=vibration, 기타=other.
- 업무 단계는 연구·설계·개발·공정·제조·품질, 대응 대상은 고객·사업부·CTO·AX·품질경영·생산기술 중 Prompt 1에서 확인한 값만 사용하세요.
- 주 기술영역은 \`classification.primaryDomain\`, 보조 기술영역은 \`classification.secondaryDomains\`에 넣으세요. 주·보조 값은 중복하지 마세요.

[여섯 맥락 매핑]
1. 요청 배경과 판단 질문 → \`content.context\`, \`content.primaryQuestion\`, \`workingTitle\`
2. Simulation 대응 → \`content.inputsAndConstraints\`, \`content.approach\`
3. 판단 근거 → \`content.result\`, \`content.applicability.judgmentScope\`, \`content.evidenceSummary\`
4. 요청자 피드백 → \`content.requesterFeedback\`
5. 실제 영향 → \`content.decisionImpact\`
6. 적용범위와 한계 → \`content.applicability.validConditions\`, \`content.applicability.limitations\`, \`content.followUp\`

[사내 완료 상태]
- 외부 JSON에서는 요청자 피드백과 실제 영향의 사내 완료 상태를 만들지 마세요.
- 사내 등록 화면에서 두 항목을 각각 \`확인 완료 / 추후 확인 / 해당 없음\`으로 확정합니다.

[검색 정보]
1. \`facets.problemPhenomena\`에는 직접 확인된 일반화 문제·현상 1~3개를 넣으세요.
2. \`facets.productStructureProcess\`와 \`facets.toolModelData\`에는 근거가 있을 때만 일반화된 명사형 표현을 넣고, 없으면 빈 배열로 두세요.
3. \`additionalTags\`에는 다음 통제어 중 본문이 직접 뒷받침하는 값만 최대 3개 넣으세요: 물성/재료모델, 경계조건, 접촉/계면, 비선형, Mesh/요소, 수렴/안정화, 계산 효율화, 실험 상관, 민감도 분석, 불확실성 검토, 설계안 비교, 원인 규명, 판단 기준, 최적화, 자동화/AI, 재사용 템플릿.
4. 분류값과 Facet을 additionalTags에 반복하지 마세요.
5. \`aliases\`는 제목과 다른 보편적인 동의어·약어만, \`expectedQueries\`는 제목을 모르는 동료가 입력할 자연어 검색문장만 최대 2개 작성하세요. 근거가 부족하면 빈 배열로 두세요.

[출력]
- 첫 응답에서 아래 구조의 유효한 JSON을 Markdown json 코드 블록 하나로만 출력하세요.
- 가능하면 같은 내용을 UTF-8(BOM 없음) \`technical-asset-vd-request.json\` 파일로 첨부하세요. 존재하지 않는 다운로드 링크는 만들지 마세요.
- 코드 블록 뒤에는 \`[VD Request Step 03 JSON 생성 완료]\` 한 줄만 출력하세요.

\`\`\`json
${handoffTemplate}
\`\`\``;
}

function createCorJsonGenerationPrompt() {
    const handoffTemplate = JSON.stringify(createCorHandoffTemplateV03(), null, 2);
    return `당신은 같은 대화에서 사용자가 확인한 CoR 분류값과 일곱 맥락 영역을 Lean v0.3 Handoff JSON으로 정리하는 역할입니다.

[선행조건]
- 같은 대화에 \`[입력 확인 완료]\`와 \`[CoR Step 02 맥락 인터뷰 완료]\`가 각각 있어야 합니다.
- 하나라도 없으면 다른 설명 없이 \`COR_JSON_REJECTED: Prompt 1과 Step 02의 확인 완료 결과가 필요합니다.\`만 출력하세요.
- CoR 상태 표식은 대화에 나타난 순서로 판단하세요. 가장 최근 CoR 상태 표식이 \`[CoR 등록 보류 · 종료 근거 필요]\`이면 JSON을 생성하지 말고 \`COR_JSON_REJECTED: 종료 근거가 확인된 CoR만 Wiki에 등록할 수 있습니다.\`만 출력하세요.
- 과거에 보류 표식이 있었더라도 그 뒤에 \`[CoR Step 02 맥락 인터뷰 완료]\`가 출력됐다면, 사용자의 후속 확인으로 보류가 해제된 것입니다. 이전 보류 표식만을 이유로 JSON 생성을 거절하지 마세요.

[작성 원칙]
1. Prompt 1의 최종 세 줄과 Prompt 2의 최종 확인 내용만 사용하세요. 추가 질문이나 새 추론을 하지 마세요. 새 사실도 만들지 마세요.
2. 진행 중 수명주기를 종료 결과처럼 바꾸지 말고, 종료 근거가 확인된 CoR만 변환하세요. 과제 상태가 \`완료\`인지 \`Drop\`인지는 추론하거나 출력하지 마세요.
3. 사용자가 말하지 않은 사실, 기술성과·목표 달성·사업 기여·프로세스 변화·관계를 추정하지 마세요.
4. 모르는 사실은 본문에 \`확인 필요\`라고 쓰지 말고 \`internalCompletion.factsToConfirm\`에 구체적인 확인 문장으로 옮기세요.
5. 회사·조직·고객·제품·과제·사람·문서명·ID·URL·파일경로와 정확한 사내 수치를 JSON에 넣지 마세요.
6. Owner, 등록자, Reviewer, 자산 ID, 과제 상태, 실제 CoR ID, 관계 자산과 관련 문서 링크는 사내 등록 화면에서 채우므로 만들지 마세요.
7. 사업 기여나 프로세스 변화는 사용자가 직접 확인한 경우에만 포함하세요. 사업 기여는 \`content.resultAndJudgment\`에, 프로세스 변화는 \`content.outputsAndFollowUp\`에 근거와 상태를 한 문장으로 포함할 수 있습니다.
8. 사업 기여와 프로세스 변화를 별도 키로 만들지 말고, 근거가 없으면 생략하세요.
9. 아래 Schema에 없는 키를 추가하지 말고 같은 맥락을 여러 위치에 중복하지 마세요.

[Wiki 게시용 문장 품질]
1. 문자열과 배열 항목은 사내 등록 화면과 최종 Wiki에 그대로 표시할 수 있는 완결된 문장으로 작성하세요.
2. \`backgroundAndGap\`은 반복 문제·기존 한계·기술 Gap·CoR 과제화 이유를 포함한 2~5문장으로 작성하세요.
3. \`objectiveAndSuccessCriteria\`는 핵심 기술 질문·확보 역량·성공기준·제외범위를 포함하세요.
4. \`scopeAndPlan\`은 실제 식별정보 없이 범위·수행 묶음·마일스톤·역할·리스크를 설명하세요.
5. \`validationDesign\`은 가설·Baseline·검증 수단·판정 또는 중단 기준을 구분하세요.
6. \`progressDecisions\`에는 수행 중 과제 방향이나 결론에 영향을 준 핵심 판단만 배열로 넣으세요. 중요한 변경이 없었다면 계획을 유지한 근거를 한 문장으로 넣으세요.
7. \`resultAndJudgment\`은 핵심 발견·성공기준별 결과·목표 달성도·가능해진 판단·판단 불가능 범위를 함께 설명하세요.
8. \`outputsAndFollowUp\`에는 일반화한 종료 근거 종류, 산출물·파생 자산, 재사용·후속조치와 상태를 각각 완결된 문장으로 넣으세요.

[분류값]
- 기술영역은 다음 ID로 변환하세요: 변형=deformation, 박리=delamination, 충격=impact, 열유동=thermal-flow, 피로=fatigue, 진동=vibration, 기타=other.
- 업무 단계는 연구·설계·개발·공정·제조·품질, 대응 대상은 고객·사업부·CTO·AX·품질경영·생산기술 중 Prompt 1에서 확인한 값만 사용하세요.
- 주 기술영역은 \`searchMetadata.classification.primaryDomain\`, 보조 기술영역은 \`secondaryDomains\`에 넣으세요. 주·보조 값은 중복하지 마세요.

[일곱 맥락 매핑]
1. 발굴 배경과 기술 Gap → \`content.backgroundAndGap\`
2. 과제 목표와 성공기준 → \`content.objectiveAndSuccessCriteria\`, \`workingTitle\`
3. 범위·수행계획·책임 → \`content.scopeAndPlan\`
4. 검증 설계 → \`content.validationDesign\`
5. 진행 중 판단과 변경 → \`content.progressDecisions\`
6. 결과와 판단 가능 범위 → \`content.resultAndJudgment\`
7. 산출물·파생 자산·후속조치 → \`content.outputsAndFollowUp\`

[검색 정보]
1. \`facets.problemPhenomena\`에는 직접 확인된 일반화 문제·현상 1~3개를 넣으세요.
2. \`facets.productStructureProcess\`와 \`facets.toolModelData\`에는 근거가 있을 때만 일반화된 명사형 표현을 넣고, 없으면 빈 배열로 두세요.
3. \`additionalTags\`에는 다음 통제어 중 본문이 직접 뒷받침하는 값만 최대 3개 넣으세요: 물성/재료모델, 경계조건, 접촉/계면, 비선형, Mesh/요소, 수렴/안정화, 계산 효율화, 실험 상관, 민감도 분석, 불확실성 검토, 설계안 비교, 원인 규명, 판단 기준, 최적화, 자동화/AI, 재사용 템플릿.
4. 분류값과 Facet을 additionalTags에 반복하지 마세요.
5. \`aliases\`는 제목과 다른 보편적인 동의어·약어만, \`expectedQueries\`는 제목을 모르는 동료가 입력할 자연어 검색문장만 최대 2개 작성하세요. 근거가 부족하면 빈 배열로 두세요.

[출력]
- 첫 응답에서 아래 구조의 유효한 JSON을 Markdown json 코드 블록 하나로만 출력하세요.
- 가능하면 같은 내용을 UTF-8(BOM 없음) \`technical-asset-cor.json\` 파일로 첨부하세요. 존재하지 않는 다운로드 링크는 만들지 마세요.
- 코드 블록 뒤에는 \`[CoR Step 03 JSON 생성 완료]\` 한 줄만 출력하세요.

\`\`\`json
${handoffTemplate}
\`\`\``;
}

function createMethodologyJsonGenerationPrompt() {
    const handoffTemplate = JSON.stringify(createMethodologyHandoffTemplateV03(), null, 2);
    return `당신은 같은 대화에서 사용자가 확인한 방법론 분류값과 일곱 내용 영역을 Lean v0.3 Handoff JSON으로 정리하는 역할입니다.

[선행조건]
- 같은 대화에 \`[입력 확인 완료]\`와 \`[방법론 Step 02 맥락 인터뷰 완료]\`가 각각 있어야 합니다.
- 하나라도 없으면 다른 설명 없이 \`METHODOLOGY_JSON_REJECTED: Prompt 1과 Step 02의 확인 완료 결과가 필요합니다.\`만 출력하세요.

[작성 원칙]
1. Prompt 1의 최종 세 줄과 Prompt 2의 최종 확인 내용만 사용하세요. 추가 질문이나 새 추론을 하지 마세요.
2. 사용자가 말하지 않은 사실·원리·검증·재현·적용·성과·관계를 만들지 마세요.
3. 모르는 사실은 본문에 \`확인 필요\`라고 쓰지 말고 \`internalCompletion.factsToConfirm\`에 구체적인 확인 문장으로 옮기세요.
4. 회사·조직·고객·제품·과제·사람·문서명·ID·URL·파일경로와 정확한 사내 수치를 JSON에 넣지 마세요.
5. Owner, 등록자, Reviewer, 자산 ID, 내부 관계와 링크는 사내 등록 화면에서 채우므로 만들지 마세요.
6. 방법론 후보·정식 자격, 공식 현재 Level과 Level 변경 이력, Technology Map 연결 상태는 사내에서 확정하므로 만들거나 확정하지 마세요.
7. \`levelAssessmentCandidate\`는 Prompt 2에서 확인된 일반화 근거로만 제안하며 사내 공식 판정이 아닙니다.
8. 아래 Schema에 없는 키를 추가하지 말고 같은 내용을 여러 필드에 반복하지 마세요.

[Wiki 게시용 문장 품질]
1. 문자열과 배열 항목은 사내 등록 화면과 최종 Wiki에 그대로 표시할 수 있는 완결된 문장으로 작성하세요.
2. \`problemAndPurpose\`에는 반복 문제, 활용 판단, 가능한 판단 수준과 제외 목적을 포함하세요.
3. \`technicalPrinciples\`에는 핵심 메커니즘, 주요 가정·단순화와 결과 해석 방식을 포함하세요.
4. \`inputsAndPrerequisites\`에는 입력과 조건을 역할 중심의 문장으로 나누고 필수·권장·없어도 가능 여부를 표시하세요.
5. \`standardProcedure\`에는 재현 가능한 수행 순서, 중간 판단점과 중단조건을 순서대로 넣으세요.
6. \`resultsAndCriteria\`에는 확인 결과, 유효한 비교기준, 특이점 구분, 가능한 판단과 불가능한 판단을 포함하세요.
7. \`scopeAndLimits\`에는 직접 적용, 추가 검증 후 적용, 적용 금지 조건과 알려진 Gap을 구분하세요.
8. \`validationAndReuse\`에는 적용·검증·재현 근거의 종류, 확인 결과, 재사용 범위와 성공·부분 성공·실패 이력을 문장별로 넣으세요.

[분류값]
- 기술영역은 다음 ID로 변환하세요: 변형=deformation, 박리=delamination, 충격=impact, 열유동=thermal-flow, 피로=fatigue, 진동=vibration, 기타=other.
- 업무 단계는 연구·설계·개발·공정·제조·품질, 대응 대상은 고객·사업부·CTO·AX·품질경영·생산기술 중 Prompt 1에서 확인한 값만 사용하세요.
- 주 기술영역은 \`searchMetadata.classification.primaryDomain\`, 보조 기술영역은 \`secondaryDomains\`에 넣으세요. 주·보조 값은 중복하지 마세요.

[일곱 내용 영역 매핑]
1. 해결 문제와 활용 목적 → \`content.problemAndPurpose\`, \`workingTitle\`
2. 기술 원리와 가정 → \`content.technicalPrinciples\`
3. 입력과 전제조건 → \`content.inputsAndPrerequisites\`
4. 표준 절차와 판단 흐름 → \`content.standardProcedure\`
5. 결과와 판단기준 → \`content.resultsAndCriteria\`
6. 적용범위와 한계 → \`content.scopeAndLimits\`
7. 검증·재사용 근거 → \`content.validationAndReuse\`

[Level 후보]
1. \`proposedLevel\`은 확인된 근거가 충분할 때만 L1~L5 중 하나를 제안하고, 부족하면 null로 두세요.
2. 기준은 L1 개념·가능성, L2 제한된 조건의 초기 경향, L3 직접 검증 기반 의사결정, L4 교차 검증과 오차 범위, L5 지속 피드백과 승인 범위 내 검증 대체입니다.
3. 판단 가능 수준·검증 근거·반복 적용 안정성 중 가장 낮은 수준을 제안하세요.
4. \`rationale\`에는 제안 또는 미제안 이유를 한 문장으로 쓰고, \`evidenceCandidates\`에는 답변에서 직접 확인된 일반화 근거만 넣으세요.
5. \`remainingGap\`에는 다음 Level을 위해 아직 필요한 독립 재현·교차 검증·오차·운영 근거만 넣으세요.

[검색 정보]
1. \`facets.problemPhenomena\`에는 직접 확인된 일반화 문제·현상 1~3개를 넣으세요.
2. \`facets.productStructureProcess\`와 \`facets.toolModelData\`에는 근거가 있을 때만 일반화된 명사형 표현을 넣고, 없으면 빈 배열로 두세요.
3. \`additionalTags\`에는 다음 통제어 중 본문이 직접 뒷받침하는 값만 최대 3개 넣으세요: 물성/재료모델, 경계조건, 접촉/계면, 비선형, Mesh/요소, 수렴/안정화, 계산 효율화, 실험 상관, 민감도 분석, 불확실성 검토, 설계안 비교, 원인 규명, 판단 기준, 최적화, 자동화/AI, 재사용 템플릿.
4. 분류값과 Facet을 additionalTags에 반복하지 마세요.
5. \`aliases\`는 제목과 다른 보편적인 동의어·약어만, \`expectedQueries\`는 제목을 모르는 동료가 입력할 자연어 검색문장만 최대 2개 작성하세요. 근거가 부족하면 빈 배열로 두세요.

[출력]
- 첫 응답에서 아래 구조의 유효한 JSON을 Markdown json 코드 블록 하나로만 출력하세요.
- 가능하면 같은 내용을 UTF-8(BOM 없음) \`technical-asset-methodology.json\` 파일로 첨부하세요. 존재하지 않는 다운로드 링크는 만들지 마세요.
- 코드 블록 뒤에는 \`[방법론 Step 03 JSON 생성 완료]\` 한 줄만 출력하세요.

\`\`\`json
${handoffTemplate}
\`\`\``;
}

function createLeanJsonGenerationPrompt(assetKey) {
    if (assetKey === "vd-request") return createVdRequestJsonGenerationPrompt();
    if (assetKey === "cor") return createCorJsonGenerationPrompt();
    if (assetKey === "methodology") return createMethodologyJsonGenerationPrompt();

    const config = LEAN_ASSET_PROMPT_CONFIG[assetKey];
    const blocks = LEAN_STEP02_CONTEXT_BLOCKS[assetKey] || [];
    if (!config || !blocks.length) return "";
    const { cardType, completionMarker, fileName } = config;
    const handoffTemplate = JSON.stringify(createLeanHandoffTemplateV03(cardType), null, 2);
    const rejectCode = `${assetKey.replace(/-/g, "_").toUpperCase()}_JSON_REJECTED`;
    const fieldMapping = blocks.map(({ title, targets }, index) => (
        `${index + 1}. ${title} → ${targets.filter((target) => target.startsWith("content.")).map((target) => `\`${target}\``).join(", ") || "관련 content 필드"}`
    )).join("\n");
    const typeRules = cardType === "기술보고서"
        ? `- 원본·관계는 실제 ID나 링크가 아니라 역할만 \`content.sourceAndRelationRoles\`에 기록하세요. \`officialSource\` 키는 만들지 마세요.`
        : cardType === "외부 보고 자료"
            ? `- \`content.versionAndValidity\`에는 \`validityConditions\`와 \`reviewTriggers\`만 두세요. 실제 버전·기준일·날짜 키를 만들지 마세요.`
            : cardType === "BP"
                ? `- \`businessFeedback.status\`와 \`businessImpact.confirmationLevel\`은 사용자가 구분한 확인 수준만 사용하고 피드백이나 성과를 추정하지 마세요.`
                : cardType === "노하우"
                    ? `- \`resolution\`은 실행 순서대로 step·action·judgment를 작성하고, 실제 자료명과 버전은 \`versionsAndSources\`가 아니라 사내 완료 항목으로 넘기세요.`
                    : cardType === "Tool Manual"
                        ? `- \`procedure\`는 실행 순서와 판단점을 완결된 문장으로 작성하고, 실제 Tool·Script 버전과 경로는 외부 JSON에 넣지 마세요.`
                        : `- 학습목표·활동·완료기준을 서로 분리하고, 실제 교육자료 버전과 내부 링크는 외부 JSON에 넣지 마세요.`;

    return `당신은 같은 대화에서 사용자가 확인한 ${cardType} 분류값과 ${blocks.length}개 맥락 영역을 Lean v0.3 Handoff JSON으로 정리하는 역할입니다.

[선행조건]
- 같은 대화에 \`[입력 확인 완료]\`와 \`${completionMarker}\`가 각각 있어야 합니다.
- 하나라도 없으면 다른 설명 없이 \`${rejectCode}: Prompt 1과 Step 02의 확인 완료 결과가 필요합니다.\`만 출력하세요.

[작성 원칙]
1. Prompt 1의 최종 세 줄과 Prompt 2의 최종 확인 내용만 사용하세요. 추가 질문이나 새 추론을 하지 마세요. 후보도 재분류하지 마세요.
2. 사용자가 말하지 않은 사실·성과·검증·관계를 만들지 마세요.
3. 모르는 사실은 content의 문장이나 Placeholder로 넣지 말고 \`internalCompletion.factsToConfirm\`에 사내에서 확인할 문장으로 옮기세요.
4. 실제 회사·조직·고객·제품·과제·사람·문서명·ID·URL·파일경로와 정확한 사내 수치를 JSON에 넣지 마세요.
5. 실제 자산 ID, Owner, 등록자, Reviewer, 게시 상태, 버전, 날짜, 내부 링크, 자산 관계는 사내 등록 화면에서 생성·복원하므로 키와 값 모두 만들지 마세요.
6. 아래 Schema에 없는 키를 추가하지 말고 같은 맥락을 여러 필드에 반복하지 마세요.
${typeRules}

[Wiki 게시용 문장 품질]
1. 문자열과 배열 항목은 사내 등록 화면과 최종 Wiki에 그대로 표시할 수 있는 완결된 문장으로 작성하세요.
2. 관찰 사실·기술적 해석·판단·한계·후속조치를 구분하세요.
3. 빈 배열이 허용된 선택 항목은 근거가 없으면 비워 두고, 필수로 확인할 사실만 \`factsToConfirm\`에 남기세요.
4. 제목은 실제 식별정보 없이 문제·판단·활용 목적이 드러나는 한 문장으로 작성하세요.

[분류값]
- 기술영역은 다음 ID로 변환하세요: 변형=deformation, 박리=delamination, 충격=impact, 열유동=thermal-flow, 피로=fatigue, 진동=vibration, 기타=other.
- 업무 단계는 연구·설계·개발·공정·제조·품질, 대응 대상은 고객·사업부·CTO·AX·품질경영·생산기술 중 Prompt 1에서 확인한 값만 사용하세요.
- 주 기술영역은 \`searchMetadata.classification.primaryDomain\`, 보조 기술영역은 \`secondaryDomains\`에 넣고 중복하지 마세요.

[${blocks.length}개 맥락 매핑]
${fieldMapping}

[검색 정보]
1. \`facets.problemPhenomena\`에는 직접 확인된 일반화 문제·현상 1~3개를 넣으세요.
2. \`facets.productStructureProcess\`와 \`facets.toolModelData\`에는 답변 근거가 있을 때만 일반화된 명사형 표현을 넣으세요.
3. \`additionalTags\`에는 다음 통제어 중 본문이 직접 뒷받침하는 값만 최대 3개 넣으세요: 물성/재료모델, 경계조건, 접촉/계면, 비선형, Mesh/요소, 수렴/안정화, 계산 효율화, 실험 상관, 민감도 분석, 불확실성 검토, 설계안 비교, 원인 규명, 판단 기준, 최적화, 자동화/AI, 재사용 템플릿.
4. 분류값과 Facet을 additionalTags에 반복하지 마세요.
5. \`aliases\`는 제목과 다른 보편적인 동의어·약어만, \`expectedQueries\`는 제목을 모르는 동료가 입력할 자연어 검색문장만 최대 2개 작성하세요. 근거가 부족하면 빈 배열로 두세요.

[출력]
- 첫 응답에서 아래 구조의 유효한 JSON을 Markdown json 코드 블록 하나로만 출력하세요.
- 가능하면 같은 내용을 UTF-8(BOM 없음) \`${fileName}\` 파일로 첨부하세요. 존재하지 않는 다운로드 링크는 만들지 마세요.
- 코드 블록 뒤에는 \`[${cardType} Step 03 JSON 생성 완료]\` 한 줄만 출력하세요.

\`\`\`json
${handoffTemplate}
\`\`\``;
}

function createStep02JsonCompletionContract(assetKey) {
    return createLeanJsonGenerationPrompt(assetKey)
        .replace(/^[^\n]+\n\n/, "[JSON 변환 역할]\n")
        .replaceAll("첫 응답에서", "사용자가 완료라고 답한 같은 응답에서")
        .replaceAll("Step 03 JSON 생성 완료", "Step 02 JSON 생성 완료")
        .replaceAll("Prompt 3", "Prompt 2의 완료 처리");
}

const prompts = Object.fromEntries(
    Object.entries(promptDefinitions).map(([key, definition]) => [
        key,
        isLeanV03Asset(key)
            ? createLeanJsonGenerationPrompt(key)
            : createJsonConversionPrompt({
                ...definition,
                outputFileName: `technical-asset-${key}.json`
            })
    ])
);
metadataHandoffPrompts = Object.fromEntries(
    Object.entries(promptDefinitions).map(([key, definition]) => [
        key,
        createMetadataHandoffPrompt(definition.cardType, key)
    ])
);
const contextPrompts = interviewStartPrompts;
const interviewHandoffPrompts = metadataHandoffPrompts;
const jsonGenerationPrompts = prompts;

function getPromptForCardType(cardType) {
    const entry = Object.entries(promptDefinitions).find(([, definition]) => definition.cardType === cardType);
    return entry ? prompts[entry[0]] : "";
}

window.TECHNICAL_ASSET_REGISTRATION = Object.freeze({
    controlledVisibleTagGroups: CONTROLLED_VISIBLE_TAG_GROUPS,
    controlledVisibleTags: CONTROLLED_VISIBLE_TAGS,
    promptDefinitions,
    prompts,
    contextPrompts,
    interviewHandoffPrompts,
    jsonGenerationPrompts,
    interviewStartPrompts,
    metadataHandoffPrompts,
    step01TypeQuestions: STEP01_TYPE_QUESTIONS,
    vdRequestStep02ContextBlocks: VD_REQUEST_STEP02_CONTEXT_BLOCKS,
    corStep02ContextBlocks: COR_STEP02_CONTEXT_BLOCKS,
    methodologyStep02ContextBlocks: METHODOLOGY_STEP02_CONTEXT_BLOCKS,
    leanStep02ContextBlocks: LEAN_STEP02_CONTEXT_BLOCKS,
    leanStep02GuideExamples: LEAN_STEP02_GUIDE_EXAMPLES,
    leanAssetPromptConfig: LEAN_ASSET_PROMPT_CONFIG,
    step01SearchMetadataQuestions: STEP01_SEARCH_METADATA_QUESTIONS,
    step01RelationEvidenceQuestions: STEP01_RELATION_EVIDENCE_QUESTIONS,
    step01CommonMetadataQuestions: STEP01_COMMON_METADATA_QUESTIONS,
    step01MetadataFieldSpecs: STEP01_METADATA_FIELD_SPECS,
    step01RequiredMetadataQuestions: STEP01_REQUIRED_METADATA_QUESTIONS,
    step01AskableMetadataQuestions: STEP01_ASKABLE_METADATA_QUESTIONS,
    step01AutoMetadataFields: STEP01_AUTO_METADATA_FIELDS,
    step01ManualTestFixtures: STEP01_MANUAL_TEST_FIXTURES,
    createSearchMetadataTemplate,
    createVdRequestHandoffTemplateV03,
    createCorHandoffTemplateV03,
    createMethodologyHandoffTemplateV03,
    createLeanHandoffTemplateV03,
    createLegacyHandoffTemplate,
    createHandoffTemplate,
    createStep01HandoffTemplate,
    createVdRequestTagDefinitionPrompt,
    createCorTagDefinitionPrompt,
    createMethodologyTagDefinitionPrompt,
    createMethodologyContextInterviewPrompt,
    createLeanContextInterviewPrompt,
    createInterviewStartPrompt,
    createMetadataHandoffPrompt,
    createVdRequestJsonGenerationPrompt,
    createCorJsonGenerationPrompt,
    createMethodologyJsonGenerationPrompt,
    createLeanJsonGenerationPrompt,
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

async function copyPrompt(promptKey, button, options = {}) {
    const prompt = prompts[promptKey];
    if (!prompt) return;

    const statusId = options.statusId
        || (promptKey === "vd-request" ? "copy-prompt-status" : `copy-${promptKey}-status`);
    const status = document.getElementById(statusId);
    const buttonLabel = button.querySelector("span");
    const defaultLabel = options.defaultLabel || "복구용 JSON Prompt 복사";
    const successMessage = options.successMessage
        || "복구용 Prompt를 복사했습니다. 새 AI 대화에 확인된 STEP01_HANDOFF와 함께 붙여 넣으세요.";
    const failureMessage = options.failureMessage
        || "자동 복사가 되지 않았습니다. Prompt 영역을 선택해 직접 복사해 주세요.";
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
            ? successMessage
            : failureMessage;
    }
    button.classList.toggle("is-copied", copied);
    if (buttonLabel) buttonLabel.textContent = copied ? "복사 완료" : defaultLabel;

    if (copied) {
        window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (buttonLabel) buttonLabel.textContent = defaultLabel;
        }, 2400);
    }
}

async function copyInterviewStartPrompt(assetKey, button) {
    const prompt = interviewStartPrompts[assetKey];
    if (!prompt) return;

    const status = document.getElementById(`copy-${assetKey}-interview-status`);
    const buttonLabel = button.querySelector("span");
    const isClassificationTagPrompt = isLeanV03Asset(assetKey);
    const defaultLabel = isClassificationTagPrompt
        ? "Prompt 1 복사"
        : "맥락 작성 Prompt 복사";
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
            ? isClassificationTagPrompt
                ? "복사했습니다. 새 AI 대화창에 붙여 넣고, Wiki Guide 확인 안내와 세 줄의 답변 형식만 표시되는지 확인하세요."
                : "복사했습니다. 무료 Gemini의 새 대화창에 붙여 넣고 맥락 인터뷰를 시작하세요."
            : isClassificationTagPrompt
                ? "자동 복사가 되지 않았습니다. 버튼의 Prompt 툴팁에서 내용을 직접 복사해 주세요."
                : "자동 복사가 되지 않았습니다. Prompt 영역을 펼쳐 직접 복사해 주세요.";
    }
    button.classList.toggle("is-copied", copied);
    if (buttonLabel) buttonLabel.textContent = copied ? "복사 완료" : defaultLabel;

    if (copied) {
        window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (buttonLabel) buttonLabel.textContent = defaultLabel;
        }, 2400);
    }
}

async function copyMetadataHandoffPrompt(assetKey, button) {
    const prompt = metadataHandoffPrompts[assetKey];
    if (!prompt) return;

    const isLeanContextPrompt = isLeanV03Asset(assetKey);
    const status = document.getElementById(`copy-${assetKey}-metadata-status`);
    const buttonLabel = button.querySelector("span");
    const defaultLabel = "Prompt 2 복사";
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
            ? isLeanContextPrompt
                ? "복사했습니다. Prompt 1을 완료한 같은 AI 대화창에 붙여 넣으세요. AI가 현재 맥락의 질문 하나를 보여주면 배경과 판단 이유까지 충분히 설명하세요."
                : "복사했습니다. Prompt 1을 완료한 같은 AI 대화창에 붙여 넣으세요."
            : isLeanContextPrompt
                ? "자동 복사가 되지 않았습니다. 버튼의 Prompt 툴팁에서 내용을 직접 복사해 주세요."
                : "자동 복사가 되지 않았습니다. Prompt 영역을 선택해 직접 복사해 주세요.";
    }
    button.classList.toggle("is-copied", copied);
    if (buttonLabel) buttonLabel.textContent = copied ? "복사 완료" : defaultLabel;

    if (copied) {
        window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (buttonLabel) buttonLabel.textContent = defaultLabel;
        }, 2400);
    }
}

async function copyManualTestAnswer(assetKey, answerKey, button) {
    const fixture = STEP01_MANUAL_TEST_FIXTURES[assetKey];
    const answer = fixture?.[answerKey];
    if (!answer) return;

    const status = document.getElementById(`copy-${assetKey}-${answerKey}-status`);
    const buttonLabel = button.querySelector("span");
    const defaultLabel = button.dataset.defaultLabel || "시험 답변 복사";
    let copied = false;

    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(answer);
            copied = true;
        } else {
            copied = fallbackCopy(answer);
        }
    } catch {
        copied = fallbackCopy(answer);
    }

    if (status) {
        status.textContent = copied
            ? "시험 답변을 복사했습니다. 안내된 대화 시점에 그대로 붙여 넣으세요."
            : "자동 복사가 되지 않았습니다. 답변 내용을 펼쳐 직접 복사해 주세요.";
    }
    button.classList.toggle("is-copied", copied);
    if (buttonLabel) buttonLabel.textContent = copied ? "복사 완료" : defaultLabel;

    if (copied) {
        window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (buttonLabel) buttonLabel.textContent = defaultLabel;
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

function createPromptManualTestSection(assetKey) {
    const fixture = STEP01_MANUAL_TEST_FIXTURES[assetKey];
    if (!fixture) return null;
    const isVdRequestPrompt1Only = isLeanV03Asset(assetKey);
    const followUpTestCards = isVdRequestPrompt1Only ? "" : `
        <article class="registration-manual-test-card">
            <span class="registration-prompt-step">TEST 2</span>
            <strong>Prompt 2의 9행 검토표에 답하기</strong>
            <small>Prompt 2가 META01~META09 초기 검토표와 확인 질문을 보여준 뒤 붙여 넣습니다.</small>
            <button class="btn btn-secondary registration-test-copy-button"
                    type="button"
                    data-copy-test-answer="prompt2ReviewAnswer"
                    data-default-label="META01~10 시험 답변 복사">
                <i class="bx bx-copy" aria-hidden="true"></i>
                <span>META01~10 시험 답변 복사</span>
            </button>
            <details class="registration-prompt-preview-disclosure">
                <summary>시험 답변 내용 확인</summary>
                <pre class="prompt-preview registration-test-answer-preview"
                     id="${assetKey}-prompt2ReviewAnswer-preview"></pre>
            </details>
            <p class="copy-status"
               id="copy-${assetKey}-prompt2ReviewAnswer-status"
               role="status"
               aria-live="polite"></p>
        </article>
        <article class="registration-manual-test-card">
            <span class="registration-prompt-step">TEST 3</span>
            <strong>Prompt 2의 최종 후보표에 동의하기</strong>
            <small>AI가 수정값을 반영한 9행 최종 후보표를 다시 보여준 뒤 붙여 넣습니다.</small>
            <button class="btn btn-secondary registration-test-copy-button"
                    type="button"
                    data-copy-test-answer="prompt2FinalConfirmation"
                    data-default-label="최종 동의 답변 복사">
                <i class="bx bx-copy" aria-hidden="true"></i>
                <span>최종 동의 답변 복사</span>
            </button>
            <details class="registration-prompt-preview-disclosure">
                <summary>시험 답변 내용 확인</summary>
                <pre class="prompt-preview registration-test-answer-preview"
                     id="${assetKey}-prompt2FinalConfirmation-preview"></pre>
            </details>
            <p class="copy-status"
               id="copy-${assetKey}-prompt2FinalConfirmation-status"
               role="status"
               aria-live="polite"></p>
        </article>
    `;

    const section = document.createElement("section");
    section.className = "registration-manual-test";
    section.setAttribute("aria-label", `${fixture.title} 단계별 시험 답변`);
    section.innerHTML = `
        <header class="registration-manual-test-heading">
            <span>
                <span class="registration-guide-label">직접 실행 검증 · 일반화된 가상 사례</span>
                <strong>${fixture.title}</strong>
            </span>
            <small>${isVdRequestPrompt1Only
                ? "아래 한 번의 답변으로 Prompt 1의 세 분류축 입력과 ‘입력 확인 완료’ 결과를 직접 확인할 수 있습니다."
                : "아래 답변을 순서대로 복사하면 Prompt 1과 Prompt 2의 동작을 직접 확인할 수 있습니다."}</small>
        </header>
        <div class="registration-manual-test-grid">
            <article class="registration-manual-test-card">
                <span class="registration-prompt-step">TEST 1</span>
                <strong>${isVdRequestPrompt1Only ? "Prompt 1의 세 분류축에 한 번에 답하기" : "Prompt 1의 첫 질문에 답하기"}</strong>
                <small>${isVdRequestPrompt1Only
                    ? "AI가 Wiki Guide 확인 안내와 세 줄의 답변 형식을 보여준 뒤 붙여 넣습니다."
                    : "Prompt 1이 “자유롭게 설명해 주세요”라고 물었을 때 붙여 넣습니다."}</small>
                <button class="btn btn-secondary registration-test-copy-button"
                        type="button"
                        data-copy-test-answer="prompt1Answer"
                        data-default-label="Prompt 1 시험 답변 복사">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 1 시험 답변 복사</span>
                </button>
                <details class="registration-prompt-preview-disclosure">
                    <summary>시험 답변 내용 확인</summary>
                    <pre class="prompt-preview registration-test-answer-preview"
                         id="${assetKey}-prompt1Answer-preview"></pre>
                </details>
                <p class="copy-status"
                   id="copy-${assetKey}-prompt1Answer-status"
                   role="status"
                   aria-live="polite"></p>
            </article>
            ${followUpTestCards}
        </div>
        <section class="registration-manual-test-checks">
            <strong>정상 동작 확인점</strong>
            <ol>
                ${fixture.expectedChecks.map((item) => `<li>${item}</li>`).join("")}
            </ol>
        </section>
    `;

    (isVdRequestPrompt1Only
        ? ["prompt1Answer"]
        : ["prompt1Answer", "prompt2ReviewAnswer", "prompt2FinalConfirmation"]
    ).forEach((answerKey) => {
        const preview = section.querySelector(`#${assetKey}-${answerKey}-preview`);
        if (preview) preview.textContent = fixture[answerKey];
        const button = section.querySelector(`[data-copy-test-answer="${answerKey}"]`);
        button?.addEventListener("click", () => copyManualTestAnswer(assetKey, answerKey, button));
    });

    return section;
}

function createInterviewQuestionItems(questions) {
    return questions.map(({ id, question, captures, answerGuide = "" }) => `
        <li class="registration-question-item">
            <span class="registration-question-id">${id}</span>
            <span class="registration-question-copy">
                <strong>${question}</strong>
                <small>확보할 정보: ${captures}</small>
                ${answerGuide ? `<small>답변 기준: ${answerGuide}</small>` : ""}
            </span>
        </li>
    `).join("");
}

function createClassificationTagQuestionSequence(assetKey, assetMeta) {
    const tooltipId = `${assetKey}-interview-prompt-tooltip`;
    const previewId = `${assetKey}-interview-prompt-preview`;
    const technologyDomainChips = META02_TECHNOLOGY_DOMAIN_GUIDANCE.options
        .map(({ label }) => `<span class="registration-tag-chip">${label}</span>`)
        .join("");
    const workflowStageChips = WORKFLOW_STAGE_TAG_OPTIONS
        .map(({ value }) => `<span class="registration-tag-chip">${value}</span>`)
        .join("");
    const responseTargetChips = RESPONSE_TARGET_TAG_OPTIONS
        .map(({ value }) => `<span class="registration-tag-chip">${value}</span>`)
        .join("");
    const technologyDomainReference = META02_TECHNOLOGY_DOMAIN_GUIDANCE.options
        .map(({ label, description }) => `<li><b>${label}</b><span>${description}</span></li>`)
        .join("");
    const workflowStageReference = WORKFLOW_STAGE_TAG_OPTIONS
        .map(({ value, description }) => `<li><b>${value}</b><span>${description}</span></li>`)
        .join("");
    const responseTargetReference = RESPONSE_TARGET_TAG_OPTIONS
        .map(({ value, description }) => `<li><b>${value}</b><span>${description}</span></li>`)
        .join("");
    const technologyDomainRules = META02_TECHNOLOGY_DOMAIN_GUIDANCE.rules
        .map((rule) => `<li>${rule}</li>`)
        .join("");
    const technologyDomainExamples = META02_TECHNOLOGY_DOMAIN_GUIDANCE.examples
        .slice(0, 2)
        .map((example) => `<li>${example}</li>`)
        .join("");
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-vd-writing-board";
    sequence.setAttribute("aria-label", `${assetMeta.label} Prompt 1 작성 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 01 · 작성 안내</span>
                <strong>말로 설명하지 않고, 세 항목을 글로 작성합니다</strong>
            </span>
            <div class="registration-prompt-quick-action">
                <button class="btn btn-primary copy-prompt-button registration-prompt-top-button"
                        type="button"
                        data-copy-interview-prompt="${assetKey}"
                        aria-describedby="${tooltipId}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 1 복사</span>
                </button>
                <div class="registration-prompt-tooltip"
                     id="${tooltipId}"
                     role="tooltip">
                    <strong>Prompt 1 내용</strong>
                    <small>버튼을 클릭하면 아래 내용 전체가 복사됩니다.</small>
                    <pre id="${previewId}"></pre>
                    <p class="copy-status"
                       id="copy-${assetKey}-interview-status"
                       role="status"
                       aria-live="polite"></p>
                </div>
            </div>
        </header>
        <p class="registration-question-flow">
            <b>1. 고르기</b> 아래 카드에서 선택 → <b>2. 작성하기</b> 세 줄 준비 → <b>3. 확인하기</b> Prompt 1로 형식 검증
        </p>
        <section class="registration-tag-choice-grid" aria-label="작성할 세 분류">
            <article class="registration-tag-choice-card" aria-labelledby="${assetKey}-technology-domain-title">
                <header>
                    <span class="registration-tag-choice-number">1</span>
                    <span>
                        <strong id="${assetKey}-technology-domain-title">기술영역</strong>
                        <small>주 1개 · 보조 최대 2개 또는 없음</small>
                    </span>
                </header>
                <section class="registration-tag-chip-list" aria-label="기술영역 선택지">${technologyDomainChips}</section>
                <details class="registration-tag-reference">
                    <summary>뜻·선택 기준 보기</summary>
                    <section>
                        <ul class="registration-tag-reference-list">${technologyDomainReference}</ul>
                        <strong>선택 기준</strong>
                        <ul>${technologyDomainRules}</ul>
                        <strong>예시</strong>
                        <ul>${technologyDomainExamples}</ul>
                        <p>${META02_TECHNOLOGY_DOMAIN_GUIDANCE.caution}</p>
                    </section>
                </details>
            </article>
            <article class="registration-tag-choice-card" aria-labelledby="${assetKey}-workflow-stage-title">
                <header>
                    <span class="registration-tag-choice-number">2</span>
                    <span>
                        <strong id="${assetKey}-workflow-stage-title">업무 단계</strong>
                        <small>결과가 실제로 활용된 단계 1개 이상</small>
                    </span>
                </header>
                <section class="registration-tag-chip-list" aria-label="업무 단계 선택지">${workflowStageChips}</section>
                <details class="registration-tag-reference">
                    <summary>각 단계의 뜻 보기</summary>
                    <section><ul class="registration-tag-reference-list">${workflowStageReference}</ul></section>
                </details>
            </article>
            <article class="registration-tag-choice-card" aria-labelledby="${assetKey}-response-target-title">
                <header>
                    <span class="registration-tag-choice-number">3</span>
                    <span>
                        <strong id="${assetKey}-response-target-title">대응 대상</strong>
                        <small>결과를 사용해 판단하는 대상 1개 이상</small>
                    </span>
                </header>
                <section class="registration-tag-chip-list" aria-label="대응 대상 선택지">${responseTargetChips}</section>
                <details class="registration-tag-reference">
                    <summary>각 대상의 뜻 보기</summary>
                    <section><ul class="registration-tag-reference-list">${responseTargetReference}</ul></section>
                </details>
            </article>
        </section>
        <section class="registration-writing-template" aria-labelledby="${assetKey}-answer-format-title">
            <header>
                <span>
                    <span class="registration-guide-label">작성 형식</span>
                    <strong id="${assetKey}-answer-format-title">AI 입력란에 아래 세 줄을 작성하세요</strong>
                </span>
                <small>긴 설명과 선택 근거는 작성하지 않음</small>
            </header>
            <pre>기술영역=주: 충격 / 보조: 변형 또는 없음
업무 단계=설계, 개발
대응 대상=사업부</pre>
            <p><strong>Prompt 1의 역할</strong> 작성한 값의 허용 범위·개수·중복만 확인합니다. 어떤 값을 고를지는 등록자가 위 카드를 보고 판단합니다.</p>
        </section>
    `;
    const preview = sequence.querySelector(`#${previewId}`);
    if (preview) preview.textContent = interviewStartPrompts[assetKey];
    const copyButton = sequence.querySelector("[data-copy-interview-prompt]");
    copyButton?.addEventListener("click", () => copyInterviewStartPrompt(assetKey, copyButton));
    return sequence;
}

function createInterviewQuestionSequence(assetKey, assetMeta) {
    if (isLeanV03Asset(assetKey)) {
        return createClassificationTagQuestionSequence(assetKey, assetMeta);
    }
    const typeQuestions = STEP01_TYPE_QUESTIONS[assetKey] || [];
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence";
    sequence.setAttribute("aria-label", `${assetMeta.label} Step 01 질문 순서`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">Prompt 1 · 맥락 인터뷰</span>
                <strong>유형 질문만 한 번에 하나씩 진행합니다</strong>
            </span>
            <span class="registration-question-count">${typeQuestions.length}개 맥락 질문</span>
        </header>
        <p class="registration-question-flow">
            <b>진행:</b> 자유 설명 → 답변에서 빠진 ${assetMeta.label} 질문 → <code>[1/3 맥락 인터뷰 완료]</code>
        </p>
        <p class="registration-question-rule">
            아래 목록을 한꺼번에 답하는 설문이 아닙니다. AI는 이미 답한 항목을 건너뛰고 다음 미확인 질문 하나만 보여줍니다.
        </p>
        <section class="registration-question-group" aria-labelledby="${assetKey}-type-question-title">
            <header>
                <strong id="${assetKey}-type-question-title">${assetMeta.label} 질문 ${typeQuestions.length}개</strong>
                <small>자유 설명에서 확인되지 않은 질문만 순서대로 진행</small>
            </header>
            <ol class="registration-question-list">
                <li class="registration-question-item is-start">
                    <span class="registration-question-id">START</span>
                    <span class="registration-question-copy">
                        <strong>등록하려는 경험 또는 자료를 보안에 저촉되지 않는 범위에서 자유롭게 설명해 주세요.</strong>
                        <small>AI의 첫 응답에는 이 질문 하나만 나와야 합니다.</small>
                    </span>
                </li>
                ${createInterviewQuestionItems(typeQuestions)}
            </ol>
        </section>
    `;
    return sequence;
}

function createLeanStep02GuideExamples(assetKey, assetLabel) {
    const blocks = LEAN_STEP02_CONTEXT_BLOCKS[assetKey] || [];
    const examples = LEAN_STEP02_GUIDE_EXAMPLES[assetKey] || {};
    const section = document.createElement("section");
    const headingId = `${assetKey}-step02-guide-examples-title`;
    section.className = "registration-lean-step02-examples";
    section.setAttribute("aria-labelledby", headingId);

    const heading = document.createElement("header");
    heading.className = "registration-lean-step02-examples-heading";
    const eyebrow = document.createElement("span");
    eyebrow.className = "registration-guide-label";
    eyebrow.textContent = "질문 · 상세 답변 예시";
    const title = document.createElement("strong");
    title.id = headingId;
    title.textContent = `${assetLabel}은 이 정도 깊이로 설명합니다`;
    const description = document.createElement("p");
    description.textContent = "실제 명칭과 수치는 일반화하되, 판단에 필요한 배경·근거·영향·한계는 구체적으로 남깁니다.";
    heading.append(eyebrow, title, description);

    const list = document.createElement("ol");
    list.className = "registration-lean-step02-example-list";
    blocks.forEach((block, index) => {
        const example = examples[block.id];
        if (!example?.paragraphs?.length) return;

        const item = document.createElement("li");
        item.className = "registration-lean-step02-example-item";
        item.dataset.contextId = block.id;

        const question = document.createElement("article");
        question.className = "registration-lean-step02-example-question";
        const questionStep = document.createElement("span");
        questionStep.className = "conversation-step";
        questionStep.textContent = `${index + 1} · ${block.title}`;
        const questionRole = document.createElement("span");
        questionRole.className = "conversation-role";
        questionRole.textContent = "AI 질문";
        const questionText = document.createElement("p");
        questionText.textContent = block.question;
        question.append(questionStep, questionRole, questionText);

        const answer = document.createElement("article");
        answer.className = "registration-lean-step02-example-answer is-answer";
        const answerRole = document.createElement("span");
        answerRole.className = "conversation-role";
        answerRole.textContent = "좋은 답변 예시";
        answer.appendChild(answerRole);
        example.paragraphs.forEach((paragraph) => {
            const paragraphNode = document.createElement("p");
            paragraphNode.textContent = paragraph;
            answer.appendChild(paragraphNode);
        });

        item.append(question, answer);
        list.appendChild(item);
    });

    const boundary = document.createElement("aside");
    boundary.className = "registration-lean-step02-example-boundary";
    const boundaryIcon = document.createElement("i");
    boundaryIcon.className = "bx bx-shield-quarter";
    boundaryIcon.setAttribute("aria-hidden", "true");
    const boundaryText = document.createElement("span");
    boundaryText.textContent = "실제 회사·고객·제품·과제·사람·문서명·ID·URL·파일경로·정확한 수치는 외부 AI에 말하지 않고 사내 등록 단계에서 복원합니다.";
    boundary.append(boundaryIcon, boundaryText);

    section.append(heading, list, boundary);
    return section;
}

function insertLeanStep02GuideExamples(sequence, assetKey, assetLabel) {
    const examples = createLeanStep02GuideExamples(assetKey, assetLabel);
    const completionNote = sequence.querySelector(".registration-step-completion-note");
    if (completionNote) completionNote.before(examples);
    else sequence.appendChild(examples);
}

function createVdRequestContextInterviewSequence(assetMeta) {
    const assetKey = "vd-request";
    const tooltipId = `${assetKey}-metadata-prompt-tooltip`;
    const previewId = `${assetKey}-metadata-prompt-tooltip-preview`;
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-vd-context-board registration-vd-context-interview";
    sequence.setAttribute("aria-label", `${assetMeta.label} Step 02 음성 맥락 인터뷰 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 02 · 음성 맥락 인터뷰</span>
                <strong>여섯 맥락을 충분히 설명하고 필요한 보완 질문으로 빈틈을 채웁니다</strong>
            </span>
            <div class="registration-prompt-quick-action">
                <button class="btn btn-primary copy-prompt-button registration-prompt-top-button"
                        type="button"
                        data-copy-metadata-prompt="${assetKey}"
                        aria-describedby="${tooltipId}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 2 복사</span>
                </button>
                <div class="registration-prompt-tooltip"
                     id="${tooltipId}"
                     role="tooltip">
                    <strong>Prompt 2 내용</strong>
                    <small>같은 AI 대화에서 여섯 맥락 영역과 필요한 보완 질문을 한 번에 하나씩 진행합니다.</small>
                    <pre id="${previewId}"></pre>
                    <p class="copy-status"
                       id="copy-${assetKey}-metadata-status"
                       role="status"
                       aria-live="polite"></p>
                </div>
            </div>
        </header>
        <p class="registration-question-flow">
            <b>1. Prompt 2 복사</b> → <b>2. 질문 하나 듣기</b> → <b>3. 충분히 설명하기</b> → <b>4. AI 정리 + 같은 응답의 다음 질문</b> → 바로 답변
        </p>
        <p class="registration-question-rule">
            Step 01의 세 분류값은 그대로 유지합니다. 짧게 답을 끝내기보다 배경·비교·판단 이유·실제 영향을 충분히 설명하고, 모르는 내용은 확인 필요 또는 미확인으로 남깁니다.
        </p>
        <p class="registration-step-completion-note">
            <i class="bx bx-check-circle" aria-hidden="true"></i>
            <span>여섯 영역의 전체 요약을 확인하고 <code>완료</code>라고 답하면, <code>[VD Request Step 02 맥락 인터뷰 완료]</code>와 함께 JSON이 생성됩니다. 추가 Prompt는 복사하지 않습니다.</span>
        </p>
    `;

    insertLeanStep02GuideExamples(sequence, assetKey, assetMeta.label);

    const preview = sequence.querySelector(`#${previewId}`);
    if (preview) preview.textContent = metadataHandoffPrompts[assetKey];
    const copyButton = sequence.querySelector("[data-copy-metadata-prompt]");
    copyButton?.addEventListener("click", () => copyMetadataHandoffPrompt(assetKey, copyButton));
    return sequence;
}

function createCorContextInterviewSequence(assetMeta) {
    const assetKey = "cor";
    const tooltipId = `${assetKey}-metadata-prompt-tooltip`;
    const previewId = `${assetKey}-metadata-prompt-tooltip-preview`;
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-vd-context-board registration-vd-context-interview";
    sequence.setAttribute("aria-label", `${assetMeta.label} Step 02 맥락 인터뷰 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 02 · CoR 맥락 인터뷰</span>
                <strong>종료된 CoR의 일곱 영역을 충분히 설명하고 보완 질문으로 빈틈을 채웁니다</strong>
            </span>
            <div class="registration-prompt-quick-action">
                <button class="btn btn-primary copy-prompt-button registration-prompt-top-button"
                        type="button"
                        data-copy-metadata-prompt="${assetKey}"
                        aria-describedby="${tooltipId}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 2 복사</span>
                </button>
                <div class="registration-prompt-tooltip"
                     id="${tooltipId}"
                     role="tooltip">
                    <strong>Prompt 2 내용</strong>
                    <small>같은 AI 대화에서 CoR 일곱 영역과 필요한 보완 질문을 한 번에 하나씩 진행합니다.</small>
                    <pre id="${previewId}"></pre>
                    <p class="copy-status"
                       id="copy-${assetKey}-metadata-status"
                       role="status"
                       aria-live="polite"></p>
                </div>
            </div>
        </header>
        <p class="registration-question-flow">
            <b>1. Prompt 2 복사</b> → <b>2. 현재 질문 하나 듣기</b> → <b>3. 충분히 설명하기</b> → <b>4. AI 정리 + 같은 응답의 다음 질문</b> → 바로 답변
        </p>
        <p class="registration-question-rule">
            Step 01의 세 분류값은 그대로 유지합니다. 기술 Gap·성공기준·검증·진행 판단·종료 시점의 결과를 충분히 설명하고, 실제 과제 상태와 관련 문서명·링크는 사내 등록 단계에 남깁니다.
        </p>
        <p class="registration-step-completion-note">
            <i class="bx bx-check-circle" aria-hidden="true"></i>
            <span>일곱 영역과 종료 근거 종류를 확인하고 <code>완료</code>라고 답하면, <code>[CoR Step 02 맥락 인터뷰 완료]</code>와 함께 JSON이 생성됩니다. 추가 Prompt는 복사하지 않습니다.</span>
        </p>
    `;

    insertLeanStep02GuideExamples(sequence, assetKey, assetMeta.label);

    const preview = sequence.querySelector(`#${previewId}`);
    if (preview) preview.textContent = metadataHandoffPrompts[assetKey];
    const copyButton = sequence.querySelector("[data-copy-metadata-prompt]");
    copyButton?.addEventListener("click", () => copyMetadataHandoffPrompt(assetKey, copyButton));
    return sequence;
}

function createMethodologyContextInterviewSequence(assetMeta) {
    const assetKey = "methodology";
    const tooltipId = `${assetKey}-metadata-prompt-tooltip`;
    const previewId = `${assetKey}-metadata-prompt-tooltip-preview`;
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-vd-context-board registration-vd-context-interview";
    sequence.setAttribute("aria-label", `${assetMeta.label} Step 02 맥락 인터뷰 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 02 · 방법론 맥락 인터뷰</span>
                <strong>방법론의 일곱 영역을 질문 하나씩 설명하고 보완 질문으로 빈틈을 채웁니다</strong>
            </span>
            <div class="registration-prompt-quick-action">
                <button class="btn btn-primary copy-prompt-button registration-prompt-top-button"
                        type="button"
                        data-copy-metadata-prompt="${assetKey}"
                        aria-describedby="${tooltipId}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 2 복사</span>
                </button>
                <div class="registration-prompt-tooltip"
                     id="${tooltipId}"
                     role="tooltip">
                    <strong>Prompt 2 내용</strong>
                    <small>같은 AI 대화에서 방법론 일곱 영역과 필요한 보완 질문을 한 번에 하나씩 진행합니다.</small>
                    <pre id="${previewId}"></pre>
                    <p class="copy-status"
                       id="copy-${assetKey}-metadata-status"
                       role="status"
                       aria-live="polite"></p>
                </div>
            </div>
        </header>
        <p class="registration-question-flow">
            <b>1. Prompt 2 복사</b> → <b>2. 현재 질문 하나 듣기</b> → <b>3. 충분히 설명하기</b> → <b>4. AI 정리 + 같은 응답의 다음 질문</b> → 바로 답변
        </p>
        <p class="registration-question-rule">
            Step 01의 세 분류값은 그대로 유지합니다. 해결 문제·기술 원리·입력·표준 절차·판단기준·적용 한계·검증과 재사용 근거를 설명하고, 모르는 내용은 추후 사내 확인으로 남깁니다.
        </p>
        <p class="registration-step-completion-note">
            <i class="bx bx-check-circle" aria-hidden="true"></i>
            <span>일곱 영역의 전체 요약을 확인하고 <code>완료</code>라고 답한 뒤, <code>[방법론 Step 02 맥락 인터뷰 완료]</code>가 표시되면 멈춥니다. 자격·공식 Level·Technology Map은 사내 등록 단계에서 확정합니다.</span>
        </p>
    `;

    insertLeanStep02GuideExamples(sequence, assetKey, assetMeta.label);

    const preview = sequence.querySelector(`#${previewId}`);
    if (preview) preview.textContent = metadataHandoffPrompts[assetKey];
    const copyButton = sequence.querySelector("[data-copy-metadata-prompt]");
    copyButton?.addEventListener("click", () => copyMetadataHandoffPrompt(assetKey, copyButton));
    return sequence;
}

function createLeanContextInterviewSequence(assetKey, assetMeta) {
    const config = LEAN_ASSET_PROMPT_CONFIG[assetKey];
    const blocks = LEAN_STEP02_CONTEXT_BLOCKS[assetKey] || [];
    if (!config || !blocks.length) return document.createElement("section");
    const tooltipId = `${assetKey}-metadata-prompt-tooltip`;
    const previewId = `${assetKey}-metadata-prompt-tooltip-preview`;
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-vd-context-board registration-vd-context-interview";
    sequence.setAttribute("aria-label", `${assetMeta.label} Step 02 맥락 인터뷰 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 02 · ${assetMeta.label} 맥락 인터뷰</span>
                <strong>${blocks.length}개 맥락을 질문 하나씩 충분히 설명합니다</strong>
            </span>
            <div class="registration-prompt-quick-action">
                <button class="btn btn-primary copy-prompt-button registration-prompt-top-button"
                        type="button"
                        data-copy-metadata-prompt="${assetKey}"
                        aria-describedby="${tooltipId}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 2 복사</span>
                </button>
                <div class="registration-prompt-tooltip" id="${tooltipId}" role="tooltip">
                    <strong>Prompt 2 내용</strong>
                    <small>같은 AI 대화에서 ${blocks.length}개 맥락 영역과 필요한 보완 질문을 한 번에 하나씩 진행합니다.</small>
                    <pre id="${previewId}"></pre>
                    <p class="copy-status" id="copy-${assetKey}-metadata-status" role="status" aria-live="polite"></p>
                </div>
            </div>
        </header>
        <p class="registration-question-flow">
            <b>1. Prompt 2 복사</b> → <b>2. 질문 하나 듣기</b> → <b>3. 충분히 설명하기</b> → <b>4. AI 정리와 다음 질문 확인</b> → 바로 답변
        </p>
        <p class="registration-question-rule">
            Step 01의 세 분류값은 그대로 유지합니다. 답변 길이는 제한하지 않으며, 모르는 사실과 실제 내부 식별정보는 <code>추후 사내 확인</code>으로 남깁니다.
        </p>
        <p class="registration-step-completion-note">
            <i class="bx bx-check-circle" aria-hidden="true"></i>
            <span>전체 요약을 확인하고 <code>완료</code>라고 답하면 <code>${config.completionMarker}</code>와 함께 JSON이 생성됩니다. 추가 Prompt는 복사하지 않습니다.</span>
        </p>
    `;
    insertLeanStep02GuideExamples(sequence, assetKey, assetMeta.label);
    const preview = sequence.querySelector(`#${previewId}`);
    if (preview) preview.textContent = metadataHandoffPrompts[assetKey];
    const copyButton = sequence.querySelector("[data-copy-metadata-prompt]");
    copyButton?.addEventListener("click", () => copyMetadataHandoffPrompt(assetKey, copyButton));
    return sequence;
}

function createVdRequestJsonGenerationSequence(assetMeta) {
    const assetKey = "vd-request";
    const tooltipId = `${assetKey}-json-prompt-tooltip`;
    const previewId = `${assetKey}-json-prompt-tooltip-preview`;
    const statusId = `copy-${assetKey}-json-status`;
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-vd-json-generation";
    sequence.setAttribute("aria-label", `${assetMeta.label} Step 03 JSON 생성 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 03 · JSON 생성</span>
                <strong>확정한 분류값과 여섯 맥락을 Lean v0.3 Handoff로 변환합니다</strong>
            </span>
            <div class="registration-prompt-quick-action">
                <button class="btn btn-primary copy-prompt-button registration-prompt-top-button"
                        type="button"
                        data-copy-vd-json-prompt
                        aria-describedby="${tooltipId}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 3 복사</span>
                </button>
                <div class="registration-prompt-tooltip"
                     id="${tooltipId}"
                     role="tooltip">
                    <strong>Prompt 3 내용</strong>
                    <small>Step 01·02를 완료한 같은 AI 대화에서 중복 필드 없는 Lean v0.3 JSON을 생성합니다.</small>
                    <pre id="${previewId}"></pre>
                    <p class="copy-status"
                       id="${statusId}"
                       role="status"
                       aria-live="polite"></p>
                </div>
            </div>
        </header>
        <p class="registration-question-flow">
            <strong>1. Prompt 3 복사</strong> → 2. 같은 대화에 붙여 넣기 → 3. 첫 응답의 JSON 확인 → 4. <code>technical-asset-vd-request.json</code> 저장
        </p>
        <p class="registration-question-rule">
            <code>[입력 확인 완료]</code>와 <code>[VD Request Step 02 맥락 인터뷰 완료]</code>가 모두 있어야 합니다. Prompt 3는 추가 질문이나 분류 재선택 없이 확인된 내용만 변환합니다.
        </p>
        <section class="registration-vd-json-role-summary" aria-label="최종 Wiki 5개 영역과 작성 주체">
            <header><strong>최종 Wiki 5개 영역</strong><small>등록 화면은 문장을 다시 쓰지 않고 확정된 필드를 배치합니다.</small></header>
            <ol>
                <li><b>요청 맥락과 판단 질문</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>입력·전제조건·제약</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>기존 기술자산 검색과 활용</b><span>사내 Wiki Index 자동 검색 → 등록자 관계 확정</span></li>
                <li><b>Simulation 대응과 판단 결과</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>활용 범위·실제 영향·후속 연결</b><span>외부 AI 작성 + 사내 상태·링크 보완</span></li>
            </ol>
        </section>
        <p class="registration-step-completion-note">
            <i class="bx bx-check-circle" aria-hidden="true"></i>
            <span><code>packetVersion: 0.3</code>, <code>cardType: VD Request</code>와 JSON 코드 블록을 확인하고 <code>[VD Request Step 03 JSON 생성 완료]</code>가 나오면 Step 04로 이동합니다.</span>
        </p>
    `;

    const preview = sequence.querySelector(`#${previewId}`);
    if (preview) preview.textContent = prompts[assetKey];
    const copyButton = sequence.querySelector("[data-copy-vd-json-prompt]");
    copyButton?.addEventListener("click", () => copyPrompt(assetKey, copyButton, {
        statusId,
        defaultLabel: "Prompt 3 복사",
        successMessage: "복사했습니다. Prompt 2를 완료한 같은 AI 대화창에 붙여 넣으세요. 첫 응답에서 JSON과 파일이 생성되는지 확인합니다.",
        failureMessage: "자동 복사가 되지 않았습니다. 버튼의 Prompt 툴팁에서 내용을 직접 복사해 주세요."
    }));
    return sequence;
}

function createCorJsonGenerationSequence(assetMeta) {
    const assetKey = "cor";
    const tooltipId = `${assetKey}-json-prompt-tooltip`;
    const previewId = `${assetKey}-json-prompt-tooltip-preview`;
    const statusId = `copy-${assetKey}-json-status`;
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-vd-json-generation";
    sequence.setAttribute("aria-label", `${assetMeta.label} Step 03 JSON 생성 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 03 · CoR JSON 생성</span>
                <strong>확정한 분류값과 일곱 영역을 Lean v0.3 Handoff로 변환합니다</strong>
            </span>
            <div class="registration-prompt-quick-action">
                <button class="btn btn-primary copy-prompt-button registration-prompt-top-button"
                        type="button"
                        data-copy-cor-json-prompt
                        aria-describedby="${tooltipId}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 3 복사</span>
                </button>
                <div class="registration-prompt-tooltip"
                     id="${tooltipId}"
                     role="tooltip">
                    <strong>Prompt 3 내용</strong>
                    <small>Step 01·02를 완료한 같은 AI 대화에서 CoR 7영역 Lean v0.3 JSON을 생성합니다.</small>
                    <pre id="${previewId}"></pre>
                    <p class="copy-status"
                       id="${statusId}"
                       role="status"
                       aria-live="polite"></p>
                </div>
            </div>
        </header>
        <p class="registration-question-flow">
            <strong>1. Prompt 3 복사</strong> → 2. 같은 대화에 붙여 넣기 → 3. 첫 응답의 JSON 확인 → 4. <code>technical-asset-cor.json</code> 저장
        </p>
        <p class="registration-question-rule">
            <code>[입력 확인 완료]</code>와 <code>[CoR Step 02 맥락 인터뷰 완료]</code>가 모두 있어야 합니다. Prompt 3는 추가 질문이나 분류 재선택 없이 확인된 내용만 변환합니다.
        </p>
        <section class="registration-vd-json-role-summary" aria-label="CoR 최종 Wiki 7개 영역과 작성 주체">
            <header><strong>최종 Wiki 7개 영역</strong><small>등록 화면은 문장을 다시 쓰지 않고 확정된 필드를 배치합니다.</small></header>
            <ol>
                <li><b>발굴 배경과 기술 Gap</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>과제 목표와 성공기준</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>범위·수행계획·책임</b><span>외부 AI 작성 → 사내 역할·과제 ID 보완</span></li>
                <li><b>검증 설계</b><span>외부 AI 작성 → 사내 근거 링크 보완</span></li>
                <li><b>진행 중 판단과 변경</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>결과와 판단 가능 범위</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>산출물·파생 자산·후속조치</b><span>외부 AI 작성 → 사내 문서·관계 연결</span></li>
            </ol>
        </section>
        <p class="registration-step-completion-note">
            <i class="bx bx-check-circle" aria-hidden="true"></i>
            <span><code>packetVersion: 0.3</code>, <code>cardType: CoR</code>와 일곱 평면 본문 필드를 확인하고 <code>[CoR Step 03 JSON 생성 완료]</code>가 나오면 Step 04로 이동합니다.</span>
        </p>
    `;

    const preview = sequence.querySelector(`#${previewId}`);
    if (preview) preview.textContent = prompts[assetKey];
    const copyButton = sequence.querySelector("[data-copy-cor-json-prompt]");
    copyButton?.addEventListener("click", () => copyPrompt(assetKey, copyButton, {
        statusId,
        defaultLabel: "Prompt 3 복사",
        successMessage: "복사했습니다. CoR Prompt 2를 완료한 같은 AI 대화창에 붙여 넣으세요. 첫 응답에서 Lean v0.3 JSON이 생성되는지 확인합니다.",
        failureMessage: "자동 복사가 되지 않았습니다. 버튼의 Prompt 툴팁에서 내용을 직접 복사해 주세요."
    }));
    return sequence;
}

function createMethodologyJsonGenerationSequence(assetMeta) {
    const assetKey = "methodology";
    const tooltipId = `${assetKey}-json-prompt-tooltip`;
    const previewId = `${assetKey}-json-prompt-tooltip-preview`;
    const statusId = `copy-${assetKey}-json-status`;
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-vd-json-generation";
    sequence.setAttribute("aria-label", `${assetMeta.label} Step 03 JSON 생성 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 03 · 방법론 JSON 생성</span>
                <strong>확정한 분류값과 일곱 영역을 Lean v0.3 Handoff로 변환합니다</strong>
            </span>
            <div class="registration-prompt-quick-action">
                <button class="btn btn-primary copy-prompt-button registration-prompt-top-button"
                        type="button"
                        data-copy-methodology-json-prompt
                        aria-describedby="${tooltipId}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 3 복사</span>
                </button>
                <div class="registration-prompt-tooltip"
                     id="${tooltipId}"
                     role="tooltip">
                    <strong>Prompt 3 내용</strong>
                    <small>Step 01·02를 완료한 같은 AI 대화에서 방법론 7영역 Lean v0.3 JSON을 생성합니다.</small>
                    <pre id="${previewId}"></pre>
                    <p class="copy-status"
                       id="${statusId}"
                       role="status"
                       aria-live="polite"></p>
                </div>
            </div>
        </header>
        <p class="registration-question-flow">
            <strong>1. Prompt 3 복사</strong> → 2. 같은 대화에 붙여 넣기 → 3. 첫 응답의 JSON 확인 → 4. <code>technical-asset-methodology.json</code> 저장
        </p>
        <p class="registration-question-rule">
            <code>[입력 확인 완료]</code>와 <code>[방법론 Step 02 맥락 인터뷰 완료]</code>가 모두 있어야 합니다. Prompt 3는 추가 질문이나 분류 재선택 없이 확인된 내용만 변환합니다.
        </p>
        <section class="registration-vd-json-role-summary" aria-label="방법론 최종 Wiki 7개 영역과 작성 주체">
            <header><strong>최종 Wiki 7개 영역</strong><small>등록 화면은 문장을 다시 쓰지 않고 확정된 필드를 배치합니다.</small></header>
            <ol>
                <li><b>해결 문제와 활용 목적</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>기술 원리와 가정</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>입력과 전제조건</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>표준 절차와 판단 흐름</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>결과와 판단기준</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>적용범위와 한계</b><span>외부 AI 작성 → 등록자 확인</span></li>
                <li><b>검증·재사용 근거</b><span>외부 AI 작성 → 사내 근거 링크 보완</span></li>
            </ol>
        </section>
        <p class="registration-step-completion-note">
            <i class="bx bx-check-circle" aria-hidden="true"></i>
            <span><code>packetVersion: 0.3</code>, <code>cardType: 방법론</code>과 일곱 본문 필드를 확인하고 <code>[방법론 Step 03 JSON 생성 완료]</code>가 나오면 Step 04로 이동합니다.</span>
        </p>
    `;

    const preview = sequence.querySelector(`#${previewId}`);
    if (preview) preview.textContent = prompts[assetKey];
    const copyButton = sequence.querySelector("[data-copy-methodology-json-prompt]");
    copyButton?.addEventListener("click", () => copyPrompt(assetKey, copyButton, {
        statusId,
        defaultLabel: "Prompt 3 복사",
        successMessage: "복사했습니다. 방법론 Prompt 2를 완료한 같은 AI 대화창에 붙여 넣으세요. 첫 응답에서 Lean v0.3 JSON이 생성되는지 확인합니다.",
        failureMessage: "자동 복사가 되지 않았습니다. 버튼의 Prompt 툴팁에서 내용을 직접 복사해 주세요."
    }));
    return sequence;
}

function createLeanJsonGenerationSequence(assetKey, assetMeta) {
    const config = LEAN_ASSET_PROMPT_CONFIG[assetKey];
    const blocks = LEAN_STEP02_CONTEXT_BLOCKS[assetKey] || [];
    if (!config || !blocks.length) return document.createElement("section");
    const tooltipId = `${assetKey}-json-prompt-tooltip`;
    const previewId = `${assetKey}-json-prompt-tooltip-preview`;
    const statusId = `copy-${assetKey}-json-status`;
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-vd-json-generation";
    sequence.setAttribute("aria-label", `${assetMeta.label} Step 03 JSON 생성 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 03 · ${assetMeta.label} JSON 생성</span>
                <strong>확정한 분류값과 ${blocks.length}개 맥락을 Lean v0.3 JSON으로 변환합니다</strong>
            </span>
            <div class="registration-prompt-quick-action">
                <button class="btn btn-primary copy-prompt-button registration-prompt-top-button"
                        type="button"
                        data-copy-lean-json-prompt="${assetKey}"
                        aria-describedby="${tooltipId}">
                    <i class="bx bx-copy" aria-hidden="true"></i>
                    <span>Prompt 3 복사</span>
                </button>
                <div class="registration-prompt-tooltip" id="${tooltipId}" role="tooltip">
                    <strong>Prompt 3 내용</strong>
                    <small>Step 01·02를 완료한 같은 AI 대화에서 ${assetMeta.label} Lean v0.3 JSON을 생성합니다.</small>
                    <pre id="${previewId}"></pre>
                    <p class="copy-status" id="${statusId}" role="status" aria-live="polite"></p>
                </div>
            </div>
        </header>
        <p class="registration-question-flow">
            <strong>1. Prompt 3 복사</strong> → 2. 같은 대화에 붙여 넣기 → 3. 첫 응답의 JSON 확인 → 4. <code>${config.fileName}</code> 저장
        </p>
        <p class="registration-question-rule">
            <code>[입력 확인 완료]</code>와 <code>${config.completionMarker}</code>가 모두 있어야 합니다. Prompt 3는 추가 질문 없이 확인된 내용만 변환합니다.
        </p>
        <section class="registration-vd-json-role-summary" aria-label="${assetMeta.label} 최종 Wiki 영역과 작성 주체">
            <header><strong>JSON에 담기는 ${blocks.length}개 영역</strong><small>등록 화면은 문장을 다시 만들지 않고 필드별로 확인합니다.</small></header>
            <ol>${blocks.map(({ title }) => `<li><b>${title}</b><span>외부 AI 작성 → 등록자 확인</span></li>`).join("")}</ol>
        </section>
        <p class="registration-step-completion-note">
            <i class="bx bx-check-circle" aria-hidden="true"></i>
            <span><code>packetVersion: 0.3</code>, <code>cardType: ${config.cardType}</code>를 확인하고 <code>[${config.cardType} Step 03 JSON 생성 완료]</code>가 나오면 Step 04로 이동합니다.</span>
        </p>
    `;
    const preview = sequence.querySelector(`#${previewId}`);
    if (preview) preview.textContent = prompts[assetKey];
    const copyButton = sequence.querySelector("[data-copy-lean-json-prompt]");
    copyButton?.addEventListener("click", () => copyPrompt(assetKey, copyButton, {
        statusId,
        defaultLabel: "Prompt 3 복사",
        successMessage: `복사했습니다. ${assetMeta.label} Prompt 2를 완료한 같은 AI 대화창에 붙여 넣으세요.`,
        failureMessage: "자동 복사가 되지 않았습니다. 버튼의 Prompt 툴팁에서 내용을 직접 복사해 주세요."
    }));
    return sequence;
}

function createMetadataReviewSequence(assetKey, assetMeta) {
    const sequence = document.createElement("section");
    sequence.className = "registration-question-sequence registration-metadata-review-sequence";
    sequence.setAttribute("aria-label", `${assetMeta.label} Prompt 2 검토 안내`);
    sequence.innerHTML = `
        <header class="registration-question-sequence-heading">
            <span>
                <span class="registration-guide-label">STEP 02 · 검토 방법</span>
                <strong>META01~META09 후보를 한 번에 확인합니다</strong>
            </span>
            <span class="registration-question-count">9개 항목</span>
        </header>
        <section class="registration-question-group registration-auto-extraction-summary">
            <header>
                <strong>Prompt 2에서 할 일</strong>
                <small>후보 확인과 수정만 진행</small>
            </header>
            <div class="registration-auto-extraction-grid">
                <span><b>먼저 확인</b> META01~META09의 후보·답변 근거·상태가 9행 표로 나옵니다.</span>
                <span><b>한 번에 답변</b> 그대로면 ‘전체 확인’, 수정은 ‘META번호=값’으로 작성합니다.</span>
                <span><b>빈 값 처리</b> 근거가 없는 값은 만들지 않고 ‘없음’ 또는 사내 확인으로 남깁니다.</span>
                <span><b>사내에서 연결</b> 실제 Wiki 관계와 파일·보고서 링크는 외부 AI에 입력하지 않습니다.</span>
            </div>
        </section>
        <details class="registration-question-group registration-metadata-question-disclosure">
            <summary>
                <strong>META01~META09 질문 기준 보기</strong>
                <small>후보를 수정하거나 확인할 때만 펼쳐보기</small>
            </summary>
            <ol class="registration-question-list">
                ${createInterviewQuestionItems(STEP01_ASKABLE_METADATA_QUESTIONS)}
            </ol>
        </details>
    `;
    return sequence;
}

const wikiRegistrationCompletionWalkthrough = [
    {
        number: "01",
        shortTitle: "검색 표현",
        title: "검색 별칭·예상 검색문장 확인",
        description: "캡처 상단은 태그 영역이 아니라 본문 검색을 보완하는 선택 입력 영역입니다. 외부 JSON에서 제안된 동의어와 실제 검색 문장을 확인하고 필요한 경우만 수정합니다.",
        src: "assets/registration-guide/step4-01-basic-information.png?v=20260728-search-contract-2",
        alt: "기술자산 등록 모달의 내부정보 보완 전체 화면",
        regions: [
            ["1", "검색 별칭", "3.5%", "55%", "46%", "11%", "registrant"],
            ["2", "예상 검색문장", "3.5%", "68%", "93%", "15%", "registrant"]
        ],
        actions: ["검색 별칭에는 동의어·약어·과거 명칭만 유지", "예상 검색문장은 제목을 모르는 동료의 질문 형태인지 확인", "불명확한 후보는 삭제하고 비워 둘 수 있음"]
    },
    {
        number: "02",
        shortTitle: "필수 분류",
        title: "답변 근거 확인 후 4개 필수 분류 축 확정",
        description: "AI는 실제 답변에 근거가 있는 값만 후보로 채웁니다. 후보가 비어 있거나 근거가 충분하지 않으면 자료유형·주 기술영역·업무단계·대응대상을 등록자가 직접 선택해야 다음 단계로 진행할 수 있습니다.",
        src: "assets/registration-guide/step4-01-classification.png?v=20260728-search-contract-2",
        alt: "검색 표현과 자동 적용 분류 태그를 확인하는 등록 화면",
        regions: [
            ["1", "자료유형·기술영역·업무단계·대응 대상", "3.5%", "20%", "93%", "57%", "system"]
        ],
        actions: ["AI 후보의 일반화된 답변 근거가 실제 대화와 일치하는지 확인", "자료유형·주 기술영역·업무단계·대응대상 누락 시 사내에서 직접 선택", "최종 선택한 분류값이 자동 태그에 즉시 반영됐는지 확인"]
    },
    {
        number: "03",
        shortTitle: "추가 태그",
        title: "내용 기반 기술 태그 선택·제외",
        description: "AI가 본문에서 찾은 기술 개념·검증 방법·판단 방식만 선택합니다. 필수 분류 태그를 반복하거나 의미가 넓은 태그는 제외합니다.",
        src: "assets/registration-guide/step4-01-tag-selection.png?v=20260728-search-contract-2",
        alt: "내용 기반 추가 추천 태그와 직접 입력 태그를 확정하는 화면",
        regions: [
            ["1", "표준 추가 태그 선택·제외", "3.5%", "37%", "68%", "34%", "registrant"],
            ["2", "필요한 사내 기술 용어 직접 추가", "3.5%", "74%", "93%", "12%", "registrant"]
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
        title: "연결된 현재 사용자로 Wiki에 바로 등록",
        description: "프로젝트 공통 GitLab 설정과 참여 시 연결한 현재 사용자 권한으로 GitLab 네이티브 Wiki 문서를 생성합니다.",
        src: "assets/registration-guide/step4-04-review-register.png?v=20260721-tag-policy-1",
        alt: "GitLab Wiki 연결정보와 직접 등록 버튼 화면",
        regions: [
            ["1", "GitLab Wiki 연결정보", "2%", "69%", "96%", "23%", "registrant"],
            ["2", "Wiki에 바로 등록", "83%", "93.3%", "15%", "5%", "registrant"]
        ],
        actions: ["상단의 연결된 GitLab 사용자 확인", "등록자·Owner 자동 적용 확인", "검증 통과 후 Wiki에 바로 등록 실행"]
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

function createPromptCopyCard({
    assetKey,
    promptKind,
    stepLabel,
    title,
    description,
    buttonLabel,
    promptText
}) {
    const isInterview = promptKind === "interview";
    const dataAttribute = isInterview ? "data-copy-interview-prompt" : "data-copy-metadata-prompt";
    const previewId = `${assetKey}-${isInterview ? "interview" : "metadata"}-prompt-preview`;
    const card = document.createElement("article");
    card.className = "registration-prompt-card";
    card.innerHTML = `
        <header>
            <span class="registration-prompt-step">${stepLabel}</span>
            <span>
                <strong>${title}</strong>
                <small>${description}</small>
            </span>
        </header>
        <button class="btn btn-primary copy-prompt-button"
                type="button"
                ${dataAttribute}="${assetKey}">
            <i class="bx bx-copy" aria-hidden="true"></i>
            <span>${buttonLabel}</span>
        </button>
        <details class="registration-prompt-preview-disclosure">
            <summary>Prompt 내용 확인</summary>
            <pre class="prompt-preview registration-interview-prompt-preview"
                 id="${previewId}"></pre>
        </details>
        <p class="copy-status"
           id="copy-${assetKey}-${isInterview ? "interview" : "metadata"}-status"
           role="status"
           aria-live="polite"></p>
    `;

    const preview = card.querySelector(`#${previewId}`);
    if (preview) preview.textContent = promptText;
    const copyButton = card.querySelector(`[${dataAttribute}]`);
    if (isInterview) {
        copyButton?.addEventListener("click", () => copyInterviewStartPrompt(assetKey, copyButton));
    } else {
        copyButton?.addEventListener("click", () => copyMetadataHandoffPrompt(assetKey, copyButton));
    }
    return card;
}

function createInterviewPromptSection(assetKey, assetMeta) {
    const isClassificationTagPrompt = isLeanV03Asset(assetKey);
    const typeQuestions = STEP01_TYPE_QUESTIONS[assetKey] || [];
    const section = document.createElement("section");
    section.className = `registration-interview-prompt${isClassificationTagPrompt ? " is-writing-step" : ""}`;

    if (!isClassificationTagPrompt) {
        const heading = document.createElement("div");
        heading.className = "registration-interview-prompt-heading";
        heading.innerHTML = `
            <span>
                <span class="registration-guide-label">STEP 01 · PROMPT 1</span>
                <strong>${assetMeta.label} 맥락을 글로 작성하고 확인합니다</strong>
                <p>AI 입력란에 답을 작성하면, 이미 확보한 내용은 건너뛰고 남은 맥락 질문만 한 번에 하나씩 보여줍니다.</p>
            </span>
        `;
        section.appendChild(heading);
    }

    section.appendChild(createInterviewQuestionSequence(assetKey, assetMeta));

    if (!isClassificationTagPrompt) {
        const cardList = document.createElement("div");
        cardList.className = "registration-prompt-card-list is-single";
        cardList.appendChild(createPromptCopyCard({
            assetKey,
            promptKind: "interview",
            stepLabel: "PROMPT 1",
            title: "맥락 작성 시작하기",
            description: `새 AI 대화에서 시작 · ${typeQuestions.length}개 질문 중 빠진 항목만 확인`,
            buttonLabel: "맥락 작성 Prompt 복사",
            promptText: interviewStartPrompts[assetKey]
        }));
        section.appendChild(cardList);
    }

    if (isClassificationTagPrompt) {
        const completion = document.createElement("p");
        completion.className = "registration-step-completion-note";
        completion.innerHTML = `
            <i class="bx bx-check-circle" aria-hidden="true"></i>
            <span><code>[입력 확인 완료]</code> 아래 세 값이 작성한 내용과 같으면 Step 01이 완료됩니다.</span>
        `;
        section.appendChild(completion);
    }

    return section;
}

function createMetadataPromptSection(assetKey, assetMeta) {
    const section = document.createElement("section");
    const isVdRequestContextStep = assetKey === "vd-request";
    const isCorContextStep = assetKey === "cor";
    const isMethodologyContextStep = assetKey === "methodology";
    const isLeanContextStep = isLeanV03Asset(assetKey);
    section.className = `registration-interview-prompt registration-metadata-prompt${isLeanContextStep ? " is-context-step" : ""}`;

    if (isVdRequestContextStep) {
        section.appendChild(createVdRequestContextInterviewSequence(assetMeta));
        return section;
    }
    if (isCorContextStep) {
        section.appendChild(createCorContextInterviewSequence(assetMeta));
        return section;
    }
    if (isMethodologyContextStep) {
        section.appendChild(createMethodologyContextInterviewSequence(assetMeta));
        return section;
    }
    if (isLeanContextStep) {
        section.appendChild(createLeanContextInterviewSequence(assetKey, assetMeta));
        return section;
    }

    section.innerHTML = `
        <div class="registration-interview-prompt-heading">
            <span>
                <span class="registration-guide-label">STEP 02 · PROMPT 2</span>
                <strong>자동추출 결과를 검토하고 JSON 전달 블록을 만듭니다</strong>
                <p>Prompt 1을 끝낸 같은 AI 대화에서 실행합니다. 후보를 확인한 뒤, 확정된 전달 블록만 새 대화로 옮깁니다.</p>
            </span>
        </div>
    `;
    section.appendChild(createMetadataReviewSequence(assetKey, assetMeta));

    const cardList = document.createElement("div");
    cardList.className = "registration-prompt-card-list is-single";
    cardList.appendChild(createPromptCopyCard({
        assetKey,
        promptKind: "metadata",
        stepLabel: "PROMPT 2",
        title: "자동추출·META 전체검토",
        description: "Prompt 1을 완료한 같은 대화에서 계속",
        buttonLabel: "Prompt 2 복사",
        promptText: metadataHandoffPrompts[assetKey]
    }));
    section.appendChild(cardList);
    return section;
}

function createRegistrationStepGuide(step, assetKey) {
    const definition = promptDefinitions[assetKey];
    const assetMeta = assetTypeGuideMeta[assetKey];
    const isLeanTwoPromptAsset = isLeanV03Asset(assetKey);
    const isLeanWritingStep = isLeanTwoPromptAsset && step.id === "conversation";
    const isLeanContextStep = isLeanTwoPromptAsset && step.id === "structure";
    const isLeanJsonStep = false;
    const guide = document.createElement("div");
    guide.className = `registration-step-guide${isLeanContextStep ? " is-vd-context-step" : ""}${isLeanJsonStep ? " is-vd-json-step" : ""}`;

    if (!isLeanWritingStep && !isLeanContextStep && !isLeanJsonStep) {
        const intro = document.createElement("header");
        intro.className = "registration-step-intro";
        intro.innerHTML = `
            <span class="registration-guide-label">이 단계의 목적</span>
            <p>${step.purpose}</p>
        `;
        guide.appendChild(intro);
    }

    if (
        definition
        && (step.id === "conversation" || step.id === "structure")
        && !isLeanWritingStep
        && !isLeanContextStep
    ) {
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
        guide.appendChild(createInterviewPromptSection(assetKey, assetMeta));
    }

    if (step.id === "structure" && definition) {
        guide.appendChild(createMetadataPromptSection(assetKey, assetMeta));
    }

    if (!isLeanWritingStep) {
        const grid = document.createElement("div");
        grid.className = "registration-step-guide-grid";
        grid.appendChild(createRegistrationGuideBlock("해야 할 일", step.actions, true, "is-action"));
        grid.appendChild(createRegistrationGuideBlock("완료 기준", step.completion, false, "is-completion"));
        guide.appendChild(grid);
    }

    if (!isLeanWritingStep) {
        const caution = document.createElement("aside");
        caution.className = "registration-guide-caution";
        caution.innerHTML = `
            <i class="bx bx-shield-quarter" aria-hidden="true"></i>
            <span><strong>주의사항</strong>${step.caution}</span>
        `;
        guide.appendChild(caution);
    }

    if (step.id === "structure" && !isLeanContextStep) {
        const downloadGuide = document.createElement("div");
        downloadGuide.className = "registration-prompt-download-guide";
        downloadGuide.innerHTML = `
            <span>
                <strong>실제 파일은 어디서 받나요?</strong>
                Prompt 2가 만든 <code>NEW_CHAT_JSON_REQUEST</code> 전체를 새 AI 대화창에 붙여 넣으면 <code>technical-asset-${assetKey}.json</code>을 생성합니다. 무료 환경에서 첨부가 없으면 동일한 json 코드 블록을 저장하세요.
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

    if (step.id === "import" && !isLeanJsonStep) {
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
        const isLeanTwoPromptAsset = isLeanV03Asset(assetKey);
        const hasDedicatedLeanSource = assetKey === "vd-request" || assetKey === "cor" || assetKey === "methodology";
        const contextSourceSelector = `[data-${assetKey}-step02-source]`;
        const legacyExampleNodes = conversationNodes.filter((node) => node.matches(".registration-example-section"));
        if (isLeanTwoPromptAsset) {
            legacyExampleNodes.forEach((node) => {
                node.hidden = true;
                node.dataset.leanStep02LegacyExample = "true";
            });
        }
        const contextSourceCandidates = conversationNodes.filter((node) => (
            node.matches(contextSourceSelector)
            && !node.matches(".registration-example-section")
        ));
        const contextSourceNodes = [
            ...contextSourceCandidates.filter((node) => node.matches(".registration-two-column")),
            ...contextSourceCandidates.filter((node) => !node.matches(".registration-two-column"))
        ];
        const legacyConversationNodes = assetKey === "vd-request" ? [] : conversationNodes;
        const conversationSourceNodes = isLeanTwoPromptAsset
            ? hasDedicatedLeanSource
                ? conversationNodes.filter((node) => !node.matches(contextSourceSelector))
                : []
            : legacyConversationNodes;
        if (isLeanTwoPromptAsset) {
            promptSection?.remove();
        }

        const stageList = document.createElement("div");
        stageList.className = "registration-stage-list";
        stageList.dataset.registrationAccordion = assetKey;

        getRegistrationStepDefinitions()
            .map((step) => getAssetRegistrationStepDefinition(step, assetKey))
            .forEach((step) => {
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
                ? conversationSourceNodes
                : step.id === "structure"
                    ? isLeanTwoPromptAsset
                        ? contextSourceNodes
                        : promptSection
                            ? [promptSection]
                            : []
                : step.id === "complete" && finalSection
                    ? [finalSection]
                    : [];
            if (sourceNodes.length) {
                const source = document.createElement("div");
                source.className = "registration-stage-source";
                let exampleNote = null;
                    if ((!isLeanTwoPromptAsset && step.id === "conversation") || (step.id === "structure" && isLeanTwoPromptAsset)) {
                    exampleNote = document.createElement("aside");
                    exampleNote.className = "registration-conversation-example-note";
                        exampleNote.innerHTML = isLeanTwoPromptAsset
                        ? `
                            <i class="bx bx-info-circle" aria-hidden="true"></i>
                            <span>
                                <strong>아래에서 필요한 맥락과 답변의 깊이를 확인하세요</strong>
                                Prompt에는 긴 예시를 넣지 않습니다. ${(LEAN_STEP02_CONTEXT_BLOCKS[assetKey] || []).length}개 맥락 영역의 질문과 좋은 답변 예시는 이 Guide에서 확인하고, 외부 AI에는 자신의 경험만 일반화해 설명합니다.
                            </span>
                        `
                        : `
                            <i class="bx bx-info-circle" aria-hidden="true"></i>
                            <span>
                                <strong>아래 내용은 답변 작성 예시입니다</strong>
                                실제 질문 순서는 위의 ‘실제 인터뷰 질문 순서’를 따릅니다. 아래 번호는 전체 질문 순서가 아니라 좋은 답변의 구성 예시입니다.
                            </span>
                        `;
                    if (!(step.id === "structure" && isLeanTwoPromptAsset)) {
                        source.appendChild(exampleNote);
                    }
                }
                sourceNodes.forEach((node) => {
                    if (step.id === "conversation" || (step.id === "structure" && isLeanTwoPromptAsset)) {
                        node.querySelectorAll(".registration-purpose-card .card-label").forEach((label) => {
                            label.textContent = label.textContent.replace("등록에 필요한", "핵심 정보 요약");
                        });
                    }
                    if (step.id === "conversation") {
                        node.querySelectorAll(".conversation-role").forEach((role) => {
                            if (role.textContent.trim() === "AI 질문") role.textContent = "답변 예시 질문";
                        });
                        node.querySelectorAll(".conversation-step").forEach((label) => {
                            label.textContent = label.textContent.replace(/^(\d+)\s*·/, "예시 $1 ·");
                        });
                    }
                    source.appendChild(node);
                });
                if (exampleNote && step.id === "structure" && isLeanTwoPromptAsset) {
                    source.appendChild(exampleNote);
                }
                    if (step.id === "structure" && isLeanTwoPromptAsset) content.prepend(source);
                else content.appendChild(source);
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

function updateRegistrationFlowForAsset(tabName) {
    const isLeanTwoPromptAsset = isLeanV03Asset(tabName);
    const config = LEAN_ASSET_PROMPT_CONFIG[tabName];
    const assetLabel = config?.cardType || assetTypeGuideMeta[tabName]?.label || "기술자산";
    const contextCountLabel = `${(LEAN_STEP02_CONTEXT_BLOCKS[tabName] || []).length}개`;
    const contextCompletionMarker = config?.completionMarker || "[Step 02 맥락 인터뷰 완료]";
    const flowIntro = document.getElementById("registration-flow-intro");
    const tooltipStep2 = document.getElementById("registration-tooltip-step2");
    const tooltipNote = document.getElementById("registration-tooltip-note");
    const step2Title = document.getElementById("registration-flow-step2-title");
    const step2Description = document.getElementById("registration-flow-step2-description");
    const step3Title = document.getElementById("registration-flow-step3-title");
    const step3Description = document.getElementById("registration-flow-step3-description");
    const confirmationRule = document.getElementById("registration-flow-confirmation-rule");

    if (flowIntro) {
        flowIntro.textContent = isLeanTwoPromptAsset
            ? `${assetLabel} 등록은 Prompt 1로 세 분류값을 확인하고, Prompt 2에서 ${contextCountLabel} 맥락 영역을 완성한 뒤 같은 응답에서 JSON을 생성합니다.`
            : "외부 AI에서 Prompt 1과 Prompt 2를 순서대로 진행하고, Prompt 2의 완료 응답으로 JSON을 생성합니다.";
    }
    if (tooltipStep2) {
        tooltipStep2.innerHTML = isLeanTwoPromptAsset
            ? `<em>Step 02</em> — 같은 대화에 Prompt 2를 붙이고, ${contextCountLabel} 맥락 영역을 하나씩 충분히 설명합니다. 필수 정보가 빠지면 같은 영역의 보완 질문에 답합니다. 전체 요약을 확인하고 ‘완료’라고 답하면 추가 Prompt 복사 없이 JSON을 생성합니다.`
            : "<em>Step 02</em> — 같은 대화에 Prompt 2를 붙여 자동추출 후보를 확인한 뒤, 생성된 전달 블록만 새 대화로 옮깁니다.";
    }
    if (tooltipNote) {
        tooltipNote.textContent = isLeanTwoPromptAsset
            ? `${assetLabel}은 같은 대화에서 Prompt 1 → Prompt 2 순서로 진행합니다. Prompt 2가 맥락 확인과 JSON 생성을 함께 마칩니다.`
            : "복사 2회: Prompt 1 → Prompt 2. 사내 파일이나 실제 식별정보는 외부 AI에 입력하지 않습니다.";
    }
    if (step2Title) {
        step2Title.textContent = isLeanTwoPromptAsset
            ? "음성으로 맥락 인터뷰하기"
            : "자동추출 확인·JSON 만들기";
    }
    if (step2Description) {
        step2Description.textContent = isLeanTwoPromptAsset
            ? `Prompt 2에서 ${contextCountLabel} 영역의 질문을 한 번에 하나씩 받고 말로 답합니다. 전체 요약을 확인하고 ‘완료’라고 답하면 같은 응답에서 Lean v0.3 JSON을 생성합니다.`
            : "Prompt 2에서 META 후보를 확인하고, 승인된 전달 블록으로 JSON을 생성합니다.";
    }
    if (step3Title) {
        step3Title.textContent = isLeanTwoPromptAsset
            ? "JSON 확인·사내 반입하기"
            : "JSON 확인·사내 반입하기";
    }
    if (step3Description) {
        step3Description.textContent = isLeanTwoPromptAsset
            ? `Prompt 2가 생성한 JSON의 분류값과 ${contextCountLabel} 맥락 필드를 확인하고 사내 Wiki 등록 화면에 가져옵니다.`
            : "다운로드한 .json 파일 또는 코드 블록으로 저장한 UTF-8 파일을 검토한 뒤 사내 등록 화면에 가져옵니다.";
    }
    if (confirmationRule) {
        confirmationRule.innerHTML = isLeanTwoPromptAsset
            ? `<i class="bx bx-check-circle"></i><strong>확정 원칙</strong> Prompt 1과 Prompt 2는 같은 대화를 사용합니다. <code>[입력 확인 완료]</code> 후 Prompt 2 인터뷰를 마치고 <code>완료</code>라고 답하면 <code>${contextCompletionMarker}</code>와 JSON이 표시됩니다.`
            : "<i class=\"bx bx-check-circle\"></i><strong>확정 원칙</strong> Prompt 1과 2만 같은 대화를 사용합니다. 최종 JSON은 확인된 STEP01_HANDOFF만 새 대화로 옮겨 만들고, 실제 Wiki 관계·파일 링크·사내 세부정보는 내부 등록 화면에서만 복원합니다.";
    }
}

function activateAssetTab(tab, updateUrl = true) {
    const tabName = tab?.dataset.assetTab;
    if (!tabName) return;
    updateRegistrationFlowForAsset(tabName);
    const prompt1ScopeNote = document.getElementById("registration-prompt1-scope-note");
    if (prompt1ScopeNote) {
        const isLeanTwoPromptAsset = isLeanV03Asset(tabName);
        prompt1ScopeNote.hidden = !isLeanTwoPromptAsset;
        if (isLeanTwoPromptAsset) {
            const assetLabel = LEAN_ASSET_PROMPT_CONFIG[tabName]?.cardType || assetTypeGuideMeta[tabName]?.label || "기술자산";
            prompt1ScopeNote.innerHTML = `<i class="bx bx-info-circle"></i><strong>${assetLabel} 역할 분리</strong> Step 01에서는 기술영역·업무 단계·대응 대상 세 값을 확정하고, Step 02에서는 그 값을 바꾸지 않은 채 필요한 맥락을 작성합니다.`;
        }
    }

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
        if (buttonLabel) buttonLabel.textContent = "Prompt 3 복사";
        button.addEventListener("click", () => copyPrompt(promptKey, button));
    });

    document.querySelectorAll(".prompt-heading p").forEach((description) => {
        description.textContent = "Prompt 1과 2를 완료한 같은 AI 대화에 붙여 넣으면, 확인된 내용만 Lean v0.3 JSON으로 변환합니다.";
    });

    document.querySelectorAll(".prompt-heading").forEach((heading) => {
        const title = heading.querySelector("h3");
        const kicker = heading.querySelector(".page-kicker");
        if (title && !title.textContent.startsWith("3/3")) title.textContent = `3/3 ${title.textContent}`;
        if (kicker) kicker.textContent = "Prompt 3 · same chat";
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
