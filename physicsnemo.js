const theoryData = [
    { title: "SciML (Scientific Machine Learning)", subtitle: "물리-ML의 기초", what: "고성능 컴퓨팅(HPC) 기반의 수치 해석 시뮬레이션에 딥러닝의 예측 능력을 결합한 새로운 학문 분야입니다.", why: "기존 수치 해석은 높은 정확도를 가지지만 계산 비용이 막대합니다. SciML은 딥러닝을 통해 이를 보완하거나 대체하여 설계 공간 탐색과 시뮬레이션을 전례 없는 속도(최대 10만 배)로 가속하는 대리 모델을 구축합니다." },
    { title: "PDE (Partial Differential Equations)", subtitle: "편미분 방정식", what: "열 전달, 유체 유동, 구조 역학 등 물리적 현상의 지배 원리를 시공간의 변화율로 설명하는 수학적 언어입니다.", why: "PhysicsNeMo에서는 방정식들을 단순한 검증 도구가 아니라, 인공지능이 학습할 때 오차를 계산하는 손실 함수(Loss Function)로 직접 주입하여 물리 법칙 위배를 강제합니다." },
    { title: "PINN (Physics-Informed Neural Networks)", subtitle: "물리 정보 신경망", what: "관측 데이터에만 의존하지 않고, 모델의 손실 함수에 물리 법칙(PDE)과 경계/초기 조건을 통합한 신경망입니다.", why: "메쉬가 필요 없는 'Meshless 솔버' 역할을 하며 데이터 부족 환경에서도 빈 공간을 추론해내고 역방향 문제(Inverse problem)를 해결합니다." },
    { title: "Neural Operator", subtitle: "신경 연산자 (FNO 등)", what: "단일 방정식 해를 찾는 PINN과 달리, 입력 함수와 출력 함수 사이의 '매핑(Mapping)' 전체를 학습하는 아키텍처입니다.", why: "한 번 학습되면 경계 조건이나 형상이 바뀌어도 재학습 없이 즉각적(Zero-shot) 해를 예측할 수 있어 디지털 트윈에 필수적입니다." },
    { title: "Modulus / PhysicsNeMo", subtitle: "NVIDIA 프레임워크", what: "NVIDIA가 개발한 오픈 소스(Apache 2.0) 물리-ML 딥러닝 프레임워크입니다.", why: "PyTorch 생태계와 통합되며, 단일 GPU부터 대규모 노드까지 확장이 가능한 분산 컴퓨팅과 최첨단 SciML 아키텍처를 제공합니다." }
];

