const overviewData = [
    {
        title: "잔류 응력의 핵심 정의 (자가 평형)",
        icon: "bx-target-lock",
        content: `
            <p>잔류 응력은 외부에서 가해지는 물리적인 하중이나 인위적인 힘이 완전히 제거된 상태에서도 재료나 구조물 내부에 <strong>스스로 남아 존재하는 응력</strong>을 의미합니다.</p>
            <p>이는 재료에 국부적이고 불균일한 소성 변형이나 체적 변화가 발생했을 때, 연속된 재료가 기하학적 연속성을 유지하기 위해 스스로 내부적인 억제력(구속)을 발휘하면서 힘과 모멘트의 <strong>'자가 평형(Self-equilibrium)'</strong>을 이루며 형성된 결과물입니다.</p>
            <p>구조 해석 관점에서 볼 때, 이러한 내재적 응력은 실제 외부 하중이 가해질 때 <strong>중첩(Superposition)</strong>되어 나타나므로 부품의 항복이나 파단을 설계치보다 훨씬 낮은 외부 하중에서 유발할 수 있는 숨겨진 위험 변수로 작용합니다.</p>
        `
    },
    {
        title: "주된 발생 원인 3가지",
        icon: "bx-git-repo-forked",
        content: `
            <p>다물리적(Multi-physics) 시스템 관점에서 잔류 응력은 크게 3가지 발생 기구를 갖습니다.</p>
            <ul>
                <li><strong>열적 요인 (Thermal Factors):</strong> 금속 적층 제조(3D 프린팅), 용접 등에서 나타나는 극심한 국부적 온도 구배 및 급속 냉각이 주원인입니다. 각 소재 간의 열팽창계수(CTE) 미스매치로 인해 구조적 구속을 받아 강력한 열응력이 발생합니다.</li>
                <li><strong>기계적/미세구조적 요인 (Mechanical Factors):</strong> 핵이 병합(Coalescence)하면서 억지로 물리적 변형을 일으키거나, 스퍼터링 공정 시 고에너지 입자가 격자 틈새로 침투하는 원자 피닝(Atomic peening), 격자 상수 불일치 등으로 인해 발생합니다.</li>
                <li><strong>화학적 요인 (Chemical Factors):</strong> 유기 박막 등의 열경화 과정에서 용매 증발에 의한 체적 감소와, 고분자 사슬의 가교 반응(Cross-linking)으로 인한 화학적 수축 현상입니다. 기판에 고정된 상태에서 수축이 억제되며 인장 응력을 유발합니다.</li>
            </ul>
        `
    },
    {
        title: "구조물에 미치는 치명적인 영향",
        icon: "bx-trending-down",
        content: `
            <p>제어되지 않은 잔류 응력은 소자와 구조물의 기계적 무결성을 치명적으로 파괴합니다.</p>
            <ul>
                <li><strong>피로 수명 단축 및 균열 전파:</strong> 인장 잔류 응력은 내부의 미세 결함을 응력 집중부로 만들어 크랙(Crack)의 생성과 성장을 가속화합니다. 주기적인 동적 하중(Cyclic loading) 환경에서 재료의 피로 수명(Fatigue life)을 급격히 단축시킵니다.</li>
                <li><strong>기하학적 변형 및 치수 불량:</strong> 박막의 응력이 평형을 잃으면 거시적 휨(Warping, Buckling)이 발생합니다. 마이크로 스케일에서는 배선의 위글링, 패턴 붕괴를 일으켜 전기·광학적 소자 특성을 파괴합니다.</li>
            </ul>
        `
    },
    {
        title: "AI 및 시뮬레이션을 통한 예측의 필요성",
        icon: "bx-chip",
        content: `
            <p>홀드릴링이나 XRD와 같은 전통적인 실험적 측정법은 파괴적 손상을 동반하거나 실시간 측정이 불가능합니다. 따라서 구조 건전성 확보를 위해 디지털 모델링 기술이 필수적으로 요구됩니다.</p>
            <ul>
                <li><strong>열-구조 연성 FEM 해석:</strong> 공정 중 발생하는 다차원적 온도 구배와 기계적 변형, 상변태 등 물리적 현상을 연계하여 3차원 공간상에서 응력 분포와 균열 시작점을 사전에 예측하는 강력한 수단입니다.</li>
                <li><strong>물리 기반 신경망(PINN) 도입:</strong> 수십만 개의 층을 해석해야 하는 FEM의 연산 시간(수일 소요)을 대체합니다. 물리적 법칙(지배 방정식)을 내재화한 PINN 모델을 통해 비선형적 응력 분포의 예측 속도를 밀리초 단위로 획기적으로 단축합니다.</li>
                <li><strong>디지털 트윈을 통한 제어:</strong> 훈련된 AI 모델을 실시간 센서와 통합하면 완벽한 '디지털 트윈'을 구축하여 파라미터 역보상을 통해 제조 공정 중 응력을 억제할 수 있습니다.</li>
            </ul>
        `
    }
];

