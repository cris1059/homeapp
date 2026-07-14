import {
  getCycleForMonday,
  getHomeIds,
  getMonday,
  personById,
  startOfDay,
} from "./schedule.js";

/** 0=lun … 4=vie; null si fin de semana */
export function getWeekdayIndex(date) {
  const day = date.getDay();
  if (day === 0 || day === 6) return null;
  return day - 1;
}

export function addDays(date, days) {
  const d = startOfDay(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isPersonHomeOnDate(personId, date = new Date()) {
  if (!personId || personId === "all") return false;
  const day = startOfDay(date);
  const weekdayIndex = getWeekdayIndex(day);
  if (weekdayIndex === null) return false;

  const monday = getMonday(day);
  const cycle = getCycleForMonday(monday);
  return getHomeIds(cycle, weekdayIndex).includes(personId);
}

/** Aviso anticipado: ¿mañana es home del favorito? */
export function isPersonHomeTomorrow(personId, fromDate = new Date()) {
  return isPersonHomeOnDate(personId, addDays(fromDate, 1));
}

export async function ensureNotificationPermission() {
  if (typeof Notification === "undefined") return "denied";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  return Notification.requestPermission();
}

/**
 * Notifica al abrir la app (online u offline) si mañana es home
 * del favorito. Como máximo una vez por día de apertura.
 * No se dispara con la aplicación cerrada (limitación PWA).
 */
export async function notifyFavoriteHomeIfNeeded({
  favoritePersonId,
  lastNotifiedDate,
  today = todayKeyLocal(),
}) {
  if (!favoritePersonId) return { notified: false, reason: "no-favorite" };
  if (lastNotifiedDate === today) return { notified: false, reason: "already" };
  if (!isPersonHomeTomorrow(favoritePersonId)) {
    return { notified: false, reason: "not-home" };
  }

  const permission = await ensureNotificationPermission();
  if (permission !== "granted") {
    return { notified: false, reason: "permission" };
  }

  const person = personById(favoritePersonId);
  if (!person) return { notified: false, reason: "unknown" };

  const tomorrow = addDays(new Date(), 1);
  const when = tomorrow.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "short",
  });

  const title = "HOME — Mañana en casa";
  const body = `${person.name} trabaja desde casa mañana (${when})`;
  const options = {
    body,
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",
    tag: `home-eve-${today}-${favoritePersonId}`,
    renotify: false,
  };

  try {
    if ("serviceWorker" in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg) {
        await reg.showNotification(title, options);
        return { notified: true, reason: "shown" };
      }
    }
    new Notification(title, options);
    return { notified: true, reason: "shown" };
  } catch {
    return { notified: false, reason: "error" };
  }
}

function todayKeyLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