const workflowData = [
    { 
        step: 1, title: "환경 세팅 및 아키텍처 (Environment)", action: "딥러닝 라이브러리를 설치하고 신경망 아키텍처를 초기화합니다.", note: "클릭하여 상세 구현 가이드 및 코드 보기", icon: "bx-server",
        goal: "GPU 가속에 최적화된 PhysicsNeMo 환경을 셋업하고, 입력 좌표(x, y, t 등)를 받아 물리량(유속, 압력 등)을 예측하는 신경망 아키텍처를 초기화합니다.",
        modules: "physicsnemo.sym.models.fully_connected.FullyConnectedArch, physicsnemo.sym.models.activation.Activation",
        gotchas: "활성화 함수 선택의 오류입니다. 나비에-스토크스 같은 2차 미분이 필요한 방정식(PDE)을 풀 때 ReLU를 사용하면 2차 미분값이 0이 되어 학습이 발산하거나 불가능해집니다. 반드시 무한 번 미분이 가능한 SiLU(Swish)나 Tanh를 사용해야 합니다.",
        snippet: `from physicsnemo.sym.models.fully_connected import FullyConnectedArch
from physicsnemo.sym.models.activation import Activation

# 2개의 입력(x,y)을 받아 3개의 출력(u,v,p)을 내는 신경망 생성
flow_net = FullyConnectedArch(
    input_keys=[Key("x"), Key("y")], 
    output_keys=[Key("u"), Key("v"), Key("p")], 
    activation_fn=Activation.SILU
)`
    },
    { 
        step: 2, title: "Hydra 기반 파라미터 정의 (Configuration)", action: "config.yaml로 실험의 하이퍼파라미터를 정의합니다.", note: "클릭하여 상세 구현 가이드 및 코드 보기", icon: "bx-slider-alt",
        goal: "Python 코드 수정 없이 실험의 하이퍼파라미터(학습률, 옵티마이저, 최대 학습 횟수 등)를 config.yaml 파일로 관리하고 동적으로 주입합니다.",
        modules: "physicsnemo.sym.hydra.ModulusConfig, @physicsnemo.sym.main 데코레이터",
        gotchas: "설정 파일을 수동으로 파싱하려고 시도하는 것입니다. PhysicsNeMo는 분산 학습 및 로깅 설정이 복잡하게 얽혀 있으므로, 반드시 프레임워크가 제공하는 @physicsnemo.sym.main 데코레이터를 사용하여 안전하게 Configuration을 로드해야 합니다.",
        snippet: `import physicsnemo.sym.main
from physicsnemo.sym.hydra import ModulusConfig

@physicsnemo.sym.main(config_path="conf", config_name="config")
def run(cfg: ModulusConfig):
    # 이 내부에서 cfg.optimizer, cfg.training.max_steps 등에 접근`
    },
    { 
        step: 3, title: "기하학적 형상 및 PDE 정의 (Geometry & PDE)", action: "시뮬레이션 대상의 도메인 형태와 물리 법칙을 선언합니다.", note: "클릭하여 상세 구현 가이드 및 코드 보기", icon: "bx-shape-polygon",
        goal: "학습이 이루어질 물리적 공간(Geometry)을 정의하고, 손실 함수로 작용할 물리 법칙(지배 방정식, PDE)을 선언합니다.",
        modules: "physicsnemo.sym.geometry.primitives_2d.Rectangle, physicsnemo.sym.eq.pdes.navier_stokes.NavierStokes",
        gotchas: "물리 단위의 무차원화(Nondimensionalization) 생략입니다. 밀도, 점성, 기하학적 크기 등의 스케일 차이가 클 경우, 텐서의 계산 범위가 신경망의 선형 범위를 벗어나 그래디언트가 폭발합니다. 모든 물리량은 0~1 사이의 단위 없는 값으로 스케일링해야 합니다.",
        snippet: `# 2D 사각형 도메인 생성 및 나비에-스토크스 방정식 초기화
rec = Rectangle((0, 0), (0.1, 0.1))
ns = NavierStokes(nu=0.01, rho=1.0, dim=2, time=False)

# 신경망과 PDE를 결합하여 연산 그래프(Nodes) 생성
nodes = ns.make_nodes() + [flow_net.make_node(name="flow_network")]`
    },
    {
        step: 4, title: "제약 조건 및 손실 함수 샘플링 (Constraints & SDF)", action: "신경망이 학습할 기준점을 도메인 경계와 내부에 샘플링합니다.", note: "클릭하여 상세 구현 가이드 및 코드 보기", icon: "bx-target-lock",
        goal: "기하학적 형상의 경계(Boundary)와 내부(Interior)에 점(Collocation points)을 뿌려 경계 조건과 PDE 잔차(Residual)가 0이 되도록 강제합니다.",
        modules: "PointwiseBoundaryConstraint, PointwiseInteriorConstraint",
        gotchas: "경계면 근처의 급격한 값의 변화로 인한 학습 지연입니다. 이를 방지하기 위해 내부 PDE 손실 함수에 경계로부터의 거리장(SDF)을 가중치로 부여하는 lambda_weighting을 누락하면 안 됩니다. 이를 통해 경계 불연속성 문제를 해결해야 합니다.",
        snippet: `interior = PointwiseInteriorConstraint(
    nodes=nodes,
    geometry=rec,
    outvar={"continuity": 0, "momentum_x": 0, "momentum_y": 0}, # PDE 잔차가 0이 되도록 강제
    batch_size=4000,
    lambda_weighting={"continuity": 1.0, "momentum_x": "sdf", "momentum_y": "sdf"} # SDF 가중치
)`
    },
    {
        step: 5, title: "도메인 조립 및 Solver 훈련 (Domain & Training)", action: "제약 조건 구성을 모두 마치고 딥러닝 최적화를 실행합니다.", note: "클릭하여 상세 구현 가이드 및 코드 보기", icon: "bx-play-circle",
        goal: "정의된 모든 제약 조건(Constraints)을 하나의 도메인에 담고, Solver를 실행해 신경망 가중치 최적화 루프를 가동합니다.",
        modules: "physicsnemo.sym.domain.Domain, physicsnemo.sym.solver.Solver",
        gotchas: "GPU 병목 현상 방치입니다. PINN 학습은 가벼운 연산을 수없이 반복하므로 CPU가 GPU에 작업을 지시하는 지연 시간(Launch latency)이 병목이 됩니다. config.yaml에서 반드시 CUDA Graphs를 활성화하여 이 오버헤드를 완벽히 제거해야 합니다.",
        snippet: `domain = Domain()
domain.add_constraint(interior, "interior") # 도메인에 제약조건 추가

solver = Solver(cfg=cfg, domain=domain)
solver.solve() # 훈련 루프 시작`
    },
    {
        step: 6, title: "예측 결과 추론 및 시각화 (Inference & Visualization)", action: "모델 예측 정확도를 평가하고 파라뷰(ParaView) 파일을 출력합니다.", note: "클릭하여 상세 구현 가이드 및 코드 보기", icon: "bx-bar-chart-alt-2",
        goal: "학습 중인 모델의 예측이 정답(또는 실제 물리적 현상)과 얼마나 일치하는지 평가하고 결과를 3D 시각화 포맷으로 추출합니다.",
        modules: "PointwiseValidator, PointwiseInferencer",
        gotchas: "출력 파일 확장자와 툴의 미스매치입니다. 초보자들은 텍스트나 일반 이미지 뷰어로 결과를 보려 하지만, PhysicsNeMo가 뱉어내는 검증/추론 데이터는 .vtp 또는 .npz 형식입니다. 결과를 시각화하려면 반드시 ParaView와 같은 전문 과학 데이터 시각화 소프트웨어를 사용해야 합니다.",
        snippet: `# 검증을 위한 외부 데이터(invar, outvar)와 노드를 매핑하여 Validator 생성
validator = PointwiseValidator(
    nodes=nodes, invar=invar_dict, true_outvar=outvar_dict, batch_size=1000
)
domain.add_validator(validator)`
    }
];

