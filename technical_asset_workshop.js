const pageMeta = {
    "guide-section": {
        title: "워크샵 안내",
        subtitle: "반복 업무를 재사용 가능한 기술자산으로 전환하는 진행 구조"
    },
    "definition-section": {
        title: "1단계 업무정의",
        subtitle: "자산화할 업무 단위를 목적, 범위, 산출물, 성공 기준으로 고정"
    },
    "flow-section": {
        title: "2단계 업무흐름",
        subtitle: "시작 조건, 주요 단계, 판단 지점, 예외 상황을 분리"
    },
    "knowledge-section": {
        title: "3단계 기술요소",
        subtitle: "숙련자 판단 기준과 암묵지를 재사용 가능한 언어로 추출"
    },
    "asset-section": {
        title: "4단계 자산화 후보",
        subtitle: "체크리스트, 템플릿, 프롬프트, 자동화 후보로 변환"
    },
    "plan-section": {
        title: "5단계 실행계획",
        subtitle: "2주 안에 검증할 최소 기술자산과 책임자를 결정"
    },
    "checks-section": {
        title: "품질 체크",
        subtitle: "좋은 업무정의와 자산화 후보인지 검토하는 기준"
    },
    "prompt-section": {
        title: "진행 프롬프트",
        subtitle: "퍼실리테이터가 워크샵 중 사용할 수 있는 질문 묶음"
    }
};

const guideCards = [
    {
        icon: "bx-target-lock",
        title: "워크샵 목적",
        body: "반복 업무를 개인 역량 설명이 아니라 팀이 재사용할 수 있는 기술자산 후보로 바꿉니다.",
        bullets: [
            "업무정의 카드 1개를 완성합니다.",
            "업무흐름과 판단 지점을 분리합니다.",
            "2주 내 만들 수 있는 최소 자산을 정합니다."
        ]
    },
    {
        icon: "bx-group",
        title: "참가자 역할",
        body: "업무 담당자는 실제 사례를 말하고, 동료는 질문으로 빈칸을 드러내며, 진행자는 산출물 형태로 정리합니다.",
        bullets: [
            "정답 발표보다 실제 업무 언어를 우선합니다.",
            "문서에 없는 판단 기준을 적극적으로 묻습니다.",
            "현장에서 바로 검증할 수 있는 형태로 마무리합니다."
        ]
    },
    {
        icon: "bx-layer-plus",
        title: "최종 산출물",
        body: "워크샵이 끝나면 업무정의, 업무흐름, 기술요소, 자산화 후보, 실행계획이 하나의 워크벤치로 남습니다.",
        bullets: [
            "업무정의 카드",
            "업무흐름 지도",
            "기술자산 후보 목록",
            "2주 실행계획"
        ]
    }
];

const definitionFields = [
    {
        label: "업무명",
        body: "참가자가 실제 현장에서 부르는 이름을 씁니다. 너무 추상적인 부서명이나 역할명은 피합니다."
    },
    {
        label: "업무 목적",
        body: "이 업무가 없으면 어떤 문제가 생기는지, 누구의 어떤 의사결정을 돕는지 적습니다."
    },
    {
        label: "업무 범위",
        body: "포함되는 활동과 제외되는 활동을 분리합니다. 범위가 흐리면 뒤 단계가 모두 넓어집니다."
    },
    {
        label: "주요 대상",
        body: "고객, 내부 요청자, 현장, 제품, 시스템, 데이터 등 업무가 향하는 대상을 명확히 합니다."
    },
    {
        label: "시작 조건",
        body: "요청, 이슈, 일정, 데이터 도착, 프로젝트 단계 등 업무가 발생하는 trigger를 적습니다."
    },
    {
        label: "종료 조건",
        body: "보고서 제출, 승인, 판단 완료, 시스템 반영 등 완료라고 볼 수 있는 상태를 적습니다."
    },
    {
        label: "주요 산출물",
        body: "보고서, 설계안, 검토의견, 분석결과, 체크리스트, 코드, 프롬프트 등 눈에 보이는 결과물을 적습니다."
    },
    {
        label: "성공 기준",
        body: "좋은 결과라고 판단하는 기준을 품질, 속도, 재현성, 리스크 감소, 의사결정 기여 관점에서 적습니다."
    },
    {
        label: "어려운 점",
        body: "숙련자 의존, 판단 기준 불명확, 데이터 부족, 반복 오류, 검토 누락처럼 자산화 가치가 있는 지점을 찾습니다.",
        full: true
    }
];

