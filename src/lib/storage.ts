const PREFIX = "n5sensei:";

export function getItem<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function setItem<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function removeItem(key: string): void {
  localStorage.removeItem(PREFIX + key);
}

export function clearAll(): void {
  Object.keys(localStorage)
    .filter((k) => k.startsWith(PREFIX))
    .forEach((k) => localStorage.removeItem(k));
}

interface StreakData {
  count: number;
  lastDate: string | null;
}

const STREAK_KEY = "streak";

function todayStr(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/** Records a study action today; increments the streak if the last study day was yesterday. */
export function touchStreak(): number {
  const data = getItem<StreakData>(STREAK_KEY, { count: 0, lastDate: null });
  const today = todayStr();
  if (data.lastDate === today) return data.count;
  const count = data.lastDate === todayStr(-1) ? data.count + 1 : 1;
  setItem(STREAK_KEY, { count, lastDate: today });
  return count;
}

export function getStreak(): number {
  return getItem<StreakData>(STREAK_KEY, { count: 0, lastDate: null }).count;
}
