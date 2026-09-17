export function speakJapanese(text: string, rate = 1) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  window.speechSynthesis.cancel()
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = "ja-JP"
  utterance.rate = Math.min(1.2, Math.max(0.8, rate))
  const voices = window.speechSynthesis.getVoices()
  const ja = voices.find((voice) => voice.lang.startsWith("ja"))
  if (ja) utterance.voice = ja
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking() {
  if (typeof window === "undefined") return
  window.speechSynthesis.cancel()
}
