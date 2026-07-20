import { useMemo } from "react";
import { VOCAB, KANJI, KANA, GRAMMAR } from "../data";
import { useSRS } from "../hooks/useSRS";
import { useLearnProgress } from "../hooks/useLearnProgress";
import { HubTile, DueBadge } from "../components/HubTile";

export default function StudyHub() {
  const vocabIds = useMemo(() => VOCAB.map((v) => v.id), []);
  const kanjiIds = useMemo(() => KANJI.map((k) => k.id), []);
  const kanaIds = useMemo(() => KANA.map((k) => k.id), []);

  const vocabSRS = useSRS("vocab", vocabIds);
  const kanjiSRS = useSRS("kanji", kanjiIds);
  const kanaSRS = useSRS("kana", kanaIds);
  const { completed: learnedGrammar } = useLearnProgress(GRAMMAR.length);

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Study</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Review decks and learn new grammar.</p>
      </div>

      <HubTile
        icon="あ"
        label="Kana"
        description={`${kanaIds.length} characters`}
        to="/kana"
        meta={<DueBadge due={kanaSRS.dueCount} />}
      />
      <HubTile
        icon="言"
        label="Vocabulary"
        description={`${vocabIds.length} words`}
        to="/vocab"
        meta={<DueBadge due={vocabSRS.dueCount} />}
      />
      <HubTile
        icon="漢"
        label="Kanji"
        description={`${kanjiIds.length} characters`}
        to="/kanji"
        meta={<DueBadge due={kanjiSRS.dueCount} />}
      />
      <HubTile
        icon="🎓"
        label="Learn Grammar"
        description={`${learnedGrammar.length} / ${GRAMMAR.length} lessons`}
        to="/learn"
      />
    </div>
  );
}
