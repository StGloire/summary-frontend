// frontend/components/book/ChapterCard.tsx
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type Chapter = {
  id: string
  title: string
  subtitle: string
  isLocked: boolean
  isFree: boolean
  displayIndex?: number
}

type Props = {
  chapter: Chapter
  isCurrentChapter: boolean
  isSpeaking: boolean
  onPress: () => void
}

export function ChapterCard({ chapter, isCurrentChapter, isSpeaking, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        borderRadius: 18,
        backgroundColor: isCurrentChapter ? "rgba(212,175,55,0.10)" : "#141414",
        borderWidth: 1,
        borderColor: isCurrentChapter ? "#D4AF37" : "#232323",
        padding: 16,
        opacity: chapter.isLocked ? 0.68 : pressed ? 0.84 : 1
      })}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 21,
          backgroundColor: isCurrentChapter ? "#D4AF37" : "#222222",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        {isCurrentChapter ? (
          <Ionicons name={isSpeaking ? "pause" : "play"} size={18} color="#050505" />
        ) : chapter.isFree ? (
          <Ionicons name="play" size={18} color="#F5F5F5" />
        ) : (
          <Text style={{ color: "#D0D0D0", fontSize: 13, fontWeight: "700" }}>{chapter.displayIndex}</Text>
        )}
      </View>

      <View style={{ flex: 1 }}>
        <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>{chapter.title}</Text>
        <Text style={{ color: "#8A8A8A", fontSize: 12, marginTop: 4 }}>{chapter.subtitle}</Text>
      </View>

      {chapter.isLocked ? (
        <Ionicons name="lock-closed" size={16} color="#8A8A8A" />
      ) : isCurrentChapter ? (
        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#D4AF37" }} />
      ) : (
        <Ionicons name="chevron-forward" size={16} color="#5E5E5E" />
      )}
    </Pressable>
  )
}