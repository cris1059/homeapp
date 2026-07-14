import {
  PEOPLE,
  DAY_LABELS,
  getMonday,
  getCycleForMonday,
  getHomeIds,
  formatWeekRange,
  formatDayDate,
  isSameDay,
  personById,
  startOfDay,
} from "./schedule.js";

const picker = document.querySelector(".person-picker");
const daysEl = document.querySelector("#days");
const weekRangeEl = document.querySelector("#week-range");
const cycleBadgeEl = document.querySelector("#cycle-badge");
const cycleListEl = document.querySelector("#cycle-list");
const goTodayBtn = document.querySelector("#go-today");
const prevBtn = document.querySelector("#prev-week");
const nextBtn = document.querySelector("#next-week");

const state = {
  weekMonday: getMonday(new Date()),
  person: "all",
};

function buildPicker() {
  const fragment = document.createDocumentFragment();

  for (const person of PEOPLE) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = `person tone-${person.tone}`;
    btn.dataset.person = person.id;
    btn.textContent = person.name;
    fragment.appendChild(btn);
  }

  picker.appendChild(fragment);
}

function buildCycleLegend() {
  const summaries = [
    { cycle: 1, wed: "Aldair, Carlos", thu: "Cristopher, Enrique, Manuel, Leticia" },
    { cycle: 2, wed: "Cristopher, Enrique", thu: "Manuel, Leticia, Aldair, Carlos" },
    { cycle: 3, wed: "Manuel, Leticia", thu: "Aldair, Carlos, Cristopher, Enrique" },
  ];

  cycleListEl.innerHTML = summaries
    .map(
      (s) => `
      <li class="cycle-item" data-cycle="${s.cycle}">
        <span class="cycle-item-label">Ciclo ${s.cycle}</span>
        <span class="cycle-item-detail">Mié · ${s.wed}</span>
        <span class="cycle-item-detail">Jue · ${s.thu}</span>
      </li>`
    )
    .join("");
}

function setActivePerson() {
  picker.querySelectorAll(".person").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.person === state.person);
  });
}

function shiftWeek(delta) {
  const next = new Date(state.weekMonday);
  next.setDate(next.getDate() + delta * 7);
  state.weekMonday = next;
  render();
}

function goToday() {
  state.weekMonday = getMonday(new Date());
  render();
}

function render() {
  const today = startOfDay(new Date());
  const thisMonday = getMonday(today);
  const cycle = getCycleForMonday(state.weekMonday);
  const isCurrentWeek = isSameDay(state.weekMonday, thisMonday);

  weekRangeEl.textContent = formatWeekRange(state.weekMonday);
  cycleBadgeEl.textContent = `Ciclo ${cycle}`;
  cycleBadgeEl.dataset.cycle = String(cycle);
  goTodayBtn.hidden = isCurrentWeek;

  cycleListEl.querySelectorAll(".cycle-item").forEach((item) => {
    item.classList.toggle("is-current", Number(item.dataset.cycle) === cycle);
  });

  daysEl.innerHTML = DAY_LABELS.map((label, i) => {
    const date = new Date(state.weekMonday);
    date.setDate(state.weekMonday.getDate() + i);
    const homeIds = getHomeIds(cycle, i);
    const isToday = isSameDay(date, today);
    const everyone = homeIds.length === PEOPLE.length;
    const nobody = homeIds.length === 0;
    const personHome =
      state.person !== "all" && homeIds.includes(state.person);

    let statusClass = "is-partial";
    let statusText = "";

    if (nobody) {
      statusClass = "is-office";
      statusText = "Nadie en casa";
    } else if (everyone) {
      statusClass = "is-all";
      statusText = "Todos en casa";
    } else if (state.person !== "all") {
      statusClass = personHome ? "is-home" : "is-office";
      statusText = personHome ? "Home" : "Oficina";
    } else {
      statusText = `${homeIds.length} en casa`;
    }

    let body = "";

    if (state.person === "all") {
      if (nobody || everyone) {
        body = `<p class="day-summary">${statusText}</p>`;
      } else {
        body = `<ul class="name-list">${homeIds
          .map((id) => {
            const p = personById(id);
            return `<li class="name-chip tone-${p.tone}">${p.name}</li>`;
          })
          .join("")}</ul>`;
      }
    } else if (personHome) {
      const p = personById(state.person);
      body = `<p class="day-summary tone-text tone-${p.tone}">${p.name} trabaja desde casa</p>`;
    } else {
      body = `<p class="day-summary muted">Oficina</p>`;
    }

    return `
      <article class="day ${statusClass}${isToday ? " is-today" : ""}">
        <header class="day-head">
          <div>
            <p class="day-name">${label}</p>
            <p class="day-date">${formatDayDate(state.weekMonday, i)}</p>
          </div>
          <span class="day-status">${statusText}</span>
        </header>
        ${body}
      </article>`;
  }).join("");
}

picker.addEventListener("click", (e) => {
  const btn = e.target.closest(".person");
  if (!btn) return;
  state.person = btn.dataset.person;
  setActivePerson();
  render();
});

prevBtn.addEventListener("click", () => shiftWeek(-1));
nextBtn.addEventListener("click", () => shiftWeek(1));
goTodayBtn.addEventListener("click", goToday);

buildPicker();
buildCycleLegend();
setActivePerson();
render();
