// frontend/app/profile.tsx
import { View, Text, Pressable, Alert, ScrollView } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../hooks/useAuth"
import { BottomNav } from "../components/layout/BottomNav"
import { TopHeader } from "../components/layout/TopHeader"

export default function ProfileScreen() {
  const router = useRouter()
  const { user, token, logout, purchases } = useAuth()
  const isLoggedIn = !!token

  const handleLogout = async () => {
    Alert.alert(
      "Déconnexion",
      "Voulez-vous vraiment vous déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Se déconnecter", 
          style: "destructive",
          onPress: async () => {
            await logout()
            router.replace("/")
          }
        }
      ]
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <TopHeader transparent={false} showSearch={false} showNotifications={false} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 100, paddingBottom: 80 }}
      >
        <View style={{ paddingHorizontal: 20 }}>
          {/* En-tête profil */}
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "#1A1A1A",
                alignItems: "center",
                justifyContent: "center",
                borderWidth: 2,
                borderColor: "#D4AF37"
              }}
            >
              <Ionicons name="person" size={50} color="#D4AF37" />
            </View>
            
            <Text style={{ color: "white", fontSize: 24, fontWeight: "700", marginTop: 16 }}>
              {isLoggedIn ? user?.email || "Utilisateur" : "Invité"}
            </Text>
            
            <Text style={{ color: "#8A8A8A", fontSize: 14, marginTop: 4 }}>
              {isLoggedIn ? "Compte premium" : "Compte gratuit"}
            </Text>
          </View>

          {/* Stats */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              backgroundColor: "#141414",
              borderRadius: 16,
              padding: 16,
              marginBottom: 24,
              borderWidth: 1,
              borderColor: "#232323"
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#D4AF37", fontSize: 20, fontWeight: "700" }}>
                {purchases.length}
              </Text>
              <Text style={{ color: "#8A8A8A", fontSize: 12, marginTop: 4 }}>
                Résumés achetés
              </Text>
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#D4AF37", fontSize: 20, fontWeight: "700" }}>
                {isLoggedIn ? "✓" : "—"}
              </Text>
              <Text style={{ color: "#8A8A8A", fontSize: 12, marginTop: 4 }}>
                Statut
              </Text>
            </View>
          </View>

          {/* Menu */}
          <View style={{ gap: 12 }}>
            <MenuItem 
              icon="bookmark-outline" 
              label="Mes favoris" 
              onPress={() => Alert.alert("Bientôt disponible")}
            />
            <MenuItem 
              icon="download-outline" 
              label="Téléchargements" 
              onPress={() => Alert.alert("Bientôt disponible")}
            />
            <MenuItem 
              icon="settings-outline" 
              label="Paramètres" 
              onPress={() => Alert.alert("Bientôt disponible")}
            />
          </View>

          {/* Bouton Auth / Logout */}
          <View style={{ marginTop: 32, gap: 12 }}>
            {!isLoggedIn ? (
              <Pressable
                onPress={() => router.push("/auth")}
                style={({ pressed }) => ({
                  backgroundColor: "#D4AF37",
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1
                })}
              >
                <Text style={{ color: "#050505", fontWeight: "700", fontSize: 16 }}>
                  Se connecter / Créer un compte
                </Text>
              </Pressable>
            ) : (
              <Pressable
                onPress={handleLogout}
                style={({ pressed }) => ({
                  backgroundColor: "#1A1A1A",
                  borderWidth: 1,
                  borderColor: "#333",
                  padding: 16,
                  borderRadius: 12,
                  alignItems: "center",
                  opacity: pressed ? 0.8 : 1
                })}
              >
                <Text style={{ color: "#FF5A5F", fontWeight: "700", fontSize: 16 }}>
                  Se déconnecter
                </Text>
              </Pressable>
            )}
          </View>

          {/* Version */}
          <Text style={{ color: "#555", fontSize: 12, textAlign: "center", marginTop: 32 }}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>

      <BottomNav />
    </View>
  )
}

function MenuItem({ icon, label, onPress }: { icon: any; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: "#141414",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#232323",
        opacity: pressed ? 0.8 : 1
      })}
    >
      <Ionicons name={icon} size={22} color="#D4AF37" />
      <Text style={{ color: "white", fontSize: 16, flex: 1 }}>{label}</Text>
      <Ionicons name="chevron-forward" size={18} color="#666" />
    </Pressable>
  )
}