// frontend/app/_layout.tsx

import { Stack } from "expo-router"
import { View, ActivityIndicator, Text } from "react-native"
import { AuthProvider } from "../contexts/AuthContext"
import { useAuth } from "@/hooks/useAuth"

// ✅ Composant SplashScreen
function SplashScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#0B0B0B",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <ActivityIndicator size="large" color="#D4AF37" />
      <Text
        style={{
          color: "#D4AF37",
          marginTop: 16,
          fontSize: 16,
          fontWeight: "500"
        }}
      >
        Chargement...
      </Text>
    </View>
  )
}

// ✅ Composant qui utilise useAuth (à l'intérieur du Provider)
function AppContent() {
  const { loading } = useAuth()

  if (loading) {
    return <SplashScreen />
  }

  return <Stack screenOptions={{ headerShown: false }} />
}

// ✅ Layout principal
export default function Layout() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}