import { ScrollView, View } from "react-native"
import { HeroSection } from "../components/sections/HeroSection"
import { BookCarousel } from "../components/book/BookCarousel"
import { BottomNav } from "../components/layout/BottomNav"
import { TopHeader } from "../components/layout/TopHeader"

import {
  featuredBook,
  newBooks,
  trendingBooks,
  books,
  categories
} from "../data/books"

import { CategoryFilter } from "../components/CategoryFilter"
import { ContinueReadingCard } from "../components/cards/ContinueReadingCard"

export default function HomeScreen() {
  const productivityBooks = books.filter(b => b.category === "Productivité")
  const entrepreneurshipBooks = books.filter(b => b.category === "Entrepreneuriat")
  const leadershipBooks = books.filter(b => b.category === "Leadership")

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      
      <TopHeader />

      <ScrollView showsVerticalScrollIndicator={false}>
        
        <HeroSection book={featuredBook} />

        <View style={{ paddingVertical: 10 }}>
          <CategoryFilter categories={categories} />
        </View>

        <BookCarousel title="Tendances du moment" books={trendingBooks} showSeeAll />

        <BookCarousel title="Nouveautés" books={newBooks} showSeeAll />

        <BookCarousel title="Productivité" books={productivityBooks} showSeeAll />

        <BookCarousel title="Entrepreneuriat" books={entrepreneurshipBooks} showSeeAll />

        <BookCarousel title="Leadership" books={leadershipBooks} showSeeAll />

        {/* Continue Reading */}
        <View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
          <ContinueReadingCard book={books[1]} progress={35} />
        </View>

        {/* espace pour éviter overlap nav */}
        <View style={{ height: 80 }} />
      </ScrollView>

      <BottomNav />
    </View>
  )
}
