import { useEffect, useMemo, useState } from "react"
import { View, Text, ScrollView, Pressable } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"

import {
  AudioPlayer,
  type AudioPlayerChapter
} from "../../components/audio/AudioPlayer"
import { BottomNav } from "../../components/layout/BottomNav"
import { useTTS } from "../../components/tts/useTTS"
import { getBookById } from "../../data/books"
import { usePurchasedBook } from "../../hooks/usePurchasedBooks"

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const selectedBookId = Array.isArray(id) ? id[0] : id

  const book = selectedBookId ? getBookById(selectedBookId) : null
  const isPurchased = usePurchasedBook(book?.id)
  const [currentChapter, setCurrentChapter] = useState<AudioPlayerChapter | null>(null)

  const {
    play,
    pause,
    resume,
    stop,
    seekBy,
    isSpeaking,
    isPaused,
    isStopped,
    positionMs,
    durationMs
  } = useTTS()

  const introChapter = useMemo<AudioPlayerChapter | null>(() => {
    if (!book) {
      return null
    }

    return {
      id: `${book.id}-intro`,
      title: book.intro.title,
      content: book.intro.content,
      duration: book.intro.duration,
      isFree: true
    }
  }, [book])

  const playableChapters = useMemo<AudioPlayerChapter[]>(() => {
    if (!book || !introChapter) {
      return []
    }

    const premiumChapters = isPurchased
      ? book.chapters.map((chapter) => ({
          id: chapter.id,
          title: chapter.title,
          content: chapter.content,
          duration: chapter.duration,
          isFree: false
        }))
      : []

    return [introChapter, ...premiumChapters]
  }, [book, introChapter, isPurchased])

  const currentChapterIndex = currentChapter
    ? playableChapters.findIndex((chapter) => chapter.id === currentChapter.id)
    : -1

  const canGoPrevious = currentChapterIndex > 0
  const canGoNext =
    currentChapterIndex >= 0 && currentChapterIndex < playableChapters.length - 1

  useEffect(() => {
    setCurrentChapter(null)
    void stop()
  }, [selectedBookId])

  if (!book || !introChapter) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Livre non trouvé</Text>
      </View>
    )
  }

  const isIntroActive = currentChapter?.id === introChapter.id

  const playChapter = async (chapter: AudioPlayerChapter) => {
    setCurrentChapter(chapter)
    await play(chapter.content)
  }

  const handleResume = async () => {
    if (!currentChapter) {
      return
    }

    if (isStopped && positionMs >= durationMs) {
      await play(currentChapter.content)
      return
    }

    await resume()
  }

  const handleChapterNavigation = async (direction: -1 | 1) => {
    if (currentChapterIndex < 0) {
      return
    }

    const targetChapter = playableChapters[currentChapterIndex + direction]

    if (!targetChapter) {
      return
    }

    await playChapter(targetChapter)
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
          alignItems: "center"
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>

        <Ionicons name="bookmark-outline" size={22} color="#ccc" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Book Info */}
        <View style={{ padding: 20, flexDirection: "row", gap: 16 }}>
          <Image
            source={{ uri: book.coverImage }}
            style={{ width: 100, height: 150, borderRadius: 10 }}
          />

          <View style={{ flex: 1 }}>
            <Text style={{ color: "#D4AF37", fontSize: 12 }}>
              {book.category}
            </Text>

            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {book.title}
            </Text>

            <Text style={{ color: "#ccc" }}>
              {book.author}
            </Text>

            <Text style={{ color: "#888", marginTop: 6 }}>
              {book.duration} min • {book.chapters.length} chapitres
            </Text>
          </View>
        </View>

        {/* 🎧 INTRO GRATUITE */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: "#D4AF37", marginBottom: 10 }}>
            🎧 Introduction (gratuit)
          </Text>

          <Pressable
            onPress={() => void playChapter(introChapter)}
            style={{
              backgroundColor: isIntroActive ? "rgba(212,175,55,0.18)" : "#1A1A1A",
              padding: 14,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: isIntroActive ? "#D4AF37" : "#2A2A2A",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ color: isIntroActive ? "#D4AF37" : "white", fontWeight: "600" }}>
                {introChapter.title}
              </Text>

              <Text style={{ color: "#8A8A8A", fontSize: 12, marginTop: 4 }}>
                {isIntroActive && isSpeaking
                  ? "Lecture en cours"
                  : isIntroActive && isPaused
                    ? "Lecture en pause"
                    : "Écouter l'introduction"}
              </Text>
            </View>

            <View
              style={{
                width: 34,
                height: 34,
                borderRadius: 17,
                backgroundColor: isIntroActive ? "#D4AF37" : "#242424",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Ionicons
                name={isIntroActive && isSpeaking ? "pause" : "play"}
                size={16}
                color={isIntroActive ? "#050505" : "#F5F5F5"}
              />
            </View>
          </Pressable>
        </View>

        {/* 🔒 CHAPITRES PREMIUM */}
        <View style={{ padding: 20 }}>
          <Text style={{ color: isPurchased ? "#D4AF37" : "#888", marginBottom: 10 }}>
            {isPurchased ? "✅ Contenu débloqué" : "🔒 Contenu premium"}
          </Text>

          {book.chapters.map((chapter, index) => {
            const isLocked = !isPurchased
            const isCurrentChapter = currentChapter?.id === chapter.id

            return (
              <Pressable
                key={chapter.id}
                onPress={() => {
                  if (isLocked) {
                    router.push({
                      pathname: "/purchase",
                      params: {
                        bookId: book.id,
                        title: book.title
                      }
                    })
                    return
                  }

                  void playChapter({
                    id: chapter.id,
                    title: chapter.title,
                    content: chapter.content,
                    duration: chapter.duration,
                    isFree: false
                  })
                }}
                style={{
                  padding: 12,
                  backgroundColor: isCurrentChapter ? "rgba(212,175,55,0.12)" : "#1A1A1A",
                  borderRadius: 10,
                  marginBottom: 10,
                  opacity: isLocked ? 0.5 : 1,
                  borderWidth: isCurrentChapter ? 1 : 0,
                  borderColor: isCurrentChapter ? "#D4AF37" : "transparent",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flex: 1 }}>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 15,
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: isCurrentChapter ? "#D4AF37" : "#262626"
                    }}
                  >
                    <Text
                      style={{
                        color: isCurrentChapter ? "#050505" : "#A0A0A0",
                        fontSize: 12,
                        fontWeight: "700"
                      }}
                    >
                      {index + 1}
                    </Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: isCurrentChapter ? "#D4AF37" : "white" }}>
                      {isLocked ? "🔒 " : ""}{chapter.title}
                    </Text>

                    <Text style={{ color: "#8A8A8A", fontSize: 12, marginTop: 3 }}>
                      {chapter.duration} min
                    </Text>
                  </View>
                </View>

                {isCurrentChapter && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#D4AF37"
                    }}
                  />
                )}
              </Pressable>
            )
          })}
        </View>

        {/* Résumé */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          <Text style={{ color: "#ddd" }}>
            {book.summary}
          </Text>
        </View>

        {currentChapter && (
          <View
            style={{
              marginHorizontal: 20,
              marginBottom: 20,
              padding: 16,
              borderRadius: 14,
              backgroundColor: "#141414",
              borderWidth: 1,
              borderColor: "#242424"
            }}
          >
            <Text style={{ color: "#D4AF37", fontSize: 16, fontWeight: "700", marginBottom: 10 }}>
              {currentChapter.title}
            </Text>

            <Text style={{ color: "#D4D4D4", lineHeight: 22 }}>
              {currentChapter.content}
            </Text>
          </View>
        )}

        <View style={{ height: currentChapter ? 260 : 80 }} />
      </ScrollView>

      {currentChapter && (
        <AudioPlayer
          currentChapter={currentChapter}
          isPlaying={isSpeaking}
          isPaused={isPaused}
          positionMs={positionMs}
          durationMs={durationMs}
          onPause={() => void pause()}
          onResume={() => void handleResume()}
          onStop={() => void stop()}
          onSeekBackward={() => void seekBy(-5000)}
          onSeekForward={() => void seekBy(5000)}
          onPreviousChapter={() => void handleChapterNavigation(-1)}
          onNextChapter={() => void handleChapterNavigation(1)}
          canGoPrevious={canGoPrevious}
          canGoNext={canGoNext}
        />
      )}

      <BottomNav />
    </View>
  )
}
