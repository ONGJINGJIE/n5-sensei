import { NavLink, useLocation } from "react-router-dom";

interface Tab {
  to: string;
  label: string;
  icon: string;
  matchPrefixes: string[];
}

const TABS: Tab[] = [
  { to: "/", label: "Home", icon: "🏠", matchPrefixes: [] },
  { to: "/study", label: "Study", icon: "📚", matchPrefixes: ["/study", "/kana", "/vocab", "/kanji", "/learn"] },
  { to: "/reference", label: "Reference", icon: "📖", matchPrefixes: ["/reference", "/grammar", "/charts"] },
  { to: "/practice", label: "Practice", icon: "📝", matchPrefixes: ["/practice", "/quiz", "/listening"] },
  { to: "/settings", label: "Settings", icon: "⚙️", matchPrefixes: ["/settings"] },
];

export function BottomNav() {
  const location = useLocation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-900/95"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-2xl">
        {TABS.map((tab) => {
          const isActive =
            tab.to === "/" ? location.pathname === "/" : tab.matchPrefixes.some((p) => location.pathname.startsWith(p));
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={`flex min-h-[56px] flex-1 touch-manipulation flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium transition-colors active:bg-slate-100 dark:active:bg-slate-800 ${
                isActive ? "text-rose-600 dark:text-rose-400" : "text-slate-500 dark:text-slate-400"
              }`}
            >
              <span className="text-xl leading-none">{tab.icon}</span>
              {tab.label}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
