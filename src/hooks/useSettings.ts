import { useCallback, useEffect, useState } from "react";
import { clearAll, getItem, setItem } from "../lib/storage";
import { setRate } from "../lib/tts";

export interface Settings {
  darkMode: boolean;
  ttsRate: number;
}

const DEFAULT_SETTINGS: Settings = { darkMode: false, ttsRate: 0.9 };
const KEY = "settings";

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(() => getItem(KEY, DEFAULT_SETTINGS));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    setRate(settings.ttsRate);
  }, [settings.ttsRate]);

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      setItem(KEY, next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    clearAll();
    setSettings(DEFAULT_SETTINGS);
  }, []);

  return { settings, update, resetProgress };
}