const flowCards = [
    {
        icon: "bx-play-circle",
        tag: "Start",
        title: "시작 조건",
        body: "이 업무가 언제 시작되는지 명확히 해야 trigger 기반 체크리스트나 자동화 후보가 보입니다.",
        bullets: ["누가 요청하는가?", "어떤 입력 자료가 들어오는가?", "시작 전에 반드시 확인할 조건은 무엇인가?"]
    },
    {
        icon: "bx-list-ol",
        tag: "Steps",
        title: "주요 단계",
        body: "큰 업무를 5~7개의 의미 있는 단계로 나눕니다. 너무 세밀한 클릭 절차보다 의사결정 흐름을 우선합니다.",
        bullets: ["자료 확인", "가정 설정", "분석/검토", "결과 해석", "공유/승인"]
    },
    {
        icon: "bx-git-branch",
        tag: "Decision",
        title: "판단 지점",
        body: "숙련자가 멈춰서 생각하는 순간을 표시합니다. 이 지점이 기술자산화의 핵심 후보입니다.",
        bullets: ["계속 진행할지 보류할지", "어떤 기준을 적용할지", "누구에게 escalation할지"]
    },
    {
        icon: "bx-error-circle",
        tag: "Exception",
        title: "예외 상황",
        body: "반복적으로 업무를 흔드는 예외를 따로 모읍니다. 예외 대응표나 FAQ가 될 수 있습니다.",
        bullets: ["자료 누락", "조건 불일치", "이전 결과와 충돌", "요청 범위 변경"]
    }
];

const knowledgeCards = [
    {
        icon: "bx-low-vision",
        tag: "Tacit",
        title: "암묵지",
        body: "숙련자는 당연하게 하지만 초심자는 놓치는 판단을 말로 꺼냅니다.",
        bullets: ["처음 보는 자료에서 가장 먼저 보는 항목", "이상하다고 느끼는 신호", "경험상 피해야 하는 선택"]
    },
    {
        icon: "bx-check-shield",
        tag: "Criteria",
        title: "판단 기준",
        body: "좋다/나쁘다의 감각을 가능한 한 비교 가능한 기준으로 바꿉니다.",
        bullets: ["합격/불합격 기준", "우선순위 기준", "리스크가 높다고 판단하는 조건"]
    },
    {
        icon: "bx-data",
        tag: "Evidence",
        title: "필요 데이터",
        body: "업무 판단에 필요한 입력 데이터와 근거 자료를 분리합니다.",
        bullets: ["필수 입력", "있으면 좋은 참고자료", "검증용 기준 데이터"]
    },
    {
        icon: "bx-revision",
        tag: "Mistakes",
        title: "반복 실수",
        body: "자주 반복되는 오류는 가장 빠르게 자산화 효과를 만드는 영역입니다.",
        bullets: ["누락되는 확인 항목", "잘못 해석되는 용어", "뒤늦게 발견되는 조건"]
    }
];

const assetCards = [
    {
        icon: "bx-checkbox-checked",
        tag: "Checklist",
        title: "체크리스트",
        body: "누락 방지가 핵심인 업무에 적합합니다.",
        bullets: ["시작 전 확인", "검토 중 확인", "공유 전 확인"]
    },
    {
        icon: "bx-file",
        tag: "Template",
        title: "템플릿",
        body: "반복 산출물의 구조를 고정할 때 유용합니다.",
        bullets: ["보고서 목차", "검토의견 양식", "회의록 구조"]
    },
    {
        icon: "bx-book-open",
        tag: "Training",
        title: "교육자료",
        body: "개념 이해와 사례 비교가 필요한 업무에 적합합니다.",
        bullets: ["대표 사례", "좋은 예/나쁜 예", "용어집"]
    },
    {
        icon: "bx-brain",
        tag: "Prompt",
        title: "AI 프롬프트",
        body: "자료 요약, 질문 생성, 초안 작성처럼 언어 기반 반복 업무에 적합합니다.",
        bullets: ["입력자료 요약", "리뷰 질문 생성", "보고서 초안 작성"]
    },
    {
        icon: "bx-cog",
        tag: "Automation",
        title: "자동화",
        body: "규칙이 분명하고 반복 빈도가 높은 업무는 자동화 후보로 봅니다.",
        bullets: ["데이터 수집", "형식 변환", "알림/리마인드"]
    },
    {
        icon: "bx-server",
        tag: "System",
        title: "시스템화",
        body: "여러 사람이 지속적으로 쓰고 이력 관리가 필요한 경우 시스템 기능으로 올립니다.",
        bullets: ["입력 폼", "승인 흐름", "결과 이력"]
    }
];

