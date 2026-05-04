import * as Speech from "expo-speech"
import { useEffect, useRef, useState } from "react"

const SPEECH_RATE = 0.9
const MIN_ESTIMATED_DURATION_MS = 12000
const WORDS_PER_MINUTE = 155 * SPEECH_RATE

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function estimateDurationMs(text: string) {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  if (!wordCount) {
    return MIN_ESTIMATED_DURATION_MS
  }

  const estimated = (wordCount / WORDS_PER_MINUTE) * 60_000
  return Math.max(MIN_ESTIMATED_DURATION_MS, Math.round(estimated))
}

function offsetToCharIndex(text: string, offsetMs: number, durationMs: number) {
  if (!text.length || durationMs <= 0) {
    return 0
  }

  const ratio = clamp(offsetMs / durationMs, 0, 1)
  const rawIndex = Math.floor(text.length * ratio)
  const nextWhitespace = text.indexOf(" ", rawIndex)

  if (nextWhitespace === -1) {
    return rawIndex
  }

  return clamp(nextWhitespace + 1, 0, text.length)
}

function charIndexToOffset(text: string, charIndex: number, durationMs: number) {
  if (!text.length || durationMs <= 0) {
    return 0
  }

  const ratio = clamp(charIndex / text.length, 0, 1)
  return Math.round(durationMs * ratio)
}

type PlaybackStatus = "idle" | "playing" | "paused" | "stopped"
type BoundaryEvent = {
  charIndex: number
  charLength: number
}

export function useTTS() {
  const [status, setStatus] = useState<PlaybackStatus>("idle")
  const [positionMs, setPositionMs] = useState(0)
  const [durationMs, setDurationMs] = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const sessionIdRef = useRef(0)
  const textRef = useRef("")
  const durationRef = useRef(0)
  const pausedPositionRef = useRef(0)
  const playbackStartRef = useRef(0)
  const playbackOffsetRef = useRef(0)
  const snippetStartRef = useRef(0)

  const clearTimer = () => {
    if (!timerRef.current) {
      return
    }

    clearInterval(timerRef.current)
    timerRef.current = null
  }

  const syncPositionFromClock = () => {
    if (!durationRef.current) {
      return 0
    }

    const elapsedMs = Date.now() - playbackStartRef.current
    const nextPosition = clamp(
      playbackOffsetRef.current + elapsedMs,
      0,
      durationRef.current
    )

    setPositionMs(nextPosition)
    return nextPosition
  }

  const beginTimer = () => {
    clearTimer()

    timerRef.current = setInterval(() => {
      syncPositionFromClock()
    }, 250)
  }

  const invalidateSession = () => {
    sessionIdRef.current += 1
    clearTimer()
    return sessionIdRef.current
  }

  const stopSpeechEngine = async () => {
    try {
      await Speech.stop()
    } catch {
      // no-op: speech engine may already be stopped
    }
  }

  const playInternal = async (text: string, startOffsetMs = 0) => {
    if (!text.trim()) {
      return
    }

    const duration = estimateDurationMs(text)
    const safeOffset = clamp(startOffsetMs, 0, duration)
    const startCharIndex = offsetToCharIndex(text, safeOffset, duration)
    const snippet = text.slice(startCharIndex).trimStart()

    if (!snippet) {
      setStatus("stopped")
      setPositionMs(duration)
      setDurationMs(duration)
      pausedPositionRef.current = duration
      return
    }

    const sessionId = invalidateSession()

    textRef.current = text
    durationRef.current = duration
    pausedPositionRef.current = safeOffset
    playbackOffsetRef.current = safeOffset
    snippetStartRef.current = startCharIndex
    setDurationMs(duration)
    setPositionMs(safeOffset)

    await stopSpeechEngine()

    Speech.speak(snippet, {
      language: "fr-FR",
      rate: SPEECH_RATE,
      onStart: () => {
        if (sessionIdRef.current !== sessionId) {
          return
        }

        playbackStartRef.current = Date.now()
        setStatus("playing")
        beginTimer()
      },
      onBoundary: (event: BoundaryEvent) => {
        if (sessionIdRef.current !== sessionId) {
          return
        }

        const absoluteCharIndex = snippetStartRef.current + event.charIndex
        const estimatedOffset = charIndexToOffset(
          textRef.current,
          absoluteCharIndex,
          durationRef.current
        )

        pausedPositionRef.current = estimatedOffset
        setPositionMs(estimatedOffset)
      },
      onDone: () => {
        if (sessionIdRef.current !== sessionId) {
          return
        }

        clearTimer()
        pausedPositionRef.current = durationRef.current
        setPositionMs(durationRef.current)
        setStatus("stopped")
      },
      onStopped: () => {
        if (sessionIdRef.current !== sessionId) {
          return
        }

        clearTimer()
      },
      onError: () => {
        if (sessionIdRef.current !== sessionId) {
          return
        }

        clearTimer()
        setStatus("stopped")
      }
    })
  }

  const play = async (text: string) => {
    await playInternal(text, 0)
  }

  const pause = async () => {
    if (status !== "playing") {
      return
    }

    const currentPosition = syncPositionFromClock()
    pausedPositionRef.current = currentPosition
    invalidateSession()
    await stopSpeechEngine()
    setStatus("paused")
  }

  const resume = async () => {
    if (!textRef.current.trim()) {
      return
    }

    await playInternal(textRef.current, pausedPositionRef.current)
  }

  const stop = async () => {
    invalidateSession()
    await stopSpeechEngine()
    pausedPositionRef.current = 0
    playbackOffsetRef.current = 0
    setPositionMs(0)

    if (textRef.current.trim()) {
      setStatus("stopped")
      setDurationMs(durationRef.current || estimateDurationMs(textRef.current))
      return
    }

    setDurationMs(0)
    setStatus("idle")
  }

  const seekBy = async (deltaMs: number) => {
    if (!textRef.current.trim()) {
      return
    }

    const basePosition = status === "playing"
      ? syncPositionFromClock()
      : pausedPositionRef.current

    const targetPosition = clamp(basePosition + deltaMs, 0, durationRef.current)

    pausedPositionRef.current = targetPosition
    setPositionMs(targetPosition)

    if (status === "playing") {
      await playInternal(textRef.current, targetPosition)
      return
    }

    setStatus("paused")
  }

  useEffect(() => {
    return () => {
      invalidateSession()
      void stopSpeechEngine()
    }
  }, [])

  return {
    play,
    pause,
    resume,
    stop,
    seekBy,
    isSpeaking: status === "playing",
    isPaused: status === "paused",
    isStopped: status === "stopped",
    status,
    positionMs,
    durationMs
  }
}
