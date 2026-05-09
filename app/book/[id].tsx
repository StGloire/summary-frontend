// frontend/app/book/[id].tsx
import { useEffect, useMemo, useState } from "react"
import { Alert, ScrollView, Share, Text, View } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"

import { AudioPlayer, type AudioPlayerChapter } from "../../components/audio/AudioPlayer"
import { BottomNav } from "../../components/layout/BottomNav"
import { useTTS } from "../../components/tts/useTTS"
import { BookHeader } from "../../components/book/BookHeader"
import { BookHero } from "../../components/book/BookHero"
import { BookTabs } from "../../components/book/BookTabs"
import { SummaryTab } from "../../components/book/SummaryTab"
import { ChaptersTab } from "../../components/book/ChaptersTab"
import { IdeasTab } from "../../components/book/IdeasTab"

import { getBookById } from "../../data/books"
import { usePurchases } from "../../hooks/usePurchases"

type BookTab = "summary" | "chapters" | "ideas"

type ChapterListItem = AudioPlayerChapter & {
  isLocked: boolean
  displayIndex?: number
  subtitle: string
}

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const selectedBookId = Array.isArray(id) ? id[0] : id

  const book = selectedBookId ? getBookById(selectedBookId) : null
  const { purchases, loading } = usePurchases()
  const isPurchased = !!book && purchases.includes(book.id)

  const [currentChapter, setCurrentChapter] = useState<AudioPlayerChapter | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [activeTab, setActiveTab] = useState<BookTab>("summary")

  const { play, pause, resume, stop, seekBy, isSpeaking, isPaused, isStopped, positionMs, durationMs } =
    useTTS()

  const introChapter = useMemo<AudioPlayerChapter | null>(() => {
    if (!book) return null
    return {
      id: `${book.id}-intro`,
      title: book.intro.title,
      content: book.intro.content,
      duration: book.intro.duration,
      isFree: true
    }
  }, [book])

  const chapterItems = useMemo<ChapterListItem[]>(() => {
    if (!book || !introChapter) return []

    return [
      {
        ...introChapter,
        isLocked: false,
        subtitle: `Introduction gratuite • ${introChapter.duration} min`
      },
      ...book.chapters.map((chapter, index) => ({
        id: chapter.id,
        title: chapter.title,
        content: chapter.content,
        duration: chapter.duration,
        isFree: false,
        isLocked: !isPurchased,
        displayIndex: index + 1,
        subtitle: !isPurchased
          ? `Chapitre premium • ${chapter.duration} min`
          : `${chapter.duration} min`
      }))
    ]
  }, [book, introChapter, isPurchased])

  const playableChapters = useMemo<AudioPlayerChapter[]>(() => {
    return chapterItems
      .filter((chapter) => !chapter.isLocked)
      .map(({ isLocked: _isLocked, subtitle: _subtitle, displayIndex: _displayIndex, ...chapter }) => chapter)
  }, [chapterItems])

  const currentChapterIndex = currentChapter
    ? playableChapters.findIndex((chapter) => chapter.id === currentChapter.id)
    : -1

  const canGoPrevious = currentChapterIndex > 0
  const canGoNext = currentChapterIndex >= 0 && currentChapterIndex < playableChapters.length - 1

  useEffect(() => {
    setCurrentChapter(null)
    setActiveTab("summary")
    void stop()
  }, [selectedBookId])

  const playChapter = async (chapter: AudioPlayerChapter) => {
    setCurrentChapter(chapter)
    await play(chapter.content)
  }

  const handleResume = async () => {
    if (!currentChapter) return
    if (isStopped && positionMs >= durationMs) {
      await play(currentChapter.content)
      return
    }
    await resume()
  }

  const handleStartListening = async () => {
    const targetChapter = currentChapter ?? introChapter
    if (targetChapter) await playChapter(targetChapter)
  }

  const handleChapterNavigation = async (direction: -1 | 1) => {
    if (currentChapterIndex < 0) return
    const targetChapter = playableChapters[currentChapterIndex + direction]
    if (!targetChapter) return
    await playChapter(targetChapter)
  }

  const handleChapterSelect = async (chapter: ChapterListItem) => {
    if (chapter.isLocked) {
      router.push({
        pathname: "/purchase",
        params: { bookId: book!.id, title: book!.title }
      })
      return
    }

    setActiveTab("chapters")

    if (currentChapter?.id === chapter.id) {
      if (isSpeaking) {
        await pause()
        return
      }
      await handleResume()
      return
    }

    await playChapter(chapter)
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${book!.title} - ${book!.author}\n\n${book!.summary}`
      })
    } catch {
      Alert.alert("Partage indisponible", "Le partage n'est pas disponible pour le moment.")
    }
  }

  const handleDownload = () => {
    Alert.alert(
      "Telechargement bientot disponible",
      "Le mode hors ligne sera ajoute dans une prochaine etape."
    )
  }

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#0B0B0B", justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white", fontSize: 16 }}>Chargement de vos achats...</Text>
      </View>
    )
  }

  if (!book || !introChapter) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0B0B0B",
          alignItems: "center",
          justifyContent: "center",
          paddingHorizontal: 24
        }}
      >
        <Text style={{ color: "white", fontSize: 20, fontWeight: "700" }}>Livre non trouve</Text>
        <Text style={{ color: "#8A8A8A", textAlign: "center", marginTop: 10, lineHeight: 22 }}>
          Impossible d&apos;afficher ce resume pour le moment.
        </Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <BookHeader
        isBookmarked={isBookmarked}
        onToggleBookmark={() => setIsBookmarked(!isBookmarked)}
        onShare={handleShare}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: currentChapter ? 300 : 120
        }}
      >
        <BookHero book={book} onListen={handleStartListening} onDownload={handleDownload} />

        <BookTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <View style={{ paddingHorizontal: 20, paddingTop: 22 }}>
          {activeTab === "summary" && <SummaryTab book={book} />}

          {activeTab === "chapters" && (
            <ChaptersTab
              chapters={chapterItems}
              currentChapterId={currentChapter?.id}
              isSpeaking={isSpeaking}
              isPurchased={isPurchased}
              onSelectChapter={handleChapterSelect}
            />
          )}

          {activeTab === "ideas" && <IdeasTab ideas={book.keyIdeas} />}
        </View>

        {currentChapter && (
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 24,
              borderTopWidth: 1,
              borderColor: "#1F1F1F",
              paddingTop: 24
            }}
          >
            <Text style={{ color: "white", fontSize: 17, fontWeight: "700" }}>{currentChapter.title}</Text>
            <Text style={{ color: "#D7D7D7", lineHeight: 24, marginTop: 12 }}>{currentChapter.content}</Text>
          </View>
        )}
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