const thinfilmData = [
    {
        title: "마이크로 및 나노 시스템(MNS)의 박막 응력 기원",
        icon: "bx-microchip",
        content: `
            <p><strong>외인성 응력 (Extrinsic Stress):</strong> 주로 기판과 박막 간의 열팽창 계수(TCE) 불일치에 기인합니다. 고온 증착 후 냉각 과정에서 수축률 차이 발생 시, 박막의 TCE가 크면 인장 응력(+), 기판이 크면 압축 응력(-)이 발생합니다.</p>
            <p><strong>내인성 응력 (Intrinsic Stress):</strong> 격자 불일치(Lattice Mismatch), 결정립 경계 및 불순물 혼입 등의 미세 구조적 결함으로 인해 발생합니다.</p>
        `
    },
    {
        title: "증착 공정별 응력 발생 양상 (진행 중)",
        icon: "bx-layer-plus",
        content: `
            <p>반도체/디스플레이 공정의 핵심 증착 방식에 따른 메커니즘입니다.</p>
            <ul>
                <li><strong>플라즈마 공정 (Sputtering, PECVD):</strong> 이온 충격에 의해 원자가 강제로 밀어 넣어지는 <strong>원자 피닝(Atomic Peening)</strong> 효과로 강한 압축 응력이 유발됩니다.</li>
                <li><strong>진공 공정 (Evaporation 등):</strong> (데이터 대기 중 - 열응력 중심의 작용 원리)</li>
                <li><strong>유기막 코팅 (Resin Curing):</strong> (데이터 대기 중 - 가교 반응 및 용매 증발에 의한 체적 수축)</li>
            </ul>
        `
    },
    {
        title: "잔류 응력 측정 공학",
        icon: "bx-slider",
        content: `
            <ul>
                <li><strong>거시적 측정 (웨이퍼 곡률법):</strong> Stoney Equation을 사용하여 레이저 스캔으로 증착 전후의 기판 곡률 변화를 측정합니다.</li>
                <li><strong>미시적 측정 (테스트 소자 베이스):</strong> 
                    <br>- <em>좌굴 빔 (Buckling Beam):</em> 압축 응력 측정에 특화. 빔이 휘어지는 임계 길이 확인.
                    <br>- <em>포인터 구조 (Pointer Structure):</em> 응력에 의한 회전 변위를 확인하여 인장/압축 모두 측정.
                </li>
            </ul>
        `
    },
    {
        title: "응력의 전략적 활용: 제로 강성 및 Spalling",
        icon: "bx-bulb",
        content: `
            <p>잔류 응력은 제거 대상에서 '에너지 원'으로 진화하고 있습니다.</p>
            <ul>
                <li><strong>프리로딩 쉐브론 메커니즘 (PCM):</strong> 산화막(SiO2)의 압축 응력을 증폭하는 V자 빔 구조. 에너지 소모 없이 스프링 강성을 98%까지 감소(Near-zero stiffness)시켜 정밀 MEMS에 적용됩니다.</li>
                <li><strong>Kerf-less 웨이퍼링 (Spalling):</strong> 강한 인장 응력을 가진 금속층(니켈)을 증착한 후, 축적된 에너지가 파괴 강도를 선호 방향으로 넘어서게 유도하여 40~60µm 얇은 실리콘 층만 자발적으로 벗겨내는(Spalling) 혁신 제조 기술입니다.</li>
            </ul>
        `
    }
];

const mechanismData = [
    {
        title: "외인성 응력 (Extrinsic Stress)",
        icon: "bx-thermometer",
        content: `
            <p>서로 다른 물리적 특성을 가진 재료 간의 인터랙션에 의해 외부 공과정에서 발생합니다.</p>
            <ul>
                <li><strong>열팽창 계수(TCE) 미스매치:</strong> 공정 온도(예: CVD 고온)에서 상온으로 냉각될 때 기판과 박막은 서서히 수축합니다.</li>
                <li><strong>수축률 차이:</strong> 박막이 기판보다 더 수축하려고 하면(TCE_film > TCE_sub), 기판이 이를 억제하므로 박막 내부에는 <strong>인장 응력(Tensile)</strong>이 걸립니다. 반대의 경우에는 <strong>압축 응력(Compressive)</strong>이 걸립니다.</li>
            </ul>
        `
    },
    {
        title: "내인성 응력 (Intrinsic Stress)",
        icon: "bx-atom",
        content: `
            <p>열적 요인이 아닌, 박막 성장 및 구조적 진화 과정 자체에 내제된 요인입니다.</p>
            <ul>
                <li><strong>격자 불일치 (Lattice Mismatch):</strong> 에피택셜(Epitaxial) 성장 시 기판과 증착 원자의 격자 상수가 달라 억지로 모양을 맞추며 발생하는 구조적 왜곡입니다.</li>
                <li><strong>미세 결함 및 병합 (Coalescence):</strong> 박막 형성 초기에 섬(Island) 들이 상호 병합되면서 경계면(Grain boundary)의 표면 에너지를 줄이기 위해 발생합니다.</li>
                <li><strong>두께 의존성 (Thickness-dependent):</strong> 박막의 두께가 두꺼워짐에 따라 응력의 부류가 변하거나 에너지가 축적되어 한계를 넘기도 합니다.</li>
            </ul>
        `
    }
];