const planCards = [
    {
        icon: "bx-flag",
        tag: "Priority",
        title: "우선순위 결정",
        body: "효과, 난이도, 반복 빈도, 리스크 감소를 기준으로 첫 번째 자산화 대상을 고릅니다.",
        bullets: ["반복 빈도가 높은가?", "실수 비용이 큰가?", "2주 안에 형태를 만들 수 있는가?"]
    },
    {
        icon: "bx-user-check",
        tag: "Owner",
        title: "담당자 지정",
        body: "작성자, 검토자, 실제 사용자 역할을 분리합니다.",
        bullets: ["초안 작성자", "업무 숙련 검토자", "현장 테스트 사용자"]
    },
    {
        icon: "bx-calendar",
        tag: "2 Weeks",
        title: "2주 실행 항목",
        body: "큰 플랫폼이 아니라 작은 산출물 하나를 실제 업무에 넣어 봅니다.",
        bullets: ["체크리스트 v0.1", "템플릿 v0.1", "프롬프트 v0.1"]
    },
    {
        icon: "bx-line-chart",
        tag: "Validation",
        title: "검증 방법",
        body: "만든 자산이 실제로 시간을 줄이거나 품질을 높였는지 확인합니다.",
        bullets: ["사용 전후 소요시간", "누락 항목 감소", "신규 담당자 이해도"]
    }
];

const checkCards = [
    {
        icon: "bx-search-alt",
        tag: "Definition",
        title: "업무정의 품질",
        body: "좋은 업무정의는 누가 읽어도 같은 업무를 떠올리게 합니다.",
        bullets: ["업무명이 구체적인가?", "시작/종료 조건이 있는가?", "산출물과 성공 기준이 분리되어 있는가?"]
    },
    {
        icon: "bx-expand-alt",
        tag: "Scope",
        title: "범위 과대 여부",
        body: "한 번의 워크샵에서 다루기 어려운 넓은 주제는 잘라야 합니다.",
        bullets: ["부서 전체 업무인가?", "여러 산출물이 섞였는가?", "담당자가 여러 조직으로 갈라지는가?"]
    },
    {
        icon: "bx-bulb",
        tag: "Asset Fit",
        title: "자산화 적합성",
        body: "자산화 가치가 높은 업무는 반복성, 판단 기준, 전파 필요성이 함께 있습니다.",
        bullets: ["반복되는가?", "숙련자 판단이 필요한가?", "다른 사람이 배워야 하는가?"]
    },
    {
        icon: "bx-run",
        tag: "Actionability",
        title: "실행 가능성",
        body: "첫 결과물이 작고 검증 가능해야 워크샵 이후 흐름이 끊기지 않습니다.",
        bullets: ["2주 안에 만들 수 있는가?", "실제 업무에 바로 넣을 수 있는가?", "검증 지표가 있는가?"]
    }
];

const workshopPrompt = `기술자산화 워크샵을 진행한다.
참가자가 반복 업무 하나를 고르면 아래 순서로 질문하고, 각 단계의 산출물을 간결한 카드 형태로 정리해줘.

1. 업무정의
- 이 업무를 실제 현장에서는 뭐라고 부르는가?
- 이 업무는 왜 필요한가?
- 어디서 시작하고 언제 끝났다고 보는가?
- 주요 산출물은 무엇인가?
- 좋은 결과라고 판단하는 기준은 무엇인가?

2. 업무흐름
- 업무의 주요 단계를 5~7개로 나누면 무엇인가?
- 각 단계에서 숙련자가 멈춰서 판단하는 지점은 어디인가?
- 반복적으로 생기는 예외 상황은 무엇인가?

3. 기술요소
- 절차서에는 없지만 숙련자가 중요하게 보는 신호는 무엇인가?
- 판단 기준, 필요 데이터, 자주 하는 실수는 무엇인가?
- 신규 담당자가 가장 어려워하는 부분은 무엇인가?

4. 자산화 후보
- 체크리스트, 템플릿, 교육자료, AI 프롬프트, 자동화, 시스템화 중 어떤 형태가 적합한가?
- 가장 먼저 만들 v0.1 산출물은 무엇인가?

5. 실행계획
- 작성자, 검토자, 실제 테스트 사용자는 누구인가?
- 2주 안에 무엇을 만들고 어디에 적용할 것인가?
- 효과는 어떤 기준으로 확인할 것인가?

출력 형식:
- 업무정의 카드
- 업무흐름 지도
- 기술요소 목록
- 자산화 후보 목록
- 2주 실행계획`;

