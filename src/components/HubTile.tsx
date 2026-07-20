import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface HubTileProps {
  icon: string;
  label: string;
  description?: string;
  meta?: ReactNode;
  /** Route to navigate to. Omit and pass onClick instead for in-page navigation (e.g. opening a category). */
  to?: string;
  onClick?: () => void;
}

const TILE_CLASSES =
  "flex min-h-[72px] w-full touch-manipulation items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left transition active:scale-[0.98] active:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:active:bg-slate-800";

export function HubTile({ icon, label, description, meta, to, onClick }: HubTileProps) {
  const content = (
    <>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="text-left">
          <div className="font-semibold text-slate-900 dark:text-slate-50">{label}</div>
          {description && <div className="text-xs text-slate-500 dark:text-slate-400">{description}</div>}
        </div>
      </div>
      {meta}
      <span className="text-slate-300 dark:text-slate-600">›</span>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={TILE_CLASSES}>
        {content}
      </button>
    );
  }

  return (
    <Link to={to ?? "#"} className={TILE_CLASSES}>
      {content}
    </Link>
  );
}

export function DueBadge({ due }: { due: number }) {
  return (
    <span
      className={`shrink-0 rounded-full px-3 py-1 text-sm font-bold ${
        due > 0
          ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
          : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
      }`}
    >
      {due} due
    </span>
  );
}
