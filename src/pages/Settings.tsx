import { useState } from "react";
import { useSettings } from "../hooks/useSettings";

export default function Settings() {
  const { settings, update, resetProgress } = useSettings();
  const [confirming, setConfirming] = useState(false);
  const [justReset, setJustReset] = useState(false);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Settings</h1>

      <button
        type="button"
        role="switch"
        aria-checked={settings.darkMode}
        onClick={() => update({ darkMode: !settings.darkMode })}
        className="flex min-h-16 w-full touch-manipulation items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 text-left active:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:active:bg-slate-800"
      >
        <span className="font-medium text-slate-800 dark:text-slate-100">Dark mode</span>
        <span
          className={`block h-7 w-12 shrink-0 rounded-full transition-colors ${settings.darkMode ? "bg-rose-600" : "bg-slate-300"}`}
        >
          <span
            className={`block h-6 w-6 translate-x-0.5 translate-y-0.5 rounded-full bg-white transition-transform ${
              settings.darkMode ? "translate-x-5" : ""
            }`}
          />
        </span>
      </button>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-medium text-slate-800 dark:text-slate-100">Speech rate</span>
          <span className="text-sm text-slate-500 dark:text-slate-400">{settings.ttsRate.toFixed(1)}x</span>
        </div>
        <input
          type="range"
          min={0.5}
          max={1.5}
          step={0.1}
          value={settings.ttsRate}
          onChange={(e) => update({ ttsRate: Number(e.target.value) })}
          className="h-8 w-full accent-rose-600"
        />
      </div>

      <div className="rounded-2xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
        <p className="mb-3 text-sm text-red-700 dark:text-red-300">
          Resetting clears all SRS progress and streak data stored in this browser. This can't be undone.
        </p>
        {confirming ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                resetProgress();
                setConfirming(false);
                setJustReset(true);
              }}
              className="min-h-12 flex-1 touch-manipulation rounded-full bg-red-600 px-4 py-3 text-sm font-semibold text-white active:bg-red-700"
            >
              Confirm reset
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="min-h-12 flex-1 touch-manipulation rounded-full border border-slate-300 px-4 py-3 text-sm text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setConfirming(true);
              setJustReset(false);
            }}
            className="min-h-12 w-full touch-manipulation rounded-full border border-red-400 px-4 py-3 text-sm font-semibold text-red-600 active:bg-red-100 dark:border-red-800 dark:text-red-300 dark:active:bg-red-950/50"
          >
            Reset progress
          </button>
        )}
        {justReset && <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">Progress reset.</p>}
      </div>
    </div>
  );
}