function renderCards(targetId, cards, cardClass = "stage-card") {
    const grid = document.getElementById(targetId);
    grid.innerHTML = cards.map(card => `
        <article class="${cardClass}">
            ${card.tag ? `<small>${card.tag}</small>` : ""}
            <h3><i class='bx ${card.icon}'></i>${card.title}</h3>
            <p>${card.body}</p>
            <ul>
                ${card.bullets.map(bullet => `<li>${bullet}</li>`).join("")}
            </ul>
        </article>
    `).join("");
}

function renderDefinitionFields() {
    const grid = document.getElementById("definition-fields");
    grid.innerHTML = definitionFields.map(field => `
        <div class="field-card ${field.full ? "full" : ""}">
            <label>${field.label}</label>
            <p>${field.body}</p>
        </div>
    `).join("");
}

function activateSection(targetId, options = {}) {
    if (!pageMeta[targetId]) return;

    const navLinks = document.querySelectorAll(".nav-links li");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");

    navLinks.forEach(item => {
        item.classList.toggle("active", item.dataset.target === targetId);
    });

    sections.forEach(section => {
        section.classList.toggle("active", section.id === targetId);
    });

    pageTitle.textContent = pageMeta[targetId].title;
    pageSubtitle.textContent = pageMeta[targetId].subtitle;

    if (options.updateHash !== false) {
        const nextHash = `#${targetId}`;
        if (window.location.hash !== nextHash) {
            history.pushState(null, "", nextHash);
        }
    }

    if (options.scrollTop !== false) {
        const wrapper = document.querySelector(".content-wrapper");
        wrapper.scrollTo({ top: 0, behavior: options.smooth ? "smooth" : "auto" });
    }
}

function bindNavigation() {
    document.querySelectorAll(".nav-links li").forEach(link => {
        link.addEventListener("click", () => {
            activateSection(link.dataset.target, { smooth: true });
        });
    });
}

function bindHashRoute() {
    const openHashSection = () => {
        const targetId = window.location.hash.replace("#", "");
        if (pageMeta[targetId]) {
            activateSection(targetId, { updateHash: false, scrollTop: false });
        }
    };

    window.addEventListener("hashchange", openHashSection);
    window.addEventListener("popstate", openHashSection);
    openHashSection();
}

function bindPromptCopy() {
    const promptBox = document.getElementById("workshop-prompt");
    const copyButton = document.getElementById("copy-workshop-prompt");
    promptBox.textContent = workshopPrompt;

    copyButton.addEventListener("click", async () => {
        let copied = false;

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(workshopPrompt);
                copied = true;
            } catch (error) {
                copied = false;
            }
        }

        if (!copied) {
            const textArea = document.createElement("textarea");
            textArea.value = workshopPrompt;
            textArea.setAttribute("readonly", "");
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            copied = document.execCommand("copy");
            document.body.removeChild(textArea);
        }

        copyButton.innerHTML = copied
            ? "<i class='bx bx-check'></i> Copied"
            : "<i class='bx bx-selection'></i> Prompt selected";
        setTimeout(() => {
            copyButton.innerHTML = "<i class='bx bx-copy'></i> Copy";
        }, 1800);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderCards("guide-grid", guideCards, "workshop-card");
    renderDefinitionFields();
    renderCards("flow-grid", flowCards);
    renderCards("knowledge-grid", knowledgeCards);
    renderCards("asset-grid", assetCards, "output-card");
    renderCards("plan-grid", planCards, "definition-card");
    renderCards("checks-grid", checkCards, "check-card");
    bindNavigation();
    bindHashRoute();
    bindPromptCopy();
});
