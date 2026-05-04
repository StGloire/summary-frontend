import { type ComponentProps, useEffect, useMemo, useRef, useState } from "react"
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

import { unlockBook, usePurchasedBook } from "../hooks/usePurchasedBooks"

type PaymentMethod = "mtn" | "airtel"
type PaymentStep = "form" | "processing" | "pending"

const paymentMethods: Array<{
  id: PaymentMethod
  label: string
  shortLabel: string
  helper: string
  color: string
  backgroundColor: string
  borderColor: string
  icon: ComponentProps<typeof Ionicons>["name"]
}> = [
  {
    id: "mtn",
    label: "MTN MoMo",
    shortLabel: "MTN",
    helper: "Paiement mobile rapide via MTN Mobile Money",
    color: "#F7C948",
    backgroundColor: "rgba(247,201,72,0.12)",
    borderColor: "rgba(247,201,72,0.30)",
    icon: "phone-portrait-outline"
  },
  {
    id: "airtel",
    label: "Airtel Money",
    shortLabel: "Airtel",
    helper: "Valide la demande de paiement sur ton numéro Airtel",
    color: "#FF5A5F",
    backgroundColor: "rgba(255,90,95,0.12)",
    borderColor: "rgba(255,90,95,0.28)",
    icon: "wifi-outline"
  }
]