const effectsData = [
    {
        title: "기계적/전기적 특성 변화",
        icon: "bx-broadcast",
        content: `
            <ul>
                <li><strong>공진 주파수 변이:</strong> 인장 응력(+)은 빔 구조의 피아노 줄을 팽팽하게 당기는 것과 같아 강성을 높이고 주파수를 상승시킵니다. 반면, 압축 응력(-)은 느슨하게 만들어 주파수를 떨어뜨립니다.</li>
                <li><strong>전자 이동도 왜곡:</strong> 결정 격자 변형은 밴드 구조를 왜곡하여 반도체 전자/정공 이동도에 큰 영향을 미칩니다 (이를 응용한 Strained-Silicon 공정도 존재).</li>
                <li><strong>리소그래피 방해:</strong> 거시적 휨(Bowing) 현상은 노광 공정의 초점 심도(Depth of Focus)를 빗나가게 하여 치명적인 패턴 불량을 만듭니다.</li>
            </ul>
        `
    },
    {
        title: "구조적 실패 (Structural Failure)",
        icon: "bx-unlink",
        content: `
            <p>응력 에너지가 재료의 결합 에너지나 접착 강도를 초과할 때 발생합니다.</p>
            <ul>
                <li><strong>박리 (Delamination):</strong> 압축 응력을 견디다 못해 막이 기판으로부터 떨어지며 부풀어 오르는 블리스터링(Blistering) 현상.</li>
                <li><strong>균열 (Cracking):</strong> 강한 인장 응력이 박막 내부나 표면의 미세 결함에 집중되면서 거미줄 모양의 균열을 생성. 피로 수명을 급격히 떨어뜨립니다.</li>
            </ul>
        `
    }
];

    const measurementData = [
        {
            title: "광학적 기판 곡률 측정 (Wafer Curvature)",
            icon: "bx-bullseye",
            content: "<p>박막 증착 전후의 기판(Wafer) 곡률 반경 변화를 레이저 스캐닝 등으로 측정합니다. 측정된 변화량은 <strong>스토니 공식(Stoney Equation)</strong>에 대입되어 기판의 물성과 두께 정보만으로 거시적 잔류 응력을 도출합니다.</p><ul><li><strong>장점:</strong> 소자에 손상을 주지 않는 완전 비파괴 검사이자 넓은 면적의 인-시튜(In-situ) 실시간 측정이 가능해 산업계 표준으로 쓰입니다.</li><li><strong>한계점:</strong> 위치별 국부적 응력 분포를 파악하기 불가능하고, 휨이 비구형(안장 형태)일 경우 오차가 발생하며 깊이 방향 구배를 알 수 없습니다.</li></ul>"
        },
        {
            title: "미세 기계 가공 포인터 (Micro-machined Pointers)",
            icon: "bx-compass",
            content: "<p>기판에서 분리된(Released) 독립적인 미세 구조물(브릿지, 링, 포인터 등)을 제작하여, 내재된 응력이 구조물을 변형시키는 현상을 시각적으로 기하학적 증폭시킵니다.</p><ul><li><strong>Guckel 링 & 포인터:</strong> 응력에 의한 미세한 힘을 포인터 빔의 거시적인 회전이나 링의 좌굴(Buckling)로 변환시켜 고해상도로 응력을 역산합니다.</li><li><strong>활용 가치:</strong> 초소형 면적에서의 국부적 인장/압축 응력을 정밀 매핑하거나 외팔보(Cantilever) 휨을 통해 두께 방향 응력 구배(Stress Gradient)를 얻는 필수 기술입니다.</li></ul>"
        },
        {
            title: "X-선 회절 분석 (XRD)",
            icon: "bx-scan",
            content: "<p>단파장의 X-선을 결정질 박막에 조사하여 <strong>브래그 법칙(Bragg's Law)</strong>에 따른 회절 패턴을 분석합니다. 격자 상수($d$)의 미세한 변형이 회절 피크의 이동(Shift)으로 나타나 절대 응력으로 환산됩니다.</p><ul><li><strong>강점:</strong> 응력 측정과 더불어 상변태, 결정립 크기 등 재료의 미세구조적 진화를 동시에 분석할 수 있는 독보적 비파괴 기법입니다.</li><li><strong>주요 기능:</strong> 나노 스케일의 변형률을 정확히 읽어내며, 입사각 조절을 통해 박막 특정 깊이의 표면 응력을 선택적으로 타겟팅할 수 있습니다.</li></ul>"
        },
        {
            title: "미세 압입 및 홀 드릴링",
            icon: "bx-target-lock",
            content: "<p><strong>홀 드릴링</strong>과 <strong>미세 압입</strong>을 통해 박막 표면에 기계적 결함을 인가하고, 체적이 이완되며 주변 재료가 겪는 변형률(Load-displacement)을 측정하여 원래 응력을 역산합니다.</p><ul><li><strong>단점:</strong> 표면에 물리적 흔적을 남기는 파괴적(Destructive) 검사 방식입니다.</li><li><strong>핵심 가치:</strong> 깊이를 늘리며 데이터를 수집할 수 있어 곡률 파악이 힘든 정밀한 '깊이별 잔류 응력 프로파일(Through-thickness Profile)' 확보에 가장 용이합니다.</li></ul>"
        }
    ];

    const modelingData = [
        {
            title: "열-구조 연성 FEM 해석",
            icon: "bx-cube",
            content: "<p>공정 중 발생하는 온도 구배, 탄소성 변형, 상변태 등 다물리적(Multi-physics) 현상을 연계하여 3차원 공간상에서 응력 분포와 균열을 사전에 예측합니다.</p><ul><li>하지만 수십만 개의 층상 모델을 해석해야 하는 경우 연산에만 수일이 소요되는 속도 한계가 존재합니다.</li></ul>"
        },
        {
            title: "물리 기반 기계학습(PINN) 시뮬레이션",
            icon: "bx-network-chart",
            content: "<p>강력한 연산 속도를 위해 물리적 법칙(지배 방정식)과 경계 조건을 손실 함수에 내재화한 <strong>인공지능 신경망(Physics-Informed Neural Network)</strong>이 도입되었습니다.</p><ul><li>비선형적 시공간 응력 분포 예측 속도를 대폭 단축하며, 실험계 기반의 딥러닝과 달리 물리적으로 타당한 예측 신뢰성을 입증합니다.</li></ul>"
        },
        {
            title: "능동적 디지털 트윈(Digital Twin) 제어",
            icon: "bx-share-alt",
            content: "<p>훈련된 AI 시뮬레이션 모델을 실제 센서 모니터링 데이터와 통합하면 완벽한 '디지털 트윈'을 구축할 수 있습니다.</p><ul><li>공정 중 이상 변수를 감지하고 기하학적 뒤틀림을 보상하는 예측 파라미터 궤적을 즉각 반영하여 잔류 응력을 스스로 억제하는 스마트 다이내믹 제조를 달성합니다.</li></ul>"
        }
    ];

