import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { VOCAB, KANJI, KANA } from "../data";
import { useSRS } from "../hooks/useSRS";
import { getStreak } from "../lib/storage";

export default function Dashboard() {
  const vocabIds = useMemo(() => VOCAB.map((v) => v.id), []);
  const kanjiIds = useMemo(() => KANJI.map((k) => k.id), []);
  const kanaIds = useMemo(() => KANA.map((k) => k.id), []);

  const vocabSRS = useSRS("vocab", vocabIds);
  const kanjiSRS = useSRS("kanji", kanjiIds);
  const kanaSRS = useSRS("kana", kanaIds);

  const [streak, setStreak] = useState(0);
  useEffect(() => {
    setStreak(getStreak());
  }, [vocabSRS.dueCount, kanjiSRS.dueCount, kanaSRS.dueCount]);

  const totalDue = vocabSRS.dueCount + kanjiSRS.dueCount + kanaSRS.dueCount;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
          がんばって! Let's study N5
        </h1>
      </div>

      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <span className="text-3xl">🔥</span>
        <div>
          <div className="text-xl font-bold text-slate-900 dark:text-slate-50">{streak} day streak</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Review any deck today to keep it going.</div>
        </div>
      </div>

      <Link
        to="/study"
        className="flex touch-manipulation flex-col gap-1 rounded-2xl bg-rose-600 p-6 text-white transition active:scale-[0.98] active:bg-rose-700"
      >
        <span className="text-sm font-medium opacity-90">
          {totalDue > 0 ? "Cards due today" : "All caught up"}
        </span>
        <span className="text-4xl font-bold">{totalDue}</span>
        <span className="mt-1 text-sm opacity-90">
          {totalDue > 0 ? "Tap to start reviewing →" : "Great job — check back tomorrow"}
        </span>
      </Link>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-2xl">あ</div>
          <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">{kanaSRS.dueCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Kana due</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-2xl">言</div>
          <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">{vocabSRS.dueCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Vocab due</div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-2xl">漢</div>
          <div className="mt-1 text-lg font-bold text-slate-900 dark:text-slate-50">{kanjiSRS.dueCount}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Kanji due</div>
        </div>
      </div>
    </div>
  );
}
