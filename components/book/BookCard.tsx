import { View, Text, Pressable } from "react-native"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

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

const sizeMap = {
  small: 112,
  medium: 144,
  large: 176
} as const

export function BookCard({ book, size = "medium", showMeta = true }: BookCardProps) {
  const router = useRouter()

  const width = sizeMap[size]
  const height = width * 1.5
  const titleFontSize = size === "small" ? 13 : 14
  const titleLineHeight = size === "small" ? 17 : 19

  return (
    <Pressable
      onPress={() => router.push(`/book/${book.id}`)}
      style={({ pressed }) => ({
        width,
        opacity: pressed ? 0.9 : 1,
        transform: [{ scale: pressed ? 0.985 : 1 }]
      })}
    >
      <View
        style={{
          borderRadius: 14,
          overflow: "hidden",
          backgroundColor: "#171717"
        }}
      >
        <Image
          source={{ uri: book.coverImage }}
          style={{ width, height }}
          contentFit="cover"
          transition={200}
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.15)", "rgba(0,0,0,0.72)"]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
          }}
        />

        {book.isNew && (
          <View
            style={{
              position: "absolute",
              top: 8,
              left: 8,
              backgroundColor: "#D4AF37",
              paddingHorizontal: 8,
              paddingVertical: 3,
              borderRadius: 5
            }}
          >
            <Text
              style={{
                fontSize: 10,
                color: "#050505",
                fontWeight: "700",
                textTransform: "uppercase"
              }}
            >
              Nouveau
            </Text>
          </View>
        )}

        <View
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            bottom: 10,
            flexDirection: "row",
            alignItems: "center",
            gap: 6
          }}
        >
          <Ionicons name="headset-outline" size={14} color="#D4AF37" />
          <Text
            style={{
              color: "white",
              fontSize: 12,
              fontWeight: "600"
            }}
          >
            {book.duration} min
          </Text>
        </View>
      </View>

      {showMeta && (
        <View style={{ marginTop: 8, gap: 2 }}>
          <Text
            numberOfLines={2}
            style={{
              color: "white",
              fontSize: titleFontSize,
              fontWeight: "700",
              lineHeight: titleLineHeight,
              minHeight: titleLineHeight * 2
            }}
          >
            {book.title}
          </Text>

          <Text
            numberOfLines={1}
            style={{
              color: "#8A8A8A",
              fontSize: 12
            }}
          >
            {book.author}
          </Text>

          <View
            style={{
              marginTop: 4,
              flexDirection: "row",
              alignItems: "center",
              gap: 4
            }}
          >
            <Ionicons name="time-outline" size={12} color="#7A7A7A" />
            <Text style={{ fontSize: 12, color: "#7A7A7A" }}>
              {book.duration} min
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  )
}
