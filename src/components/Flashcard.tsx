import { useState, type ReactNode } from "react";
import type { Rating } from "../lib/srs";

interface FlashcardProps {
  front: ReactNode;
  back: ReactNode;
  onRate: (rating: Rating) => void;
  onSpeak?: () => void;
}

/** Mount with key={item.id} from the caller so state resets when the card changes. */

const RATING_BUTTONS: { rating: Rating; label: string; classes: string }[] = [
  { rating: "again", label: "Again", classes: "bg-red-600 active:bg-red-700" },
  { rating: "hard", label: "Hard", classes: "bg-orange-500 active:bg-orange-600" },
  { rating: "good", label: "Good", classes: "bg-emerald-600 active:bg-emerald-700" },
  { rating: "easy", label: "Easy", classes: "bg-sky-600 active:bg-sky-700" },
];

export function Flashcard({ front, back, onRate, onSpeak }: FlashcardProps) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <button
        type="button"
        onClick={() => setRevealed((r) => !r)}
        className="flex min-h-56 w-full max-w-md touch-manipulation flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm transition active:scale-[0.99] active:shadow-md dark:border-slate-800 dark:bg-slate-900"
      >
        <div className="text-5xl font-bold text-slate-900 dark:text-slate-50">{front}</div>
        {revealed && (
          <div className="mt-2 text-lg text-slate-600 dark:text-slate-300">{back}</div>
        )}
        {!revealed && (
          <div className="text-sm text-slate-400 dark:text-slate-500">Tap to reveal</div>
        )}
      </button>

      {onSpeak && (
        <button
          type="button"
          onClick={onSpeak}
          className="touch-manipulation rounded-full border border-slate-300 px-5 py-2.5 text-sm text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
        >
          🔊 Listen
        </button>
      )}

      {revealed && (
        <div className="grid w-full max-w-md grid-cols-4 gap-2">
          {RATING_BUTTONS.map((b) => (
            <button
              key={b.rating}
              type="button"
              className={`min-h-14 touch-manipulation rounded-xl px-2 py-3 text-sm font-semibold text-white transition-colors active:scale-95 ${b.classes}`}
              onClick={() => {
                setRevealed(false);
                onRate(b.rating);
              }}
            >
              {b.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
