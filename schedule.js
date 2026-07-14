/** Ancla: semana del lunes 13 jul 2026 = Ciclo 2 */
export const ANCHOR_MONDAY = new Date(2026, 6, 13);
export const CYCLE_ORDER = [2, 3, 1];

export const PEOPLE = [
  { id: "aldair", name: "Aldair", tone: "sage" },
  { id: "carlos", name: "Carlos", tone: "moss" },
  { id: "cristopher", name: "Cristopher", tone: "teal" },
  { id: "enrique", name: "Enrique", tone: "lake" },
  { id: "manuel", name: "Manuel", tone: "clay" },
  { id: "leticia", name: "Leticia", tone: "amber" },
];

const GROUPS = {
  A: ["aldair", "carlos"],
  B: ["cristopher", "enrique"],
  C: ["manuel", "leticia"],
};

const ALL_IDS = PEOPLE.map((p) => p.id);

/** Por ciclo: quién tiene home cada día laboral (0=lun … 4=vie) */
const CYCLE_SCHEDULE = {
  1: {
    0: ALL_IDS,
    1: [],
    2: GROUPS.A,
    3: [...GROUPS.B, ...GROUPS.C],
    4: ALL_IDS,
  },
  2: {
    0: ALL_IDS,
    1: [],
    2: GROUPS.B,
    3: [...GROUPS.C, ...GROUPS.A],
    4: ALL_IDS,
  },
  3: {
    0: ALL_IDS,
    1: [],
    2: GROUPS.C,
    3: [...GROUPS.A, ...GROUPS.B],
    4: ALL_IDS,
  },
};

export const DAY_LABELS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

export function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getMonday(date) {
  const d = startOfDay(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

function weeksBetween(fromMonday, toMonday) {
  const ms = toMonday.getTime() - fromMonday.getTime();
  return Math.round(ms / (7 * 24 * 60 * 60 * 1000));
}

function mod(n, m) {
  return ((n % m) + m) % m;
}

export function getCycleForMonday(monday) {
  const offset = weeksBetween(ANCHOR_MONDAY, monday);
  return CYCLE_ORDER[mod(offset, CYCLE_ORDER.length)];
}

export function getHomeIds(cycle, weekdayIndex) {
  return CYCLE_SCHEDULE[cycle][weekdayIndex] ?? [];
}

export function formatWeekRange(monday) {
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);

  const opts = { day: "numeric", month: "short" };
  const start = monday.toLocaleDateString("es-MX", opts);
  const end = friday.toLocaleDateString("es-MX", {
    ...opts,
    year: "numeric",
  });
  return `${start} – ${end}`;
}

export function formatDayDate(monday, weekdayIndex) {
  const d = new Date(monday);
  d.setDate(monday.getDate() + weekdayIndex);
  return d.toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
  });
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function personById(id) {
  return PEOPLE.find((p) => p.id === id);
}
