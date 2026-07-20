import { useCallback, useEffect, useState } from "react";
import {
  type CardState,
  type Rating,
  isDue,
  newCardState,
  review as reviewCard,
} from "../lib/srs";
import { getItem, setItem, touchStreak } from "../lib/storage";

export type Deck = "vocab" | "kanji" | "kana";

function storageKey(deck: Deck) {
  return `srs:${deck}`;
}

function loadDeckStates(deck: Deck): Record<string, CardState> {
  return getItem(storageKey(deck), {});
}

export function useSRS(deck: Deck, itemIds: string[]) {
  const [states, setStates] = useState<Record<string, CardState>>(() => loadDeckStates(deck));

  useEffect(() => {
    setStates(loadDeckStates(deck));
  }, [deck]);

  const getState = useCallback((id: string) => states[id] ?? newCardState(), [states]);

  const dueIds = itemIds.filter((id) => isDue(states[id] ?? newCardState()));

  const reviewItem = useCallback(
    (id: string, rating: Rating) => {
      setStates((prev) => {
        const current = prev[id] ?? newCardState();
        const next = { ...prev, [id]: reviewCard(current, rating) };
        setItem(storageKey(deck), next);
        return next;
      });
      touchStreak();
    },
    [deck],
  );

  return { states, getState, dueIds, dueCount: dueIds.length, reviewItem };
}
