// frontend/components/book/IdeasTab.tsx
import { Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type Props = {
  ideas: string[]
}

export function IdeasTab({ ideas }: Props) {
  return (
    <View style={{ gap: 14 }}>
      {ideas.map((idea, index) => (
        <View
          key={`idea-${index}`}
          style={{
            flexDirection: "row",
            gap: 12,
            borderRadius: 18,
            backgroundColor: "#141414",
            borderWidth: 1,
            borderColor: "#232323",
            padding: 16
          }}
        >
          <Ionicons name="checkmark-circle" size={20} color="#D4AF37" style={{ marginTop: 1 }} />
          <Text style={{ flex: 1, color: "#E8E8E8", lineHeight: 22 }}>{idea}</Text>
        </View>
      ))}
    </View>
  )
}