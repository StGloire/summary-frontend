import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from "react-native"
import { useRouter } from "expo-router"

import { useAuth } from "../hooks/useAuth"

export default function AuthScreen() {
  const router = useRouter()
  const { login, register, loading } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async () => {
    if (!email || !password) return

    const res = isLogin
      ? await login(email, password)
      : await register(email, password)

    if (res.token) {
      router.replace("/") // 🔥 redirection home
    } else {
      alert("Erreur d'authentification")
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#0B0B0B" }}
    >
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>

        {/* LOGO */}
        <Text
          style={{
            color: "#D4AF37",
            fontSize: 28,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10
          }}
        >
          SUMMARY
        </Text>

        <Text
          style={{
            color: "#aaa",
            textAlign: "center",
            marginBottom: 40
          }}
        >
          Apprends plus vite en quelques minutes
        </Text>

        {/* EMAIL */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          style={{
            backgroundColor: "#1A1A1A",
            color: "white",
            padding: 14,
            borderRadius: 10,
            marginBottom: 12
          }}
        />

        {/* PASSWORD */}
        <TextInput
          placeholder="Mot de passe"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={{
            backgroundColor: "#1A1A1A",
            color: "white",
            padding: 14,
            borderRadius: 10,
            marginBottom: 20
          }}
        />

        {/* BUTTON */}
        <Pressable
          onPress={handleSubmit}
          style={{
            backgroundColor: "#D4AF37",
            padding: 16,
            borderRadius: 12,
            alignItems: "center"
          }}
        >
          <Text style={{ fontWeight: "bold", color: "#000" }}>
            {loading
              ? "Chargement..."
              : isLogin
              ? "Se connecter"
              : "Créer un compte"}
          </Text>
        </Pressable>

        {/* SWITCH */}
        <Pressable
          onPress={() => setIsLogin(!isLogin)}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "#aaa", textAlign: "center" }}>
            {isLogin
              ? "Pas de compte ? S'inscrire"
              : "Déjà un compte ? Se connecter"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}