import { parseFurigana } from "../lib/furigana";

/** Renders a single vocab-style word with its whole-word reading as furigana. */
export function Furigana({ word, reading }: { word: string; reading: string }) {
  if (word === reading) return <>{word}</>;
  return (
    <ruby>
      {word}
      <rt className="text-[0.55em] font-normal text-slate-400 dark:text-slate-500">{reading}</rt>
    </ruby>
  );
}

/** Renders bracket-annotated text, e.g. "私[わたし]は学生[がくせい]です。" */
export function FuriganaText({ text }: { text: string }) {
  const segments = parseFurigana(text);
  return (
    <>
      {segments.map((seg, i) =>
        seg.reading ? (
          <ruby key={i}>
            {seg.text}
            <rt className="text-[0.55em] font-normal text-slate-400 dark:text-slate-500">
              {seg.reading}
            </rt>
          </ruby>
        ) : (
          <span key={i}>{seg.text}</span>
        ),
      )}
    </>
  );
}
