import { useMemo, useState } from "react";
import { KANA, type KanaItem } from "../data";
import { useSRS } from "../hooks/useSRS";
import { ReadingGrid } from "../components/ReadingGrid";
import { Flashcard } from "../components/Flashcard";
import { ProgressBar } from "../components/ProgressBar";
import { PageHeader } from "../components/PageHeader";
import { speak } from "../lib/tts";

type Mode = "chart" | "drill";
type KanaType = "hiragana" | "katakana";

export default function Kana() {
  const [mode, setMode] = useState<Mode>("chart");
  const [kanaType, setKanaType] = useState<KanaType>("hiragana");

  const chartItems = useMemo(
    () =>
      KANA.filter((k) => k.type === kanaType).map((k) => ({
        id: k.id,
        display: k.char,
        reveal: k.romaji,
        speakText: k.char,
      })),
    [kanaType],
  );

  const ids = useMemo(() => KANA.map((k) => k.id), []);
  const { dueIds, reviewItem } = useSRS("kana", ids);
  const [initialDue] = useState(() => dueIds.length);
  const byId = useMemo(() => {
    const map = new Map<string, KanaItem>();
    KANA.forEach((k) => map.set(k.id, k));
    return map;
  }, []);
  const currentId = dueIds[0];
  const current = currentId ? byId.get(currentId) : undefined;
  const reviewedCount = initialDue - dueIds.length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-8">
      <PageHeader
        title="Kana"
        backTo="/study"
        trailing={
          <div className="flex shrink-0 gap-1 rounded-full border border-slate-200 p-1 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setMode("chart")}
              className={`touch-manipulation rounded-full px-3 py-2 text-sm ${mode === "chart" ? "bg-rose-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
            >
              Chart
            </button>
            <button
              type="button"
              onClick={() => setMode("drill")}
              className={`touch-manipulation rounded-full px-3 py-2 text-sm ${mode === "drill" ? "bg-rose-600 text-white" : "text-slate-600 dark:text-slate-300"}`}
            >
              Drill
            </button>
          </div>
        }
      />

      {mode === "chart" ? (
        <div className="w-full">
          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setKanaType("hiragana")}
              className={`touch-manipulation rounded-full px-4 py-2.5 text-sm ${
                kanaType === "hiragana"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              Hiragana
            </button>
            <button
              type="button"
              onClick={() => setKanaType("katakana")}
              className={`touch-manipulation rounded-full px-4 py-2.5 text-sm ${
                kanaType === "katakana"
                  ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"
                  : "border border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-300"
              }`}
            >
              Katakana
            </button>
          </div>
          <ReadingGrid items={chartItems} />
          <p className="mt-3 text-center text-xs text-slate-400">Tap a tile to hear it and reveal the romaji.</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {initialDue === 0 ? "No cards due right now." : `${reviewedCount} / ${initialDue} reviewed`}
          </p>
          {initialDue > 0 && (
            <div className="w-full">
              <ProgressBar value={reviewedCount} max={initialDue} />
            </div>
          )}
          {current ? (
            <Flashcard
              key={current.id}
              front={current.char}
              back={<div className="font-medium text-slate-900 dark:text-slate-50">{current.romaji}</div>}
              onSpeak={() => speak(current.char)}
              onRate={(rating) => reviewItem(current.id, rating)}
            />
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
              <div className="text-4xl">🎉</div>
              <p className="mt-2 font-semibold text-slate-900 dark:text-slate-50">All caught up!</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
