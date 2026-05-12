// frontend/components/book/SummaryTab.tsx
import { Text, View } from "react-native"
import type { Book } from "../../data/books"

type Props = {
  book: Book
}

export function SummaryTab({ book }: Props) {
  return (
    <View style={{ gap: 16 }}>
      <Text style={{ color: "#E8E8E8", lineHeight: 24 }}>{book.summary}</Text>

      <View
        style={{
          borderRadius: 18,
          backgroundColor: "#141414",
          borderWidth: 1,
          borderColor: "#232323",
          padding: 16
        }}
      >
        <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>A propos de l&apos;auteur</Text>

        <Text style={{ color: "#9A9A9A", lineHeight: 22, marginTop: 10 }}>
          {book.author} est un auteur reconnu dans le domaine du {book.category.toLowerCase()}. Ses
          ouvrages ont aide des millions de lecteurs a travers le monde.
        </Text>
      </View>
    </View>
  )
}