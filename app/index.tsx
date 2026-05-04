import { useMemo, useState } from "react"
import { ScrollView, Text, View } from "react-native"
import { HeroSection } from "../components/sections/HeroSection"
import { BookCarousel } from "../components/book/BookCarousel"
import { BottomNav } from "../components/layout/BottomNav"
import { TopHeader } from "../components/layout/TopHeader"

import {
  featuredBook,
  newBooks,
  trendingBooks,
  books,
  categories,
  getBooksByCategory
} from "../data/books"

import { CategoryFilter } from "../components/CategoryFilter"
import { ContinueReadingCard } from "../components/cards/ContinueReadingCard"

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Tous")

  const filteredBooks = useMemo(() => getBooksByCategory(activeCategory), [activeCategory])
  const heroBook = activeCategory === "Tous" ? featuredBook : filteredBooks[0] ?? featuredBook

  const categorySections = useMemo(
    () =>
      categories
        .filter((category) => category !== "Tous")
        .map((category) => ({
          title: category,
          books: getBooksByCategory(category),
          seeAllHref: {
            pathname: "/explore" as const,
            params: { category }
          }
        }))
        .filter((section) => section.books.length > 0),
    []
  )

  const continueReadingBook = books[1]
  const shouldShowContinueReading =
    activeCategory === "Tous" || continueReadingBook.category === activeCategory

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <TopHeader transparent />

      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroSection book={heroBook} />

        <View style={{ paddingVertical: 10 }}>
          <CategoryFilter
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </View>

        {activeCategory === "Tous" ? (
          <>
            <BookCarousel title="Tendances du moment" books={trendingBooks} showSeeAll />

            <BookCarousel title="Nouveautés" books={newBooks} showSeeAll />

            {categorySections.map((section) => (
              <BookCarousel
                key={section.title}
                title={section.title}
                books={section.books}
                showSeeAll
                seeAllHref={section.seeAllHref}
              />
            ))}
          </>
        ) : filteredBooks.length > 0 ? (
          <BookCarousel
            title={activeCategory}
            books={filteredBooks}
            showSeeAll
            seeAllHref={{
              pathname: "/explore",
              params: { category: activeCategory }
            }}
          />
        ) : (
          <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 24 }}>
            <Text
              style={{
                color: "#A0A0A0",
                fontSize: 14,
                lineHeight: 20
              }}
            >
              Aucun livre disponible pour cette catégorie pour le moment.
            </Text>
          </View>
        )}

        {shouldShowContinueReading && (
          <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
            <Text
              style={{
                color: "white",
                fontSize: 22,
                fontWeight: "600",
                marginBottom: 14
              }}
            >
              Continuer la lecture
            </Text>

            <ContinueReadingCard book={continueReadingBook} progress={35} />
          </View>
        )}

        {/* espace pour éviter overlap nav */}
        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomNav />
    </View>
  )
}
