import { useMemo, useState } from "react"
import { Pressable, ScrollView, Text, View } from "react-native"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { BottomNav } from "../components/layout/BottomNav"
import { TopHeader } from "../components/layout/TopHeader"
import { books } from "../data/books"

type TabType = "all" | "in-progress" | "downloaded" | "completed"
type LibraryBook = (typeof books)[number]

const savedBooks = books.slice(0, 4)
const downloadedBooks = savedBooks.slice(Math.max(savedBooks.length - 2, 0))
const progressPresets = [75, 35, 100, 100]

const readingProgress = savedBooks.reduce<Record<string, number>>((accumulator, book, index) => {
  accumulator[book.id] = progressPresets[index] ?? 0
  return accumulator
}, {})

function formatListeningTime(totalMinutes: number) {
  if (totalMinutes >= 60) {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    if (!minutes) {
      return `${hours}h`
    }

    return `${hours}h ${minutes}m`
  }

  return `${totalMinutes}m`
}

function LibraryBookRow({
  book,
  progress,
  isDownloaded
}: {
  book: LibraryBook
  progress: number
  isDownloaded: boolean
}) {
  const router = useRouter()
  const isInProgress = progress > 0 && progress < 100

  const openBook = () => {
    router.push({
      pathname: "/book/[id]",
      params: { id: book.id }
    })
  }

  return (
    <Pressable
      onPress={openBook}
      style={({ pressed }) => ({
        flexDirection: "row",
        gap: 14,
        borderRadius: 16,
        backgroundColor: "#171717",
        padding: 14,
        opacity: pressed ? 0.88 : 1
      })}
    >
      <View
        style={{
          position: "relative",
          width: 80,
          height: 112,
          overflow: "hidden",
          borderRadius: 10
        }}
      >
        <Image
          source={{ uri: book.coverImage }}
          style={{ width: "100%", height: "100%" }}
          contentFit="cover"
        />

        {isDownloaded && (
          <View
            style={{
              position: "absolute",
              right: 6,
              bottom: 6,
              width: 22,
              height: 22,
              borderRadius: 7,
              backgroundColor: "rgba(212,175,55,0.95)",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <Ionicons name="download-outline" size={13} color="#050505" />
          </View>
        )}
      </View>

      <View style={{ flex: 1, justifyContent: "space-between", paddingVertical: 2 }}>
        <View>
          <Text
            numberOfLines={1}
            style={{
              color: "white",
              fontSize: 16,
              fontWeight: "600"
            }}
          >
            {book.title}
          </Text>

          <Text style={{ color: "#8A8A8A", fontSize: 13, marginTop: 2 }}>
            {book.author}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 14, marginTop: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="time-outline" size={13} color="#7A7A7A" />
              <Text style={{ color: "#7A7A7A", fontSize: 12 }}>
                {book.duration} min
              </Text>
            </View>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Ionicons name="book-outline" size={13} color="#7A7A7A" />
              <Text style={{ color: "#7A7A7A", fontSize: 12 }}>
                {book.chapters.length} chapitres
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 12 }}>
          <View
            style={{
              height: 6,
              borderRadius: 999,
              overflow: "hidden",
              backgroundColor: "#2B2B2B"
            }}
          >
            <View
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: progress === 100 ? "#22C55E" : "#D4AF37",
                borderRadius: 999
              }}
            />
          </View>

          <View
            style={{
              marginTop: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between"
            }}
          >
            <Text style={{ color: "#8A8A8A", fontSize: 12 }}>
              {progress === 100 ? "Terminé" : `${progress}% complété`}
            </Text>

            {isInProgress && (
              <Pressable
                onPress={(event) => {
                  event.stopPropagation()
                  openBook()
                }}
                style={({ pressed }) => ({
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 8,
                  paddingVertical: 5,
                  borderRadius: 999,
                  backgroundColor: "rgba(212,175,55,0.14)",
                  opacity: pressed ? 0.75 : 1
                })}
              >
                <Ionicons name="play" size={11} color="#D4AF37" />
                <Text style={{ color: "#D4AF37", fontSize: 12, fontWeight: "600" }}>
                  Reprendre
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  )
}

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("all")
  const router = useRouter()

  const inProgressBooks = useMemo(
    () =>
      savedBooks.filter((book) => {
        const progress = readingProgress[book.id]
        return progress > 0 && progress < 100
      }),
    []
  )

  const completedBooks = useMemo(
    () => savedBooks.filter((book) => readingProgress[book.id] === 100),
    []
  )

  const filteredBooks = useMemo(() => {
    switch (activeTab) {
      case "in-progress":
        return inProgressBooks
      case "downloaded":
        return downloadedBooks
      case "completed":
        return completedBooks
      default:
        return savedBooks
    }
  }, [activeTab, completedBooks, inProgressBooks])

  const tabs: Array<{ value: TabType; label: string; count: number }> = [
    { value: "all", label: "Tous", count: savedBooks.length },
    { value: "in-progress", label: "En cours", count: inProgressBooks.length },
    { value: "downloaded", label: "Téléchargés", count: downloadedBooks.length },
    { value: "completed", label: "Terminés", count: completedBooks.length }
  ]

  const totalListeningMinutes = savedBooks.reduce((total, book) => {
    const progress = readingProgress[book.id] ?? 0
    return total + Math.round((book.duration * progress) / 100)
  }, 0)

  const totalKeyIdeas = savedBooks.reduce((total, book) => total + book.keyIdeas.length, 0)

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <TopHeader />

      <View style={{ flex: 1, paddingTop: 102 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 8 }}>
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "700"
            }}
          >
            Ma Bibliothèque
          </Text>

          <Text style={{ color: "#8A8A8A", fontSize: 14, marginTop: 6 }}>
            {savedBooks.length} livre{savedBooks.length > 1 ? "s" : ""} sauvegardé
            {savedBooks.length > 1 ? "s" : ""}
          </Text>
        </View>

        <View
          style={{
            borderBottomWidth: 1,
            borderBottomColor: "#1C1C1C",
            backgroundColor: "rgba(11,11,11,0.96)"
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 8,
              paddingBottom: 14,
              gap: 8
            }}
          >
            {tabs.map((tab) => {
              const isActive = tab.value === activeTab

              return (
                <Pressable
                  key={tab.value}
                  onPress={() => setActiveTab(tab.value)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    borderRadius: 999,
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    backgroundColor: isActive ? "#D4AF37" : "#171717",
                    opacity: pressed ? 0.8 : 1
                  })}
                >
                  <Text
                    style={{
                      color: isActive ? "#050505" : "#A0A0A0",
                      fontSize: 13,
                      fontWeight: "600"
                    }}
                  >
                    {tab.label}
                  </Text>

                  <View
                    style={{
                      minWidth: 22,
                      borderRadius: 999,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      backgroundColor: isActive ? "rgba(5,5,5,0.14)" : "#2A2A2A"
                    }}
                  >
                    <Text
                      style={{
                        color: isActive ? "#050505" : "#8A8A8A",
                        fontSize: 11,
                        fontWeight: "700",
                        textAlign: "center"
                      }}
                    >
                      {tab.count}
                    </Text>
                  </View>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingTop: 18,
            paddingBottom: 110
          }}
        >
          {filteredBooks.length > 0 ? (
            <View style={{ gap: 14 }}>
              {filteredBooks.map((book) => (
                <LibraryBookRow
                  key={book.id}
                  book={book}
                  progress={readingProgress[book.id] ?? 0}
                  isDownloaded={downloadedBooks.some((downloadedBook) => downloadedBook.id === book.id)}
                />
              ))}
            </View>
          ) : (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 72,
                paddingHorizontal: 20
              }}
            >
              <Ionicons
                name="book-outline"
                size={48}
                color="rgba(160,160,160,0.45)"
                style={{ marginBottom: 16 }}
              />

              <Text
                style={{
                  color: "white",
                  fontSize: 18,
                  fontWeight: "600",
                  marginBottom: 6
                }}
              >
                Aucun livre
              </Text>

              <Text
                style={{
                  color: "#8A8A8A",
                  fontSize: 14,
                  textAlign: "center",
                  lineHeight: 20,
                  marginBottom: 18
                }}
              >
                {activeTab === "downloaded"
                  ? "Téléchargez des livres pour les écouter hors ligne"
                  : "Commencez à explorer et ajouter des livres"}
              </Text>

              <Pressable
                onPress={() => router.push("/explore")}
                style={({ pressed }) => ({
                  borderRadius: 999,
                  backgroundColor: "#D4AF37",
                  paddingHorizontal: 18,
                  paddingVertical: 12,
                  opacity: pressed ? 0.84 : 1
                })}
              >
                <Text style={{ color: "#050505", fontSize: 14, fontWeight: "700" }}>
                  Explorer les livres
                </Text>
              </Pressable>
            </View>
          )}

          <View
            style={{
              marginTop: 18,
              borderRadius: 18,
              backgroundColor: "#171717",
              padding: 20
            }}
          >
            <Text
              style={{
                color: "white",
                fontSize: 18,
                fontWeight: "600",
                marginBottom: 16
              }}
            >
              Vos statistiques
            </Text>

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 12 }}>
              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    color: "#D4AF37",
                    fontSize: 28,
                    fontWeight: "700"
                  }}
                >
                  {completedBooks.length}
                </Text>
                <Text style={{ color: "#8A8A8A", fontSize: 12, textAlign: "center", marginTop: 4 }}>
                  Livres lus
                </Text>
              </View>

              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    color: "#D4AF37",
                    fontSize: 28,
                    fontWeight: "700"
                  }}
                >
                  {formatListeningTime(totalListeningMinutes)}
                </Text>
                <Text style={{ color: "#8A8A8A", fontSize: 12, textAlign: "center", marginTop: 4 }}>
                  Temps d'écoute
                </Text>
              </View>

              <View style={{ flex: 1, alignItems: "center" }}>
                <Text
                  style={{
                    color: "#D4AF37",
                    fontSize: 28,
                    fontWeight: "700"
                  }}
                >
                  {totalKeyIdeas}
                </Text>
                <Text style={{ color: "#8A8A8A", fontSize: 12, textAlign: "center", marginTop: 4 }}>
                  Idées clés
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>

      <BottomNav />
    </View>
  )
}
