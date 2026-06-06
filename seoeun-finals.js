const storagePrefix = "seoeun-finals-v1";

const examStart = new Date(2026, 6, 6);
const examEnd = new Date(2026, 6, 9);
const prepStart = new Date(2026, 5, 6);
let selectedDateKey = "";

const dayPlan = [
    {
        key: "mon",
        label: "월",
        hours: 4.5,
        blocks: [
            ["1.5h", "학원 숙제", "국어·영어·수학 F/up"],
            ["1.4h", "수학 약점 보강", "오답 8-10문제"],
            ["0.9h", "과학 문제집", "개념 확인 후 풀이"],
            ["0.7h", "사회 교과서", "본문 표시와 키워드"]
        ]
    },
    {
        key: "tue",
        label: "화",
        hours: 2,
        blocks: [
            ["1.5h", "학원 숙제", "국어·영어·수학 F/up"],
            ["0.5h", "암기 과목", "도덕 또는 기술/가정"]
        ]
    },
    {
        key: "wed",
        label: "수",
        hours: 4,
        blocks: [
            ["1.5h", "학원 숙제", "국어·영어·수학 F/up"],
            ["1.2h", "수학 개념 구멍", "취약 단원 예제 재풀이"],
            ["0.8h", "과학 문제집", "문제 유형 익히기"],
            ["0.5h", "국어·영어", "학원 내용 짧은 복습"]
        ]
    },
    {
        key: "thu",
        label: "목",
        hours: 2,
        blocks: [
            ["1.5h", "학원 숙제", "국어·영어·수학 F/up"],
            ["0.5h", "사회·도덕", "1회독 및 요약노트 만들기"]
        ]
    },
    {
        key: "fri",
        label: "금",
        hours: 3,
        blocks: [
            ["1.5h", "학원 숙제", "국어·영어·수학 F/up"],
            ["0.8h", "수학 오답", "이번 주 틀린 문제 재풀이"],
            ["0.7h", "과학·사회", "1회독 및 요약노트 만들기"]
        ]
    },
    {
        key: "sat",
        label: "토",
        hours: 3.5,
        blocks: [
            ["1.5h", "학원 숙제", "국어·영어·수학 F/up"],
            ["1.0h", "수학", "단원별 문제 세트"],
            ["1.0h", "국영수 제외 과목", "1회독 및 요약노트 만들기"]
        ]
    },
    {
        key: "sun",
        label: "일",
        hours: 3.5,
        blocks: [
            ["1.5h", "학원 숙제", "국어·영어·수학 F/up"],
            ["0.8h", "과학 문제집", "채점 후 오답 표시"],
            ["0.7h", "사회·도덕", "1회독 및 요약노트 만들기"],
            ["0.5h", "주간 점검", "부모와 다음 주 조정"]
        ]
    }
];

const subjects = [
    {
        id: "math",
        name: "수학",
        icon: "bx-math",
        tag: "최우선",
        tagClass: "tag-risk",
        initial: 50,
        note: "중간고사에서 가장 취약. 오답 재풀이와 개념 빈칸 점검을 매주 고정합니다."
    },
    {
        id: "korean",
        name: "국어",
        icon: "bx-book-open",
        tag: "학원 F/up",
        tagClass: "tag-core",
        initial: 20,
        note: "학원 흐름은 유지하고, 시험범위 확정 뒤 교과서 지문과 문법 포인트를 따로 표시합니다."
    },
    {
        id: "english",
        name: "영어",
        icon: "bx-message-rounded-detail",
        tag: "학원 F/up",
        tagClass: "tag-core",
        initial: 20,
        note: "학원 숙제 시간을 기본축으로 두고, 학교 범위 단어·본문 암기를 별도로 확인합니다."
    },
    {
        id: "science",
        name: "과학",
        icon: "bx-test-tube",
        tag: "문제집",
        tagClass: "tag-workbook",
        initial: 0,
        note: "문제집 풀이 경험이 필요합니다. 개념 정리보다 채점과 오답 표시까지 한 세트로 봅니다."
    },
    {
        id: "social",
        name: "사회",
        icon: "bx-world",
        tag: "암기",
        tagClass: "tag-memory",
        initial: 0,
        note: "교과서 본문 표시, 단원별 키워드, 빈칸 테스트로 준비합니다."
    },
    {
        id: "ethics",
        name: "도덕",
        icon: "bx-heart",
        tag: "암기",
        tagClass: "tag-memory",
        initial: 0,
        note: "개념어와 사례를 짝지어 짧게 반복합니다."
    },
    {
        id: "techhome",
        name: "기술/가정",
        icon: "bx-home-alt",
        tag: "암기",
        tagClass: "tag-memory",
        initial: 0,
        note: "범위가 나오면 그림·표·용어 중심으로 요약합니다."
    },
    {
        id: "art",
        name: "미술",
        icon: "bx-palette",
        tag: "미정",
        tagClass: "tag-pending",
        initial: 0,
        note: "시험 여부 확정 전입니다."
    },
    {
        id: "music",
        name: "음악",
        icon: "bx-music",
        tag: "미정",
        tagClass: "tag-pending",
        initial: 0,
        note: "시험 여부 확정 전입니다."
    },
    {
        id: "pe",
        name: "체육",
        icon: "bx-run",
        tag: "미정",
        tagClass: "tag-pending",
        initial: 0,
        note: "시험 여부 확정 전입니다."
    }
];

