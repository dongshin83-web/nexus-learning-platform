const pageMeta = {
    "objective-section": {
        title: "Leader Objective",
        subtitle: "구조역학 Simulation 팀장이 가져야 할 판단 능력의 목표선"
    },
    "roadmap-section": {
        title: "12-Week Learning Plan",
        subtitle: "Abaqus와 HyperMesh를 리더십 리뷰 능력 중심으로 학습하는 12주 계획"
    },
    "workflow-section": {
        title: "Abaqus + HyperMesh Workflow",
        subtitle: "외부 요구를 계산 전략으로 번역하고 결과를 의사결정 자료로 만드는 흐름"
    },
    "review-section": {
        title: "Review Checklist",
        subtitle: "실무자가 가져온 모델을 검토할 때 반드시 확인할 질문 세트"
    },
    "cases-section": {
        title: "Capstone Cases",
        subtitle: "팀장 관점의 판단 능력을 검증하기 위한 실습 케이스"
    },
    "terms-section": {
        title: "Key Terms",
        subtitle: "팀원과 정확히 같은 언어로 토론하기 위해 먼저 잡아야 할 개념"
    },
    "prompt-section": {
        title: "NotebookLM Prompt",
        subtitle: "다음 조사 루프에서 사용할 Deep Research용 시작 프롬프트"
    }
};

const leaderCards = [
    {
        icon: "bx-radar",
        title: "팀장 역할의 중심",
        body: "직접 모델을 가장 빨리 만드는 것이 아니라, 해석 목적과 모델 가정, 수치 리스크, 의사결정 가능 범위를 정리하는 사람입니다.",
        signals: [
            "외부 요구를 failure mode와 simulation question으로 바꾼다.",
            "Abaqus/HyperMesh 선택과 해석 workflow가 문제에 맞는지 묻는다.",
            "결과 그림보다 reaction, energy, convergence, correlation evidence를 먼저 본다."
        ]
    },
    {
        icon: "bx-target-lock",
        title: "알아야 할 최소 깊이",
        body: "element, material, contact, boundary condition, nonlinear step, solver log를 읽고 모델의 약한 연결고리를 토론할 수 있어야 합니다.",
        signals: [
            "Standard와 Explicit의 선택 이유를 설명할 수 있다.",
            "mesh convergence와 singularity를 구분할 수 있다.",
            "경계조건이 실제 load path를 왜곡하는지 질문할 수 있다."
        ]
    },
    {
        icon: "bx-low-vision",
        title: "깊게 안 해도 되는 영역",
        body: "모든 GUI 조작, 모든 deck option, 모든 contact parameter를 암기할 필요는 없습니다. 다만 그 옵션이 필요한 상황과 검증 질문은 알아야 합니다.",
        signals: [
            "버튼 위치보다 input deck의 구조를 읽는 능력을 우선한다.",
            "UMAT/VUMAT을 직접 구현하기보다 언제 필요한지 판단한다.",
            "HyperMesh 작업 속도보다 mesh quality 기준을 리뷰한다."
        ]
    },
    {
        icon: "bx-conversation",
        title: "팀원과의 좋은 토론 기준",
        body: "정답을 바로 주는 것이 아니라, 실무자가 가진 현장 지식을 더 날카롭게 꺼내는 질문을 던지는 것이 목표입니다.",
        signals: [
            "이 결과를 믿어도 되는 가장 강한 근거는 무엇인가?",
            "이 모델이 현실을 가장 크게 단순화한 지점은 어디인가?",
            "의사결정에 쓰기 전에 하나만 더 검증한다면 무엇인가?"
        ]
    }
];

