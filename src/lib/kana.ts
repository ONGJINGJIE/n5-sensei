const KATAKANA_TO_HIRAGANA_OFFSET = 0x60;

/**
 * Converts full-width katakana to hiragana; everything else passes through untouched.
 * Kanji on-readings are stored in katakana, so without this a hiragana search query
 * (the natural way to type a reading) would never match them.
 */
export function toHiragana(input: string): string {
  return input.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - KATAKANA_TO_HIRAGANA_OFFSET));
}