document.addEventListener('DOMContentLoaded', () => {
    // Generic Render Function
    function renderSection(gridId, data) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        grid.innerHTML = '';
        
        data.forEach(item => {
            grid.innerHTML += `
                <div class="overview-card">
                    <h3><i class='bx ${item.icon}'></i> ${item.title}</h3>
                    <div class="card-content">
                        ${item.content}
                    </div>
                </div>
            `;
        });
    }

    renderSection('overview-grid', overviewData);
    renderSection('thinfilm-grid', thinfilmData);
    renderSection('mechanism-grid', mechanismData);
    renderSection('effects-grid', effectsData);
    renderSection('measurement-grid', measurementData);
    renderSection('modeling-grid', modelingData);

    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const titleMap = {
        'overview-section': { title: 'Core Overview', sub: '잔류 응력의 핵심 개념 및 요약' },
        'thinfilm-section': { title: 'Thin Film Processes', sub: '반도체·디스플레이 구동 로직 및 증착 공정별 응력 기구' },
        'mechanism-section': { title: 'Mechanisms', sub: '다물리적 발생 메커니즘 심층 분석' },
        'effects-section': { title: 'Effects & Impacts', sub: '구조물의 수명과 변형에 미치는 치명적인 영향' },
        'measurement-section': { title: 'Measurement Methods', sub: '미세구조 및 스크래치를 통한 응력 측정/평가 기술' },
        'modeling-section': { title: 'AI & Simulation', sub: 'PINN 및 유한요소해석 기반 다물리 시뮬레이션과 디지털 트윈' }
    };

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.forEach(n => n.classList.remove('active'));
            link.classList.add('active');

            const targetId = link.getAttribute('data-target');
            sections.forEach(s => s.classList.remove('active'));
            document.getElementById(targetId).classList.add('active');

            pageTitle.textContent = titleMap[targetId].title;
            pageSubtitle.textContent = titleMap[targetId].sub;
        });
    });
});
