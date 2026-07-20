import kanaJson from "./kana.json";
import vocabJson from "./vocab.json";
import kanjiJson from "./kanji.json";
import grammarJson from "./grammar.json";
import timeJson from "./time.json";
import datesJson from "./dates.json";
import countersJson from "./counters.json";
import type {
  KanaItem,
  VocabItem,
  KanjiItem,
  GrammarItem,
  TimeData,
  DatesData,
  CounterGroup,
} from "./types";

export const KANA: KanaItem[] = kanaJson as KanaItem[];
export const VOCAB: VocabItem[] = vocabJson as VocabItem[];
export const KANJI: KanjiItem[] = kanjiJson as KanjiItem[];
export const GRAMMAR: GrammarItem[] = grammarJson as GrammarItem[];
export const TIME: TimeData = timeJson as TimeData;
export const DATES: DatesData = datesJson as DatesData;
export const COUNTERS: CounterGroup[] = countersJson as CounterGroup[];

export { VOCAB_CATEGORIES } from "./vocabCategories";
export type { VocabCategoryMeta } from "./vocabCategories";

export type {
  KanaItem,
  VocabItem,
  KanjiItem,
  GrammarItem,
  TimeData,
  DatesData,
  CounterGroup,
  NumberedReading,
  CounterItem,
  VocabCategory,
} from "./types";
