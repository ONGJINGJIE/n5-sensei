import { GRAMMAR } from "../data";
import { HubTile } from "../components/HubTile";

export default function ReferenceHub() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Reference</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Look things up any time.</p>
      </div>

      <HubTile icon="📖" label="Grammar" description={`${GRAMMAR.length} points, browsable`} to="/grammar" />
      <HubTile
        icon="🗓️"
        label="Time, Dates & Counters"
        description="Hours, days, months, counting items"
        to="/charts"
      />
    </div>
  );
}
