export function isTTSSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

let cachedVoices: SpeechSynthesisVoice[] = [];

function loadVoices(): SpeechSynthesisVoice[] {
  if (!isTTSSupported()) return [];
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) cachedVoices = voices;
  return cachedVoices;
}

if (isTTSSupported()) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function getJapaneseVoice(): SpeechSynthesisVoice | null {
  const voices = loadVoices();
  return (
    voices.find((v) => v.lang === "ja-JP") ?? voices.find((v) => v.lang.startsWith("ja")) ?? null
  );
}

export function hasJapaneseVoice(): boolean {
  return getJapaneseVoice() !== null;
}

let currentRate = 0.9;

export function setRate(rate: number): void {
  currentRate = rate;
}

export function speak(text: string, rate: number = currentRate): void {
  if (!isTTSSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getJapaneseVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = "ja-JP";
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}
