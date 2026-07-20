export interface KanaItem {
  id: string;
  char: string;
  romaji: string;
  type: "hiragana" | "katakana";
  group: "base" | "dakuten" | "handakuten" | "yoon";
}

export type VocabCategory =
  | "greetings"
  | "people"
  | "pronouns"
  | "places"
  | "daily-life"
  | "transportation"
  | "food"
  | "time"
  | "nature"
  | "verbs"
  | "adjectives"
  | "numbers";

export interface VocabItem {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  pos: string;
  category: VocabCategory;
}

export interface KanjiItem {
  id: string;
  char: string;
  on: string;
  kun: string;
  meaning: string;
  strokes: number;
}

export interface GrammarExample {
  /** Plain Japanese text, no furigana markup. */
  jp: string;
  /** Same sentence with kanji runs annotated as kanji[reading], e.g. "私[わたし]は学生[がくせい]です。" */
  furigana: string;
  en: string;
}

export interface GrammarItem {
  id: string;
  pattern: string;
  /** Pattern name with kanji runs annotated as kanji[reading]; identical to pattern when no kanji is present. */
  patternFurigana: string;
  explanation: string;
  examples: GrammarExample[];
}

export interface NumberedReading {
  num: number;
  kanji: string;
  reading: string;
  note?: string;
}

export interface TimeData {
  hours: NumberedReading[];
  minutes: NumberedReading[];
}

export interface DatesData {
  daysOfMonth: NumberedReading[];
  months: NumberedReading[];
}

export interface CounterItem {
  count: number;
  kanji: string;
  reading: string;
  note?: string;
}

export interface CounterGroup {
  id: string;
  counter: string;
  usage: string;
  items: CounterItem[];
}
