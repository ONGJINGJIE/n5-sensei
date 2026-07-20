const KATAKANA_TO_HIRAGANA_OFFSET = 0x60;

/**
 * Converts full-width katakana to hiragana; everything else passes through untouched.
 * Kanji on-readings are stored in katakana, so without this a hiragana search query
 * (the natural way to type a reading) would never match them.
 */
export function toHiragana(input: string): string {
  return input.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - KATAKANA_TO_HIRAGANA_OFFSET));
}

// Longest romaji sequences first so greedy matching prefers "kya" over "ka" + "ya".
const ROMAJI_TO_HIRAGANA: [string, string][] = [
  ["kya", "きゃ"], ["kyu", "きゅ"], ["kyo", "きょ"],
  ["gya", "ぎゃ"], ["gyu", "ぎゅ"], ["gyo", "ぎょ"],
  ["sha", "しゃ"], ["shu", "しゅ"], ["sho", "しょ"],
  ["sya", "しゃ"], ["syu", "しゅ"], ["syo", "しょ"],
  ["ja", "じゃ"], ["ju", "じゅ"], ["jo", "じょ"],
  ["zya", "じゃ"], ["zyu", "じゅ"], ["zyo", "じょ"],
  ["cha", "ちゃ"], ["chu", "ちゅ"], ["cho", "ちょ"],
  ["tya", "ちゃ"], ["tyu", "ちゅ"], ["tyo", "ちょ"],
  ["nya", "にゃ"], ["nyu", "にゅ"], ["nyo", "にょ"],
  ["hya", "ひゃ"], ["hyu", "ひゅ"], ["hyo", "ひょ"],
  ["bya", "びゃ"], ["byu", "びゅ"], ["byo", "びょ"],
  ["pya", "ぴゃ"], ["pyu", "ぴゅ"], ["pyo", "ぴょ"],
  ["mya", "みゃ"], ["myu", "みゅ"], ["myo", "みょ"],
  ["rya", "りゃ"], ["ryu", "りゅ"], ["ryo", "りょ"],
  ["ka", "か"], ["ki", "き"], ["ku", "く"], ["ke", "け"], ["ko", "こ"],
  ["ga", "が"], ["gi", "ぎ"], ["gu", "ぐ"], ["ge", "げ"], ["go", "ご"],
  ["sa", "さ"], ["shi", "し"], ["si", "し"], ["su", "す"], ["se", "せ"], ["so", "そ"],
  ["za", "ざ"], ["ji", "じ"], ["zi", "じ"], ["zu", "ず"], ["ze", "ぜ"], ["zo", "ぞ"],
  ["ta", "た"], ["chi", "ち"], ["ti", "ち"], ["tsu", "つ"], ["tu", "つ"], ["te", "て"], ["to", "と"],
  ["da", "だ"], ["di", "ぢ"], ["du", "づ"], ["de", "で"], ["do", "ど"],
  ["na", "な"], ["ni", "に"], ["nu", "ぬ"], ["ne", "ね"], ["no", "の"],
  ["ha", "は"], ["hi", "ひ"], ["fu", "ふ"], ["hu", "ふ"], ["he", "へ"], ["ho", "ほ"],
  ["ba", "ば"], ["bi", "び"], ["bu", "ぶ"], ["be", "べ"], ["bo", "ぼ"],
  ["pa", "ぱ"], ["pi", "ぴ"], ["pu", "ぷ"], ["pe", "ぺ"], ["po", "ぽ"],
  ["ma", "ま"], ["mi", "み"], ["mu", "む"], ["me", "め"], ["mo", "も"],
  ["ya", "や"], ["yu", "ゆ"], ["yo", "よ"],
  ["ra", "ら"], ["ri", "り"], ["ru", "る"], ["re", "れ"], ["ro", "ろ"],
  ["wa", "わ"], ["wo", "を"],
  ["a", "あ"], ["i", "い"], ["u", "う"], ["e", "え"], ["o", "お"],
];

const ROMAJI_VOWELS = new Set(["a", "i", "u", "e", "o"]);

/**
 * Best-effort romaji -> hiragana conversion (e.g. "koko" -> "ここ") so users can search
 * with plain English letters instead of needing an IME. Runs greedy longest-match against
 * ROMAJI_TO_HIRAGANA, with special handling for the "n" mora and sokuon (doubled consonants,
 * e.g. "kitte" -> "きって"). Any character sequence that doesn't look like romaji (already
 * Japanese text, stray punctuation) passes through untouched.
 */
export function romajiToHiragana(input: string): string {
  const s = input.toLowerCase();
  let out = "";
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    if (ch === "n") {
      const next = s[i + 1];
      if (next === "n") {
        out += "ん";
        i += 1;
        continue;
      }
      if (!next || !/[aiueoy]/.test(next)) {
        out += "ん";
        i += 1;
        continue;
      }
    }

    if (/[bcdfghjkmpqrstvwyz]/.test(ch) && ch === s[i + 1] && ch !== "n") {
      out += "っ";
      i += 1;
      continue;
    }

    let matched = false;
    for (const len of [3, 2, 1]) {
      const chunk = s.slice(i, i + len);
      const found = ROMAJI_TO_HIRAGANA.find(([romaji]) => romaji === chunk);
      if (found) {
        out += found[1];
        i += len;
        matched = true;
        break;
      }
    }

    if (!matched) {
      out += ch;
      i += 1;
    }
  }

  return out;
}

/** True if the string is plausibly romaji (ASCII letters only, at least one vowel/n). */
export function looksLikeRomaji(input: string): boolean {
  return /^[a-z]+$/i.test(input) && /[aiueon]/i.test(input) && ROMAJI_VOWELS.size > 0;
}
