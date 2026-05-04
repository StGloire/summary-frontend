import { useState } from "react"
import { ScrollView, Text, Pressable } from "react-native"

interface CategoryFilterProps {
  categories: string[]
  onCategoryChange?: (category: string) => void
}

export function CategoryFilter({
  categories,
  onCategoryChange
}: CategoryFilterProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0])

  const handlePress = (category: string) => {
    setActiveCategory(category)
    onCategoryChange?.(category)
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: 20,
        gap: 8
      }}
    >
      {categories.map((category) => {
        const isActive = activeCategory === category

        return (
          <Pressable
            key={category}
            onPress={() => handlePress(category)}
            style={({ pressed }) => ({
              backgroundColor: isActive ? "#D4AF37" : "#1A1A1A",
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 20,
              opacity: pressed ? 0.7 : 1
            })}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: "500",
                color: isActive ? "#000" : "#ccc"
              }}
            >
              {category}
            </Text>
          </Pressable>
        )
      })}
    </ScrollView>
  )
}