const surrogatePipelineData = [
    {
        step: 1,
        title: "데이터 생성 및 포맷팅 (Data Generation & Formatting)",
        action: "전통 솔버의 시뮬레이션 결과를 추출하여 AI 포맷으로 변환합니다.",
        icon: "bx-data",
        concept: "전통적인 유한요소해석(FEM) 솔버(Ansys, COMSOL, Abaqus 등)가 계산한 물리적 시뮬레이션 결과를 AI 모델이 읽을 수 있는 형태로 추출하는 첫 단추입니다.",
        requirements: "<ul><li><strong>포맷:</strong> 일반적으로 솔버에서 내보낸 <code>.vtk</code>, <code>.vtu</code>(볼륨 데이터), <code>.vtp</code>(표면 데이터) 파일이 가장 많이 사용되며, 이를 파이썬에서 다루기 쉬운 <code>.npy</code>(NumPy)나 딥러닝에 최적화된 <code>.tfrecord</code>로 변환하여 준비합니다.</li><li><strong>필수 물리량:</strong> 각 노드의 <strong>3D 공간 좌표, 속도, 가속도, 변위, 응력</strong> 정보가 포함되어야 합니다.</li><li><strong>노드 타입 및 경계 조건:</strong> 원핫 인코딩 형태의 노드 타입(고정, 자유 등) 정보가 필수적입니다.</li></ul>",
        gotchas: "<strong>단위 통일과 무차원화(Nondimensionalization)를 잊지 마세요.</strong> 응력은 수백만(MPa) 단위이고 변위는 밀리미터 단위일 경우 스케일 차이로 신경망이 발산(NaN)할 수 있습니다."
    },
    {
        step: 2,
        title: "데이터 전처리 및 그래프 변환",
        action: "좌표 데이터를 물리적 상호작용 가능한 형태의 그래프로 만듭니다.",
        icon: "bx-share-alt",
        concept: "단순 좌표 나열을 AI가 물리적 '상호작용'으로 인식할 수 있도록 <strong>그래프 구조 G(V, E, U) (노드 V, 엣지 E, 글로벌 변수 U)</strong>로 변환하는 과정입니다.",
        requirements: "<ul><li><strong>엣지(Edge) 생성 로직:</strong> 원본 메쉬 위상을 바탕으로 '메쉬 엣지'를 만들고, 반경 내 이웃 노드를 연결하는 '월드 엣지'를 생성합니다.</li><li><strong>정규화(Normalization):</strong> 학습 안정성을 위해 노드의 속도/변위 값 평균을 0, 분산을 1로 맞추는 표준화를 수행합니다.</li></ul>",
        gotchas: "<strong>One-hot 인코딩된 '노드 타입' 데이터는 절대 정규화하면 안 됩니다.</strong> 범주형 데이터가 정규화되면 모델이 경계 조건을 구분하지 못해 예측 형상이 무너집니다."
    },
    {
        step: 3,
        title: "모델 아키텍처 및 하이퍼파라미터 설정",
        action: "대규모 변형에 맞는 GNN 아키텍처와 설정을 정의합니다.",
        icon: "bx-brain",
        concept: "구조 역학 시뮬레이션에는 불규칙한 메쉬(Unstructured Mesh)와 대규모 변형을 다루는 데 탁월한 <strong>GNN(Graph Neural Network) 아키텍처</strong>를 사용해야 합니다.",
        requirements: "<ul><li><strong>HybridMeshGraphNet 특징:</strong> 고정된 메쉬 엣지와 동적으로 변하는 월드 엣지를 각각 다른 인코더로 처리해 대규모 변형과 충돌을 학습합니다.</li><li><strong>config.yaml 설정:</strong> <code>input_dim</code>, <code>processor_size</code>(은닉층 크기), <code>learning_rate</code>.</li></ul>",
        gotchas: "<strong>OOM(Out of Memory)에 대비하세요.</strong> <code>config.yaml</code>에서 <code>recompute_activation</code>이나 <code>gradient_checkpointing</code>을 True로 켜서 메모리를 대폭 절약하십시오."
    },
    {
        step: 4,
        title: "모델 학습 (Training)",
        action: "손실 함수를 최소화하며 자기 회귀(Auto-Regressive) 학습을 개시합니다.",
        icon: "bx-play-circle",
        concept: "현재 타임 스텝(t)의 상태를 보고 다음 타임 스텝(t+1)의 변화량을 예측하는 <strong>자기 회귀(Auto-Regressive)</strong> 방식으로 학습됩니다.",
        requirements: "<ul><li><strong>손실 함수:</strong> 예측된 물리량과 실제 정답 간의 MSE를 주로 사용합니다.</li><li><strong>다중 GPU 실행:</strong> 단일 GPU 한계를 넘기 위해 <code>mpirun -np N python train.py</code> 또는 torchrun 커맨드로 DDP 모드를 실행합니다.</li></ul>",
        gotchas: "<strong>오차 누적(Error Accumulation) 현상을 방지해야 합니다.</strong> 추론 시 궤도 이탈을 자체 회복할 수 있도록 <strong>학습 시 입력 데이터에 의도적으로 미세 노이즈를 주입</strong>해야 합니다."
    },
    {
        step: 5,
        title: "추론(Inference) 및 3D 시각화",
        action: "가중치를 불러와 롤아웃 수행 후 ParaView 형식으로 출력합니다.",
        icon: "bx-cube",
        concept: "학습된 가중치 모델을 시뮬레이터 대비 수천 배 이상 빠르게 <strong>연속 예측(Rollout)</strong>한 뒤 시각화합니다.",
        requirements: "<ul><li><strong>Rollout 연계:</strong> t 예측값을 다음 스텝의 입력으로 연속 주입.</li><li><strong>PyVista 시각화:</strong> 텐서 결과를 3D 메쉬 파일 객체로 매핑한 뒤 <code>.vtp</code>나 <code>.vtu</code> 확장자로 변환 및 저장합니다.</li></ul>",
        gotchas: "<strong>출력값의 역정규화(De-normalization)를 절대 빼먹지 마세요.</strong> 모든 노드 배열을 저장해 둔 평균과 표준편차로 원상복구해야 ParaView에서 물리적 응력과 변위가 제대로 렌더링됩니다."
    }
];

