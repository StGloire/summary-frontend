// frontend/components/book/PremiumBanner.tsx
import { Text, View } from "react-native"

type Props = {
  isPurchased: boolean
}

export function PremiumBanner({ isPurchased }: Props) {
  return (
    <View
      style={{
        borderRadius: 16,
        backgroundColor: isPurchased ? "rgba(212,175,55,0.12)" : "#131313",
        borderWidth: 1,
        borderColor: isPurchased ? "rgba(212,175,55,0.24)" : "#222222",
        padding: 14,
        marginBottom: 12
      }}
    >
      <Text style={{ color: "white", fontWeight: "700" }}>
        {isPurchased ? "Contenu premium debloque" : "Introduction gratuite disponible"}
      </Text>

      <Text style={{ color: "#8A8A8A", marginTop: 6, lineHeight: 20 }}>
        {isPurchased
          ? "Tu peux maintenant lire tous les chapitres et passer librement de l'un a l'autre."
          : "L'introduction est accessible librement. Les autres chapitres se debloquent apres la simulation de paiement."}
      </Text>
    </View>
  )
}