const subjectStatus = [
    ["국어", "중간고사 과목"],
    ["영어", "중간고사 과목"],
    ["수학", "취약 보강"],
    ["사회", "교과서 정리"],
    ["과학", "문제집 필요"],
    ["도덕", "암기 과목"],
    ["기술/가정", "암기 과목"],
    ["미술", "시험 미정"],
    ["음악", "시험 미정"],
    ["체육", "시험 미정"]
];

const parentChecklist = [
    ["range", "시험범위 확정되면 과목별 범위를 바로 적기", "범위 확정 전"],
    ["dates", "과목별 시험 날짜가 나오면 전날 복습 과목 바꾸기", "일정 확정 전"],
    ["math", "수학 오답 노트에서 다시 틀린 문제만 따로 표시하기", "매주"],
    ["science", "과학 문제집은 채점 후 틀린 이유를 한 줄로 적기", "매주 2-3회"],
    ["weekend", "일요일 30분은 부모와 진도율·컨디션 같이 보기", "주간 점검"]
];

function getStored(key, fallback) {
    const raw = localStorage.getItem(`${storagePrefix}:${key}`);
    if (raw === null) return fallback;

    try {
        return JSON.parse(raw);
    } catch (error) {
        return fallback;
    }
}

function setStored(key, value) {
    localStorage.setItem(`${storagePrefix}:${key}`, JSON.stringify(value));
}

function startOfDay(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
}

function toDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function fromDateKey(key) {
    const [year, month, day] = key.split("-").map(Number);
    return new Date(year, month - 1, day);
}

