import { useState } from "react";
import { speak } from "../lib/tts";

export interface ReadingGridItem {
  id: string;
  display: string;
  reveal: string;
  /** Text to hand to speech synthesis; defaults to `reveal` (an all-kana reading is what TTS should get, not kanji/numerals). */
  speakText?: string;
}

interface ReadingGridProps {
  items: ReadingGridItem[];
  columns?: string;
}

export function ReadingGrid({
  items,
  columns = "grid-cols-4 sm:grid-cols-5 md:grid-cols-6",
}: ReadingGridProps) {
  const [revealedId, setRevealedId] = useState<string | null>(null);

  return (
    <div className={`grid gap-2 ${columns}`}>
      {items.map((item) => {
        const revealed = revealedId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              setRevealedId(item.id);
              speak(item.speakText ?? item.reveal);
            }}
            className="flex aspect-square min-h-14 touch-manipulation flex-col items-center justify-center rounded-xl border border-slate-200 bg-white p-1 text-center transition active:scale-95 active:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:active:bg-slate-800"
          >
            <span className="text-lg font-bold leading-tight text-slate-900 dark:text-slate-50">
              {item.display}
            </span>
            <span
              className={`text-xs leading-tight text-slate-500 dark:text-slate-400 ${revealed ? "opacity-100" : "opacity-0"}`}
            >
              {item.reveal}
            </span>
          </button>
        );
      })}
    </div>
  );
}
