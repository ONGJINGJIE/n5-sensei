import { useMemo, useState } from "react";
import { GRAMMAR, type GrammarItem } from "../data";
import { FuriganaText } from "../components/Furigana";
import { QuizQuestion } from "../components/QuizQuestion";
import { ProgressBar } from "../components/ProgressBar";
import { PageHeader } from "../components/PageHeader";
import { useLearnProgress } from "../hooks/useLearnProgress";
import { shuffle } from "../lib/random";
import { toReadingText } from "../lib/furigana";
import { speak } from "../lib/tts";

export default function Learn() {
  const { completed, markCompleted, index, setIndex } = useLearnProgress(GRAMMAR.length);
  const [quizAttempt, setQuizAttempt] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const lesson = GRAMMAR[index];
  const isLast = index === GRAMMAR.length - 1;
  const isLessonLearned = completed.includes(lesson.id);

  const choices = useMemo(() => {
    const distractors = shuffle(GRAMMAR.filter((g) => g.id !== lesson.id)).slice(0, 3);
    return shuffle<GrammarItem>([lesson, ...distractors]);
    // quizAttempt is a deliberate dependency: it forces a fresh shuffle on "Try again"
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id, quizAttempt]);
  const correctIndex = choices.findIndex((g) => g.id === lesson.id);
  const checkExample = lesson.examples[0];

  const goTo = (i: number) => {
    setIndex(i);
    setFeedback(null);
    setQuizAttempt((a) => a + 1);
  };

  const retry = () => {
    setFeedback(null);
    setQuizAttempt((a) => a + 1);
  };

  const handleCheckAnswer = (correct: boolean) => {
    if (correct) {
      markCompleted(lesson.id);
      setFeedback("correct");
    } else {
      setFeedback("incorrect");
    }
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <div>
        <PageHeader
          title="Learn Grammar"
          backTo="/study"
          subtitle={`Lesson ${index + 1} / ${GRAMMAR.length} · ${completed.length} learned`}
        />
        <div className="mt-2">
          <ProgressBar value={completed.length} max={GRAMMAR.length} />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {GRAMMAR.map((g, i) => {
          const isCurrent = i === index;
          const isDone = completed.includes(g.id);
          return (
            <button
              key={g.id}
              type="button"
              onClick={() => goTo(i)}
              className={`flex h-11 w-11 touch-manipulation items-center justify-center rounded-full text-sm font-semibold transition-colors active:scale-95 ${
                isCurrent
                  ? "bg-rose-600 text-white"
                  : isDone
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                    : "bg-slate-100 text-slate-500 active:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:active:bg-slate-700"
              }`}
            >
              {isDone && !isCurrent ? "✓" : i + 1}
            </button>
          );
        })}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            <FuriganaText text={lesson.patternFurigana} />
          </h2>
          {isLessonLearned && (
            <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
              ✓ Learned
            </span>
          )}
        </div>
        <p className="mt-2 text-slate-600 dark:text-slate-300">{lesson.explanation}</p>

        <div className="mt-4 flex flex-col gap-2">
          {lesson.examples.map((ex) => (
            <div
              key={ex.jp}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60"
            >
              <div>
                <div className="text-slate-900 dark:text-slate-50">
                  <FuriganaText text={ex.furigana} />
                </div>
                <div className="text-sm text-slate-400">{ex.en}</div>
              </div>
              <button
                type="button"
                onClick={() => speak(toReadingText(ex.furigana))}
                className="h-11 w-11 shrink-0 touch-manipulation rounded-full border border-slate-300 text-lg text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-700"
              >
                🔊
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
          Quick check — which pattern does this sentence use?
        </p>
        <QuizQuestion
          key={`${lesson.id}-${quizAttempt}`}
          prompt={<FuriganaText text={checkExample.furigana} />}
          options={choices.map((g) => <FuriganaText key={g.id} text={g.patternFurigana} />)}
          correctIndex={correctIndex}
          onAnswer={handleCheckAnswer}
        />
        {feedback === "correct" && (
          <p className="mt-3 text-center font-medium text-emerald-600 dark:text-emerald-400">
            Correct! Nice work.
          </p>
        )}
        {feedback === "incorrect" && (
          <div className="mt-3 flex flex-col items-center gap-2">
            <p className="text-center font-medium text-red-600 dark:text-red-400">
              Not quite — review the explanation above, then try again.
            </p>
            <button
              type="button"
              onClick={retry}
              className="min-h-12 touch-manipulation rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
            >
              Try again
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => goTo(index - 1)}
          className="min-h-12 touch-manipulation rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-600 active:bg-slate-100 disabled:opacity-40 disabled:active:bg-transparent dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
        >
          Previous
        </button>
        {isLast ? (
          <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
            🎉 You've reached the last lesson.
          </p>
        ) : (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            className="min-h-12 touch-manipulation rounded-full bg-rose-600 px-5 py-3 text-sm font-semibold text-white active:bg-rose-700"
          >
            Next Lesson
          </button>
        )}
      </div>
    </div>
  );
}
