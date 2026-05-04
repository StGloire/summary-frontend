import * as Speech from "expo-speech"
import { useState } from "react"

export function useTTS() {
  const [isSpeaking, setIsSpeaking] = useState(false)

  const speak = (text: string) => {
    if (!text) return

    // stop tout avant de relancer
    Speech.stop()

    setIsSpeaking(true)

    Speech.speak(text, {
      language: "fr-FR",
      rate: 0.9,

      onStart: () => setIsSpeaking(true),

      onDone: () => setIsSpeaking(false),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false)
    })
  }

  const stop = () => {
    Speech.stop()
    setIsSpeaking(false)
  }

  return {
    speak,
    stop,
    isSpeaking
  }
}
