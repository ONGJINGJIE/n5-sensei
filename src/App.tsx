import { HashRouter, Link, Route, Routes } from "react-router-dom";
import { BottomNav } from "./components/BottomNav";
import { useSettings } from "./hooks/useSettings";
import Dashboard from "./pages/Dashboard";
import StudyHub from "./pages/StudyHub";
import ReferenceHub from "./pages/ReferenceHub";
import PracticeHub from "./pages/PracticeHub";
import Kana from "./pages/Kana";
import Vocab from "./pages/Vocab";
import Kanji from "./pages/Kanji";
import Learn from "./pages/Learn";
import Grammar from "./pages/Grammar";
import Quiz from "./pages/Quiz";
import Listening from "./pages/Listening";
import Charts from "./pages/Charts";
import Search from "./pages/Search";
import Settings from "./pages/Settings";

function App() {
  useSettings();

  return (
    <HashRouter>
      <div className="min-h-svh bg-slate-50 pb-24 dark:bg-slate-950">
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <span className="text-lg font-bold text-rose-600 dark:text-rose-400">N5先生</span>
            <Link
              to="/search"
              aria-label="Search"
              className="flex h-10 w-10 touch-manipulation items-center justify-center rounded-full text-xl text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800"
            >
              🔍
            </Link>
          </div>
        </header>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/study" element={<StudyHub />} />
          <Route path="/reference" element={<ReferenceHub />} />
          <Route path="/practice" element={<PracticeHub />} />
          <Route path="/kana" element={<Kana />} />
          <Route path="/vocab" element={<Vocab />} />
          <Route path="/kanji" element={<Kanji />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/search" element={<Search />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
}

export default App;
