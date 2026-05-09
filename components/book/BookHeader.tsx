// frontend/components/book/BookHeader.tsx
import { Pressable, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"

type Props = {
  isBookmarked: boolean
  onToggleBookmark: () => void
  onShare: () => void
}

export function BookHeader({ isBookmarked, onToggleBookmark, onShare }: Props) {
  const router = useRouter()

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: "rgba(11,11,11,0.94)"
      }}
    >
      <IconActionButton
        icon="arrow-back"
        onPress={() => router.back()}
        accessibilityLabel="Retour"
      />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <IconActionButton
          icon={isBookmarked ? "bookmark" : "bookmark-outline"}
          onPress={onToggleBookmark}
          accent={isBookmarked}
          accessibilityLabel="Ajouter aux favoris"
        />
        <IconActionButton
          icon="share-social-outline"
          onPress={onShare}
          accessibilityLabel="Partager"
        />
      </View>
    </View>
  )
}

function IconActionButton({ icon, onPress, accent = false, accessibilityLabel }: any) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 42,
        height: 42,
        borderRadius: 21,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: accent ? "rgba(212,175,55,0.14)" : "#151515",
        borderWidth: 1,
        borderColor: accent ? "rgba(212,175,55,0.28)" : "#252525",
        opacity: pressed ? 0.82 : 1
      })}
    >
      <Ionicons name={icon} size={20} color={accent ? "#D4AF37" : "#F5F5F5"} />
    </Pressable>
  )
}