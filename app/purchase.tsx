import { Alert, View, Text, Pressable, ScrollView } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { unlockBook, usePurchasedBook } from "../hooks/usePurchasedBooks"

export default function PurchaseScreen() {
  const router = useRouter()
  const { bookId, title } = useLocalSearchParams()
  const selectedBookId = Array.isArray(bookId) ? bookId[0] : bookId
  const selectedTitle = Array.isArray(title) ? title[0] : title
  const isPurchased = usePurchasedBook(selectedBookId)

  const handlePurchase = () => {
    if (!selectedBookId) {
      Alert.alert(
        "Livre introuvable",
        "Impossible de débloquer ce résumé pour le moment."
      )
      return
    }

    if (isPurchased) {
      router.back()
      return
    }

    unlockBook(selectedBookId)

    Alert.alert(
      "Achat réussi",
      "Les chapitres premium sont maintenant déverrouillés.",
      [
        {
          text: "Continuer",
          onPress: () => router.back()
        }
      ]
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>

      {/* HEADER */}
      <View style={{ flexDirection: "row", padding: 16 }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20 }}>

        {/* TITLE */}
        <Text style={{ color: "white", fontSize: 26, fontWeight: "bold" }}>
          Débloquer le résumé 🔓
        </Text>

        <Text style={{ color: "#888", marginTop: 10 }}>
          Accède au résumé complet de :
        </Text>

        <Text style={{ color: "#D4AF37", fontSize: 18, marginTop: 5 }}>
          {selectedTitle || "ce résumé"}
        </Text>

        {/* BENEFITS */}
        <View style={{ marginTop: 30, gap: 15 }}>
          <Feature text="Résumé audio complet" />
          <Feature text="Lecture illimitée" />
          <Feature text="Accès à vie" />
        </View>

        {/* PRICE */}
        <View
          style={{
            marginTop: 40,
            padding: 20,
            backgroundColor: "#1A1A1A",
            borderRadius: 12,
            alignItems: "center"
          }}
        >
          <Text style={{ color: "#888" }}>Prix unique</Text>

          <Text style={{ color: "#D4AF37", fontSize: 28, fontWeight: "bold", marginTop: 10 }}>
            1.99$
          </Text>
        </View>

        {/* CTA */}
        <Pressable
          style={{
            marginTop: 30,
            backgroundColor: "#D4AF37",
            padding: 15,
            borderRadius: 10,
            alignItems: "center",
            opacity: selectedBookId ? 1 : 0.6
          }}
          onPress={handlePurchase}
        >
          <Text style={{ fontWeight: "bold" }}>
            {isPurchased ? "Retour au résumé" : "Acheter le résumé"}
          </Text>
        </Pressable>

        {/* FOOTER */}
        <Text
          style={{
            color: "#666",
            fontSize: 12,
            marginTop: 20,
            textAlign: "center"
          }}
        >
          Accès immédiat après paiement
        </Text>

      </ScrollView>
    </View>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Ionicons name="checkmark-circle" size={20} color="#D4AF37" />
      <Text style={{ color: "white", marginLeft: 10 }}>
        {text}
      </Text>
    </View>
  )
}
