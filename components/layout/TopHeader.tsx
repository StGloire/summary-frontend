import { View, Text, Pressable } from "react-native"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../../hooks/useAuth" // ✅ Ajouté

interface TopHeaderProps {
  transparent?: boolean
  showSearch?: boolean
  showNotifications?: boolean
  showAuth?: boolean // ✅ Ajouté
}

export function TopHeader({
  transparent = false,
  showSearch = true,
  showNotifications = true,
  showAuth = false // ✅ Par défaut false
}: TopHeaderProps) {
  const router = useRouter()
  const { token } = useAuth() // ✅ Récupère le token pour savoir si l'utilisateur est connecté

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: transparent ? "transparent" : "rgba(11,11,11,0.9)",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* Logo */}
      <Pressable
        onPress={() => router.push("/")}
        style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
      >
        <Image
          source={require("../../assets/images/logo.png")}
          style={{ width: 36, height: 36 }}
        />
        <Text
          style={{
            color: "#D4AF37",
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          SUMMARY
        </Text>
      </Pressable>

      {/* Actions */}
      <View style={{ flexDirection: "row", gap: 10 }}>
        
        {showSearch && (
          <Pressable
            onPress={() => router.push("/explore")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              padding: 8
            })}
          >
            <Ionicons name="search-outline" size={22} color="#ccc" />
          </Pressable>
        )}

        {showNotifications && (
          <Pressable
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              padding: 8
            })}
          >
            <View>
              <Ionicons name="notifications-outline" size={22} color="#ccc" />

              {/* Badge */}
              <View
                style={{
                  position: "absolute",
                  top: 2,
                  right: 2,
                  width: 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: "#D4AF37"
                }}
              />
            </View>
          </Pressable>
        )}

        {/* ✅ Bouton d'authentification - visible seulement si showAuth est true et utilisateur non connecté */}
        {showAuth && !token && (
          <Pressable
            onPress={() => router.push("/auth/login")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              padding: 8
            })}
          >
            <Ionicons name="log-in-outline" size={22} color="#ccc" />
          </Pressable>
        )}

        {/* ✅ Optionnel : Icône de profil quand connecté */}
        {showAuth && token && (
          <Pressable
            onPress={() => router.push("/profile")}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              padding: 8
            })}
          >
            <Ionicons name="person-circle-outline" size={22} color="#D4AF37" />
          </Pressable>
        )}
      </View>
    </View>
  )
}