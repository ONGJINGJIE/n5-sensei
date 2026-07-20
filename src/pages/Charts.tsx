import { useState } from "react";
import { TIME, DATES, COUNTERS, type NumberedReading, type CounterGroup } from "../data";
import { ReadingGrid, type ReadingGridItem } from "../components/ReadingGrid";
import { PageHeader } from "../components/PageHeader";

type Tab = "time" | "dates" | "counters";

function toGridItems(prefix: string, entries: NumberedReading[]): ReadingGridItem[] {
  return entries.map((e) => ({
    id: `${prefix}-${e.num}`,
    display: e.kanji,
    reveal: e.note ? `${e.reading} (${e.note})` : e.reading,
    speakText: e.reading,
  }));
}

function TimeTab() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Hours — 時</h2>
        <ReadingGrid items={toGridItems("hour", TIME.hours)} columns="grid-cols-3 sm:grid-cols-4" />
      </section>
      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Minutes — 分</h2>
        <ReadingGrid items={toGridItems("min", TIME.minutes)} columns="grid-cols-3 sm:grid-cols-4" />
      </section>
    </div>
  );
}

function DatesTab() {
  return (
    <div className="flex flex-col gap-6">
      <p className="rounded-lg bg-amber-100 px-4 py-2 text-sm text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">
        Watch out: 一日 as "the 1st of the month" is ついたち, but 一日 meaning "one day" (a duration) is いちにち — same
        kanji, different reading depending on meaning.
      </p>
      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Day of the month — 日</h2>
        <ReadingGrid items={toGridItems("day", DATES.daysOfMonth)} columns="grid-cols-3 sm:grid-cols-4" />
      </section>
      <section>
        <h2 className="mb-2 text-sm font-semibold text-slate-500 dark:text-slate-400">Month — 月</h2>
        <ReadingGrid items={toGridItems("month", DATES.months)} columns="grid-cols-3 sm:grid-cols-4" />
      </section>
    </div>
  );
}

function CounterSection({ group }: { group: CounterGroup }) {
  const [open, setOpen] = useState(false);
  const items: ReadingGridItem[] = group.items.map((it) => ({
    id: `${group.id}-${it.count}`,
    display: it.kanji,
    reveal: it.note ? `${it.reading} (${it.note})` : it.reading,
    speakText: it.reading,
  }));

  return (
    <div className="rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-14 w-full touch-manipulation items-center justify-between px-4 py-3.5 text-left active:bg-slate-50 dark:active:bg-slate-800"
      >
        <div>
          <div className="font-semibold text-slate-900 dark:text-slate-50">{group.counter}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{group.usage}</div>
        </div>
        <span className="text-slate-400">{open ? "−" : "+"}</span>
      </button>
      {open && (
        <div className="border-t border-slate-100 p-4 dark:border-slate-800">
          <ReadingGrid items={items} columns="grid-cols-3 sm:grid-cols-4" />
        </div>
      )}
    </div>
  );
}

function CountersTab() {
  return (
    <div className="flex flex-col gap-3">
      {COUNTERS.map((group) => (
        <CounterSection key={group.id} group={group} />
      ))}
    </div>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: "time", label: "Time" },
  { id: "dates", label: "Dates" },
  { id: "counters", label: "Counters" },
];

export default function Charts() {
  const [tab, setTab] = useState<Tab>("time");

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
      <PageHeader title="Time, Dates & Counters" backTo="/reference" subtitle="Tap any tile to hear it." />

      <div className="flex gap-1 rounded-full border border-slate-200 p-1 dark:border-slate-800">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`touch-manipulation flex-1 rounded-full px-3 py-2.5 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-rose-600 text-white"
                : "text-slate-600 active:bg-slate-100 dark:text-slate-300 dark:active:bg-slate-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "time" && <TimeTab />}
      {tab === "dates" && <DatesTab />}
      {tab === "counters" && <CountersTab />}
    </div>
  );
}
