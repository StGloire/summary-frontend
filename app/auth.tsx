// frontend/app/auth.tsx
import { useState } from "react"
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons" // ✅ Ajouté

import { useAuth } from "../hooks/useAuth"

export default function AuthScreen() {
  const router = useRouter()
  const { signIn, signUp, loading } = useAuth()

  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false) // ✅ Ajouté

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs")
      return
    }

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password)
      }
      
      router.replace("/")
      
    } catch (error: any) {
      Alert.alert(
        "Erreur d'authentification",
        error.message || "Une erreur est survenue"
      )
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#0B0B0B" }}
    >
      <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
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

        <TextInput
          placeholder="Email"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{
            backgroundColor: "#1A1A1A",
            color: "white",
            padding: 14,
            borderRadius: 10,
            marginBottom: 12
          }}
        />

        {/* ✅ Champ mot de passe avec bouton pour afficher/masquer */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1A1A1A",
            borderRadius: 10,
            marginBottom: 20
          }}
        >
          <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#666"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={{
              flex: 1,
              color: "white",
              padding: 14,
            }}
          />
          
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={{ padding: 14 }}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#8A8A8A"
            />
          </Pressable>
        </View>

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: "#D4AF37",
            padding: 16,
            borderRadius: 12,
            alignItems: "center",
            opacity: loading ? 0.6 : 1
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