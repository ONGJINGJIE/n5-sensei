import { useState, type ReactNode } from "react";
import { VOCAB, KANJI, GRAMMAR, type GrammarItem } from "../data";
import { QuizQuestion } from "../components/QuizQuestion";
import { Furigana, FuriganaText } from "../components/Furigana";
import { primaryKanjiReading, toReadingText } from "../lib/furigana";
import { speak } from "../lib/tts";
import { shuffle, sample } from "../lib/random";
import { PageHeader } from "../components/PageHeader";

interface Question {
  id: string;
  instruction: string;
  prompt: ReactNode;
  /** All-kana reading (no kanji, no furigana markup) to read aloud — avoids TTS guessing the wrong reading for ambiguous kanji. */
  speakText: string;
  options: ReactNode[];
  correctIndex: number;
}

function buildVocabQuestion(): Question {
  const item = sample(VOCAB, 1)[0];
  const distractors = sample(
    VOCAB.filter((v) => v.id !== item.id),
    3,
  ).map((v) => v.meaning);
  const options = shuffle([item.meaning, ...distractors]);
  return {
    id: `vocab-${item.id}-${Math.random()}`,
    instruction: "What does this word mean?",
    prompt: <Furigana word={item.word} reading={item.reading} />,
    speakText: item.reading,
    options,
    correctIndex: options.indexOf(item.meaning),
  };
}

function buildKanjiQuestion(): Question {
  const item = sample(KANJI, 1)[0];
  const distractors = sample(
    KANJI.filter((k) => k.id !== item.id),
    3,
  ).map((k) => k.meaning);
  const options = shuffle([item.meaning, ...distractors]);
  const reading = primaryKanjiReading(item.kun, item.on);
  return {
    id: `kanji-${item.id}-${Math.random()}`,
    instruction: "What does this kanji mean?",
    prompt: <Furigana word={item.char} reading={reading} />,
    speakText: reading,
    options,
    correctIndex: options.indexOf(item.meaning),
  };
}

function buildGrammarQuestion(): Question {
  const item = sample(GRAMMAR, 1)[0];
  const example = item.examples[0];
  const distractors = sample(
    GRAMMAR.filter((g) => g.id !== item.id),
    3,
  );
  const choices = shuffle<GrammarItem>([item, ...distractors]);
  return {
    id: `grammar-${item.id}-${Math.random()}`,
    instruction: "Which grammar point fits this sentence?",
    prompt: (
      <div className="flex flex-col gap-1">
        <div>
          <FuriganaText text={example.furigana} />
        </div>
        <div className="text-sm font-normal text-slate-400">{example.en}</div>
      </div>
    ),
    speakText: toReadingText(example.furigana),
    options: choices.map((g) => <FuriganaText key={g.id} text={g.patternFurigana} />),
    correctIndex: choices.findIndex((g) => g.id === item.id),
  };
}

const BUILDERS = [buildVocabQuestion, buildKanjiQuestion, buildGrammarQuestion];
const QUESTION_COUNT = 10;

function buildQuiz(): Question[] {
  return Array.from({ length: QUESTION_COUNT }, () => {
    const builder = BUILDERS[Math.floor(Math.random() * BUILDERS.length)];
    return builder();
  });
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>(() => buildQuiz());
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);

  const current = questions[index];
  const finished = index >= questions.length;

  const handleAnswer = (correct: boolean) => {
    setAnswered(true);
    if (correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setAnswered(false);
    setIndex((i) => i + 1);
  };

  const restart = () => {
    setQuestions(buildQuiz());
    setIndex(0);
    setScore(0);
    setAnswered(false);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-8">
      <PageHeader
        title="Mock Quiz"
        backTo="/practice"
        subtitle={!finished && `Question ${index + 1} / ${questions.length} · Score ${score}`}
      />

      {!finished && current && (
        <>
          <p className="text-sm text-slate-500 dark:text-slate-400">{current.instruction}</p>
          <button
            type="button"
            onClick={() => speak(current.speakText)}
            className="min-h-11 touch-manipulation rounded-full border border-slate-300 px-5 py-2.5 text-sm text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
          >
            🔊 Listen
          </button>
          <QuizQuestion
            key={current.id}
            prompt={current.prompt}
            options={current.options}
            correctIndex={current.correctIndex}
            onAnswer={handleAnswer}
          />
          {answered && (
            <button
              type="button"
              onClick={handleNext}
              className="min-h-12 w-full max-w-md touch-manipulation rounded-full bg-rose-600 px-6 py-3 font-semibold text-white active:bg-rose-700"
            >
              {index + 1 === questions.length ? "See results" : "Next"}
            </button>
          )}
        </>
      )}

      {finished && (
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-4xl">📝</div>
          <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-50">
            {score} / {questions.length}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {score === questions.length ? "Perfect score!" : "Keep practicing!"}
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-4 rounded-full bg-rose-600 px-6 py-2 font-semibold text-white hover:bg-rose-700"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
