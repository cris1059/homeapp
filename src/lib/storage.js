const DB_NAME = "homeapp";
const DB_VERSION = 1;
const STORE = "prefs";
const PREFS_KEY = "settings";

export const DEFAULT_PREFS = {
  version: 1,
  favoritePersonId: null,
  filterPerson: "all",
  lastNotifiedDate: null,
};

function openDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE);
      }
    };
  });
}

function localFallbackGet() {
  try {
    const raw = localStorage.getItem("homeapp-prefs");
    if (!raw) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

function localFallbackSet(prefs) {
  try {
    localStorage.setItem("homeapp-prefs", JSON.stringify(prefs));
  } catch {
    /* ignore quota */
  }
}

export async function getPrefs() {
  try {
    const db = await openDb();
    const prefs = await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readonly");
      const req = tx.objectStore(STORE).get(PREFS_KEY);
      req.onsuccess = () => resolve(req.result ?? null);
      req.onerror = () => reject(req.error);
    });
    db.close();
    if (!prefs) return { ...DEFAULT_PREFS };
    return { ...DEFAULT_PREFS, ...prefs };
  } catch {
    return localFallbackGet();
  }
}

export async function setPrefs(next) {
  const prefs = { ...DEFAULT_PREFS, ...next };
  localFallbackSet(prefs);

  try {
    const db = await openDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, "readwrite");
      tx.objectStore(STORE).put(prefs, PREFS_KEY);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
    db.close();
  } catch {
    /* localStorage already updated */
  }

  return prefs;
}

export function todayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
