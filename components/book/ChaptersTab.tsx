// frontend/components/book/ChaptersTab.tsx
import { View } from "react-native"
import { ChapterCard } from "./ChapterCard"
import { PremiumBanner } from "./PremiumBanner"
import type { AudioPlayerChapter } from "../audio/AudioPlayer"

// ✅ isFree devient REQUIS (pas optionnel)
export type ChapterListItem = AudioPlayerChapter & {
  isLocked: boolean
  displayIndex?: number
  subtitle: string
  isFree: boolean  // ✅ Ajout explicite pour garantir qu'il est requis
}

type Props = {
  chapters: ChapterListItem[]
  currentChapterId?: string
  isSpeaking: boolean
  isPurchased: boolean
  onSelectChapter: (chapter: ChapterListItem) => void
}

export function ChaptersTab({ 
  chapters, 
  currentChapterId, 
  isSpeaking, 
  isPurchased, 
  onSelectChapter 
}: Props) {
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