import { useMemo, useState } from "react";
import { KANJI, type KanjiItem } from "../data";
import { useSRS } from "../hooks/useSRS";
import { Flashcard } from "../components/Flashcard";
import { ProgressBar } from "../components/ProgressBar";
import { PageHeader } from "../components/PageHeader";
import { speak } from "../lib/tts";

export default function Kanji() {
  const ids = useMemo(() => KANJI.map((k) => k.id), []);
  const { dueIds, reviewItem } = useSRS("kanji", ids);
  const [initialDue] = useState(() => dueIds.length);

  const byId = useMemo(() => {
    const map = new Map<string, KanjiItem>();
    KANJI.forEach((k) => map.set(k.id, k));
    return map;
  }, []);

  const currentId = dueIds[0];
  const current = currentId ? byId.get(currentId) : undefined;
  const reviewedCount = initialDue - dueIds.length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-8">
      <div className="w-full">
        <PageHeader
          title="Kanji"
          backTo="/study"
          subtitle={initialDue === 0 ? "No cards due right now." : `${reviewedCount} / ${initialDue} reviewed`}
        />
        {initialDue > 0 && (
          <div className="mt-2">
            <ProgressBar value={reviewedCount} max={initialDue} />
          </div>
        )}
      </div>

      {current ? (
        <Flashcard
          key={current.id}
          front={current.char}
          back={
            <div className="flex flex-col gap-1">
              <div>音: {current.on}</div>
              <div>訓: {current.kun}</div>
              <div className="font-medium text-slate-900 dark:text-slate-50">{current.meaning}</div>
              <div className="text-xs text-slate-400">{current.strokes} strokes</div>
            </div>
          }
          onSpeak={() => speak(current.char)}
          onRate={(rating) => reviewItem(current.id, rating)}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-4xl">🎉</div>
          <p className="mt-2 font-semibold text-slate-900 dark:text-slate-50">All caught up!</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Come back later for more reviews, or check the Quiz page.
          </p>
        </div>
      )}
    </div>
  );
}
