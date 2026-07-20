import { useMemo, useState } from "react";
import { GRAMMAR, type GrammarItem } from "../data";
import { QuizQuestion } from "../components/QuizQuestion";
import { FuriganaText } from "../components/Furigana";
import { PageHeader } from "../components/PageHeader";
import { shuffle } from "../lib/random";

export default function Grammar() {
  const [openId, setOpenId] = useState<string | null>(null);
  const [practiceId, setPracticeId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  const practiceItem = GRAMMAR.find((g) => g.id === practiceId);
  const choices = useMemo(() => {
    if (!practiceItem) return [];
    const distractors = shuffle(GRAMMAR.filter((g) => g.id !== practiceItem.id)).slice(0, 3);
    return shuffle<GrammarItem>([practiceItem, ...distractors]);
  }, [practiceItem]);

  const example = practiceItem?.examples[0];
  const correctIndex = practiceItem ? choices.findIndex((g) => g.id === practiceItem.id) : -1;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-8">
      <PageHeader title="Grammar" backTo="/reference" subtitle={`${GRAMMAR.length} points to browse`} />
      {GRAMMAR.map((g) => {
        const isOpen = openId === g.id;
        return (
          <div
            key={g.id}
            className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : g.id)}
              className="flex min-h-14 w-full touch-manipulation items-center justify-between px-4 py-3.5 text-left font-semibold text-slate-900 active:bg-slate-50 dark:text-slate-50 dark:active:bg-slate-800"
            >
              <span>
                <FuriganaText text={g.patternFurigana} />
              </span>
              <span className="text-slate-400">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 px-4 py-3 text-sm dark:border-slate-800">
                <p className="text-slate-600 dark:text-slate-300">{g.explanation}</p>
                <ul className="mt-2 space-y-1">
                  {g.examples.map((ex) => (
                    <li key={ex.jp} className="text-slate-800 dark:text-slate-200">
                      <FuriganaText text={ex.furigana} /> <span className="text-slate-400">— {ex.en}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={() => {
                    setPracticeId(g.id);
                    setFeedback(null);
                  }}
                  className="mt-3 touch-manipulation rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white active:bg-rose-700"
                >
                  Practice
                </button>
              </div>
            )}
          </div>
        );
      })}

      {practiceItem && example && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 dark:bg-slate-900">
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">
              Which grammar point fits this sentence?
            </p>
            <QuizQuestion
              key={practiceItem.id}
              prompt={
                <div className="flex flex-col gap-1">
                  <div>
                    <FuriganaText text={example.furigana} />
                  </div>
                  <div className="text-sm font-normal text-slate-400">{example.en}</div>
                </div>
              }
              options={choices.map((g) => <FuriganaText key={g.id} text={g.patternFurigana} />)}
              correctIndex={correctIndex}
              onAnswer={(correct) => setFeedback(correct ? "Correct!" : "Not quite — check the pattern again.")}
            />
            {feedback && (
              <p className="mt-3 text-center font-medium text-slate-700 dark:text-slate-200">{feedback}</p>
            )}
            <button
              type="button"
              onClick={() => setPracticeId(null)}
              className="mt-4 min-h-12 w-full touch-manipulation rounded-full border border-slate-300 py-3 text-sm font-semibold text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
