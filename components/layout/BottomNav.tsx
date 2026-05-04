import { View, Text, Pressable } from "react-native"
import { useRouter, usePathname } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const navItems = [
  { href: "/", icon: "home-outline", label: "Accueil" },
  { href: "/explore", icon: "search-outline", label: "Explorer" },
  { href: "/library", icon: "book-outline", label: "Bibliothèque" },
  { href: "/profile", icon: "person-outline", label: "Profil" },
] as const

export function BottomNav() {
  const router = useRouter()
  const pathname = usePathname()

  return (
    <View
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 70,
        backgroundColor: "#0B0B0B",
        borderTopWidth: 1,
        borderTopColor: "#222",
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href

        return (
          <Pressable
            key={item.href}
            onPress={() => router.push(item.href)}
            style={({ pressed }) => ({
              alignItems: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <Ionicons
              name={item.icon as any}
              size={22}
              color={isActive ? "#D4AF37" : "#888"}
            />
            <Text
              style={{
                fontSize: 11,
                color: isActive ? "#D4AF37" : "#888",
                marginTop: 2,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
