import { View, Text, ScrollView, Pressable } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"

import { getBookById } from "../../data/books"
import { BottomNav } from "../../components/layout/BottomNav"
import { useTTS } from "../../components/tts/useTTS"
import { usePurchasedBook } from "../../hooks/usePurchasedBooks"

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const selectedBookId = Array.isArray(id) ? id[0] : id

  const book = selectedBookId ? getBookById(selectedBookId) : null

  const { speak, stop, isSpeaking } = useTTS()
  const isPurchased = usePurchasedBook(book?.id)

  if (!book) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "white" }}>Livre non trouvé</Text>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 16,
          alignItems: "center"
        }}
      >
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>

        <Ionicons name="bookmark-outline" size={22} color="#ccc" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Book Info */}
        <View style={{ padding: 20, flexDirection: "row", gap: 16 }}>
          <Image
            source={{ uri: book.coverImage }}
            style={{ width: 100, height: 150, borderRadius: 10 }}
          />

          <View style={{ flex: 1 }}>
            <Text style={{ color: "#D4AF37", fontSize: 12 }}>
              {book.category}
            </Text>

            <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
              {book.title}
            </Text>

            <Text style={{ color: "#ccc" }}>
              {book.author}
            </Text>

            <Text style={{ color: "#888", marginTop: 6 }}>
              {book.duration} min • {book.chapters.length} chapitres
            </Text>
          </View>
        </View>

        {/* 🎧 INTRO GRATUITE */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text style={{ color: "#D4AF37", marginBottom: 10 }}>
            🎧 Introduction (gratuit)
          </Text>

          <Pressable
            onPress={() => speak(book.intro.content)}
            style={{
              backgroundColor: "#D4AF37",
              padding: 12,
              borderRadius: 8,
              alignItems: "center"
            }}
          >
            <Text style={{ fontWeight: "600" }}>
              {isSpeaking ? "Lecture..." : "Écouter l'introduction"}
            </Text>
          </Pressable>

          {isSpeaking && (
            <Pressable
              onPress={stop}
              style={{
                marginTop: 10,
                backgroundColor: "#222",
                padding: 10,
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#444"
              }}
            >
              <Text style={{ color: "#D4AF37", textAlign: "center" }}>
                Arrêter la lecture
              </Text>
            </Pressable>
          )}
        </View>

        {/* 🔒 CHAPITRES PREMIUM */}
        <View style={{ padding: 20 }}>
          <Text style={{ color: isPurchased ? "#D4AF37" : "#888", marginBottom: 10 }}>
            {isPurchased ? "✅ Contenu débloqué" : "🔒 Contenu premium"}
          </Text>

          {book.chapters.map((chapter, index) => {
            const isLocked = !isPurchased

            return (
              <Pressable
                key={chapter.id}
                onPress={() => {
                  if (isLocked) {
                    router.push({
                      pathname: "/purchase",
                      params: {
                        bookId: book.id,
                        title: book.title
                      }
                    })
                    return
                  }

                  speak(chapter.content)
                }}
                style={{
                  padding: 12,
                  backgroundColor: "#1A1A1A",
                  borderRadius: 10,
                  marginBottom: 10,
                  opacity: isLocked ? 0.5 : 1
                }}
              >
                <Text style={{ color: "white" }}>
                  {isLocked ? "🔒 " : ""}{index + 1}. {chapter.title}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* Résumé */}
        <View style={{ padding: 20 }}>
          <Text style={{ color: "#ddd" }}>
            {book.summary}
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomNav />
    </View>
  )
}
