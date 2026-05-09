// frontend/components/book/BookHero.tsx
import { Pressable, Text, View } from "react-native"
import { Image } from "expo-image"
import { Ionicons } from "@expo/vector-icons"
import type { Book } from "../../../data/books"

type Props = {
  book: Book
  onListen: () => void
  onDownload: () => void
}

export function BookHero({ book, onListen, onDownload }: Props) {
  return (
    <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
      <View style={{ flexDirection: "row", gap: 18 }}>
        <View
          style={{
            width: 128,
            height: 192,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: "#1A1A1A"
          }}
        >
          <Image source={{ uri: book.coverImage }} style={{ width: "100%", height: "100%" }} contentFit="cover" />
        </View>

        <View style={{ flex: 1, justifyContent: "space-between", paddingVertical: 4 }}>
          <View>
            <View
              style={{
                alignSelf: "flex-start",
                borderRadius: 999,
                backgroundColor: "rgba(212,175,55,0.14)",
                paddingHorizontal: 10,
                paddingVertical: 5
              }}
            >
              <Text style={{ color: "#D4AF37", fontSize: 12, fontWeight: "700" }}>{book.category}</Text>
            </View>

            <Text
              style={{
                color: "white",
                fontSize: 28,
                fontWeight: "800",
                lineHeight: 32,
                marginTop: 12
              }}
            >
              {book.title}
            </Text>

            <Text style={{ color: "#9A9A9A", fontSize: 14, marginTop: 8 }}>
              par <Text style={{ color: "#D4AF37" }}>{book.author}</Text>
            </Text>
          </View>

          <View style={{ gap: 10, marginTop: 18 }}>
            <MetaPill icon="time-outline" label={`${book.duration} min`} />
            <MetaPill icon="book-outline" label={`${book.chapters.length} chapitres`} />
          </View>
        </View>
      </View>

      <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
        <Pressable
          onPress={onListen}
          style={({ pressed }) => ({
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 16,
            backgroundColor: "#D4AF37",
            paddingVertical: 16,
            opacity: pressed ? 0.82 : 1
          })}
        >
          <Ionicons name="play" size={18} color="#050505" />
          <Text style={{ color: "#050505", fontSize: 15, fontWeight: "800" }}>Ecouter</Text>
        </Pressable>

        <Pressable
          onPress={onDownload}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#2A2A2A",
            backgroundColor: "#121212",
            paddingHorizontal: 18,
            paddingVertical: 16,
            opacity: pressed ? 0.82 : 1
          })}
        >
          <Ionicons name="download-outline" size={18} color="#F5F5F5" />
          <Text style={{ color: "#F5F5F5", fontSize: 14, fontWeight: "700" }}>Telecharger</Text>
        </Pressable>
      </View>
    </View>
  )
}

function MetaPill({ icon, label }: { icon: any; label: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        alignSelf: "flex-start",
        gap: 8,
        borderRadius: 999,
        backgroundColor: "#141414",
        paddingHorizontal: 12,
        paddingVertical: 9
      }}
    >
      <Ionicons name={icon} size={15} color="#9A9A9A" />
      <Text style={{ color: "#BDBDBD", fontSize: 13, fontWeight: "600" }}>{label}</Text>
    </View>
  )
}