const roadmap = [
    {
        phase: "Weeks 1-2",
        title: "구조역학과 FEA 판단 언어 정렬",
        goal: "stress, strain, stiffness, load path, weak form, element, DOF를 팀원과 같은 언어로 말한다.",
        learn: "continuum mechanics 복습, 선형 탄성, plane stress/strain, beam/shell/solid element의 역할.",
        output: "간단한 benchmark 3개에 대해 해석 목적, 지배 가정, 예상 결과를 한 페이지로 정리."
    },
    {
        phase: "Weeks 3-4",
        title: "Abaqus 기본 workflow와 evidence 읽기",
        goal: "Abaqus/CAE에서 선형 정적 모델을 만들고, .inp와 .odb가 어떤 정보를 담는지 읽는다.",
        learn: "part, property, assembly, step, interaction, load, BC, job, visualization, reaction force balance.",
        output: "cantilever, plate with hole, simple bracket 결과를 mesh refinement별로 비교."
    },
    {
        phase: "Weeks 5-6",
        title: "HyperMesh 모델 빌드와 mesh quality 리뷰",
        goal: "실무자의 HyperMesh 모델을 보고 geometry cleanup, element type, mesh quality issue를 토론한다.",
        learn: "CAD import, topology cleanup, midsurface, shell/solid mesh, connector, Abaqus solver profile, deck export.",
        output: "HyperMesh에서 Abaqus input deck로 넘기는 체크리스트 초안 작성."
    },
    {
        phase: "Weeks 7-8",
        title: "비선형 해석의 리스크 구조",
        goal: "contact, plasticity, large deformation, convergence issue가 어디에서 생기는지 구분한다.",
        learn: "Abaqus/Standard nonlinear step, increment, contact stabilization, material plasticity, convergence diagnostics.",
        output: "비선형 해석 실패 로그 3개를 원인 후보와 다음 실험으로 분류."
    },
    {
        phase: "Weeks 9-10",
        title: "동역학, Explicit, thermal stress 판단",
        goal: "quasi-static, transient, impact, thermal-structural 문제를 solver 전략으로 분기한다.",
        learn: "Abaqus/Explicit, stable time increment, mass scaling, kinetic/internal energy ratio, thermal expansion, residual stress.",
        output: "Standard와 Explicit 선택 기준표 및 thermal stress 해석 리뷰 질문 작성."
    },
    {
        phase: "Weeks 11-12",
        title: "리뷰 시스템과 팀 capstone",
        goal: "실제 팀 문제 하나를 simulation campaign으로 설계하고, 결과 리뷰 회의를 운영한다.",
        learn: "Abaqus Python scripting, 반복 실행 자동화, 결과 extraction, V&V, decision memo 작성.",
        output: "팀 표준 Simulation Review Memo v1과 capstone 발표 자료."
    }
];

const workflow = [
    {
        icon: "bx-world",
        title: "External Need",
        body: "시장, 고객, 제품 리스크를 구조역학 질문으로 번역합니다. 무엇이 깨질 수 있고, 어떤 의사결정을 내려야 하는지 먼저 고정합니다.",
        question: "우리가 알고 싶은 것은 최대 응력인가, 변형량인가, 수명인가, 접촉 안정성인가?"
    },
    {
        icon: "bx-shape-triangle",
        title: "HyperMesh Model Build",
        body: "CAD cleanup, mesh topology, element type, connector, part organization을 정리해 solver가 읽을 수 있는 모델을 만듭니다.",
        question: "이 mesh는 물리 현상을 보기 위한 mesh인가, 단지 보기 좋은 mesh인가?"
    },
    {
        icon: "bx-cog",
        title: "Abaqus Physics Setup",
        body: "material, contact, load, BC, step, nonlinear option을 실제 물리 상황에 맞게 배치합니다.",
        question: "경계조건이 실제 load path를 대체하고 있는가, 아니면 왜곡하고 있는가?"
    },
    {
        icon: "bx-line-chart",
        title: "Solve Evidence",
        body: "수렴 로그, reaction balance, energy balance, increment history, warning 메시지를 결과 그림보다 먼저 확인합니다.",
        question: "이 해석은 정상 종료되었는가, 아니면 운 좋게 숫자가 나온 것인가?"
    },
    {
        icon: "bx-file-find",
        title: "Decision Memo",
        body: "결과를 의사결정 가능한 언어로 바꿉니다. 신뢰 가능한 범위, 남은 리스크, 다음 해석을 명확히 적습니다.",
        question: "이 결과로 지금 결정할 수 있는 것과 결정하면 안 되는 것은 무엇인가?"
    }
];

