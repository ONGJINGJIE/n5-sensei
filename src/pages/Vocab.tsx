import { useMemo, useState } from "react";
import { VOCAB, VOCAB_CATEGORIES, type VocabItem, type VocabCategory } from "../data";
import { useSRS } from "../hooks/useSRS";
import { Flashcard } from "../components/Flashcard";
import { Furigana } from "../components/Furigana";
import { ProgressBar } from "../components/ProgressBar";
import { PageHeader } from "../components/PageHeader";
import { HubTile, DueBadge } from "../components/HubTile";
import { speak } from "../lib/tts";

type Selection = VocabCategory | "all";

export default function Vocab() {
  const allIds = useMemo(() => VOCAB.map((v) => v.id), []);
  const { dueIds, reviewItem } = useSRS("vocab", allIds);

  const byId = useMemo(() => {
    const map = new Map<string, VocabItem>();
    VOCAB.forEach((v) => map.set(v.id, v));
    return map;
  }, []);

  const totalByCategory = useMemo(() => {
    const counts: Partial<Record<VocabCategory, number>> = {};
    for (const item of VOCAB) {
      counts[item.category] = (counts[item.category] ?? 0) + 1;
    }
    return counts;
  }, []);

  const dueByCategory = useMemo(() => {
    const counts: Partial<Record<VocabCategory, number>> = {};
    for (const id of dueIds) {
      const cat = byId.get(id)?.category;
      if (cat) counts[cat] = (counts[cat] ?? 0) + 1;
    }
    return counts;
  }, [dueIds, byId]);

  const [selection, setSelection] = useState<Selection | null>(null);
  const [initialDue, setInitialDue] = useState(0);

  const openSelection = (sel: Selection) => {
    setSelection(sel);
    setInitialDue(sel === "all" ? dueIds.length : (dueByCategory[sel] ?? 0));
  };

  const scopedDueIds = useMemo(() => {
    if (!selection) return [];
    if (selection === "all") return dueIds;
    return dueIds.filter((id) => byId.get(id)?.category === selection);
  }, [selection, dueIds, byId]);

  const currentId = scopedDueIds[0];
  const current = currentId ? byId.get(currentId) : undefined;
  const reviewedCount = initialDue - scopedDueIds.length;

  if (!selection) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-6">
        <PageHeader
          title="Vocabulary"
          backTo="/study"
          subtitle={`${VOCAB.length} words across ${VOCAB_CATEGORIES.length} categories`}
        />
        <HubTile
          icon="🌐"
          label="All Words"
          description="Mixed review across every category"
          meta={<DueBadge due={dueIds.length} />}
          onClick={() => openSelection("all")}
        />
        {VOCAB_CATEGORIES.map((cat) => (
          <HubTile
            key={cat.key}
            icon={cat.icon}
            label={cat.label}
            description={`${totalByCategory[cat.key] ?? 0} words`}
            meta={<DueBadge due={dueByCategory[cat.key] ?? 0} />}
            onClick={() => openSelection(cat.key)}
          />
        ))}
      </div>
    );
  }

  const selectionLabel =
    selection === "all" ? "All Words" : (VOCAB_CATEGORIES.find((c) => c.key === selection)?.label ?? "Vocabulary");

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-4 py-6">
      <div className="w-full">
        <PageHeader
          title={selectionLabel}
          onBack={() => setSelection(null)}
          subtitle={initialDue === 0 ? "No cards due right now." : `${reviewedCount} / ${initialDue} reviewed`}
        />
        {initialDue > 0 && (
          <div className="mt-2">
            <ProgressBar value={reviewedCount} max={initialDue} />
          </div>
        )}
      </div>

      {current ? (
        <Flashcard
          key={current.id}
          front={<Furigana word={current.word} reading={current.reading} />}
          back={
            <div className="flex flex-col gap-1">
              <div className="font-medium text-slate-900 dark:text-slate-50">{current.meaning}</div>
              <div className="text-xs uppercase text-slate-400">{current.pos}</div>
            </div>
          }
          onSpeak={() => speak(current.reading)}
          onRate={(rating) => reviewItem(current.id, rating)}
        />
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center dark:border-slate-800 dark:bg-slate-900">
          <div className="text-4xl">🎉</div>
          <p className="mt-2 font-semibold text-slate-900 dark:text-slate-50">All caught up!</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Come back later for more reviews, or try a different category.
          </p>
        </div>
      )}
    </div>
  );
}
