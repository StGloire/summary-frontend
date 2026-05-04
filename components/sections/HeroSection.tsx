import { View, Text, Pressable, Dimensions } from "react-native"
import { Image } from "expo-image"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const { height } = Dimensions.get("window")

interface Book {
  id: string
  title: string
  author: string
  coverImage: string
  duration: number
  category: string
  chapters: any[]
  summary: string
  isNew?: boolean
}

interface HeroSectionProps {
  book: Book
}

export function HeroSection({ book }: HeroSectionProps) {
  const router = useRouter()

  return (
    <View style={{ height: height * 0.7, minHeight: 500 }}>
      
      {/* Background */}
      <Image
        source={{ uri: book.coverImage }}
        style={{ position: "absolute", width: "100%", height: "100%" }}
        contentFit="cover"
      />

      {/* Gradient overlay */}
      <LinearGradient 
        colors={["transparent", "rgba(0,0,0,0.5)", "rgba(11,11,11,0.95)"]}
        style={{ position: "absolute", width: "100%", height: "100%" }}
      />

      {/* Content */}
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          paddingHorizontal: 20,
          paddingBottom: 30
        }}
      >
        {/* Badges */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 10 }}>
          <View
            style={{
              backgroundColor: "rgba(212,175,55,0.2)",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6
            }}
          >
            <Text style={{ color: "#D4AF37", fontSize: 12, fontWeight: "600" }}>
              {book.category}
            </Text>
          </View>

          {book.isNew && (
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.1)",
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 6
              }}
            >
              <Text style={{ color: "white", fontSize: 12 }}>
                Nouveau
              </Text>
            </View>
          )}
        </View>

        {/* Title */}
        <Text
          numberOfLines={2}
          style={{
            fontSize: 28,
            fontWeight: "bold",
            color: "white",
            marginBottom: 6
          }}
        >
          {book.title}
        </Text>

        {/* Author */}
        <Text style={{ color: "#ccc", marginBottom: 10 }}>
          par <Text style={{ color: "#D4AF37" }}>{book.author}</Text>
        </Text>

        {/* Meta */}
        <View style={{ flexDirection: "row", gap: 16, marginBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="time-outline" size={14} color="#ccc" />
            <Text style={{ color: "#ccc" }}>{book.duration} min</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="book-outline" size={14} color="#ccc" />
            <Text style={{ color: "#ccc" }}>
              {book.chapters.length} chapitres
            </Text>
          </View>
        </View>

        {/* Summary */}
        <Text
          numberOfLines={3}
          style={{
            color: "#ddd",
            marginBottom: 16,
            fontSize: 13,
            lineHeight: 18
          }}
        >
          {book.summary}
        </Text>

        {/* Buttons */}
        <View style={{ flexDirection: "row", gap: 10 }}>
          
          {/* Play */}
          <Pressable
            onPress={() => router.push(`/book/${book.id}`)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#D4AF37",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8
            }}
          >
            <Ionicons name="play" size={16} color="black" />
            <Text style={{ marginLeft: 6, fontWeight: "600" }}>
              Écouter
            </Text>
          </Pressable>

          {/* Learn more */}
          <Pressable
            onPress={() => router.push(`/book/${book.id}`)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              borderWidth: 1,
              borderColor: "#aaa",
              paddingHorizontal: 16,
              paddingVertical: 10,
              borderRadius: 8
            }}
          >
            <Ionicons name="book-outline" size={16} color="white" />
            <Text style={{ marginLeft: 6, color: "white" }}>
              Détails
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}
