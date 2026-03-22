const theoryData = [
    { title: "SciML (Scientific Machine Learning)", subtitle: "물리-ML의 기초", what: "고성능 컴퓨팅(HPC) 기반의 수치 해석 시뮬레이션에 딥러닝의 예측 능력을 결합한 새로운 학문 분야입니다.", why: "기존 수치 해석은 높은 정확도를 가지지만 계산 비용이 막대합니다. SciML은 딥러닝을 통해 이를 보완하거나 대체하여 설계 공간 탐색과 시뮬레이션을 전례 없는 속도(최대 10만 배)로 가속하는 대리 모델을 구축합니다." },
    { title: "PDE (Partial Differential Equations)", subtitle: "편미분 방정식", what: "열 전달, 유체 유동, 구조 역학 등 물리적 현상의 지배 원리를 시공간의 변화율로 설명하는 수학적 언어입니다.", why: "PhysicsNeMo에서는 방정식들을 단순한 검증 도구가 아니라, 인공지능이 학습할 때 오차를 계산하는 손실 함수(Loss Function)로 직접 주입하여 물리 법칙 위배를 강제합니다." },
    { title: "PINN (Physics-Informed Neural Networks)", subtitle: "물리 정보 신경망", what: "관측 데이터에만 의존하지 않고, 모델의 손실 함수에 물리 법칙(PDE)과 경계/초기 조건을 통합한 신경망입니다.", why: "메쉬가 필요 없는 'Meshless 솔버' 역할을 하며 데이터 부족 환경에서도 빈 공간을 추론해내고 역방향 문제(Inverse problem)를 해결합니다." },
    { title: "Neural Operator", subtitle: "신경 연산자 (FNO 등)", what: "단일 방정식 해를 찾는 PINN과 달리, 입력 함수와 출력 함수 사이의 '매핑(Mapping)' 전체를 학습하는 아키텍처입니다.", why: "한 번 학습되면 경계 조건이나 형상이 바뀌어도 재학습 없이 즉각적(Zero-shot) 해를 예측할 수 있어 디지털 트윈에 필수적입니다." },
    { title: "Modulus / PhysicsNeMo", subtitle: "NVIDIA 프레임워크", what: "NVIDIA가 개발한 오픈 소스(Apache 2.0) 물리-ML 딥러닝 프레임워크입니다.", why: "PyTorch 생태계와 통합되며, 단일 GPU부터 대규모 노드까지 확장이 가능한 분산 컴퓨팅과 최첨단 SciML 아키텍처를 제공합니다." }
];

const workflowData = [
    { step: 1, title: "환경 세팅 및 인프라 구축", action: "딥러닝 라이브러리(PyTorch, CUDA, NCCL, PhysicsNeMo)를 설치합니다.", note: "프로덕션 환경에서는 NVIDIA NGC 컨테이너 사용이 강력히 권장됩니다.", icon: "bx-server" },
    { step: 2, title: "실험 구성 및 파라미터 정의", action: "conf/config.yaml로 옵티마이저, 훈련 스텝, 모델 크기를 정의합니다.", note: "Hydra를 사용하여 커맨드라인에서 변수를 쉽게 제어할 수 있습니다.", icon: "bx-slider-alt" },
    { step: 3, title: "기하학적 도메인 및 PDE 정의", action: "시뮬레이션 대상의 형태와 적용될 물리 법칙을 선언합니다.", note: "안정적인 학습을 위해 물리량을 단위 없는 상태로 스케일링하는 무차원화 필수.", icon: "bx-shape-polygon" },
    { step: 4, title: "제약 조건 / 손실 함수 구성", action: "신경망이 학습할 기준점을 도메인에 샘플링하여 배치합니다.", note: "SDF(Signed Distance Field) 가중치를 적용해 학습 수렴 속도를 높여야 합니다.", icon: "bx-target-lock" },
    { step: 5, title: "도메인 조립 및 훈련 실행", action: "제약 조건, 트레이너 등을 Domain에 추가하고 Solver를 실행합니다.", note: "TF32 켜기, CUDA Graphs 활용, 도메인 병렬화(ShardTensor) 적용", icon: "bx-play-circle" },
    { step: 6, title: "결과 시각화 및 모델 추론", action: "잔차 수렴 확인 후, 대리 모델로 실제 예측을 수행합니다.", note: "결과 .vtp 파일은 ParaView로 기존 CFD처럼 시각화할 수 있습니다.", icon: "bx-bar-chart-alt-2" }
];

