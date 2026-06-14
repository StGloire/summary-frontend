// frontend/app/auth/register.tsx

import { useState } from "react"

import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert
} from "react-native"

import { useRouter } from "expo-router"

import { useAuth } from "../../hooks/useAuth"

export default function RegisterScreen() {
  const router = useRouter()

  const { signUp } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [loading, setLoading] = useState(false)

  async function handleRegister() {
    if (!email || !password) {
      Alert.alert(
        "Champs requis",
        "Veuillez remplir tous les champs."
      )
      return
    }

    try {
      setLoading(true)

      await signUp(email, password)

      router.replace("/profile")
    } catch {
      Alert.alert(
        "Inscription échouée",
        "Impossible de créer le compte."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        justifyContent: "center",
        padding: 24
      }}
    >
      <Text
        style={{
          color: "white",
          fontSize: 32,
          fontWeight: "700",
          marginBottom: 32
        }}
      >
        Créer un compte
      </Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{
          backgroundColor: "#141414",
          color: "white",
          padding: 16,
          borderRadius: 12,
          marginBottom: 16
        }}
      />

      <TextInput
        placeholder="Mot de passe"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{
          backgroundColor: "#141414",
          color: "white",
          padding: 16,
          borderRadius: 12,
          marginBottom: 24
        }}
      />

      <Pressable
        onPress={handleRegister}
        style={({ pressed }) => ({
          backgroundColor: "#D4AF37",
          padding: 16,
          borderRadius: 12,
          alignItems: "center",
          opacity: pressed ? 0.8 : 1
        })}
      >
        <Text
          style={{
            color: "#050505",
            fontWeight: "700",
            fontSize: 16
          }}
        >
          {loading ? "Création..." : "Créer un compte"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/auth/login")}
        style={{
          marginTop: 24,
          alignItems: "center"
        }}
      >
        <Text style={{ color: "#D4AF37" }}>
          Déjà un compte ? Se connecter
        </Text>
      </Pressable>
    </View>
  )
}