import { useEffect, useMemo, useState } from "react"
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  useWindowDimensions,
  View
} from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { BookCard } from "../components/book/BookCard"
import { BottomNav } from "../components/layout/BottomNav"
import { TopHeader } from "../components/layout/TopHeader"
import { categories, getBooksByCategory } from "../data/books"

type SortBy = "recent" | "duration" | "title"
type Book = ReturnType<typeof getBooksByCategory>[number]

const sortOptions: Array<{ value: SortBy; label: string }> = [
  { value: "recent", label: "Récents" },
  { value: "duration", label: "Durée" },
  { value: "title", label: "Titre" }
]

export default function ExploreScreen() {
  const { category } = useLocalSearchParams<{ category?: string | string[] }>()
  const requestedCategory = Array.isArray(category) ? category[0] : category
  const initialCategory =
    requestedCategory && categories.includes(requestedCategory)
      ? requestedCategory
      : "Tous"

  const [searchQuery, setSearchQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState<SortBy>("recent")
  const [showFilters, setShowFilters] = useState(false)

  const { width } = useWindowDimensions()
  const cardSize = width < 380 ? "small" : "medium"
  const cardWidth = cardSize === "small" ? 112 : 144
  const horizontalPadding = 20
  const gridGap = 16
  const availableWidth = Math.max(width - horizontalPadding * 2, cardWidth)
  const columnCount = Math.max(
    2,
    Math.min(5, Math.floor((availableWidth + gridGap) / (cardWidth + gridGap)) || 2)
  )

  const filteredBooks = useMemo(() => {
    let result = getBooksByCategory(activeCategory)

    if (searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase()

      result = result.filter((book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.category.toLowerCase().includes(query)
      )
    }

    switch (sortBy) {
      case "duration":
        result = [...result].sort((a, b) => a.duration - b.duration)
        break
      case "title":
        result = [...result].sort((a, b) => a.title.localeCompare(b.title))
        break
      default:
        break
    }

    return result
  }, [activeCategory, searchQuery, sortBy])

  const rows = useMemo(() => {
    const nextRows: Book[][] = []

    for (let index = 0; index < filteredBooks.length; index += columnCount) {
      nextRows.push(filteredBooks.slice(index, index + columnCount))
    }

    return nextRows
  }, [columnCount, filteredBooks])

  useEffect(() => {
    setActiveCategory(initialCategory)
  }, [initialCategory])

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <TopHeader showSearch={false} />

      <View style={{ flex: 1, paddingTop: 102 }}>
        <View
          style={{
            backgroundColor: "rgba(11,11,11,0.96)",
            borderBottomWidth: 1,
            borderBottomColor: "#1C1C1C"
          }}
        >
          <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 14 }}>
            <Text
              style={{
                color: "white",
                fontSize: 28,
                fontWeight: "700",
                marginBottom: 16
              }}
            >
              Explorer
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#171717",
                borderRadius: 14,
                borderWidth: 1,
                borderColor: showFilters ? "rgba(212,175,55,0.35)" : "#232323",
                paddingLeft: 14,
                paddingRight: 8,
                minHeight: 50
              }}
            >
              <Ionicons name="search-outline" size={18} color="#7A7A7A" />

              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Rechercher un livre, auteur..."
                placeholderTextColor="#7A7A7A"
                style={{
                  flex: 1,
                  color: "white",
                  paddingVertical: 12,
                  paddingHorizontal: 10,
                  fontSize: 14
                }}
              />

              {searchQuery ? (
                <Pressable
                  onPress={() => setSearchQuery("")}
                  style={({ pressed }) => ({
                    padding: 6,
                    opacity: pressed ? 0.7 : 1
                  })}
                >
                  <Ionicons name="close" size={16} color="#A0A0A0" />
                </Pressable>
              ) : null}

              <Pressable
                onPress={() => setShowFilters((current) => !current)}
                style={({ pressed }) => ({
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: showFilters ? "rgba(212,175,55,0.18)" : "transparent",
                  opacity: pressed ? 0.7 : 1
                })}
              >
                <Ionicons
                  name="options-outline"
                  size={18}
                  color={showFilters ? "#D4AF37" : "#A0A0A0"}
                />
              </Pressable>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingBottom: 14,
              gap: 8
            }}
          >
            {categories.map((category) => {
              const isActive = category === activeCategory

              return (
                <Pressable
                  key={category}
                  onPress={() => setActiveCategory(category)}
                  style={({ pressed }) => ({
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                    borderRadius: 999,
                    backgroundColor: isActive ? "#D4AF37" : "#171717",
                    opacity: pressed ? 0.78 : 1
                  })}
                >
                  <Text
                    style={{
                      color: isActive ? "#050505" : "#A0A0A0",
                      fontSize: 13,
                      fontWeight: "600"
                    }}
                  >
                    {category}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>

          {showFilters && (
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#1C1C1C",
                paddingHorizontal: 20,
                paddingTop: 12,
                paddingBottom: 14
              }}
            >
              <Text
                style={{
                  color: "#7A7A7A",
                  fontSize: 12,
                  fontWeight: "600",
                  marginBottom: 10
                }}
              >
                Trier par
              </Text>

              <View style={{ flexDirection: "row", gap: 8 }}>
                {sortOptions.map((option) => {
                  const isActive = option.value === sortBy

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => setSortBy(option.value)}
                      style={({ pressed }) => ({
                        paddingHorizontal: 12,
                        paddingVertical: 8,
                        borderRadius: 10,
                        backgroundColor: isActive ? "rgba(212,175,55,0.18)" : "#171717",
                        opacity: pressed ? 0.78 : 1
                      })}
                    >
                      <Text
                        style={{
                          color: isActive ? "#D4AF37" : "#A0A0A0",
                          fontSize: 12,
                          fontWeight: "600"
                        }}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  )
                })}
              </View>
            </View>
          )}
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 18,
            paddingBottom: 110
          }}
        >
          <Text style={{ color: "#7A7A7A", fontSize: 14, marginBottom: 18 }}>
            {filteredBooks.length} résultat{filteredBooks.length > 1 ? "s" : ""}
          </Text>

          {filteredBooks.length > 0 ? (
            rows.map((row, rowIndex) => (
              <View
                key={`row-${rowIndex}`}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginBottom: 20
                }}
              >
                {row.map((book) => (
                  <BookCard key={book.id} book={book} size={cardSize} />
                ))}

                {row.length < columnCount &&
                  Array.from({ length: columnCount - row.length }).map((_, emptyIndex) => (
                    <View key={`empty-${rowIndex}-${emptyIndex}`} style={{ width: cardWidth }} />
                  ))}
              </View>
            ))
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
                name="search-outline"
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
                Aucun résultat
              </Text>

              <Text
                style={{
                  color: "#7A7A7A",
                  fontSize: 14,
                  textAlign: "center",
                  lineHeight: 20
                }}
              >
                Essayez de modifier vos critères de recherche
              </Text>
            </View>
          )}
        </ScrollView>
      </View>

      <BottomNav />
    </View>
  )
}