function isSameDate(left, right) {
    return toDateKey(left) === toDateKey(right);
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function formatKoreanDate(date) {
    return new Intl.DateTimeFormat("ko-KR", {
        month: "long",
        day: "numeric",
        weekday: "long"
    }).format(date);
}

function getPhase(today) {
    const time = startOfDay(today).getTime();
    if (time < new Date(2026, 5, 16).getTime()) return "범위 확정 전";
    if (time < new Date(2026, 5, 29).getTime()) return "1회독 주간";
    if (time < examStart.getTime()) return "실전 압축";
    if (time <= examEnd.getTime()) return "시험 주간";
    return "시험 종료";
}

function updateDday() {
    const today = startOfDay(new Date());
    const diff = Math.ceil((examStart.getTime() - today.getTime()) / 86400000);
    const number = document.getElementById("d-day-number");
    const label = document.getElementById("d-day-label");
    const todayLabel = document.getElementById("today-label");

    if (diff > 0) {
        number.textContent = `D-${diff}`;
        label.textContent = "2026년 7월 6일 첫 시험일까지 남은 시간";
    } else if (today.getTime() <= examEnd.getTime()) {
        number.textContent = "시험";
        label.textContent = "시험 주간입니다. 다음 날 과목 중심으로 가볍게 정리합니다.";
    } else {
        number.textContent = "완료";
        label.textContent = "기말고사 기간이 끝났습니다. 다음 계획은 회고부터 시작합니다.";
    }

    todayLabel.textContent = formatKoreanDate(today);
}

function getTodayPlan() {
    return getPlanForDate(new Date());
}

function getPlanForDate(date) {
    const dayIndex = date.getDay();
    const planIndex = dayIndex === 0 ? 6 : dayIndex - 1;
    return dayPlan[planIndex];
}

function taskIdFor(text) {
    return text
        .replace(/\s+/g, "-")
        .replace(/[^\w가-힣-]/g, "")
        .slice(0, 48);
}

function getInitialSelectedDateKey() {
    const today = startOfDay(new Date());
    if (today < prepStart) return toDateKey(prepStart);
    if (today > examEnd) return toDateKey(examEnd);
    return toDateKey(today);
}

function getDateTasksKey(dateKey) {
    return `dateTasks:${dateKey}`;
}

function getDefaultTasksForDate(date) {
    const dateKey = toDateKey(date);
    const plan = getPlanForDate(date);
    const phase = getPhase(date);
    const isExamWeek = startOfDay(date) >= examStart && startOfDay(date) <= examEnd;
    const dayOffset = Math.round((startOfDay(date).getTime() - prepStart.getTime()) / 86400000);

    const tasks = plan.blocks.map((block, index) => ({
        id: `${dateKey}:base:${index}:${taskIdFor(block[1])}`,
        time: block[0],
        title: block[1],
        detail: block[2],
        done: false
    }));

    if (isExamWeek) {
        tasks.splice(1, 0, {
            id: `${dateKey}:exam-review`,
            time: "0.7h",
            title: "다음 시험 과목 가볍게 보기",
            detail: "새 문제보다 교과서 표시, 오답, 암기 카드 위주",
            done: false
        });
    } else if (phase === "범위 확정 전") {
        tasks.push({
            id: `${dateKey}:range-ready`,
            time: "0.3h",
            title: "시험범위 받을 준비",
            detail: "과목별 단원명과 프린트 위치를 적을 자리 만들기",
            done: false
        });
    } else if (phase === "1회독 주간") {
        tasks.push({
            id: `${dateKey}:first-pass`,
            time: "0.5h",
            title: "범위 1회독 체크",
            detail: "오늘 본 단원에 형광펜과 헷갈린 표시 남기기",
            done: false
        });
    } else if (phase === "실전 압축") {
        tasks.push({
            id: `${dateKey}:wrong-note`,
            time: "0.5h",
            title: "오답 재확인",
            detail: "다시 틀린 문제만 별표 표시하고 다음 날로 넘기기",
            done: false
        });
    }

    if (dayOffset % 3 === 0 && !isExamWeek) {
        tasks.push({
            id: `${dateKey}:parent-check`,
            time: "0.2h",
            title: "부모와 짧은 점검",
            detail: "수학 오답, 과학 문제집, 암기 과목 중 막힌 것만 확인",
            done: false
        });
    }

    return tasks;
}

function getTasksForDate(dateKey) {
    const stored = getStored(getDateTasksKey(dateKey), null);
    if (stored) return normalizeTasksForDate(dateKey, stored);
    return getDefaultTasksForDate(fromDateKey(dateKey));
}

function normalizeTasksForDate(dateKey, tasks) {
    let changed = false;
    const normalized = tasks.map(task => {
        const title = task.title || "";
        const detail = task.detail || "";
        const isNonCoreMemoryTask =
            title.includes("사회") ||
            title.includes("도덕") ||
            title.includes("기술") ||
            title.includes("가정") ||
            title.includes("비주요") ||
            title.includes("국영수 제외") ||
            title.includes("과학");

        if (isNonCoreMemoryTask && (detail.includes("암기 카드") || detail.includes("키워드 10개") || detail.includes("교과서 정리 또는 문제집") || detail.includes("한 과목 집중 정리"))) {
            changed = true;
            return {
                ...task,
                detail: "1회독 및 요약노트 만들기"
            };
        }

        return task;
    });

    if (changed) saveTasksForDate(dateKey, normalized);
    return normalized;
}

function saveTasksForDate(dateKey, tasks) {
    setStored(getDateTasksKey(dateKey), tasks);
}

function updateTask(dateKey, taskId, patch) {
    const tasks = getTasksForDate(dateKey).map(task =>
        task.id === taskId ? { ...task, ...patch } : task
    );
    saveTasksForDate(dateKey, tasks);
}

function deleteTask(dateKey, taskId) {
    const tasks = getTasksForDate(dateKey).filter(task => task.id !== taskId);
    saveTasksForDate(dateKey, tasks);
}

function getCalendarDates() {
    const dates = [];
    for (let cursor = new Date(prepStart); cursor <= examEnd; cursor = addDays(cursor, 1)) {
        dates.push(new Date(cursor));
    }
    return dates;
}

function renderStudyCalendar() {
    const grid = document.getElementById("study-calendar-grid");
    const dates = getCalendarDates();
    const firstDayBlankCount = prepStart.getDay();
    const today = startOfDay(new Date());
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];

    const weekdayHtml = weekdays.map(day => `<div class="calendar-weekday">${day}</div>`).join("");
    const blanks = Array.from({ length: firstDayBlankCount }, () => `<button class="study-date-button blank" type="button" tabindex="-1"></button>`).join("");
    const dateHtml = dates.map(date => {
        const dateKey = toDateKey(date);
        const tasks = getTasksForDate(dateKey);
        const doneCount = tasks.filter(task => task.done).length;
        const ratio = tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0;
        const selected = dateKey === selectedDateKey;
        const examDay = date >= examStart && date <= examEnd;
        const todayClass = isSameDate(date, today);

        return `
            <button class="study-date-button ${selected ? "selected" : ""} ${examDay ? "exam-day" : ""} ${todayClass ? "today" : ""}" type="button" data-date-key="${dateKey}" aria-label="${date.getMonth() + 1}월 ${date.getDate()}일 할 일 보기">
                <span class="date-number">
                    <span>${date.getDate()}</span>
                    <small>${weekdays[date.getDay()]}</small>
                </span>
                <span class="date-task-meta">
                    <span>${doneCount}/${tasks.length} 완료</span>
                    <span class="date-task-bar"><span style="width:${ratio}%"></span></span>
                </span>
            </button>
        `;
    }).join("");

    grid.innerHTML = `${weekdayHtml}${blanks}${dateHtml}`;
    grid.querySelectorAll(".study-date-button[data-date-key]").forEach(button => {
        button.addEventListener("click", event => {
            selectedDateKey = event.currentTarget.dataset.dateKey;
            setStored("selectedDate", selectedDateKey);
            renderStudyCalendar();
            renderTodos();
        });
    });
}

