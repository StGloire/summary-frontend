import { View, Text, Pressable } from "react-native"
import { Image } from "expo-image"
import { useRouter } from "expo-router"

export function ContinueReadingCard({ book, progress }) {
  const router = useRouter()

  return (
    <Pressable
      onPress={() => router.push(`/book/${book.id}`)}
      style={{
        flexDirection: "row",
        gap: 12,
        backgroundColor: "#1A1A1A",
        padding: 12,
        borderRadius: 12
      }}
    >
      <Image
        source={{ uri: book.coverImage }}
        style={{ width: 60, height: 90, borderRadius: 8 }}
      />

      <View style={{ flex: 1, justifyContent: "space-between" }}>
        <View>
          <Text style={{ color: "white", fontWeight: "600" }}>
            {book.title}
          </Text>
          <Text style={{ color: "#888" }}>
            {book.author}
          </Text>
        </View>

        <View>
          <View
            style={{
              height: 4,
              backgroundColor: "#333",
              borderRadius: 10,
              overflow: "hidden"
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

          <Text style={{ color: "#888", fontSize: 12 }}>
            {progress}% complété
          </Text>
        </View>
      </View>
    </Pressable>
  )
}