const dictionaryData = [
    { term: "Surrogate Model", kor: "대리 모델", meaning: "고비용 수치 해석 시뮬레이터를 대신하여 실시간에 가까운 속도로 근사 결과를 도출하도록 훈련된 AI 모델." },
    { term: "Residual", kor: "잔차 (오차)", meaning: "AI 모델 예측값을 지배 방정식(PDE)에 대입했을 때 완전히 0이 되지 않고 남는 오류. 모델은 이를 0에 수렴하도록 학습함." },
    { term: "Automatic Differentiation", kor: "자동 미분", meaning: "신경망 입력 좌표에 대한 출력값의 미분(기울기)을 수학적으로 직접 연산하는 기술." },
    { term: "Collocation Points", kor: "콜로케이션 포인트", meaning: "물리 법칙 손실을 평가하기 위해 도메인 내부에 흩뿌리는 점들의 집합." },
    { term: "Zero-shot Generalization", kor: "제로샷 일반화", meaning: "관측되지 않은 새로운 형상/조건이 주어져도 재학습 없이 물리적 해를 예측하는 능력." },
    { term: "Signed Distance Field", kor: "SDF (거리장)", meaning: "공간의 점이 경계로부터 얼마나 떨어져 있는지 부호로 나타내어 신경망이 3D 형태를 인식하게 돕는 기법." },
    { term: "Meshless Finite Derivative", kor: "메쉬 없는 유한 차분", meaning: "동적으로 스텐실을 구성해 자동 미분을 대체하고 메모리를 절약하며 수 배 가속하는 기술." },
    { term: "Digital Twin", kor: "디지털 트윈", meaning: "현실의 물리적 시스템을 컴퓨터 상에 동일하게 구현한 것으로, PhysicsNeMo가 AI 엔진을 제공함." }
];

const codeSnippet = `import torch
from sympy import Symbol
from modulus.sym.hydra import ModulusConfig
import modulus.sym.main
from modulus.sym.geometry.primitives_2d import Rectangle
from modulus.sym.eq.pdes.navier_stokes import NavierStokes
from modulus.sym.models.fully_connected import FullyConnectedArch
from modulus.sym.models.activation import Activation
from modulus.sym.key import Key
from modulus.sym.domain import Domain
from modulus.sym.domain.constraint import PointwiseBoundaryConstraint, PointwiseInteriorConstraint
from modulus.sym.solver import Solver

# [A] Configuration 로드: Hydra를 사용하여 conf/config.yaml의 설정을 주입합니다.
@modulus.sym.main(config_path="conf", config_name="config")
def run(cfg: ModulusConfig):
    
    # [B] 신경망 모델(Architecture) 정의
    # 입력(x, y)을 받아 출력(u, v, p)을 예측하는 완전 연결 신경망(FCNN)을 생성합니다.
    flow_net = FullyConnectedArch(
        input_keys=[Key("x"), Key("y")],
        output_keys=[Key("u"), Key("v"), Key("p")],
        layer_size=512,
        nr_layers=6,
        activation_fn=Activation.SILU # 2차 미분을 위해 ReLU 대신 SiLU 사용
    )
    
    # [C] 기하학적 형상(Geometry) 및 지배 방정식(PDE) 정의
    # 1. 2D 사각형 도메인 생성 (가로세로 0~0.1)
    rec = Rectangle((0, 0), (0.1, 0.1))
    
    # 2. 비압축성 나비에-스토크스 방정식 호출 (동점성계수 nu, 밀도 rho 설정)
    ns = NavierStokes(nu=0.01, rho=1.0, dim=2, time=False)
    
    # 3. 모델과 방정식에서 사용할 연산 노드(Node)들을 결합하여 추론 그래프 생성
    nodes = ns.make_nodes() + [flow_net.make_node(name="flow_network")]
    
    # [D] 제약 조건(Constraints) 추가
    # 1. 경계 조건 (Boundary Condition): 위쪽 벽이 1m/s로 움직인다고 가정 (Lid-Driven Cavity)
    top_wall = PointwiseBoundaryConstraint(
        nodes=nodes,
        geometry=rec,
        outvar={"u": 1.0, "v": 0.0}, # 목표 출력값 설정
        batch_size=1000,
        criteria=Symbol("y") == 0.1  # y=0.1인 위쪽 벽면만 샘플링
    )
    
    # 2. 내부 조건 (Interior Constraint): 도메인 내부에서 PDE 잔차가 0이 되도록 강제
    interior = PointwiseInteriorConstraint(
        nodes=nodes,
        geometry=rec,
        outvar={"continuity": 0, "momentum_x": 0, "momentum_y": 0}, # PDE 잔차=0
        batch_size=4000,
        bounds={Symbol("x"): (0, 0.1), Symbol("y"): (0, 0.1)},
        lambda_weighting={"continuity": 1.0, "momentum_x": "sdf", "momentum_y": "sdf"} # SDF 가중치 적용
    )
    
    # [E] 도메인(Domain) 구성 및 솔버(Solver) 실행
    domain = Domain()
    domain.add_constraint(top_wall, "top_wall")
    domain.add_constraint(interior, "interior")
    
    # 훈련 루프 실행
    solver = Solver(cfg, domain)
    solver.solve()

if __name__ == "__main__":
    run()`;