const dictionaryData = [
    { term: "Collocation Points", kor: "콜로케이션 포인트 (격자점/배치점)", meaning_textbook: "편미분 방정식(PDE) 잔차 함수를 평가하기 위해 도메인 내부와 경계에 샘플링된 점들의 집합.", meaning_easy: "머신러닝에서 일반적인 '학습 데이터의 Label'이 없는 빈 공간에, \"여기서도 물리 법칙을 지켜!\"라고 감시카메라(점)를 마구 뿌려놓는 것과 같습니다. 이 점들이 많을수록 AI가 농땡이를 피우지 못하고 룰(방정식)을 엄격하게 따르게 됩니다." },
    { term: "Forward Problem", kor: "순방향 문제", meaning_textbook: "물리 시스템의 초기 조건, 경계 조건 및 지배 방정식의 매개변수가 모두 주어졌을 때, 시스템의 숨겨진 상태나 최종 결과(해)를 예측하는 문제.", meaning_easy: "게임 엔진에서 물리 엔진의 세팅값(중력, 마찰력, 물체 무게 등)을 모두 하드코딩해 넣은 뒤, \"이 상태에서 공을 던지면 어디로 떨어질까?\"를 시뮬레이션하는 가장 기본적인 '결과 예측' 과정입니다." },
    { term: "Inverse Problem", kor: "역방향 문제", meaning_textbook: "관측된 결과 데이터(측정값)를 바탕으로, 그 결과를 만들어낸 물리 시스템의 알 수 없는 초기 조건, 경계 조건 또는 매개변수(예: 유체 점성, 열 확산률)를 역으로 추정하는 문제.", meaning_easy: "시스템 로그(결과 데이터)만 보고 역추적하여 \"도대체 어떤 환경 설정값(원인 매개변수) 때문에 이런 결과가 나왔을까?\"를 찾아내는 디버깅 및 원인 분석 과정과 같습니다. PINN은 코드를 거의 바꾸지 않고도 순방향과 역방향 문제를 동일하게 풀 수 있어 각광받습니다." },
    { term: "Nondimensionalization", kor: "무차원화", meaning_textbook: "물리 방정식의 변수들을 특성 척도(Characteristic scale)로 나누어 물리적 단위(kg, m, s 등)를 제거하고, 스케일링된 형태로 모델 손실 함수에 통합하여 안정성을 높이는 수학적 기법.", meaning_easy: "딥러닝에서 데이터 스케일이 제각각이면 학습이 터져버리므로 적용하는 MinMaxScaler나 StandardScaler의 물리 버전입니다. 압력 100만(Pa)과 길이 0.01(m)을 그대로 신경망에 넣으면 그래디언트 폭발이 일어나므로, 단위를 떼고 0과 1 사이의 비율로 스케일을 맞추는 필수 전처리입니다." },
    { term: "Boundary Condition (BC)", kor: "경계 조건", meaning_textbook: "미분 방정식을 풀 때, 해석하고자 하는 시공간적 도메인의 경계(테두리)에서 반드시 만족해야 하는 물리적 상태나 값.", meaning_easy: "게임 맵(Domain)의 '투명 벽'이나 '끝부분'에서 일어나는 하드코딩된 규칙입니다. \"이 벽의 온도는 항상 100도다(Dirichlet BC)\" 혹은 \"이 벽으로는 열이 빠져나가지 못한다(Neumann BC)\"처럼 시스템의 외곽을 통제하며, AI 모델에게는 MSE 손실 함수의 한 축으로 작용합니다." },
    { term: "Navier-Stokes Equations", kor: "나비에-스토크스 방정식", meaning_textbook: "점성이 있는 유체의 운동(속도와 압력)을 질량 보존과 운동량 보존의 법칙을 통해 기술하는 비선형 편미분 방정식.", meaning_easy: "물이나 공기가 어떻게 움직이는지 완벽하게 설명하는 '유체역학의 바이블' 같은 공식입니다. 수학적으로 풀기가 너무 악랄해서 기존에는 슈퍼컴퓨터를 갈아 넣어야 했지만, Physics-ML은 이 공식을 AI의 손실 함수(Loss)로 사용하여 치트키처럼 흐름을 예측합니다." },
    { term: "Fourier Transform / Spectral Layer", kor: "푸리에 변환 / 스펙트럴 레이어", meaning_textbook: "공간이나 시간에 대한 복잡한 신호를 주파수 도메인으로 변환하는 기법으로, 푸리에 신경 연산자(FNO)에서 전역적인 공간 의존성(Global convolution)을 학습하기 위해 사용됨.", meaning_easy: "믹서기에 갈린 스무디(데이터)를 원래의 재료인 딸기, 바나나(주파수)로 분리해내는 마법입니다. 합성곱(CNN)이 이미지의 작은 픽셀(국소적)만 본다면, 푸리에 변환은 맵 전체의 큰 뼈대(저주파)를 한 번에 싹 훑기 때문에 연산 속도가 미친 듯이 빨라집니다." },
    { term: "Reynolds Number (Re)", kor: "레이놀즈 수", meaning_textbook: "유체 유동에서 관성력(Inertial force)과 점성력(Viscous force)의 비율을 나타내는 무차원 수로, 층류(Laminar)와 난류(Turbulent)를 구분하는 기준.", meaning_easy: "유체가 '얌전하게 흐르는가(꿀)' 아니면 '미친 듯이 소용돌이치며 흐르는가(폭포수)'를 나타내는 '시뮬레이션 난이도 수치'입니다. 이 숫자가 커질수록 난류가 심해져 AI가 예측하기 매우 까다로워지며, 모델의 한계 성능을 테스트하는 주요 지표가 됩니다." },
    { term: "Meshless Method", kor: "무격자 (메쉬리스) 기법", meaning_textbook: "도메인을 요소(Elements)나 격자(Grid)로 분할(Meshing)하지 않고, 신경망과 자동 미분을 활용해 연속적인 시공간 좌표에서 편미분 방정식을 직접 푸는 수치 해석 방법.", meaning_easy: "3D 그래픽스에서 물체를 수많은 다각형(폴리곤 메쉬)으로 복잡하게 쪼개어 계산하는 대신, 허공의 아무 좌표(x, y, t)나 찔러 넣으면 정답이 나오는 함수 자체를 만드는 방식입니다. 끔찍한 메쉬 생성 막노동을 없애주어 PINN이 사랑받는 가장 큰 이유입니다." },
    { term: "Partial Differential Equation (PDE)", kor: "편미분 방정식", meaning_textbook: "여러 개의 독립 변수(공간 좌표, 시간 등)에 대한 다변수 함수의 편미분을 포함하는 방정식으로, 물리량의 시공간적 변화율과 상호작용을 기술.", meaning_easy: "우주 만물의 변화를 다루는 '규칙 기반의 룰셋(Rule-set)'입니다. 일반 비전 AI가 고양이 사진의 '정답 픽셀'을 찾는다면, Physics-ML은 이 PDE라는 룰셋을 정답지(Loss) 대신 사용하여 \"이 룰을 어기지 않는 최적의 값을 찾아라!\"라고 학습합니다." },
    { term: "Surrogate Model", kor: "대리 모델 (대체 모델)", meaning_textbook: "계산 비용이 막대한 전통적인 고정밀 수치 해석 시뮬레이터를 대신하여, 근사적인 결과를 실시간에 가까운 속도로 도출하도록 훈련된 AI/ML 모델.", meaning_easy: "복잡한 수학 증명 문제를 며칠에 걸려 푸는 '수학 교수님(기존 시뮬레이터)'의 패턴을 완벽히 모방하도록 학습된 '초고속 챗봇(AI)'입니다. 정확도는 기존 방식과 유사하지만 속도는 10만 배 빠르기 때문에 수만 번의 설계 옵션을 순식간에 테스트할 때 사용합니다." },
    { term: "Residual", kor: "잔차 (오차)", meaning_textbook: "AI 모델이 예측한 결과값을 지배 방정식(PDE)에 대입했을 때, 방정식이 완벽히 0이 되지 않고 남는 값.", meaning_easy: "수학 시험에서 모델이 제출한 답안으로 '검산'을 했을 때 양변이 딱 맞아떨어지지 않고 남는 '오답의 크기'입니다. Physics-ML에서는 이 잔차를 'Loss(손실)' 그 자체로 사용하므로, 잔차를 0으로 깎아나가는 과정이 곧 AI가 물리 법칙을 터득하는 과정입니다." },
    { term: "Automatic Differentiation (AutoDiff)", kor: "자동 미분", meaning_textbook: "체인 룰(Chain Rule)을 사용하여 컴퓨터 프로그램 연산 그래프상에서 모든 함수의 미분값을 정확하고 메모리 효율적으로 계산하는 알고리즘.", meaning_easy: "일반적인 AI에서는 '오차를 가중치(Weight)로 미분해서 파라미터를 업데이트할 때'만 쓰이는 백엔드 기술입니다. 하지만 Physics-ML에서는 이를 해킹(?)하여 '네트워크의 출력(속도)을 입력 좌표(공간 x, 시간 t)로 직접 미분'하는 데 사용함으로써, 복잡한 물리 방정식(PDE) 계산을 공짜로 처리하는 핵심 치트키입니다." },
    { term: "Signed Distance Field (SDF)", kor: "부호 있는 거리장", meaning_textbook: "공간 상의 특정 점이 기하학적 형상의 경계(표면)로부터 얼마나 직교하여 떨어져 있는지를 계산하고, 내부와 외부를 부호(+, -)로 나타낸 공간 인코딩 스칼라 장.", meaning_easy: "맵의 모든 위치 좌표에 \"가장 가까운 벽까지의 거리\"를 적어놓은 네비게이션 데이터입니다. AI가 3D 물체(예: 자동차)의 복잡한 모양을 픽셀이 아니라 \"여긴 차 표면에서 2cm 떨어졌구나\"라는 거리 정보로 입체감을 이해하게 돕는 필수 기법입니다. (경계면 근처의 학습 가중치를 조절할 때도 쓰입니다)." },
    { term: "Neural Operator", kor: "신경 연산자", meaning_textbook: "유한 차원의 유클리드 공간 매핑이 아닌, 무한 차원의 함수 공간(Function spaces) 사이의 매핑(Operator) 자체를 학습하여 데이터 해상도나 격자에 독립적인 예측을 수행하는 신경망 아키텍처.", meaning_easy: "특정 해상도(예: 100x100 픽셀)의 배열 사이즈에 하드코딩된 일반 딥러닝 모델과 달리, '수식 변환기' 자체를 학습한 모델입니다. 비트맵 이미지가 아니라 벡터 이미지 작동하여, 한 번 훈련시키면 나중에 해상도를 무한대로 늘려 쿼리해도 재학습 없이 바로 결과를 뱉어내는 궁극의 아키텍처입니다." }
];