const reviewGroups = [
    {
        icon: "bx-help-circle",
        title: "Problem Framing",
        questions: [
            "이 해석의 의사결정 질문이 한 문장으로 정의되어 있는가?",
            "failure mode가 명확한가: yielding, buckling, fatigue, fracture, contact slip, excessive deformation?",
            "실험, hand calculation, 이전 모델 중 비교 기준이 있는가?"
        ]
    },
    {
        icon: "bx-cube-alt",
        title: "Model Fidelity",
        questions: [
            "geometry simplification이 stress path를 바꾸지 않는가?",
            "beam, shell, solid element 선택 이유가 문제 스케일과 맞는가?",
            "material model이 실제 온도, strain rate, plasticity 범위를 대표하는가?"
        ]
    },
    {
        icon: "bx-git-branch",
        title: "Numerical Reliability",
        questions: [
            "mesh convergence 또는 최소한 mesh sensitivity가 확인되었는가?",
            "contact penetration, stabilization, hourglass, artificial energy가 관리되고 있는가?",
            "warning과 convergence issue를 해석자가 설명할 수 있는가?"
        ]
    },
    {
        icon: "bx-bar-chart-alt-2",
        title: "Result Evidence",
        questions: [
            "reaction force와 applied load가 균형을 이루는가?",
            "singularity peak와 실제 hot spot을 구분했는가?",
            "결과가 단위, 좌표계, 평균화 옵션에 민감하지 않은가?"
        ]
    },
    {
        icon: "bx-check-shield",
        title: "Decision Readiness",
        questions: [
            "현재 결과로 가능한 결정과 불가능한 결정이 분리되어 있는가?",
            "다음 실험 하나를 한다면 가장 uncertainty를 줄이는 방향인가?",
            "외부 이해관계자에게 말할 수 있는 수준의 caveat가 정리되어 있는가?"
        ]
    }
];

const capstoneCases = [
    {
        icon: "bx-ruler",
        title: "Cantilever Benchmark",
        purpose: "FEA 기본 신뢰도 감각 만들기",
        tasks: ["Euler-Bernoulli beam hand calculation과 Abaqus 결과 비교", "solid/shell/beam element 차이 확인", "mesh refinement에 따른 tip displacement와 stress peak 변화 기록"]
    },
    {
        icon: "bx-donut-chart",
        title: "Plate With Hole",
        purpose: "응력집중과 singularity 감각 만들기",
        tasks: ["stress concentration factor와 문헌값 비교", "mesh density와 stress averaging 옵션의 영향 확인", "peak stress를 설계 판단에 쓰면 위험한 조건 정리"]
    },
    {
        icon: "bx-link",
        title: "Bolted or Contact Assembly",
        purpose: "contact와 load path 리뷰 능력 확보",
        tasks: ["friction, preload, contact pressure sensitivity 확인", "수렴 실패 원인을 접촉, 강체 운동, BC 문제로 분류", "Standard 해석 로그 리뷰"]
    },
    {
        icon: "bx-thermometer",
        title: "Thermal Stress Model",
        purpose: "DFT/MD/재료 지식과 구조 해석 연결",
        tasks: ["CTE mismatch로 발생하는 응력 방향 예측", "온도장 입력 방식과 structural step 연결", "잔류응력과 외부하중 중첩 판단"]
    },
    {
        icon: "bx-bolt-circle",
        title: "Impact or Quasi-static Explicit",
        purpose: "Standard와 Explicit 선택 기준 학습",
        tasks: ["kinetic/internal energy ratio로 quasi-static 여부 확인", "mass scaling의 물리 왜곡 가능성 기록", "시간스케일과 strain rate 민감도 토론"]
    }
];

