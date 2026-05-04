import { View, Text, ScrollView, Pressable } from "react-native"
import { Href, useRouter } from "expo-router"
import { BookCard } from "./BookCard"

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  duration: number
  isNew?: boolean
}

interface BookCarouselProps {
  title: string
  books: Book[]
  showSeeAll?: boolean
  seeAllHref?: Href
}

export function BookCarousel({
  title,
  books,
  showSeeAll = false,
  seeAllHref = "/explore"
}: BookCarouselProps) {
  const router = useRouter()

  if (!books.length) {
    return null
  }

  return (
    <View style={{ paddingVertical: 16 }}>
      
      {/* Header */}
      <View
        style={{
          marginBottom: 12,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "600" }}>
          {title}
        </Text>

        {showSeeAll && (
          <Pressable onPress={() => router.push(seeAllHref)}>
            <Text style={{ fontSize: 14, color: "#D4AF37", fontWeight: "500" }}>
              Voir tout
            </Text>
          </Pressable>
        )}
      </View>

      {/* Scroll horizontal */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          gap: 12
        }}
      >
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </ScrollView>
    </View>
  )
}
