import {
  DAY_LABELS,
  PEOPLE,
  formatDayDate,
  getHomeIds,
  isSameDay,
  personById,
  startOfDay,
} from "../lib/schedule.js";

function dayView(weekMonday, cycle, person, weekdayIndex, today) {
  const date = new Date(weekMonday);
  date.setDate(weekMonday.getDate() + weekdayIndex);
  const homeIds = getHomeIds(cycle, weekdayIndex);
  const isToday = isSameDay(date, today);
  const everyone = homeIds.length === PEOPLE.length;
  const nobody = homeIds.length === 0;
  const personHome = person !== "all" && homeIds.includes(person);

  let statusClass = "is-partial";
  let statusText = "";

  if (nobody) {
    statusClass = "is-office";
    statusText = "Nadie en casa";
  } else if (everyone) {
    statusClass = "is-all";
    statusText = "Todos en casa";
  } else if (person !== "all") {
    statusClass = personHome ? "is-home" : "is-office";
    statusText = personHome ? "Home" : "Oficina";
  } else {
    statusText = `${homeIds.length} en casa`;
  }

  return {
    label: DAY_LABELS[weekdayIndex],
    dateLabel: formatDayDate(weekMonday, weekdayIndex),
    statusClass,
    statusText,
    isToday,
    nobody,
    everyone,
    personHome,
    homeIds,
  };
}

export function DayCard({ weekMonday, cycle, person, weekdayIndex }) {
  const today = startOfDay(new Date());
  const day = dayView(weekMonday, cycle, person, weekdayIndex, today);
  const selected = person !== "all" ? personById(person) : null;

  let body;
  if (person === "all") {
    if (day.nobody || day.everyone) {
      body = <p className="day-summary">{day.statusText}</p>;
    } else {
      body = (
        <ul className="name-list">
          {day.homeIds.map((id) => {
            const p = personById(id);
            return (
              <li key={id} className={`name-chip tone-${p.tone}`}>
                {p.name}
              </li>
            );
          })}
        </ul>
      );
    }
  } else if (day.personHome) {
    body = (
      <p className={`day-summary tone-text tone-${selected.tone}`}>
        {selected.name} trabaja desde casa
      </p>
    );
  } else {
    body = <p className="day-summary muted">Oficina</p>;
  }

  return (
    <article className={`day ${day.statusClass}${day.isToday ? " is-today" : ""}`}>
      <header className="day-head">
        <div>
          <p className="day-name">{day.label}</p>
          <p className="day-date">{day.dateLabel}</p>
        </div>
        <span className="day-status">{day.statusText}</span>
      </header>
      {body}
    </article>
  );
}

export function DayList({ weekMonday, cycle, person }) {
  return (
    <section className="days" aria-live="polite">
      {DAY_LABELS.map((_, i) => (
        <DayCard
          key={i}
          weekMonday={weekMonday}
          cycle={cycle}
          person={person}
          weekdayIndex={i}
        />
      ))}
    </section>
  );
}