const terms = [
    {
        icon: "bx-grid-alt",
        title: "Element",
        body: "구조물을 나누는 계산 단위입니다. 팀장 관점에서는 element formulation, integration, aspect ratio가 결과 신뢰도에 어떤 영향을 주는지 묻는 것이 중요합니다."
    },
    {
        icon: "bx-lock-alt",
        title: "Boundary Condition",
        body: "현실의 지지, 구속, 하중 전달을 수학적으로 대체하는 조건입니다. 가장 흔한 오류는 해석 편의를 위해 실제 load path를 없애버리는 것입니다."
    },
    {
        icon: "bx-transfer",
        title: "Contact",
        body: "부품 사이의 닿음, 미끄러짐, 분리, 마찰을 표현합니다. 수렴 실패와 결과 민감도의 큰 원인이므로 contact pressure와 penetration을 함께 봐야 합니다."
    },
    {
        icon: "bx-loader-circle",
        title: "Convergence",
        body: "비선형 해석에서 평형 방정식을 만족하는 해를 찾는 과정입니다. 정상 종료 여부보다 residual, increment cutback, warning의 의미를 읽는 것이 더 중요합니다."
    },
    {
        icon: "bx-pulse",
        title: "Energy Balance",
        body: "특히 Explicit에서는 internal, kinetic, artificial, hourglass energy를 비교해 해석이 물리 문제를 풀고 있는지 수치 문제를 만들고 있는지 판단합니다."
    },
    {
        icon: "bx-certification",
        title: "V&V",
        body: "Verification은 방정식을 제대로 풀었는가, Validation은 현실을 제대로 대표하는가의 질문입니다. 팀장 리뷰는 늘 이 둘을 분리해서 다뤄야 합니다."
    }
];

const notebookPrompt = `NotebookLM의 Deep Research 기능을 켜고, 아래 목적에 맞춰 구조역학 Simulation 팀장용 학습 자료를 만들어줘.

목적:
나는 DFT와 MD 기반 지식이 있고, 회사에서는 CFD 팀장으로 DSMC Tool과 Boltzmann 방정식 기반 입자 유동 계산을 직접 다뤄본 경험이 있다. 이제 Abaqus와 HyperMesh를 사용하는 구조역학 Simulation 팀의 방향성을 정하고, 실무자와 깊이 있게 토론할 수 있는 수준의 전문성을 얻고 싶다.

내 목표는 Abaqus/HyperMesh의 최고 숙련자가 되는 것이 아니라, review-capable technical leader가 되는 것이다. 즉, 팀원이 만든 모델과 결과를 보고 물리 가정, 수치 리스크, 모델 신뢰도, 다음 해석 방향을 판단할 수 있어야 한다.

다음 목차로 조사하고 정리해줘.

1. 구조역학 FEA의 핵심 원리
- continuum mechanics, weak form, element, DOF, stiffness, stress/strain, load path
- DFT/MD/CFD/DSMC 경험자가 이해하기 쉬운 대응 관계

2. Abaqus 학습 우선순위
- Abaqus/CAE workflow
- input deck과 ODB에서 반드시 읽어야 할 정보
- Abaqus/Standard와 Abaqus/Explicit 선택 기준
- nonlinear, contact, plasticity, large deformation, convergence diagnostics

3. HyperMesh 학습 우선순위
- CAD cleanup, topology, midsurface, shell/solid mesh
- mesh quality 기준과 나쁜 mesh가 만드는 결과 왜곡
- Abaqus solver profile, deck export, connector, model organization

4. 팀장용 Simulation Review Checklist
- problem framing
- model fidelity
- boundary condition and load path
- mesh convergence and sensitivity
- solver log and warning
- result interpretation and decision readiness

5. 12주 학습 로드맵
- 주차별 학습 목표
- 직접 해볼 benchmark case
- 팀원과 토론해야 할 질문
- 산출물 형식

6. 반드시 피해야 할 오해
- 예쁜 contour plot을 신뢰도로 착각하는 경우
- singularity와 실제 hot spot을 혼동하는 경우
- 정상 종료를 검증 완료로 착각하는 경우
- contact stabilization, mass scaling, artificial energy를 과소평가하는 경우

7. 최종 산출물
- 팀장이 매주 누적할 learning memo template
- 해석 리뷰 회의 agenda template
- capstone simulation campaign 예시

가능하면 공식 문서와 산업 실무 관점의 키워드를 함께 제시하고, 각 항목마다 "팀장이 던질 좋은 질문"을 별도로 정리해줘.`;

