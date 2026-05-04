import { useState } from "react"
import { View, Text, ScrollView, Pressable } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"

import { getBookById } from "../../data/books"
import { BottomNav } from "../../components/layout/BottomNav"

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()

  const book = id ? getBookById(id.toString()) : null

  const [currentChapter, setCurrentChapter] = useState(null)
  const [activeTab, setActiveTab] = useState("summary")

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

        {/* Actions */}
        <View style={{ flexDirection: "row", gap: 10, paddingHorizontal: 20 }}>
          <Pressable
            onPress={() => setCurrentChapter(book.chapters[0])}
            style={{
              flex: 1,
              backgroundColor: "#D4AF37",
              padding: 12,
              borderRadius: 8,
              alignItems: "center"
            }}
          >
            <Text style={{ fontWeight: "600" }}>Écouter</Text>
          </Pressable>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: "row", marginTop: 20 }}>
          {["summary", "chapters", "ideas"].map((tab) => {
            const isActive = activeTab === tab

            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: 12,
                  borderBottomWidth: 2,
                  borderBottomColor: isActive ? "#D4AF37" : "transparent"
                }}
              >
                <Text
                  style={{
                    textAlign: "center",
                    color: isActive ? "#D4AF37" : "#888"
                  }}
                >
                  {tab}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {/* CONTENT */}
        <View style={{ padding: 20 }}>

          {activeTab === "summary" && (
            <Text style={{ color: "#ddd" }}>
              {book.summary}
            </Text>
          )}

          {activeTab === "chapters" && (
            book.chapters.map((chapter, index) => (
              <Pressable
                key={chapter.id}
                onPress={() => setCurrentChapter(chapter)}
                style={{
                  padding: 12,
                  backgroundColor: "#1A1A1A",
                  borderRadius: 10,
                  marginBottom: 10
                }}
              >
                <Text style={{ color: "white" }}>
                  {index + 1}. {chapter.title}
                </Text>
              </Pressable>
            ))
          )}

          {activeTab === "ideas" && (
            book.keyIdeas.map((idea, index) => (
              <Text key={index} style={{ color: "#ddd", marginBottom: 10 }}>
                • {idea}
              </Text>
            ))
          )}

        </View>

        {/* Chapter content */}
        {currentChapter && (
          <View style={{ padding: 20 }}>
            <Text style={{ color: "#D4AF37", marginBottom: 10 }}>
              {currentChapter.title}
            </Text>

            <Text style={{ color: "#ccc" }}>
              {currentChapter.content}
            </Text>
          </View>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomNav />
    </View>
  )
}
