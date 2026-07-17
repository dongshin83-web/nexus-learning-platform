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
        symptomAndConditions: "확인 필요",
        causeAndDiagnosis: {
            hypothesis: "확인 필요",
            diagnosticSequence: ["확인 필요"],
            ineffectiveAttempts: ["확인 필요"]
        },
        resolution: ["확인 필요"],
        effectAndEvidence: {
            result: "확인 필요",
            evidenceLevel: "확인 필요"
        },
        risksAndRecovery: {
            doNotApply: ["확인 필요"],
            sideEffects: ["확인 필요"],
            recovery: ["확인 필요"]
        },
        versionsAndSources: ["[사내에서 Tool·Solver 버전과 근거 링크 복원]"]
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
        purpose: "반복되는 하나의 실행 난제에 대한 증상, 진단, 해결 절차, 효과와 위험을 정리합니다.",
        focus: "검색 가능한 증상과 발생조건, 원인 가설과 진단 순서, 실패한 시도, 최대 7단계의 해결 절차, 전후 효과, 적용 금지 조건·부작용·복구방법을 구분하세요."
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

function createJsonConversionPrompt({ cardType, purpose, focus }) {
    const handoffTemplate = JSON.stringify(createHandoffTemplate(cardType), null, 2);

    return `당신은 앞선 대화 내용을 사내 기술자산 Library 등록용 Handoff Packet JSON으로 변환하는 정리자입니다.

[사용 맥락]
이 Prompt는 사용자와 기술 경험을 대화한 바로 그 대화창에 붙여 넣었습니다. 새 인터뷰를 시작하거나 이미 답한 내용을 다시 질문하지 말고, 이 창의 앞선 대화 전체만 읽어 정리하세요.

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

[최종 출력]
인사, 설명, 질문, 주의문구를 덧붙이지 마세요. Markdown의 json 코드 블록 정확히 한 개만 출력하세요. 코드 블록 안에는 아래 구조를 지키는 유효한 JSON 객체 하나만 넣고 주석이나 trailing comma를 사용하지 마세요.

\`\`\`json
${handoffTemplate}
\`\`\``;
}

const prompts = Object.fromEntries(
    Object.entries(promptDefinitions).map(([key, definition]) => [key, createJsonConversionPrompt(definition)])
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
            ? "Prompt를 복사했습니다. 앞선 대화를 이어가던 같은 AI 대화창에 붙여 넣으세요."
            : "자동 복사가 되지 않았습니다. Prompt 영역을 선택해 직접 복사해 주세요.";
    }
    button.classList.toggle("is-copied", copied);
    if (buttonLabel) buttonLabel.textContent = copied ? "복사 완료" : "Prompt 복사";

    if (copied) {
        window.setTimeout(() => {
            button.classList.remove("is-copied");
            if (buttonLabel) buttonLabel.textContent = "Prompt 복사";
        }, 2400);
    }
}

function getAssetTabs() {
    return [...document.querySelectorAll("[data-asset-tab]:not([disabled])")];
}

function activateAssetTab(tab, updateUrl = true) {
    const tabName = tab?.dataset.assetTab;
    if (!tabName) return;

    getAssetTabs().forEach((item) => {
        const selected = item === tab;
        item.setAttribute("aria-selected", String(selected));
        item.tabIndex = selected ? 0 : -1;
    });
    document.querySelectorAll(".asset-guide-panel[role='tabpanel']").forEach((panel) => {
        panel.hidden = panel.id !== `panel-${tabName}`;
    });
    if (updateUrl) history.replaceState(null, "", `#${tabName}`);
}

function initRegistrationGuide() {
    Object.entries(prompts).forEach(([promptKey, prompt]) => {
        const preview = document.getElementById(`${promptKey}-prompt-preview`);
        if (preview) preview.textContent = prompt;
    });

    document.querySelectorAll("[data-copy-prompt], #copy-vd-request-prompt").forEach((button) => {
        const promptKey = button.dataset.copyPrompt || "vd-request";
        button.addEventListener("click", () => copyPrompt(promptKey, button));
    });

    const tabs = getAssetTabs();
    tabs.forEach((tab) => {
        tab.addEventListener("click", () => activateAssetTab(tab));
        tab.addEventListener("keydown", (event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            event.preventDefault();
            const direction = event.key === "ArrowRight" ? 1 : -1;
            const nextIndex = (tabs.indexOf(tab) + direction + tabs.length) % tabs.length;
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
