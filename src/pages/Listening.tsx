import { useState } from "react";
import { VOCAB, type VocabItem } from "../data";
import { QuizQuestion } from "../components/QuizQuestion";
import { hasJapaneseVoice, isTTSSupported, speak } from "../lib/tts";
import { shuffle } from "../lib/random";
import { PageHeader } from "../components/PageHeader";

interface ListeningQuestion {
  key: string;
  item: VocabItem;
  options: string[];
  correctIndex: number;
}

function buildQuestion(): ListeningQuestion {
  const shuffled = shuffle(VOCAB);
  const item = shuffled[0];
  const distractors = shuffled.slice(1, 4).map((v) => v.meaning);
  const options = shuffle([item.meaning, ...distractors]);
  return {
    key: `${item.id}-${Math.random()}`,
    item,
    options,
    correctIndex: options.indexOf(item.meaning),
  };
}

export default function Listening() {
  const [question, setQuestion] = useState(() => buildQuestion());
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [answered, setAnswered] = useState(false);

  const ttsSupported = isTTSSupported();
  const voiceAvailable = hasJapaneseVoice();

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    setRounds((r) => r + 1);
    if (correct) setScore((s) => s + 1);
  };

  const next = () => {
    setQuestion(buildQuestion());
    setAnswered(false);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-8">
      <PageHeader title="Listening" backTo="/practice" subtitle={`Score ${score} / ${rounds}`} />

      {!ttsSupported && (
        <p className="rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          Your browser doesn't support speech synthesis, so listening playback isn't available here.
        </p>
      )}
      {ttsSupported && !voiceAvailable && (
        <p className="rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
          No Japanese voice was found on this device — playback may fall back to a default voice or stay silent.
        </p>
      )}

      {ttsSupported && (
        <button
          type="button"
          onClick={() => speak(question.item.reading)}
          className="min-h-14 touch-manipulation rounded-full bg-rose-600 px-6 py-3 text-lg font-semibold text-white active:bg-rose-700"
        >
          🔊 Play word
        </button>
      )}

      <QuizQuestion
        key={question.key}
        prompt="What does the word mean?"
        options={question.options}
        correctIndex={question.correctIndex}
        onAnswer={handleAnswer}
      />

      {answered && (
        <button
          type="button"
          onClick={next}
          className="min-h-12 touch-manipulation rounded-full border border-slate-300 px-6 py-3 font-semibold text-slate-600 active:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
        >
          Next word
        </button>
      )}
    </div>
  );
}