function renderLeaderCards() {
    const grid = document.getElementById("leader-grid");
    grid.innerHTML = leaderCards.map(card => `
        <article class="sim-card">
            <h3><i class='bx ${card.icon}'></i>${card.title}</h3>
            <p>${card.body}</p>
            <ul class="signal-list">
                ${card.signals.map(signal => `<li>${signal}</li>`).join("")}
            </ul>
        </article>
    `).join("");
}

function renderRoadmap() {
    const grid = document.getElementById("roadmap-grid");
    grid.innerHTML = roadmap.map(item => `
        <article class="roadmap-card">
            <span class="phase-badge"><i class='bx bx-calendar'></i>${item.phase}</span>
            <h3>${item.title}</h3>
            <p>${item.goal}</p>
            <h4>Learning Focus</h4>
            <p>${item.learn}</p>
            <h4>Output</h4>
            <p>${item.output}</p>
        </article>
    `).join("");
}

function renderWorkflow() {
    const grid = document.getElementById("workflow-grid");
    grid.innerHTML = workflow.map(item => `
        <article class="workflow-step">
            <div class="step-icon"><i class='bx ${item.icon}'></i></div>
            <h3>${item.title}</h3>
            <p>${item.body}</p>
            <div class="leader-question"><strong>Leader question</strong><br>${item.question}</div>
        </article>
    `).join("");
}

function renderReview() {
    const grid = document.getElementById("review-grid");
    grid.innerHTML = reviewGroups.map(group => `
        <article class="review-card">
            <h3><i class='bx ${group.icon}'></i>${group.title}</h3>
            <ul>
                ${group.questions.map(question => `<li>${question}</li>`).join("")}
            </ul>
        </article>
    `).join("");
}

function renderCases() {
    const grid = document.getElementById("cases-grid");
    grid.innerHTML = capstoneCases.map(item => `
        <article class="case-card">
            <h3><i class='bx ${item.icon}'></i>${item.title}</h3>
            <p><strong style="color:var(--primary);">Purpose:</strong> ${item.purpose}</p>
            <ul>
                ${item.tasks.map(task => `<li>${task}</li>`).join("")}
            </ul>
        </article>
    `).join("");
}

function renderTerms() {
    const grid = document.getElementById("terms-grid");
    grid.innerHTML = terms.map(term => `
        <article class="term-card">
            <h3><i class='bx ${term.icon}'></i>${term.title}</h3>
            <p>${term.body}</p>
        </article>
    `).join("");
}

function bindNavigation() {
    const navLinks = document.querySelectorAll(".nav-links li");
    const sections = document.querySelectorAll(".content-section");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");

    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            const targetId = link.dataset.target;
            navLinks.forEach(item => item.classList.remove("active"));
            link.classList.add("active");

            sections.forEach(section => {
                section.classList.toggle("active", section.id === targetId);
            });

            pageTitle.textContent = pageMeta[targetId].title;
            pageSubtitle.textContent = pageMeta[targetId].subtitle;
        });
    });
}

function bindPromptCopy() {
    const promptBox = document.getElementById("notebook-prompt");
    const copyButton = document.getElementById("copy-notebook-prompt");
    promptBox.textContent = notebookPrompt;

    copyButton.addEventListener("click", async () => {
        let copied = false;

        if (navigator.clipboard && window.isSecureContext) {
            try {
                await navigator.clipboard.writeText(notebookPrompt);
                copied = true;
            } catch (error) {
                copied = false;
            }
        }

        if (!copied) {
            const textArea = document.createElement("textarea");
            textArea.value = notebookPrompt;
            textArea.setAttribute("readonly", "");
            textArea.style.position = "fixed";
            textArea.style.left = "-9999px";
            document.body.appendChild(textArea);
            textArea.select();
            copied = document.execCommand("copy");
            document.body.removeChild(textArea);
        }

        if (!copied) {
            const range = document.createRange();
            range.selectNodeContents(promptBox);
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
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
    renderLeaderCards();
    renderRoadmap();
    renderWorkflow();
    renderReview();
    renderCases();
    renderTerms();
    bindNavigation();
    bindPromptCopy();
});
