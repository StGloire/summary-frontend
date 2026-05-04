import { type ComponentProps, useMemo, useState } from "react"
import { Alert, Pressable, ScrollView, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

import { BottomNav } from "../components/layout/BottomNav"
import { TopHeader } from "../components/layout/TopHeader"

type MenuItem = {
  icon: ComponentProps<typeof Ionicons>["name"]
  label: string
  value?: string
  accent?: boolean
}

const userData = {
  name: "Jean Dupont",
  email: "jean@example.com",
  isPremium: true,
  memberSince: "Janvier 2024",
  stats: {
    booksRead: 12,
    totalTime: 18,
    currentStreak: 7,
    longestStreak: 14
  }
}

const weeklyProgress = [100, 100, 75, 100, 50, 0, 0]
const weekDays = ["L", "M", "M", "J", "V", "S", "D"]

function StatCard({
  icon,
  value,
  label,
  highlight = false
}: {
  icon: ComponentProps<typeof Ionicons>["name"]
  value: string | number
  label: string
  highlight?: boolean
}) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 16,
        padding: 16,
        backgroundColor: highlight ? "rgba(212,175,55,0.10)" : "#171717",
        borderWidth: highlight ? 1 : 0,
        borderColor: highlight ? "rgba(212,175,55,0.22)" : "transparent"
      }}
    >
      <View style={{ marginBottom: 10, flexDirection: "row", alignItems: "center", gap: 8 }}>
        <Ionicons
          name={icon}
          size={16}
          color={highlight ? "#D4AF37" : "#8A8A8A"}
        />
      </View>

      <Text
        style={{
          color: highlight ? "#D4AF37" : "white",
          fontSize: 28,
          fontWeight: "700"
        }}
      >
        {value}
      </Text>

      <Text style={{ color: "#8A8A8A", fontSize: 12, marginTop: 4 }}>
        {label}
      </Text>
    </View>
  )
}