const codeSnippets = {
    'config': {
        filename: 'conf/config.yaml',
        language: 'language-yaml',
        code: `# ==========================================
# 파일명: conf/config.yaml
# ==========================================
defaults:
  - modulus_default
  - scheduler: tf_exponential_lr
  - optimizer: adam
  - loss: sum
  - _self_

# 학습률(Learning Rate) 감소 스케줄러 설정
scheduler:
  decay_rate: 0.95      # 0.95 비율로 학습률을 점진적으로 줄입니다.
  decay_steps: 2000     # 매 2000 스텝마다 학습률 감소가 일어납니다.

# 모델 훈련 관련 파라미터 설정
training:
  max_steps: 100000         # 총 학습 스텝 수입니다.
  rec_results_freq: 1000    # 매 1000 스텝마다 TensorBoard 및 VTK 결과를 저장합니다.
  save_network_freq: 1000   # 매 1000 스텝마다 모델 체크포인트(가중치)를 저장합니다.
  print_stats_freq: 100     # 매 100 스텝마다 콘솔에 손실(Loss) 통계를 출력합니다.

# 모델 아키텍처 설정 (Fully Connected Neural Network)
arch:
  fully_connected:
    layer_size: 512         # 각 은닉층(Hidden Layer)의 뉴런 수입니다.
    nr_layers: 6            # 총 은닉층의 개수입니다.`
    },
    'geometry': {
        filename: 'geometry_pde.py',
        language: 'language-python',
        code: `# ==========================================
# 파일명: geometry_pde.py
# ==========================================
from physicsnemo.sym.geometry.primitives_2d import Rectangle
from physicsnemo.sym.eq.pdes.navier_stokes import NavierStokes
from physicsnemo.sym.models.fully_connected import FullyConnectedArch
from physicsnemo.sym.models.activation import Activation
from physicsnemo.sym.key import Key

def get_geometry_and_nodes(cfg):
    """기하학적 형태(Geometry)와 계산 노드(방정식+신경망)를 생성하여 반환합니다."""
    
    # 1. 기하학적 형상(Geometry) 정의: (0, 0)에서 (0.1, 0.1)까지의 2D 사각형
    rec = Rectangle((0, 0), (0.1, 0.1))
    
    # 2. 지배 방정식(PDE) 정의: 비압축성 나비에-스토크스 방정식
    # nu: 동점성계수(Kinematic viscosity), rho: 밀도(Density), time=False: 정상 상태
    ns = NavierStokes(nu=0.01, rho=1.0, dim=2, time=False)
    
    # 3. 신경망(Neural Network) 아키텍처 정의
    # 활성화 함수로는 2차 미분이 가능한 SiLU(Swish)를 사용 (ReLU 불가)
    flow_net = FullyConnectedArch(
        input_keys=[Key("x"), Key("y")],
        output_keys=[Key("u"), Key("v"), Key("p")],
        activation_fn=Activation.SILU 
    )
    
    # 4. 연산 노드(Nodes) 결합
    nodes = ns.make_nodes() + [flow_net.make_node(name="flow_network")]
    
    return rec, nodes`
    },
    'main': {
        filename: 'main.py',
        language: 'language-python',
        code: `# ==========================================
# 파일명: main.py
# 실행 방법: python main.py
# ==========================================
from sympy import Symbol
import physicsnemo.sym.main
from physicsnemo.sym.domain import Domain
from physicsnemo.sym.domain.constraint import PointwiseBoundaryConstraint, PointwiseInteriorConstraint
from physicsnemo.sym.solver import Solver
from geometry_pde import get_geometry_and_nodes

# Hydra 설정을 불러오는 데코레이터입니다. 'conf' 폴더 안의 'config.yaml'을 읽어옵니다.
@physicsnemo.sym.main(config_path="conf", config_name="config")
def run(cfg):
    # 1. Geometry와 Nodes 초기화
    rec, nodes = get_geometry_and_nodes(cfg)
    x, y = Symbol("x"), Symbol("y")
    
    # 2. 도메인(Domain) 객체 생성
    domain = Domain()
    
    # 3. 제약 조건 - 경계 조건 (Lid-Driven Cavity. 위쪽 벽면 u=1.0)
    top_wall = PointwiseBoundaryConstraint(
        nodes=nodes,
        geometry=rec,
        outvar={"u": 1.0, "v": 0.0},     # 예측해야 할 정답 값
        batch_size=1000,
        criteria=y == 0.1                # 위쪽 벽만 선택
    )
    domain.add_constraint(top_wall, "top_wall")
    
    # 4. 제약 조건 - 내부 PDE 조건 (잔차=0 강제)
    interior = PointwiseInteriorConstraint(
        nodes=nodes,
        geometry=rec,
        outvar={"continuity": 0, "momentum_x": 0, "momentum_y": 0},
        batch_size=4000,
        # [매우 중요] SDF 가중치 적용 (벽면 근처 기울기 발산 방지)
        lambda_weighting={"continuity": 1.0, "momentum_x": "sdf", "momentum_y": "sdf"}
    )
    domain.add_constraint(interior, "interior")
    
    # 5. Solver 초기화 및 훈련 시작
    solver = Solver(cfg, domain)
    solver.solve()

if __name__ == "__main__":
    run()`
    }
};

