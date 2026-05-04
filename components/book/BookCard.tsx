import { View, Text, Pressable } from "react-native"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  duration: number
  isNew?: boolean
}

interface BookCardProps {
  book: Book
  size?: "small" | "medium" | "large"
  showMeta?: boolean
}

export function BookCard({ book, size = "medium", showMeta = true }: BookCardProps) {
  const router = useRouter()

  const sizes = {
    small: 112,
    medium: 144,
    large: 176
  }

  const width = sizes[size]
  const height = width * 1.5

  return (
    <Pressable
        onPress={() => router.push(`/book/${book.id}`)}
        style={({ pressed }) => [
            { width },
            { opacity: pressed ? 0.8 : 1 }
        ]}
        >
      <View style={{ borderRadius: 12, overflow: "hidden" }}>
        <Image
          source={{ uri: book.coverImage }}
          style={{ width, height }}
          contentFit="cover"
        />

        {book.isNew && (
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "#D4AF37",
              paddingHorizontal: 6,
              paddingVertical: 2,
              borderRadius: 4
            }}
          >
            <Text style={{ fontSize: 10, color: "#000", fontWeight: "600" }}>
              Nouveau
            </Text>
          </View>
        )}

        <View
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            flexDirection: "row",
            alignItems: "center",
            gap: 4
          }}
        >
          <Ionicons name="headset-outline" size={14} color="#FFD700" />
          <Text style={{ fontSize: 12, color: "white" }}>
            {book.duration} min
          </Text>
        </View>
      </View>

      {showMeta && (
        <View style={{ marginTop: 6 }}>
          <Text numberOfLines={2} style={{ fontSize: 14, fontWeight: "600" }}>
            {book.title}
          </Text>

          <Text style={{ fontSize: 12, color: "#888" }}>
            {book.author}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Ionicons name="time-outline" size={12} color="#888" />
            <Text style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>
              {book.duration} min
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  )
}
