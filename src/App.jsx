import { useState } from "react";
import { PersonPicker } from "./components/PersonPicker.jsx";
import { WeekNav } from "./components/WeekNav.jsx";
import { DayList } from "./components/DayCard.jsx";
import { CycleLegend } from "./components/CycleLegend.jsx";
import {
  getMonday,
  getCycleForMonday,
  formatWeekRange,
  isSameDay,
  startOfDay,
} from "./lib/schedule.js";

export default function App() {
  const [weekMonday, setWeekMonday] = useState(() => getMonday(new Date()));
  const [person, setPerson] = useState("all");

  const today = startOfDay(new Date());
  const thisMonday = getMonday(today);
  const cycle = getCycleForMonday(weekMonday);
  const isCurrentWeek = isSameDay(weekMonday, thisMonday);

  function shiftWeek(delta) {
    const next = new Date(weekMonday);
    next.setDate(next.getDate() + delta * 7);
    setWeekMonday(next);
  }

  function goToday() {
    setWeekMonday(getMonday(new Date()));
  }

  return (
    <>
      <div className="atmosphere" aria-hidden="true" />

      <header className="top">
        <p className="brand">HOME</p>
        <p className="tagline">Quién trabaja desde casa esta semana</p>
      </header>

      <main className="app">
        <PersonPicker person={person} onPersonChange={setPerson} />

        <WeekNav
          weekRange={formatWeekRange(weekMonday)}
          cycle={cycle}
          onPrev={() => shiftWeek(-1)}
          onNext={() => shiftWeek(1)}
        />

        {!isCurrentWeek && (
          <button type="button" className="today-link" onClick={goToday}>
            Ir a esta semana
          </button>
        )}

        <DayList weekMonday={weekMonday} cycle={cycle} person={person} />

        <CycleLegend currentCycle={cycle} />
      </main>
    </>
  );
}