const tuningData = [
    { title: "SDF 공간적 가중치 (Spatial Weighting)", issue: "벽면(Boundary)에서 속도가 급격히 변하는 불연속성으로 인해 학습 초기에 그래디언트가 폭발하거나 수렴이 지연됨.", solution: "경계면으로부터의 거리(SDF)에 비례하여 PDE 손실 가중치(lambda_weighting)를 부여합니다. 벽면 근처는 가중치를 줄이고, 내부 중앙은 가중치를 높여 방정식 학습에 집중시킵니다.", icon: "bx-outline" },
    { title: "동적 손실 균형 알고리즘 (Dynamic Loss Balancing)", issue: "물리 방정식의 잔차 손실과 데이터/경계조건 손실 간의 스케일 차이로 인해 모델이 특정 손실에 편향되거나 수렴이 실패함.", solution: "PhysicsNeMo의 내장 알고리즘(Grad Norm, Soft Adapt, ReLoBRaLo, NTK 분석)을 통해 각 항의 수렴 속도를 동적으로 평가하여 가중치를 자동 할당합니다. config.yaml에서 플래그로 켭니다.", icon: "bx-slider-alt" }
];

const troubleData = [
    { issue: "손실 함수가 수렴하지 않고 발산/정체될 때", cause: "물리 단위 스케일이 다르거나 활성화 함수로 ReLU(2차 미분시 0) 사용.", solution: "1. 물리량을 단위가 없는 상태로 스케일링(Nondimensionalization) 필수.<br>2. 무한 번 미분 가능한 Tanh, SiLU(Swish), Stan 활성화 함수 사용.", tag: "Loss Divergence", color: "#f87171" },
    { issue: "대규모 3D 메쉬 연산 중 OOM (메모리 부족)", cause: "자동 미분(Autodiff)의 고차 미분 연산 그래프가 단일 GPU 메모리를 즉시 초과함.", solution: "1. ShardTensor를 적용하여 도메인을 여러 GPU 단위로 분할(Domain Parallelism).<br>2. 메쉬 없는 유한 차분(Meshless Finite Derivatives) 도입으로 미분 연산 대체 (메모리 절약).", tag: "OOM Error", color: "#fbbf24" },
    { issue: "다중 노드 확장 시 GPU 사용률(Utilization) 저하", cause: "가벼운 Pointwise 연산 수만 번 반복 시 CPU 커널 론칭(Launch latency) 병목 발생.", solution: "1. 웜업 스텝 동안 CUDA Graphs를 활성화하여 커널 한 번에 제출.<br>2. JIT (torch.compile)로 커널 융합.<br>3. TF32 수학 모드 활성화로 텐서 코어 효율 극대화.", tag: "Low Utilization", color: "#60a5fa" }
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render Theory Grid
    const theoryGrid = document.getElementById('theory-grid');
    theoryData.forEach(item => {
        theoryGrid.innerHTML += `
            <div class="theory-card">
                <div class="card-header">
                    <h3 class="card-title">${item.title}</h3>
                    <span class="card-subtitle">${item.subtitle}</span>
                </div>
                <div class="card-body">
                    <h4><i class='bx bx-question-mark'></i> 핵심 내용</h4>
                    <p>${item.what}</p>
                    <h4><i class='bx bx-bulb'></i> 중요성</h4>
                    <p>${item.why}</p>
                </div>
            </div>
        `;
    });

    // 2. Render Workflow Timeline
    const workflowTimeline = document.getElementById('workflow-timeline');
    workflowData.forEach(item => {
        workflowTimeline.innerHTML += `
            <div class="timeline-step">
                <div class="step-icon"><i class='bx ${item.icon}'></i></div>
                <div class="step-content">
                    <span class="step-number">Step ${item.step}</span>
                    <h3>${item.title}</h3>
                    <p class="step-action">${item.action}</p>
                    <div class="step-note"><i class='bx bx-info-circle' style="color:var(--purple); margin-right:5px;"></i> ${item.note}</div>
                </div>
            </div>
        `;
    });

    // 3. Render Dictionary Grid
    const dictionaryGrid = document.getElementById('dictionary-grid');
    function renderDict(data) {
        dictionaryGrid.innerHTML = '';
        data.forEach(item => {
            dictionaryGrid.innerHTML += `
                <div class="dict-card">
                    <h3 class="dict-term">${item.term}</h3>
                    <span class="dict-kor">${item.kor}</span>
                    <p class="dict-meaning">${item.meaning}</p>
                </div>
            `;
        });
    }
    renderDict(dictionaryData);

    const searchInput = document.getElementById('term-search');
    searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        renderDict(dictionaryData.filter(i => i.term.toLowerCase().includes(q) || i.kor.toLowerCase().includes(q) || i.meaning.toLowerCase().includes(q)));
    });

    // 4. Render Code Snippet
    const codeBlock = document.getElementById('code-block');
    codeBlock.textContent = codeSnippet;
    hljs.highlightElement(codeBlock);

    document.getElementById('copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(codeSnippet);
        const btn = document.getElementById('copy-btn');
        btn.innerHTML = "<i class='bx bx-check'></i> Copied!";
        setTimeout(() => btn.innerHTML = "<i class='bx bx-copy'></i> Copy", 2000);
    });

    // 5. Render Tuning Grid
    const tuningGrid = document.getElementById('tuning-grid');
    tuningData.forEach(item => {
        tuningGrid.innerHTML += `
            <div class="tuning-card">
                <div class="tuning-icon"><i class='bx ${item.icon}'></i></div>
                <div class="tuning-content">
                    <h3>${item.title}</h3>
                    <div class="tuning-problem"><strong>문제 병목:</strong> ${item.issue}</div>
                    <div class="tuning-solution"><strong>최적화 방법:</strong> ${item.solution}</div>
                </div>
            </div>
        `;
    });

    // 6. Render Troubleshooting Grid
    const troubleGrid = document.getElementById('trouble-grid');
    troubleData.forEach(item => {
        troubleGrid.innerHTML += `
            <div class="trouble-card">
                <div class="trouble-header">
                    <span class="trouble-tag" style="background: ${item.color}20; color: ${item.color}; border: 1px solid ${item.color}50;">${item.tag}</span>
                    <h3>${item.issue}</h3>
                </div>
                <div class="trouble-body">
                    <div class="t-cause"><i class='bx bx-error-circle'></i> <strong>발생 원인:</strong> <p>${item.cause}</p></div>
                    <div class="t-solution"><i class='bx bx-check-shield'></i> <strong>권장 해결책:</strong> <p>${item.solution}</p></div>
                </div>
            </div>
        `;
    });

    // Navigation Logic
    const navLinks = document.querySelectorAll('.nav-links li');
    const sections = document.querySelectorAll('.content-section');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const titleMap = {
        'theory-section': { title: 'Core Theory', sub: 'PhysicsNeMo 이해를 위한 필수 이론' },
        'workflow-section': { title: 'Implementation', sub: '기능 구현 및 적용 워크플로우' },
        'dictionary-section': { title: 'Terminology', sub: '실무자 필수 개념 사전' },
        'code-section': { title: 'Code Snippet', sub: 'PhysicsNeMo 2D PINN 뼈대 코드' },
        'tuning-section': { title: 'Loss & Tuning Strategy', sub: '손실 함수 가중치 동적 조절 기법' },
        'troubleshoot-section': { title: 'Troubleshooting', sub: '자주 발생하는 3대 병목 해결법' }
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
