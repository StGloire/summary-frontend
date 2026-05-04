import { useEffect, useRef, useState } from "react"
import { View, Text, Pressable } from "react-native"
import { Audio } from "expo-av"
import { Ionicons } from "@expo/vector-icons"

export function AudioPlayer({ book, currentChapter, onChapterChange }) {
  const sound = useRef(null)

  const [isPlaying, setIsPlaying] = useState(false)
  const [position, setPosition] = useState(0)
  const [duration, setDuration] = useState(1)

  useEffect(() => {
    loadAudio()

    return () => {
      if (sound.current) {
        sound.current.unloadAsync()
      }
    }
  }, [currentChapter])

  const loadAudio = async () => {
    if (!currentChapter?.audio) return

    if (sound.current) {
      await sound.current.unloadAsync()
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: currentChapter.audio },
      { shouldPlay: true }
    )

    sound.current = newSound
    setIsPlaying(true)

    newSound.setOnPlaybackStatusUpdate((status) => {
      if (!status.isLoaded) return

      setPosition(status.positionMillis)
      setDuration(status.durationMillis || 1)
      setIsPlaying(status.isPlaying)
    })
  }

  const togglePlay = async () => {
    if (!sound.current) return

    if (isPlaying) {
      await sound.current.pauseAsync()
    } else {
      await sound.current.playAsync()
    }
  }

  const playNext = () => {
    const index = book.chapters.findIndex(c => c.id === currentChapter.id)
    const next = book.chapters[index + 1]

    if (next) onChapterChange(next)
  }

  const playPrev = () => {
    const index = book.chapters.findIndex(c => c.id === currentChapter.id)
    const prev = book.chapters[index - 1]

    if (prev) onChapterChange(prev)
  }

  const progress = (position / duration) * 100

  return (
    <View
      style={{
        position: "absolute",
        bottom: 70,
        left: 0,
        right: 0,
        backgroundColor: "#111",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#222"
      }}
    >
      {/* Title */}
      <Text style={{ color: "white", fontSize: 12 }}>
        {currentChapter.title}
      </Text>

      {/* Progress */}
      <View
        style={{
          height: 3,
          backgroundColor: "#333",
          marginVertical: 6,
          borderRadius: 10
        }}
      >
        <View
          style={{
            width: `${progress}%`,
            backgroundColor: "#D4AF37",
            height: "100%"
          }}
        />
      </View>

      {/* Controls */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          gap: 20
        }}
      >
        <Pressable onPress={playPrev}>
          <Ionicons name="play-skip-back" size={22} color="white" />
        </Pressable>

        <Pressable onPress={togglePlay}>
          <Ionicons
            name={isPlaying ? "pause" : "play"}
            size={28}
            color="#D4AF37"
          />
        </Pressable>

        <Pressable onPress={playNext}>
          <Ionicons name="play-skip-forward" size={22} color="white" />
        </Pressable>
      </View>
    </View>
  )
}