export default function PurchaseScreen() {
  const router = useRouter()
  const { bookId, title } = useLocalSearchParams()
  const selectedBookId = Array.isArray(bookId) ? bookId[0] : bookId
  const selectedTitle = Array.isArray(title) ? title[0] : title
  const isPurchased = usePurchasedBook(selectedBookId)

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("mtn")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("form")
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activeMethod = paymentMethods.find((method) => method.id === selectedMethod) ?? paymentMethods[0]
  const sanitizedPhoneNumber = phoneNumber.replace(/\D/g, "")
  const canSubmit = Boolean(selectedBookId) && sanitizedPhoneNumber.length === 9
  const formattedLocalNumber = sanitizedPhoneNumber
    ? `+242 ${sanitizedPhoneNumber}`
    : "+242 -- -- -- --"
  const maskedNumber = sanitizedPhoneNumber
    ? `+242 ${sanitizedPhoneNumber.slice(0, 2)} •• •• ${sanitizedPhoneNumber.slice(-2)}`
    : "+242 •• •• •• ••"
  const paymentReference = useMemo(() => {
    const bookSuffix = (selectedBookId ?? "SUM").slice(-4).toUpperCase()
    return `SUM-${selectedMethod.toUpperCase()}-${bookSuffix}`
  }, [selectedBookId, selectedMethod])

  const clearProcessingTimeout = () => {
    if (!timeoutRef.current) {
      return
    }

    clearTimeout(timeoutRef.current)
    timeoutRef.current = null
  }

  useEffect(() => {
    return () => {
      clearProcessingTimeout()
    }
  }, [])

  const startPaymentSimulation = () => {
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

    if (!canSubmit) {
      Alert.alert(
        "Numéro invalide",
        "Saisis les 9 chiffres de ton numéro Mobile Money pour continuer."
      )
      return
    }

    setPaymentStep("processing")
    clearProcessingTimeout()

    timeoutRef.current = setTimeout(() => {
      setPaymentStep("pending")
      timeoutRef.current = null
    }, 1800)
  }

  const confirmPayment = () => {
    if (!selectedBookId) {
      Alert.alert(
        "Livre introuvable",
        "Impossible de confirmer ce paiement pour le moment."
      )
      return
    }

    unlockBook(selectedBookId)

    Alert.alert(
      "Paiement confirmé",
      `Le paiement ${activeMethod.label} a été validé. Les chapitres premium sont maintenant déverrouillés.`,
      [
        {
          text: "Continuer",
          onPress: () => router.back()
        }
      ]
    )
  }

  const handleMainAction = () => {
    if (paymentStep === "pending") {
      confirmPayment()
      return
    }

    if (paymentStep === "processing") {
      return
    }

    startPaymentSimulation()
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <View style={{ flexDirection: "row", paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="white" />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        <View
          style={{
            borderRadius: 18,
            padding: 18,
            backgroundColor: "#151515",
            borderWidth: 1,
            borderColor: "rgba(212,175,55,0.14)"
          }}
        >
          <View
            style={{
              alignSelf: "flex-start",
              borderRadius: 999,
              backgroundColor: "rgba(212,175,55,0.14)",
              paddingHorizontal: 10,
              paddingVertical: 5
            }}
          >
            <Text style={{ color: "#D4AF37", fontSize: 12, fontWeight: "700" }}>
              Simulation de paiement
            </Text>
          </View>

          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "700",
              marginTop: 14
            }}
          >
            Débloquer le résumé
          </Text>

          <Text style={{ color: "#8A8A8A", marginTop: 8, lineHeight: 20 }}>
            Accède au résumé audio complet et à tous les chapitres premium de :
          </Text>

          <Text
            style={{
              color: "#D4AF37",
              fontSize: 18,
              fontWeight: "700",
              marginTop: 8
            }}
          >
            {selectedTitle || "ce résumé"}
          </Text>
        </View>

        <View
          style={{
            marginTop: 18,
            flexDirection: "row",
            gap: 10
          }}
        >
          {[
            {
              label: "Choix du réseau",
              done: paymentStep === "form" || paymentStep === "processing" || paymentStep === "pending"
            },
            {
              label: "Validation mobile money",
              done: paymentStep === "processing" || paymentStep === "pending"
            },
            {
              label: "Résumé débloqué",
              done: isPurchased
            }
          ].map((step, index) => (
            <View
              key={step.label}
              style={{
                flex: 1,
                borderRadius: 16,
                backgroundColor: step.done ? "rgba(212,175,55,0.14)" : "#141414",
                borderWidth: 1,
                borderColor: step.done ? "rgba(212,175,55,0.26)" : "#222222",
                paddingHorizontal: 12,
                paddingVertical: 12
              }}
            >
              <Text
                style={{
                  color: step.done ? "#D4AF37" : "#6F6F6F",
                  fontSize: 11,
                  fontWeight: "800"
                }}
              >
                0{index + 1}
              </Text>

              <Text
                style={{
                  color: step.done ? "white" : "#8A8A8A",
                  fontSize: 12,
                  fontWeight: "600",
                  marginTop: 6,
                  lineHeight: 16
                }}
              >
                {step.label}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 18, gap: 12 }}>
          <Feature text="Résumé audio complet et chapitres premium" />
          <Feature text="Lecture illimitée dès validation du paiement" />
          <Feature text="Accès à vie sur ce compte" />
        </View>

        <View
          style={{
            marginTop: 26,
            borderRadius: 18,
            backgroundColor: "#171717",
            padding: 18
          }}
        >
          <Text style={{ color: "#8A8A8A", fontSize: 13 }}>
            Montant à payer
          </Text>

          <Text
            style={{
              color: "#D4AF37",
              fontSize: 30,
              fontWeight: "700",
              marginTop: 8
            }}
          >
            1 500 FCFA
          </Text>

          <Text style={{ color: "#6F6F6F", fontSize: 12, marginTop: 6 }}>
            Paiement mobile money local simulé
          </Text>
        </View>

        <View style={{ marginTop: 26 }}>
          <Text style={{ color: "white", fontSize: 17, fontWeight: "700", marginBottom: 12 }}>
            Choisis ton moyen de paiement
          </Text>

          <View style={{ gap: 10 }}>
            {paymentMethods.map((method) => {
              const isActive = method.id === selectedMethod

              return (
                <Pressable
                  key={method.id}
                  onPress={() => setSelectedMethod(method.id)}
                  style={({ pressed }) => ({
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: isActive ? method.borderColor : "#2A2A2A",
                    backgroundColor: isActive ? method.backgroundColor : "#171717",
                    padding: 16,
                    opacity: pressed ? 0.82 : 1
                  })}
                >
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 14,
                        backgroundColor: isActive ? method.color : "#242424",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Ionicons
                        name={method.icon}
                        size={20}
                        color={isActive ? "#050505" : "#B8B8B8"}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: isActive ? method.color : "white",
                          fontSize: 16,
                          fontWeight: "700"
                        }}
                      >
                        {method.label}
                      </Text>

                      <Text style={{ color: "#8A8A8A", fontSize: 12, marginTop: 3 }}>
                        {method.helper}
                      </Text>
                    </View>

                    <Ionicons
                      name={isActive ? "radio-button-on" : "radio-button-off"}
                      size={20}
                      color={isActive ? method.color : "#6F6F6F"}
                    />
                  </View>
                </Pressable>
              )
            })}
          </View>
        </View>

        <View style={{ marginTop: 26 }}>
          <Text style={{ color: "white", fontSize: 17, fontWeight: "700", marginBottom: 12 }}>
            Numéro à débiter
          </Text>

          <View
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: paymentStep === "pending" ? activeMethod.borderColor : "#2A2A2A",
              backgroundColor: "#171717",
              paddingHorizontal: 14,
              paddingVertical: 12
            }}
          >
            <Text style={{ color: "#8A8A8A", fontSize: 12, marginBottom: 8 }}>
              {activeMethod.shortLabel} Mobile Money
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <Text style={{ color: "#D4AF37", fontSize: 16, fontWeight: "700" }}>
                +242
              </Text>

              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="06 123 45 67"
                placeholderTextColor="#6F6F6F"
                editable={paymentStep === "form"}
                style={{
                  flex: 1,
                  color: "white",
                  fontSize: 16,
                  paddingVertical: 0
                }}
              />
            </View>
          </View>

          <Text style={{ color: "#6F6F6F", fontSize: 12, marginTop: 8 }}>
            Entre le numéro local à 9 chiffres associé à ton portefeuille {activeMethod.shortLabel}.
          </Text>
        </View>

        <View
          style={{
            marginTop: 18,
            borderRadius: 18,
            backgroundColor: "#121212",
            borderWidth: 1,
            borderColor: "#202020",
            padding: 16
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <Text style={{ color: "white", fontSize: 15, fontWeight: "700" }}>
              Détails de la demande
            </Text>

            <View
              style={{
                borderRadius: 999,
                backgroundColor: activeMethod.backgroundColor,
                paddingHorizontal: 10,
                paddingVertical: 5
              }}
            >
              <Text style={{ color: activeMethod.color, fontSize: 11, fontWeight: "800" }}>
                {activeMethod.shortLabel}
              </Text>
            </View>
          </View>

          <View style={{ marginTop: 16, gap: 12 }}>
            <DetailRow label="Montant" value="1 500 FCFA" />
            <DetailRow label="Canal" value={activeMethod.label} />
            <DetailRow label="Numéro" value={paymentStep === "form" ? formattedLocalNumber : maskedNumber} />
            <DetailRow label="Référence" value={paymentReference} />
          </View>
        </View>

        {paymentStep !== "form" && (
          <View
            style={{
              marginTop: 22,
              borderRadius: 18,
              padding: 16,
              backgroundColor: paymentStep === "pending" ? activeMethod.backgroundColor : "#171717",
              borderWidth: 1,
              borderColor: paymentStep === "pending" ? activeMethod.borderColor : "#2A2A2A"
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: paymentStep === "pending" ? activeMethod.color : "#242424",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                {paymentStep === "processing" ? (
                  <ActivityIndicator size="small" color="#D4AF37" />
                ) : (
                  <Ionicons name="phone-portrait-outline" size={18} color="#050505" />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: paymentStep === "pending" ? activeMethod.color : "white",
                    fontSize: 15,
                    fontWeight: "700"
                  }}
                >
                  {paymentStep === "processing"
                    ? "Envoi de la demande de paiement..."
                    : `Demande ${activeMethod.label} envoyée`}
                </Text>

                <Text style={{ color: "#8A8A8A", fontSize: 12, marginTop: 4, lineHeight: 18 }}>
                  {paymentStep === "processing"
                    ? `Connexion à ${activeMethod.label} et préparation de la demande sur ${maskedNumber}.`
                    : `Valide la demande reçue sur ${maskedNumber}, puis reviens confirmer ici pour débloquer le résumé.`}
                </Text>
              </View>
            </View>
          </View>
        )}

        <Pressable
          onPress={handleMainAction}
          disabled={!selectedBookId || paymentStep === "processing" || (!isPurchased && paymentStep === "form" && !canSubmit)}
          style={({ pressed }) => ({
            marginTop: 28,
            borderRadius: 16,
            backgroundColor: "#D4AF37",
            paddingVertical: 16,
            alignItems: "center",
            opacity:
              !selectedBookId || paymentStep === "processing" || (!isPurchased && paymentStep === "form" && !canSubmit)
                ? 0.45
                : pressed
                  ? 0.82
                  : 1
          })}
        >
          <Text style={{ color: "#050505", fontSize: 15, fontWeight: "800" }}>
            {isPurchased
              ? "Retour au résumé"
              : paymentStep === "processing"
                ? "Traitement en cours..."
                : paymentStep === "pending"
                  ? "J'ai confirmé le paiement"
                  : `Payer avec ${activeMethod.label}`}
          </Text>
        </Pressable>

        {paymentStep === "pending" && !isPurchased && (
          <Pressable
            onPress={() => {
              clearProcessingTimeout()
              setPaymentStep("form")
            }}
            style={({ pressed }) => ({
              marginTop: 12,
              alignItems: "center",
              opacity: pressed ? 0.75 : 1
            })}
          >
            <Text style={{ color: "#8A8A8A", fontSize: 13 }}>
              Modifier le numéro ou le moyen de paiement
            </Text>
          </Pressable>
        )}

        <Text
          style={{
            color: "#6F6F6F",
            fontSize: 12,
            marginTop: 18,
            textAlign: "center",
            lineHeight: 18
          }}
        >
          Simulation locale: aucune transaction réelle n'est envoyée.
          Le résumé est débloqué après validation de cette étape.
        </Text>
      </ScrollView>
    </View>
  )
}

function Feature({ text }: { text: string }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Ionicons name="checkmark-circle" size={20} color="#D4AF37" />
      <Text style={{ color: "white", marginLeft: 10, flex: 1 }}>
        {text}
      </Text>
    </View>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16
      }}
    >
      <Text style={{ color: "#7D7D7D", fontSize: 12 }}>
        {label}
      </Text>

      <Text
        style={{
          color: "white",
          fontSize: 13,
          fontWeight: "700",
          textAlign: "right",
          flexShrink: 1
        }}
      >
        {value}
      </Text>
    </View>
  )
}
