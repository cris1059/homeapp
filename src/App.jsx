import { useEffect, useRef, useState } from "react";
import { PersonPicker } from "./components/PersonPicker.jsx";
import { WeekNav } from "./components/WeekNav.jsx";
import { DayList } from "./components/DayCard.jsx";
import { CycleLegend } from "./components/CycleLegend.jsx";
import { ConnectionStatus } from "./components/ConnectionStatus.jsx";
import {
  getMonday,
  getCycleForMonday,
  formatWeekRange,
  isSameDay,
  startOfDay,
  personById,
} from "./lib/schedule.js";
import { getPrefs, setPrefs, todayKey } from "./lib/storage.js";
import {
  notifyFavoriteHomeIfNeeded,
  isPersonHomeOnDate,
  isPersonHomeTomorrow,
} from "./lib/notifications.js";
import { useOnline } from "./hooks/useOnline.js";

export default function App() {
  const online = useOnline();
  const [weekMonday, setWeekMonday] = useState(() => getMonday(new Date()));
  const [person, setPerson] = useState("all");
  const [favoritePersonId, setFavoritePersonId] = useState(null);
  const [prefsReady, setPrefsReady] = useState(false);
  const notifiedThisSession = useRef(false);

  const today = startOfDay(new Date());
  const thisMonday = getMonday(today);
  const cycle = getCycleForMonday(weekMonday);
  const isCurrentWeek = isSameDay(weekMonday, thisMonday);
  const favorite = favoritePersonId ? personById(favoritePersonId) : null;
  const favoriteHomeToday =
    favoritePersonId && isPersonHomeOnDate(favoritePersonId, today);
  const favoriteHomeTomorrow =
    favoritePersonId && isPersonHomeTomorrow(favoritePersonId, today);

  useEffect(() => {
    let cancelled = false;

    getPrefs().then((prefs) => {
      if (cancelled) return;
      setFavoritePersonId(prefs.favoritePersonId);
      setPerson(prefs.filterPerson || prefs.favoritePersonId || "all");
      setPrefsReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!prefsReady || notifiedThisSession.current) return;

    let cancelled = false;

    (async () => {
      const prefs = await getPrefs();
      const result = await notifyFavoriteHomeIfNeeded({
        favoritePersonId: prefs.favoritePersonId ?? favoritePersonId,
        lastNotifiedDate: prefs.lastNotifiedDate,
      });

      if (cancelled) return;

      // Bloquear reintentos solo cuando ya se resolvió el día (o no aplica)
      if (
        result.notified ||
        result.reason === "already" ||
        result.reason === "not-home" ||
        result.reason === "permission" ||
        result.reason === "error" ||
        result.reason === "unknown"
      ) {
        notifiedThisSession.current = true;
      }

      if (result.notified) {
        await setPrefs({
          ...prefs,
          lastNotifiedDate: todayKey(),
        });
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [prefsReady, favoritePersonId]);

  async function handlePersonChange(next) {
    setPerson(next);
    const prefs = await getPrefs();
    await setPrefs({ ...prefs, filterPerson: next });
  }

  async function handleFavoriteChange(id) {
    setFavoritePersonId(id);
    setPerson(id);
    const prefs = await getPrefs();
    await setPrefs({
      ...prefs,
      favoritePersonId: id,
      filterPerson: id,
    });
  }

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
        <div className="top-row">
          <p className="brand">HOME</p>
          <ConnectionStatus online={online} />
        </div>
        <p className="tagline">Quién trabaja desde casa esta semana</p>
        {favorite && (
          <p className="favorite-hint">
            Favorito: <strong>{favorite.name}</strong>
            {favoriteHomeToday
              ? " · hoy home"
              : favoriteHomeTomorrow
                ? " · mañana home (aviso al abrir)"
                : " · sin home mañana"}
          </p>
        )}
      </header>

      <main className="app">
        <PersonPicker
          person={person}
          favoritePersonId={favoritePersonId}
          onPersonChange={handlePersonChange}
          onFavoriteChange={handleFavoriteChange}
        />

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
