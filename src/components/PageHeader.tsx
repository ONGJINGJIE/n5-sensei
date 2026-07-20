import { Link } from "react-router-dom";
import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  /** Route to navigate back to. Omit and pass onBack instead for in-page navigation (e.g. back to a category list). */
  backTo?: string;
  onBack?: () => void;
  trailing?: ReactNode;
}

const BACK_BUTTON_CLASSES =
  "flex h-11 w-11 shrink-0 touch-manipulation items-center justify-center rounded-full text-2xl text-slate-500 active:bg-slate-200 dark:text-slate-400 dark:active:bg-slate-700";

export function PageHeader({ title, subtitle, backTo, onBack, trailing }: PageHeaderProps) {
  return (
    <div className="mb-2 flex items-center gap-2">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label="Back" className={BACK_BUTTON_CLASSES}>
          ←
        </button>
      ) : (
        <Link to={backTo ?? "/"} aria-label="Back" className={BACK_BUTTON_CLASSES}>
          ←
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-2xl font-bold text-slate-900 dark:text-slate-50">{title}</h1>
        {subtitle && <div className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</div>}
      </div>
      {trailing}
    </div>
  );
}