function renderTodos() {
    const selectedDate = fromDateKey(selectedDateKey);
    const plan = getPlanForDate(selectedDate);
    const tasks = getTasksForDate(selectedDateKey);
    const list = document.getElementById("todo-list");
    const phase = getPhase(selectedDate);

    document.getElementById("selected-date-title").textContent = `${formatKoreanDate(selectedDate)} 할 일`;
    document.getElementById("today-study-summary").textContent =
        `${plan.label}요일 총 ${plan.hours}시간 중 학원 숙제 1.5시간을 먼저 하고, 선택한 날짜의 시험 준비를 조정합니다.`;
    document.getElementById("today-phase").textContent = phase;

    list.innerHTML = tasks.map(task => {
        const isDone = Boolean(task.done);
        return `
            <div class="todo-item ${isDone ? "done" : ""}">
                <input id="todo-${escapeHtml(task.id)}" type="checkbox" data-task-id="${escapeHtml(task.id)}" ${isDone ? "checked" : ""}>
                <div class="todo-fields">
                    <input class="todo-field todo-title-input" type="text" value="${escapeHtml(task.title)}" data-task-id="${escapeHtml(task.id)}" data-field="title" aria-label="할 일 제목">
                    <input class="todo-field todo-detail-input" type="text" value="${escapeHtml(task.detail)}" data-task-id="${escapeHtml(task.id)}" data-field="detail" aria-label="할 일 세부 내용">
                </div>
                <input class="todo-time-input" type="text" value="${escapeHtml(task.time)}" data-task-id="${escapeHtml(task.id)}" data-field="time" aria-label="예상 시간">
                <button class="delete-todo-button" type="button" data-task-id="${escapeHtml(task.id)}" aria-label="할 일 삭제"><i class='bx bx-trash'></i></button>
            </div>
        `;
    }).join("");

    list.querySelectorAll("input[type='checkbox']").forEach(input => {
        input.addEventListener("change", event => {
            updateTask(selectedDateKey, event.target.dataset.taskId, { done: event.target.checked });
            renderTodos();
            renderStudyCalendar();
        });
    });

    list.querySelectorAll(".todo-field, .todo-time-input").forEach(input => {
        input.addEventListener("change", event => {
            const value = event.target.value.trim();
            updateTask(selectedDateKey, event.target.dataset.taskId, {
                [event.target.dataset.field]: value || "미정"
            });
            renderTodos();
            renderStudyCalendar();
        });
    });

    list.querySelectorAll(".delete-todo-button").forEach(button => {
        button.addEventListener("click", event => {
            deleteTask(selectedDateKey, event.currentTarget.dataset.taskId);
            renderTodos();
            renderStudyCalendar();
        });
    });
}

