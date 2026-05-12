// frontend/components/book/BookCard.tsx
import { Pressable, Text, View } from "react-native"
import { Image } from "expo-image"
import { useRouter } from "expo-router"

type Book = {
  id: string
  title: string
  author: string
  coverImage: string
  duration: number
  isNew?: boolean
}

type Props = {
  book: Book
  size?: number | string
}

export function BookCard({ book }: Props) {
  const router = useRouter()

  return (
    <Pressable
      onPress={() => router.push(`/book/${book.id}`)}
      style={({ pressed }) => ({
        width: 160,
        opacity: pressed ? 0.8 : 1
      })}
    >
      <View
        style={{
          borderRadius: 16,
          overflow: "hidden",
          backgroundColor: "#1A1A1A",
          aspectRatio: 2 / 3
        }}
      >
        <Image
          source={{ uri: book.coverImage }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />
      </View>

      <Text
        style={{
          color: "white",
          fontSize: 14,
          fontWeight: "600",
          marginTop: 8
        }}
        numberOfLines={1}
      >
        {book.title}
      </Text>

      <Text
        style={{
          color: "#8A8A8A",
          fontSize: 12,
          marginTop: 2
        }}
        numberOfLines={1}
      >
        {book.author}
      </Text>

      <Text
        style={{
          color: "#D4AF37",
          fontSize: 11,
          marginTop: 4
        }}
      >
        {book.duration} min
      </Text>
    </Pressable>
  )
}