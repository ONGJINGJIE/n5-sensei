export interface FuriganaSegment {
  text: string;
  reading?: string;
}

const KANJI_RUN_WITH_READING = /([一-鿿々]+)\[([^\]]+)\]/g;

/**
 * Parses "私[わたし]は学生[がくせい]です。" into alternating plain/ruby segments.
 * Only a kanji run immediately followed by [reading] is treated as ruby text,
 * so surrounding kana and punctuation pass through untouched.
 */
export function parseFurigana(input: string): FuriganaSegment[] {
  const segments: FuriganaSegment[] = [];
  let lastIndex = 0;

  for (const match of input.matchAll(KANJI_RUN_WITH_READING)) {
    const [full, kanji, reading] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) {
      segments.push({ text: input.slice(lastIndex, index) });
    }
    segments.push({ text: kanji, reading });
    lastIndex = index + full.length;
  }

  if (lastIndex < input.length) {
    segments.push({ text: input.slice(lastIndex) });
  }

  return segments;
}

/** Strips [reading] markup, leaving plain Japanese text. */
export function stripFurigana(input: string): string {
  return input.replace(KANJI_RUN_WITH_READING, "$1");
}

/**
 * Replaces kanji[reading] markup with just the reading, producing an all-kana
 * string safe to hand to speech synthesis — kanji are frequently ambiguous
 * (e.g. 七 could be read しち or なな), so TTS should always speak the reading
 * we've already authored rather than guess from the kanji itself.
 */
export function toReadingText(input: string): string {
  return input.replace(KANJI_RUN_WITH_READING, "$2");
}

/** Picks a single reading to show as furigana for a kanji entry: first kun reading (minus okurigana), or first on reading. */
export function primaryKanjiReading(kun: string, on: string): string {
  const kunFirst = kun.split("、")[0];
  if (kunFirst && kunFirst !== "-") {
    return kunFirst.split("-")[0];
  }
  return on.split("、")[0] ?? "";
}
