// frontend/components/book/ChaptersTab.tsx
import { View } from "react-native"
import { ChapterCard } from "./ChapterCard"
import { PremiumBanner } from "./PremiumBanner"

type Chapter = {
  id: string
  title: string
  subtitle: string
  isLocked: boolean
  isFree: boolean
  displayIndex?: number
}

type Props = {
  chapters: Chapter[]
  currentChapterId?: string
  isSpeaking: boolean
  isPurchased: boolean
  onSelectChapter: (chapter: Chapter) => void
}

export function ChaptersTab({ chapters, currentChapterId, isSpeaking, isPurchased, onSelectChapter }: Props) {
  return (
    <View style={{ gap: 12 }}>
      <PremiumBanner isPurchased={isPurchased} />

      {chapters.map((chapter) => (
        <ChapterCard
          key={chapter.id}
          chapter={chapter}
          isCurrentChapter={currentChapterId === chapter.id}
          isSpeaking={isSpeaking}
          onPress={() => onSelectChapter(chapter)}
        />
      ))}
    </View>
  )
}