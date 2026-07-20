import { useCallback, useState } from "react";
import { getItem, setItem } from "../lib/storage";

const COMPLETED_KEY = "learn:completed";
const INDEX_KEY = "learn:index";

export function useLearnProgress(total: number) {
  const [completed, setCompleted] = useState<string[]>(() => getItem(COMPLETED_KEY, []));
  const [index, setIndexState] = useState<number>(() => {
    const saved = getItem(INDEX_KEY, 0);
    return Math.min(Math.max(saved, 0), total - 1);
  });

  const markCompleted = useCallback((id: string) => {
    setCompleted((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      setItem(COMPLETED_KEY, next);
      return next;
    });
  }, []);

  const setIndex = useCallback(
    (i: number) => {
      const clamped = Math.min(Math.max(i, 0), total - 1);
      setIndexState(clamped);
      setItem(INDEX_KEY, clamped);
    },
    [total],
  );

  return { completed, markCompleted, index, setIndex };
}
