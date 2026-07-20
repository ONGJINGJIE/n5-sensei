import { useState, type ReactNode } from "react";

interface QuizQuestionProps {
  prompt: ReactNode;
  options: ReactNode[];
  correctIndex: number;
  onAnswer: (correct: boolean) => void;
}

/** Mount with a key that changes per question so selection state resets. */
export function QuizQuestion({ prompt, options, correctIndex, onAnswer }: QuizQuestionProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const handleSelect = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    onAnswer(index === correctIndex);
  };

  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center text-2xl font-bold text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
        {prompt}
      </div>
      <div className="flex flex-col gap-2">
        {options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrectOption = index === correctIndex;
          let style =
            "border-slate-200 bg-white active:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:active:bg-slate-800";
          if (selected !== null) {
            if (isCorrectOption) {
              style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40";
            } else if (isSelected) {
              style = "border-red-500 bg-red-50 dark:bg-red-950/40";
            } else {
              style = "border-slate-200 bg-white opacity-60 dark:border-slate-800 dark:bg-slate-900";
            }
          }
          return (
            <button
              key={index}
              type="button"
              disabled={selected !== null}
              onClick={() => handleSelect(index)}
              className={`min-h-14 touch-manipulation rounded-xl border px-4 py-4 text-left text-base font-medium text-slate-800 transition-colors active:scale-[0.99] disabled:active:scale-100 dark:text-slate-100 ${style}`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
