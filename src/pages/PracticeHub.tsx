import { HubTile } from "../components/HubTile";

export default function PracticeHub() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-3 px-4 py-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">Practice</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Test yourself across everything you've learned.</p>
      </div>

      <HubTile icon="📝" label="Mock Quiz" description="10 mixed vocab / kanji / grammar questions" to="/quiz" />
      <HubTile icon="🔊" label="Listening" description="Audio recognition practice" to="/listening" />
    </div>
  );
}
