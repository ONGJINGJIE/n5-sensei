import { useMemo, useState, type ReactNode } from "react";
import { VOCAB, KANJI, GRAMMAR, KANA } from "../data";
import { Furigana, FuriganaText } from "../components/Furigana";
import { PageHeader } from "../components/PageHeader";
import { speak } from "../lib/tts";
import { primaryKanjiReading, toReadingText } from "../lib/furigana";

const MAX_RESULTS = 25;

function matches(query: string, ...fields: string[]): boolean {
  const q = query.toLowerCase();
  return fields.some((f) => f.toLowerCase().includes(q));
}

function ResultSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-semibold text-slate-500 dark:text-slate-400">{title}</h2>
      <div className="flex flex-col gap-2">{children}</div>
    </section>
  );
}

function SpeakButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      onClick={() => speak(text)}
      aria-label="Listen"
      className="flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full border border-slate-300 text-lg text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
    >
      🔊
    </button>
  );
}

export default function Search() {
  const [query, setQuery] = useState("");
  const trimmed = query.trim();

  const vocabResults = useMemo(() => {
    if (!trimmed) return [];
    return VOCAB.filter((v) => matches(trimmed, v.word, v.reading, v.meaning)).slice(0, MAX_RESULTS);
  }, [trimmed]);

  const kanjiResults = useMemo(() => {
    if (!trimmed) return [];
    return KANJI.filter((k) => matches(trimmed, k.char, k.on, k.kun, k.meaning)).slice(0, MAX_RESULTS);
  }, [trimmed]);

  const grammarResults = useMemo(() => {
    if (!trimmed) return [];
    return GRAMMAR.filter((g) =>
      matches(trimmed, g.pattern, g.explanation, ...g.examples.flatMap((e) => [e.jp, e.en])),
    ).slice(0, MAX_RESULTS);
  }, [trimmed]);

  const kanaResults = useMemo(() => {
    if (!trimmed) return [];
    return KANA.filter((k) => matches(trimmed, k.char, k.romaji)).slice(0, MAX_RESULTS);
  }, [trimmed]);

  const totalResults = vocabResults.length + kanjiResults.length + grammarResults.length + kanaResults.length;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-4 py-6">
      <PageHeader title="Search" backTo="/" />

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search vocab, kanji, grammar…"
          autoFocus
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-base text-slate-900 placeholder:text-slate-400 focus:border-rose-400 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 touch-manipulation items-center justify-center rounded-full text-slate-400 active:bg-slate-100 dark:active:bg-slate-800"
          >
            ✕
          </button>
        )}
      </div>

      {!trimmed && (
        <p className="text-center text-sm text-slate-400">Search by Japanese word, reading, or English meaning.</p>
      )}

      {trimmed && totalResults === 0 && (
        <p className="text-center text-sm text-slate-400">No results for "{trimmed}".</p>
      )}

      {vocabResults.length > 0 && (
        <ResultSection title={`Vocabulary (${vocabResults.length})`}>
          {vocabResults.map((v) => (
            <div
              key={v.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  <Furigana word={v.word} reading={v.reading} />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{v.meaning}</div>
                <div className="text-xs uppercase text-slate-400">{v.pos}</div>
              </div>
              <SpeakButton text={v.reading} />
            </div>
          ))}
        </ResultSection>
      )}

      {kanjiResults.length > 0 && (
        <ResultSection title={`Kanji (${kanjiResults.length})`}>
          {kanjiResults.map((k) => (
            <div
              key={k.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
            >
              <div>
                <div className="text-lg font-bold text-slate-900 dark:text-slate-50">
                  <Furigana word={k.char} reading={primaryKanjiReading(k.kun, k.on)} />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{k.meaning}</div>
                <div className="text-xs text-slate-400">
                  音 {k.on} · 訓 {k.kun}
                </div>
              </div>
              <SpeakButton text={primaryKanjiReading(k.kun, k.on)} />
            </div>
          ))}
        </ResultSection>
      )}

      {grammarResults.length > 0 && (
        <ResultSection title={`Grammar (${grammarResults.length})`}>
          {grammarResults.map((g) => {
            const example = g.examples[0];
            return (
              <div
                key={g.id}
                className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-lg font-bold text-slate-900 dark:text-slate-50">
                    <FuriganaText text={g.patternFurigana} />
                  </div>
                  <SpeakButton text={toReadingText(example.furigana)} />
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300">{g.explanation}</div>
                <div className="mt-1 text-sm text-slate-800 dark:text-slate-200">
                  <FuriganaText text={example.furigana} /> <span className="text-slate-400">— {example.en}</span>
                </div>
              </div>
            );
          })}
        </ResultSection>
      )}

      {kanaResults.length > 0 && (
        <ResultSection title={`Kana (${kanaResults.length})`}>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
            {kanaResults.map((k) => (
              <button
                key={k.id}
                type="button"
                onClick={() => speak(k.char)}
                className="flex aspect-square touch-manipulation flex-col items-center justify-center rounded-xl border border-slate-200 bg-white transition active:scale-95 active:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:active:bg-slate-800"
              >
                <span className="text-xl font-bold text-slate-900 dark:text-slate-50">{k.char}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{k.romaji}</span>
              </button>
            ))}
          </div>
        </ResultSection>
      )}
    </div>
  );
}
