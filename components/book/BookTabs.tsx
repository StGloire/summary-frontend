// frontend/components/book/BookTabs.tsx
import { Pressable, Text, View } from "react-native"

type Tab = "summary" | "chapters" | "ideas"

const tabs: { id: Tab; label: string }[] = [
  { id: "summary", label: "Resume" },
  { id: "chapters", label: "Chapitres" },
  { id: "ideas", label: "Idees cles" }
]

type Props = {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
}

export function BookTabs({ activeTab, onTabChange }: Props) {
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#1D1D1D"
      }}
    >
      <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id

          return (
            <Pressable
              key={tab.id}
              onPress={() => onTabChange(tab.id)}
              style={{
                flex: 1,
                alignItems: "center",
                paddingVertical: 14,
                borderBottomWidth: 2,
                borderBottomColor: isActive ? "#D4AF37" : "transparent"
              }}
            >
              <Text
                style={{
                  color: isActive ? "white" : "#8A8A8A",
                  fontSize: 14,
                  fontWeight: "700"
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}