export default function ProfileScreen() {
  const [dailyGoal] = useState(15)

  const todayIndex = useMemo(() => {
    const day = new Date().getDay()
    return (day + 6) % 7
  }, [])

  const menuItems: MenuItem[] = [
    {
      icon: "diamond-outline",
      label: "Abonnement Premium",
      value: "Actif",
      accent: true
    },
    {
      icon: "flag-outline",
      label: "Objectif quotidien",
      value: `${dailyGoal} min`
    },
    {
      icon: "notifications-outline",
      label: "Notifications",
      value: "Activées"
    },
    {
      icon: "moon-outline",
      label: "Mode sombre",
      value: "Activé"
    },
    {
      icon: "help-circle-outline",
      label: "Aide & Support"
    },
    {
      icon: "settings-outline",
      label: "Paramètres"
    }
  ]

  const showPlaceholder = (title: string) => {
    Alert.alert(title, "Cette section sera bientôt connectée.")
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0B0B0B" }}>
      <TopHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: 102,
          paddingBottom: 110
        }}
      >
        <View style={{ position: "relative", paddingHorizontal: 20, paddingBottom: 24 }}>
          <LinearGradient
            colors={["rgba(212,175,55,0.12)", "rgba(212,175,55,0.03)", "transparent"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 0,
              height: 190
            }}
          />

          <View
            style={{
              position: "relative",
              flexDirection: "row",
              alignItems: "center",
              gap: 16
            }}
          >
            <View style={{ position: "relative" }}>
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "#171717",
                  borderWidth: 2,
                  borderColor: "rgba(212,175,55,0.20)",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Ionicons name="person-outline" size={36} color="#D4AF37" />
              </View>

              {userData.isPremium && (
                <View
                  style={{
                    position: "absolute",
                    right: -2,
                    bottom: -2,
                    width: 28,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: "#D4AF37",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Ionicons name="diamond" size={14} color="#050505" />
                </View>
              )}
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: "white",
                  fontSize: 22,
                  fontWeight: "700"
                }}
              >
                {userData.name}
              </Text>

              <Text style={{ color: "#8A8A8A", fontSize: 14, marginTop: 4 }}>
                {userData.email}
              </Text>

              <Text style={{ color: "#D4AF37", fontSize: 12, marginTop: 6 }}>
                Membre depuis {userData.memberSince}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
            <StatCard
              icon="book-outline"
              value={userData.stats.booksRead}
              label="Livres lus"
            />
            <StatCard
              icon="time-outline"
              value={`${userData.stats.totalTime}h`}
              label="Temps d'écoute"
            />
          </View>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <StatCard
              icon="flag-outline"
              value={userData.stats.currentStreak}
              label="Jours consécutifs"
              highlight
            />
            <StatCard
              icon="headset-outline"
              value={userData.stats.longestStreak}
              label="Record personnel"
            />
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
          <View
            style={{
              borderRadius: 18,
              backgroundColor: "#171717",
              padding: 20
            }}
          >
            <View
              style={{
                marginBottom: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between"
              }}
            >
              <Text style={{ color: "white", fontSize: 18, fontWeight: "600" }}>
                Cette semaine
              </Text>

              <Text style={{ color: "#D4AF37", fontSize: 14, fontWeight: "600" }}>
                85% objectif
              </Text>
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between", gap: 8 }}>
              {weekDays.map((day, index) => {
                const progress = weeklyProgress[index]
                const isToday = index === todayIndex

                return (
                  <View
                    key={`${day}-${index}`}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      gap: 8
                    }}
                  >
                    <View
                      style={{
                        width: "100%",
                        height: 64,
                        borderRadius: 999,
                        overflow: "hidden",
                        backgroundColor: "#2B2B2B",
                        justifyContent: "flex-end",
                        borderWidth: isToday ? 2 : 0,
                        borderColor: isToday ? "rgba(212,175,55,0.30)" : "transparent"
                      }}
                    >
                      <View
                        style={{
                          width: "100%",
                          height: `${progress}%`,
                          backgroundColor: "#D4AF37"
                        }}
                      />
                    </View>

                    <Text
                      style={{
                        color: isToday ? "#D4AF37" : "#8A8A8A",
                        fontSize: 12,
                        fontWeight: isToday ? "700" : "500"
                      }}
                    >
                      {day}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, paddingVertical: 8, gap: 8 }}>
          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => showPlaceholder(item.label)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 16,
                borderRadius: 16,
                padding: 16,
                backgroundColor: item.accent ? "rgba(212,175,55,0.10)" : "#171717",
                opacity: pressed ? 0.84 : 1
              })}
            >
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: item.accent ? "#D4AF37" : "#242424"
                }}
              >
                <Ionicons
                  name={item.icon}
                  size={18}
                  color={item.accent ? "#050505" : "#8A8A8A"}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: item.accent ? "#D4AF37" : "white",
                    fontSize: 15,
                    fontWeight: "600"
                  }}
                >
                  {item.label}
                </Text>
              </View>

              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                {item.value ? (
                  <Text style={{ color: "#8A8A8A", fontSize: 13 }}>
                    {item.value}
                  </Text>
                ) : null}

                <Ionicons name="chevron-forward" size={16} color="#7A7A7A" />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
          <Pressable
            onPress={() => Alert.alert("Déconnexion", "Action de déconnexion simulée.")}
            style={({ pressed }) => ({
              width: "100%",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 14,
              backgroundColor: pressed ? "rgba(239,68,68,0.12)" : "transparent"
            })}
          >
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={{ color: "#EF4444", fontSize: 15, fontWeight: "600" }}>
              Se déconnecter
            </Text>
          </Pressable>
        </View>

        <Text
          style={{
            paddingHorizontal: 20,
            paddingTop: 8,
            textAlign: "center",
            color: "#6F6F6F",
            fontSize: 12
          }}
        >
          SUMMARY v1.0.0
        </Text>
      </ScrollView>

      <BottomNav />
    </View>
  )
}
