import { View, Text, Pressable } from "react-native"
import { Image } from "expo-image"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

interface TopHeaderProps {
  transparent?: boolean
  showSearch?: boolean
  showNotifications?: boolean
}

export function TopHeader({
  transparent = false,
  showSearch = true,
  showNotifications = true
}: TopHeaderProps) {
  const router = useRouter()

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
      </View>
    </View>
  )
}