function bindCustomTodo() {
    const input = document.getElementById("custom-todo-input");
    const button = document.getElementById("add-todo-button");

    const addTodo = () => {
        const title = input.value.trim();
        if (!title) return;

        const tasks = getTasksForDate(selectedDateKey);
        tasks.push({
            id: `${selectedDateKey}:custom:${Date.now()}`,
            title,
            detail: "직접 추가한 할 일",
            time: "0.5h",
            done: false
        });
        saveTasksForDate(selectedDateKey, tasks);
        input.value = "";
        renderTodos();
        renderStudyCalendar();
    };

    button.addEventListener("click", addTodo);
    input.addEventListener("keydown", event => {
        if (event.key === "Enter") addTodo();
    });
}

function getProgress(subject) {
    return getStored(`progress:${subject.id}`, subject.initial);
}

function renderSubjects() {
    const grid = document.getElementById("subject-grid");

    grid.innerHTML = subjects.map(subject => {
        const value = getProgress(subject);
        return `
            <article class="subject-card">
                <div class="subject-head">
                    <div class="subject-name"><i class='bx ${subject.icon}'></i>${subject.name}</div>
                    <span class="subject-tag ${subject.tagClass}">${subject.tag}</span>
                </div>
                <div class="progress-wrap">
                    <div class="progress-line"><div class="progress-fill" style="width:${value}%"></div></div>
                    <input class="subject-slider" type="range" min="0" max="100" value="${value}" data-subject-id="${subject.id}" aria-label="${subject.name} 진도율">
                </div>
                <p class="subject-note"><strong class="subject-value">${value}%</strong> · ${subject.note}</p>
            </article>
        `;
    }).join("");

    grid.querySelectorAll(".subject-slider").forEach(slider => {
        slider.addEventListener("input", event => {
            const id = event.target.dataset.subjectId;
            const value = Number(event.target.value);
            setStored(`progress:${id}`, value);
            const card = event.target.closest(".subject-card");
            card.querySelector(".progress-fill").style.width = `${value}%`;
            card.querySelector(".subject-value").textContent = `${value}%`;
            updateOverallProgress();
        });
    });

    updateOverallProgress();
}

function updateOverallProgress() {
    const confirmedSubjects = subjects.filter(subject => subject.tag !== "미정");
    const total = confirmedSubjects.reduce((sum, subject) => sum + getProgress(subject), 0);
    const average = Math.round(total / confirmedSubjects.length);
    document.getElementById("overall-progress").textContent = `확정 과목 평균 ${average}%`;
}

function renderWeek() {
    const todayPlan = getTodayPlan();
    const grid = document.getElementById("week-grid");

    grid.innerHTML = dayPlan.map(day => `
        <article class="day-card ${day.key === todayPlan.key ? "today" : ""}">
            <div class="day-head">
                <span>${day.label}요일</span>
                <span class="hours-pill">${day.hours}h</span>
            </div>
            <ul class="block-list">
                ${day.blocks.map(block => `
                    <li>
                        ${block[1]}
                        <small>${block[0]} · ${block[2]}</small>
                    </li>
                `).join("")}
            </ul>
        </article>
    `).join("");
}

function renderSubjectStatus() {
    const grid = document.getElementById("exam-subjects");

    grid.innerHTML = subjectStatus.map(([name, status]) => `
        <div class="exam-subject">
            <span>${name}</span>
            <small>${status}</small>
        </div>
    `).join("");
}

function renderParentChecklist() {
    const checked = getStored("parentChecklist", {});
    const list = document.getElementById("parent-checklist");

    list.innerHTML = parentChecklist.map(([id, title, tag]) => {
        const isDone = Boolean(checked[id]);
        return `
            <div class="check-item ${isDone ? "done" : ""}">
                <input id="check-${id}" type="checkbox" data-check-id="${id}" ${isDone ? "checked" : ""}>
                <label for="check-${id}">
                    ${title}<br>
                    <small>${tag}</small>
                </label>
            </div>
        `;
    }).join("");

    list.querySelectorAll("input[type='checkbox']").forEach(input => {
        input.addEventListener("change", event => {
            checked[event.target.dataset.checkId] = event.target.checked;
            setStored("parentChecklist", checked);
            renderParentChecklist();
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    selectedDateKey = getStored("selectedDate", getInitialSelectedDateKey());
    updateDday();
    renderStudyCalendar();
    renderTodos();
    bindCustomTodo();
    renderSubjects();
    renderWeek();
    renderSubjectStatus();
    renderParentChecklist();
});
