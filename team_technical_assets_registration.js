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

const promptDefinitions = {
    "vd-request": {
        cardType: "VD Request",
        purpose: "개별 요청에서 요청자가 필요로 한 판단, Simulation이 제공한 근거, 요청자의 피드백과 실제 후속 행동을 정리합니다.",
        focus: "상황과 판단 질문, 비교·검토 방식, 핵심 경향, 피드백 확인 경로, 실제 의사결정 영향, 재사용 조건을 구분하세요. 영향이 확인되지 않았으면 추정하지 말고 확인 필요로 남기세요."
    },
    cor: {
        cardType: "CoR",
        purpose: "완료된 CoR의 기술 Gap, 목표와 검증, 확보 기술, 경영성과 기여와 회사 프로세스 변화를 정리합니다.",
        focus: "과제 완료와 결과보고서 준비 여부, 목표 달성도, 주요 진행 판단, 검증 결과, 제안서·중간보고서·결과보고서·관련 방법론 존재 여부를 구분하세요. 미완료라면 완료된 것처럼 쓰지 마세요."
    },
    methodology: {
        cardType: "방법론",
        purpose: "반복 적용 가능한 기술 원리, 표준 절차, 판단 기준, 적용범위와 검증 근거를 정리합니다.",
        focus: "최소 적용 근거, 후보·정식 방법론 상태, L1~L5 현재 Level과 근거·남은 Gap, Technology Map 등재·미등재 여부를 포함하세요. Map 미등재여도 Level은 반드시 근거에 따라 평가하세요."
    },
    bp: {
        cardType: "BP",
        purpose: "구체적인 사업 상황에서 Simulation이 가능하게 한 판단, 사업부의 행동, 경영성과와 재현 조건을 정리합니다.",
        focus: "사업 맥락, Simulation 대응, 피드백과 실제 행동, 비용·기간·품질·고객대응 등에 이른 영향 경로, 성과 확인 수준, 반복 가능한 성공요인을 구분하세요. 기대효과를 실측 성과처럼 쓰지 마세요."
    },
    "technical-report": {
        cardType: "기술보고서",
        purpose: "공식 기술 질문, 검토 범위, 분석·실험 근거, 결론과 판단 가능한 범위를 정리합니다.",
        focus: "관찰 결과·기술적 해석·최종 결론을 구분하고, 결론의 유효조건, 지원 가능한 판단과 지원할 수 없는 판단, 한계, 공식 원문과 버전 복원 항목을 포함하세요."
    },
    knowhow: {
        cardType: "노하우",
        purpose: "기술 수행뿐 아니라 장표·보고서 작성, 요청 검토 SOP, 다른 조직과의 협업·소통에서 반복해 쓸 수 있는 판단과 실행 방식을 정리합니다.",
        focus: "knowhowCategory는 기술 수행·산출물 작성·업무 절차·협업·소통 중 하나를 선택하세요. 적용 상황과 목표, 핵심 난점과 사전 확인, 최대 7단계의 실행 순서와 판단 이유, 완료·품질 기준과 확인 근거, 예외·위험·중단·복구·Escalation 조건, 재사용 범위와 연결 자료를 구분하세요. 산출물 원문과 공식 SOP는 복사하지 말고 사내 연결 대상으로 남기며, 공식 여부가 확인되지 않은 실무 방식은 공식 절차처럼 표현하지 마세요."
    },
    "tool-manual": {
        cardType: "Tool Manual",
        purpose: "특정 Tool에서 하나의 작업을 안전하고 일관되게 수행하는 정상 작업 흐름을 정리합니다.",
        focus: "작업 목적과 결과물, 권한·환경·입력의 사전조건, 3~10단계 실행 절차, 정상 완료와 잘못된 결과의 구분, 중단조건과 주요 위험, 사내에서 복원할 버전·예제·원문을 포함하세요."
    },
    "education-material": {
        cardType: "교육자료",
        purpose: "개별 학습 콘텐츠의 학습목표, 대상, 구성, 활동과 완료 확인기준을 정리합니다.",
        focus: "관찰 가능한 학습목표 최대 3개, 대상과 사전지식, 다루는 내용과 제외 범위, 학습 방식·예상 시간·준비물, 이해·수행 확인기준, 관련 기술자산과 버전 복원 항목을 포함하세요."
    },
    "external-report": {
        cardType: "외부 보고 자료",
        purpose: "확인된 기술 근거를 팀 외부 이해관계자의 의사결정 상황에 맞게 재구성한 보고 자료를 정리합니다.",
        focus: "보고 목적과 대상, 연결되는 의사결정, 근거가 확인된 핵심 메시지, 원천 자산, 공유 가능 범위와 제외 정보, 버전·기준일·재검토 조건, 전달 시 한계를 구분하세요."
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
            "사내 문서·이미지·모델·로그·파일·링크는 업로드하지 않고, 사내에서 연결할 자료만 Placeholder로 남깁니다."
        ],
        completion: [
            "유형별 필수 질문에 답했거나 모르는 항목을 ‘확인 필요’로 표시했습니다.",
            "실제 식별정보·정확한 수치·내부 링크가 포함되지 않았습니다.",
            "무엇을 판단했고 어떤 근거로 결론을 냈는지 설명됩니다.",
            "사내에서 복원해야 할 항목이 별도로 구분돼 있습니다."
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
            "AI가 제시한 누락 항목과 요약을 확인한 뒤 ‘최종 JSON 생성’을 지시합니다.",
            "AI 답변에 첨부된 .json 파일을 다운로드합니다.",
            "첨부 기능이 없는 AI에서만 json 코드 블록을 복사해 UTF-8 .json으로 저장합니다."
        ],
        completion: [
            "cardTypeCandidate가 선택한 Asset type과 일치합니다.",
            "유형별 필수 내용이 typeSpecific에 포함돼 있습니다.",
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
        summary: "다운로드 파일과 승인된 반입 경로 확인",
        purpose: "AI에서 다운로드했거나 코드 블록으로 직접 저장한 JSON을 점검하고, 승인된 경로를 통해 사내 Library 등록 초안으로 가져옵니다.",
        actions: [
            "AI가 첨부한 UTF-8 .json 파일을 다운로드합니다. 첨부가 없으면 코드 블록의 JSON 객체만 직접 저장합니다.",
            "파일을 다시 열어 코드 블록과 내용이 같고 Markdown 기호, 설명 문장, 주석, trailing comma가 섞이지 않았는지 확인합니다.",
            "실제 제품명이나 과제명을 파일명에 쓰지 않고 일반화된 파일명을 사용합니다.",
            "실제 회사·조직·사람·제품명, URL, 파일 경로, 정확한 수치가 남아 있지 않은지 다시 점검합니다.",
            "승인된 메일 또는 파일 전달 방식으로 반입한 뒤 Library의 기술자산 등록 화면에서 파일을 불러옵니다."
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
        title: "사내 Library에 등록하기",
        summary: "사내 정보 보완 → 직접 등록 → Reviewer 검토 요청",
        purpose: "반입한 JSON 초안에 실제 사내 정보·근거·관계를 보완한 뒤, 같은 등록 화면에서 Library 자산을 저장하고 Reviewer 검토를 요청합니다.",
        actions: [
            "실제 제목·조직·제품·과제 ID·조건·수치와 확인일을 사내에서 복원합니다.",
            "유형별 필수 본문과 공통 메타데이터, Owner·Reviewer를 입력합니다.",
            "공식 원문·모델·데이터·회의·Template은 중복 업로드하지 않고 사내 원본 링크로 연결합니다.",
            "기존 Library의 중복 후보와 관계를 확인하고, Technology Map·Learning Path에는 ‘연결됨 / 해당 없음 / 대상 없음’ 중 하나와 판단 사유를 기록합니다.",
            "등록 전 검증에서 사실·적용범위·한계·보안 경계를 확인한 뒤 ‘Library 등록 요청’을 누릅니다."
        ],
        completion: [
            "제목·요약·Asset type·게시 상태와 유형별 필수 내용이 완성됐습니다.",
            "실제 근거와 원본 링크, 적용범위·한계·주의사항이 있습니다.",
            "검색 분류와 기존 자산 관계, Technology Map·Learning Path 연결 판단이 확인됐습니다.",
            "Owner·Reviewer와 사람의 최종 사실 확인을 완료했습니다.",
            "‘Library 등록 요청’으로 DB에 초안과 연결정보를 함께 저장하고 Reviewer 검토를 요청했습니다."
        ],
        caution: "4단계에서 별도의 등록 JSON을 다시 만들거나 다운로드하지 않습니다. Library는 공식 원본 저장소를 대체하지 않으며, AI가 제안한 분류·관계·성과는 사람이 승인하기 전까지 확정하지 않습니다."
    }
];

function createHandoffTemplate(cardType) {
    return {
        packetVersion: "0.1",
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
        searchTerms: ["확인 필요"],
        relatedAssetCandidates: ["확인 필요"],
        placeholdersToRestoreInternally: ["확인 필요"],
        itemsToConfirm: ["확인 필요"],
        securitySelfCheck: "pass",
        typeSpecific: TYPE_SPECIFIC_SCHEMAS[cardType]
    };
}

function createJsonConversionPrompt({ cardType, purpose, focus, outputFileName }) {
    const handoffTemplate = JSON.stringify(createHandoffTemplate(cardType), null, 2);

    return `당신은 앞선 대화 내용을 사내 기술자산 Library 등록용 Handoff Packet JSON으로 변환하는 정리자입니다.

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
5. 모르는 문자열은 "확인 필요", 모르는 배열은 ["확인 필요"]로 남기고 확인할 사항을 itemsToConfirm에도 적으세요. 확인 결과 해당 사항이 없으면 빈 배열 []을 사용하세요.
6. 사내에서 실제 용어·수치·담당자·버전·문서 링크를 복원할 항목은 placeholdersToRestoreInternally에 일반명으로 적으세요.
7. 검색어도 실제 고유명 대신 외부에 노출 가능한 일반 기술어와 현상어만 사용하세요.

[Handoff Packet 작성 규칙]
- 아래 공통 키와 typeSpecific의 모든 키를 삭제하거나 이름을 바꾸지 마세요.
- 공통 키에는 대화 전체의 핵심을 짧게 요약하고, typeSpecific에는 ${cardType} 등록 필수 내용을 서로 모순되지 않게 정리하세요.
- evidenceAvailable에는 "회의에서 방향 확인", "비교 평가 근거 존재"처럼 근거의 종류만 쓰고 실제 문서명·링크는 쓰지 마세요.
- 같은 사실을 여러 필드에 장문으로 반복하지 마세요.
- 실제 식별정보와 정확한 수치가 모두 제거됐음을 재검사한 뒤에만 securitySelfCheck를 "pass"로 두세요. 안전 여부가 불확실하면 "recheck"로 바꾸세요.

[최종 전달 방식 · 실제 JSON 파일 생성]
1. 최종 내용을 먼저 아래 구조의 유효한 JSON 객체로 완성하세요. JSON에는 주석이나 trailing comma를 사용하지 말고 첫 문자는 {, 마지막 문자는 }가 되게 하세요.
2. 현재 AI 환경에 파일 생성·첨부 기능이 있다면 선택사항으로 안내하지 말고, 완성한 JSON을 UTF-8(BOM 없음) 파일로 직접 생성하세요. 파일명은 반드시 \`${outputFileName}\`으로 지정합니다.
3. 생성한 파일을 사용자가 클릭해 저장할 수 있는 실제 첨부 파일 또는 다운로드 링크로 제공하세요. 파일명이나 저장 경로를 텍스트로만 쓰거나, 존재하지 않는 링크를 만들지 마세요.
4. 파일 본문에는 JSON 객체만 저장하세요. Markdown 코드 펜스, 인사말, 설명, 주의문구를 파일에 포함하지 마세요.
5. 다운로드 파일과 내용이 완전히 동일한 JSON을 Markdown의 json 코드 블록 정확히 한 개로도 제공하세요. 사용자가 파일을 받을 수 없는 경우 전체 내용을 복사해 직접 저장할 수 있어야 합니다.
6. 파일 생성·첨부 기능이 정말 없는 환경에서만 다운로드 링크를 생략하고 json 코드 블록을 제공하세요. 이 경우 코드 블록 밖에 ‘파일 첨부 기능이 없어 아래 JSON을 UTF-8 .json으로 저장하세요.’라는 문장 한 줄만 허용합니다.
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

const registrationCompletionWalkthrough = [
    {
        number: "01",
        shortTitle: "기본정보",
        title: "실제 기본정보로 교체",
        description: "AI 초안을 실제 자산 정보와 책임정보로 바꿉니다.",
        src: "assets/registration-guide/step4-01-basic-information.png",
        alt: "기술자산 등록 모달의 내부정보 보완 전체 화면",
        regions: [
            ["1", "등록 ID", "1.5%", "18.5%", "97%", "8%", "system"],
            ["2", "자산 식별정보", "1.5%", "31%", "97%", "25%", "ai"],
            ["3", "Owner·Reviewer", "1.5%", "56.4%", "97%", "16.5%", "registrant"],
            ["4", "활용 맥락·요약", "1.5%", "73.4%", "97%", "19.7%", "ai"]
        ],
        actions: ["실제 제목·ID·분류로 교체", "Owner·Reviewer와 사내 맥락 확인"]
    },
    {
        number: "02",
        shortTitle: "Library·근거",
        title: "기존 Library와 사내 근거 연결",
        description: "중복을 확인하고 원본·근거 위치를 연결합니다.",
        src: "assets/registration-guide/step4-02-library-and-links.png",
        alt: "기존 Library 검색과 회사 내부 자산 링크 등록 모달 전체 화면",
        regions: [
            ["1", "기존 Library 검색·관계", "1.5%", "18.5%", "48.2%", "74.6%", "registrant"],
            ["2", "사내 원본·근거 링크", "50.3%", "18.5%", "48.2%", "74.6%", "registrant"]
        ],
        actions: ["기존 자산을 연결하거나 후보 없음 사유 기록", "사내 링크 추가 후 접근 가능 여부 확인"]
    },
    {
        number: "03",
        shortTitle: "Framework",
        title: "Technology Map·Learning Path 판정",
        description: "두 Framework와의 관계를 각각 결정합니다.",
        src: "assets/registration-guide/step4-03-framework-connections.png",
        alt: "Technology Map과 Learning Path 연결 판정 등록 모달 전체 화면",
        regions: [
            ["1", "Technology Map 연결", "1.5%", "29.4%", "48.2%", "61.7%", "registrant"],
            ["2", "Learning Path 연결", "50.3%", "29.4%", "48.2%", "61.7%", "registrant"]
        ],
        actions: ["연결됨·해당 없음·대상 없음 중 하나 선택", "연결됨이면 대상·관계·설명을 추가"]
    },
    {
        number: "04",
        shortTitle: "검증·등록",
        title: "검증 후 바로 Library 등록",
        description: "오류를 수정한 뒤 같은 화면에서 DB 저장과 Reviewer 검토를 요청합니다.",
        src: "assets/registration-guide/step4-04-review-download.png",
        alt: "등록 전 검증과 사내 Library 등록 요청 모달 전체 화면",
        regions: [
            ["1", "등록 전 검증", "1.5%", "18.5%", "41.1%", "45.9%", "system"],
            ["2", "최종 등록 내용 확인", "43.2%", "18.5%", "55.3%", "45.9%", "registrant"],
            ["3", "Library 등록 요청", "81.3%", "93.6%", "17.2%", "5.4%", "registrant"]
        ],
        actions: ["검증 오류 수정 후 최종 내용 확인", "‘Library 등록 요청’을 눌러 DB 저장과 Reviewer 검토 요청"]
    }
];

function createRegistrationCompletionWalkthrough() {
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
            <h3>반입한 JSON으로 사내 Library 등록을 완료하는 순서</h3>
            <p>반투명 박스가 각 단계에서 확인하거나 입력할 화면 영역을 표시합니다.</p>
            <ol class="registration-walkthrough-flow" aria-label="등록 완료 흐름">
                ${registrationCompletionWalkthrough.map((step) => `<li><b>${step.number}</b><span>${step.shortTitle}</span></li>`).join("")}
            </ol>
            <div class="registration-role-legend" aria-label="입력 역할 구분">
                ${Object.entries(roleLabels).map(([role, label]) => `<span class="is-${role}">${label}</span>`).join("")}
            </div>
            <p class="registration-save-note"><strong>저장 시점</strong> 이전·다음 동안 화면에 유지 · 취소 시 초기화 · ‘Library 등록 요청’ 시 DB에 한 번 저장</p>
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

    const grid = document.createElement("div");
    grid.className = "registration-step-guide-grid";
    grid.appendChild(createRegistrationGuideBlock("해야 할 일", step.actions, true, "is-action"));
    grid.appendChild(createRegistrationGuideBlock("완료 기준", step.completion, false, "is-completion"));
    guide.appendChild(grid);

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
        const actions = document.createElement("div");
        actions.className = "registration-import-actions";
        actions.innerHTML = `
            <span><strong>반입 후 이동</strong> Library 등록 창에서 JSON을 읽고 유형·오류·중복 후보를 확인합니다.</span>
            <a class="btn btn-primary" href="team_technical_assets_library.html#register"><i class="bx bx-import" aria-hidden="true"></i>Library 등록 열기</a>
        `;
        guide.appendChild(actions);
    }

    if (step.id === "complete") {
        guide.appendChild(createRegistrationCompletionWalkthrough());
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

        registrationStepDefinitions.forEach((step) => {
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
