import type { VocabCategory } from "./types";

export interface VocabCategoryMeta {
  key: VocabCategory;
  label: string;
  icon: string;
}

/** Display order for the vocab category picker. */
export const VOCAB_CATEGORIES: VocabCategoryMeta[] = [
  { key: "greetings", label: "Greetings & Expressions", icon: "👋" },
  { key: "people", label: "People & Family", icon: "👪" },
  { key: "places", label: "Places", icon: "🏠" },
  { key: "daily-life", label: "Daily Life", icon: "💼" },
  { key: "transportation", label: "Transportation", icon: "🚃" },
  { key: "food", label: "Food & Drink", icon: "🍚" },
  { key: "time", label: "Time", icon: "🕐" },
  { key: "nature", label: "Nature & Animals", icon: "🌤️" },
  { key: "verbs", label: "Verbs", icon: "🏃" },
  { key: "adjectives", label: "Adjectives", icon: "✨" },
  { key: "numbers", label: "Numbers", icon: "🔢" },
];