const tuningData = [
    { title: "Nondimensionalization (물리량 무차원화 및 스케일링)", issue: "압력은 10<sup>5</sup> Pa, 길이는 10<sup>-3</sup> m 등 스케일 차이가 극심한 데이터를 그대로 넣으면 활성화 함수가 즉시 포화되어 미분값이 0이 되거나 폭발해 Loss가 NaN이 됨.", solution: "모든 물리량을 특성 척도로 나누어 0~1 또는 -1~1 사이의 단위 없는(Dimensionless) 값으로 정규화하고, 방정식(PDE)을 스케일링된 변수로 재설계해야 함.", icon: "bx-ruler" },
    { title: "Dynamic Loss Balancing (동적 손실 균형)", issue: "L = L_PDE + L_BC + L_Data 에서 손실 간 스케일이 다르면(예: PDE=0.001, BC=10), 옵티마이저가 덩치가 큰 BC만 학습하고 물리 법칙(PDE)을 무시해 '가짜 해'가 도출됨.", solution: "수동 가중치 조절을 멈추고 내장 알고리즘(Grad Norm, ReLoBRaLo)이나 NTK 분석을 도입해, 각 컴포넌트의 그래디언트를 평가하여 최적의 가중치를 자동 할당.", icon: "bx-scale" },
    { title: "Learning Rate Annealing (학습률 어닐링)", issue: "학습 중반부터 경계조건과 물리 법칙이 서로 가중치를 반대로 업데이트하려는 '그래디언트 충돌'이 발생하여 로스가 심하게 진동하고 정체됨.", solution: "전역 학습률 어닐링을 통해 손실 가중치(ω)를 미세 조정하고, tf_exponential_lr 스케줄링 및 인과적 가중치(Causal weighting scheme)를 적용해 날카로운 최소값에 도달 유도.", icon: "bx-trending-down" },
    { title: "Spatial Weighting using SDF (공간적 가중치 적용)", issue: "경계면 근처 유속 불연속성 때문에, 모델이 도메인 내부 유동은 학습하지 않고 벽면 근처 에러를 잡는 데만 모든 학습 용량을 낭비함.", solution: "PointwiseInteriorConstraint에 lambda_weighting={'momentum_x': 'sdf'} 파라미터를 추가하여 벽면에 가까운 점의 PDE 가중치는 줄이고, 중앙일수록 높여 내부 유동 집중 학습 유도.", icon: "bx-layer" },
    { title: "Fourier Features / Positional Encoding", issue: "난류나 소용돌이 같은 고주파수(High-frequency) 현상 시, 일반 퍼셉트론(MLP)의 스펙트럴 편향(Spectral Bias)으로 인해 디테일이 뭉개지고 저주파수만 학습됨.", solution: "좌표 (x, y, z, t)를 번거롭게 넣지 말고, FourierNetArch를 선택하여 frequencies=('axis', [0, ... 9]) 셋팅으로 고차원 주파수 인코딩을 거쳐 미세 현상까지 날카롭게 잡아냄.", icon: "bx-pulse" }
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
    workflowData.forEach((item, index) => {
        workflowTimeline.innerHTML += `
            <div class="timeline-step" onclick="openImplModal(${index})">
                <div class="step-icon"><i class='bx ${item.icon}'></i></div>
                <div class="step-content">
                    <span class="step-number">Step ${item.step}</span>
                    <h3>${item.title}</h3>
                    <p class="step-action">${item.action}</p>
                    <div class="step-note"><i class='bx bx-pointer' style="color:var(--purple); margin-right:5px;"></i> ${item.note}</div>
                </div>
            </div>
        `;
    });

    const surrogateTimeline = document.getElementById('surrogate-timeline');
    surrogatePipelineData.forEach((item, index) => {
        surrogateTimeline.innerHTML += `
            <div class="timeline-step" onclick="openSurrogateModal(${index})">
                <div class="step-icon"><i class='bx ${item.icon}' style="color:var(--accent); background:rgba(52, 211, 153, 0.1);"></i></div>
                <div class="step-content">
                    <span class="step-number" style="color:var(--accent);">Step ${item.step}</span>
                    <h3 style="color:var(--text-light);">${item.title}</h3>
                    <p class="step-action" style="color:var(--text-muted);">${item.action}</p>
                    <div class="step-note" style="color:var(--accent);"><i class='bx bx-pointer' style="margin-right:5px;"></i> 클릭하여 상세 가이드 보기</div>
                </div>
            </div>
        `;
    });

    // 2-1. Modal Logic
    window.openImplModal = function(index) {
        const item = workflowData[index];
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="modal-header">
                <span class="modal-step-badge">Step ${item.step}</span>
                <h2>${item.title}</h2>
            </div>
            
            <div class="modal-section">
                <h4><i class='bx bx-bullseye'></i> 핵심 목표</h4>
                <p>${item.goal}</p>
            </div>
            
            <div class="modal-section">
                <h4><i class='bx bx-grid-alt'></i> 필수 모듈 / 클래스</h4>
                <p><code>${item.modules}</code></p>
            </div>
            
            <div class="modal-gotchas">
                <h4><i class='bx bx-error'></i> 실무 주의사항 (Gotchas)</h4>
                <p>${item.gotchas}</p>
            </div>
            
            <div class="modal-section" style="margin-top:2rem;">
                <h4><i class='bx bx-terminal'></i> 최소 작동 코드 (Snippet)</h4>
                <div class="modal-code-wrapper">
                    <pre><code class="language-python">${item.snippet}</code></pre>
                </div>
            </div>
        `;
        
        document.getElementById('impl-modal').classList.add('active');
        // Re-run highlightjs for dynamically added block
        const domBlocks = modalBody.querySelectorAll('pre code');
        domBlocks.forEach((block) => {
            hljs.highlightElement(block);
        });
    };
    
    document.getElementById('close-modal').addEventListener('click', () => {
        document.getElementById('impl-modal').classList.remove('active');
    });

    window.openSurrogateModal = function(index) {
        const item = surrogatePipelineData[index];
        const modalBody = document.getElementById('modal-body');
        modalBody.innerHTML = `
            <div class="modal-header">
                <span class="modal-step-badge" style="background:var(--accent);">Step ${item.step}</span>
                <h2>${item.title}</h2>
            </div>
            
            <div class="modal-section" style="margin-top:1.5rem;">
                <h4 style="color:var(--text-light);"><i class='bx bx-bullseye' style="color:var(--accent);"></i> 핵심 개념</h4>
                <p style="color:var(--text-muted); line-height:1.6;">${item.concept}</p>
            </div>
            
            <div class="modal-section">
                <h4 style="color:var(--text-light);"><i class='bx bx-data' style="color:var(--accent);"></i> 요구되는 데이터 및 설정</h4>
                <div style="color:var(--text-muted); line-height:1.6; margin-left: 0.5rem;" class="pipeline-reqs">${item.requirements}</div>
            </div>
            
            <div class="modal-gotchas">
                <h4><i class='bx bx-error'></i> 주의할 점 (Gotchas)</h4>
                <p>${item.gotchas}</p>
            </div>
        `;
        document.getElementById('impl-modal').classList.add('active');
    };

    // 3. Render Dictionary Grid
    const dictionaryGrid = document.getElementById('dictionary-grid');
    function renderDict(data) {
        dictionaryGrid.innerHTML = '';
        data.forEach(item => {
            dictionaryGrid.innerHTML += `
                <div class="dict-card">
                    <h3 class="dict-term">${item.term}</h3>
                    <span class="dict-kor">${item.kor}</span>
                    <p class="dict-meaning textbook-meaning"><i class='bx bx-book-open'></i> <strong>교과서적 의미:</strong><br>${item.meaning_textbook}</p>
                    <div class="dict-meaning easy-meaning"><i class='bx bx-bulb' style="color: #fcd34d;"></i> <strong>엔지니어용 쉬운 비유:</strong><br>${item.meaning_easy}</div>
                </div>
            `;
        });
    }
    renderDict(dictionaryData);

    const searchInput = document.getElementById('term-search');
    searchInput.addEventListener('input', (e) => {
        const q = e.target.value.toLowerCase();
        renderDict(dictionaryData.filter(i => i.term.toLowerCase().includes(q) || i.kor.toLowerCase().includes(q) || i.meaning_textbook.toLowerCase().includes(q) || i.meaning_easy.toLowerCase().includes(q)));
    });

    // 4. Render Code Snippet
    const codeBlock = document.getElementById('code-block');
    const codeFilename = document.getElementById('code-filename');
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    let currentSnippetCode = '';

    function switchCodeTab(tabId) {
        tabBtns.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        
        const data = codeSnippets[tabId];
        codeFilename.textContent = data.filename;
        codeBlock.className = data.language;
        codeBlock.textContent = data.code;
        currentSnippetCode = data.code;
        
        codeBlock.removeAttribute('data-highlighted');
        hljs.highlightElement(codeBlock);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            switchCodeTab(e.target.getAttribute('data-tab'));
        });
    });

    if (tabBtns.length > 0) switchCodeTab('config'); // Initialize

    document.getElementById('copy-btn').addEventListener('click', () => {
        navigator.clipboard.writeText(currentSnippetCode);
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
