import { type ComponentProps } from "react"
import { Pressable, Text, View } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export interface AudioPlayerChapter {
  id: string
  title: string
  content: string
  duration: number
  isFree?: boolean
}

interface AudioPlayerProps {
  currentChapter: AudioPlayerChapter
  isPlaying: boolean
  isPaused: boolean
  positionMs: number
  durationMs: number
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onSeekBackward: () => void
  onSeekForward: () => void
  onPreviousChapter: () => void
  onNextChapter: () => void
  canGoPrevious: boolean
  canGoNext: boolean
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

function ControlButton({
  icon,
  onPress,
  disabled = false,
  label,
  filled = false
}: {
  icon: ComponentProps<typeof Ionicons>["name"]
  onPress: () => void
  disabled?: boolean
  label?: string
  filled?: boolean
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => ({
        alignItems: "center",
        justifyContent: "center",
        opacity: disabled ? 0.35 : pressed ? 0.78 : 1
      })}
    >
      <View
        style={{
          width: filled ? 46 : 38,
          height: filled ? 46 : 38,
          borderRadius: filled ? 23 : 19,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: filled ? "#D4AF37" : "transparent"
        }}
      >
        <Ionicons
          name={icon}
          size={filled ? 22 : 20}
          color={filled ? "#050505" : "#F5F5F5"}
        />
      </View>

      {label ? (
        <Text style={{ color: "#7A7A7A", fontSize: 10, marginTop: 4 }}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  )
}

export function AudioPlayer({
  currentChapter,
  isPlaying,
  isPaused,
  positionMs,
  durationMs,
  onPause,
  onResume,
  onStop,
  onSeekBackward,
  onSeekForward,
  onPreviousChapter,
  onNextChapter,
  canGoPrevious,
  canGoNext
}: AudioPlayerProps) {
  const progress = durationMs > 0 ? Math.min(positionMs / durationMs, 1) : 0
  const playbackLabel = isPlaying
    ? "Lecture en cours"
    : isPaused
      ? "Lecture en pause"
      : "Prêt à lire"

  return (
    <View
      style={{
        position: "absolute",
        left: 12,
        right: 12,
        bottom: 82,
        borderRadius: 22,
        overflow: "hidden"
      }}
    >
      <LinearGradient
        colors={["rgba(30,30,30,0.98)", "rgba(12,12,12,0.98)"]}
        style={{
          paddingHorizontal: 16,
          paddingTop: 14,
          paddingBottom: 16,
          borderWidth: 1,
          borderColor: "rgba(212,175,55,0.14)"
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8
          }}
        >
          <View style={{ flex: 1, paddingRight: 12 }}>
            <Text
              style={{
                color: "#D4AF37",
                fontSize: 11,
                fontWeight: "700",
                textTransform: "uppercase"
              }}
            >
              {playbackLabel}
            </Text>

            <Text
              numberOfLines={1}
              style={{
                color: "white",
                fontSize: 15,
                fontWeight: "700",
                marginTop: 4
              }}
            >
              {currentChapter.title}
            </Text>

            <Text
              style={{
                color: "#8A8A8A",
                fontSize: 12,
                marginTop: 2
              }}
            >
              {currentChapter.isFree ? "Introduction gratuite" : "Chapitre premium"} • {currentChapter.duration} min
            </Text>
          </View>

          <ControlButton
            icon={isPlaying ? "pause" : "play"}
            onPress={isPlaying ? onPause : onResume}
            filled
          />
        </View>

        <View
          style={{
            height: 5,
            borderRadius: 999,
            overflow: "hidden",
            backgroundColor: "#2B2B2B",
            marginBottom: 6
          }}
        >
          <View
            style={{
              width: `${progress * 100}%`,
              height: "100%",
              backgroundColor: "#D4AF37",
              borderRadius: 999
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12
          }}
        >
          <Text style={{ color: "#8A8A8A", fontSize: 11 }}>
            {formatTime(positionMs)}
          </Text>

          <Text style={{ color: "#8A8A8A", fontSize: 11 }}>
            {formatTime(durationMs)}
          </Text>
        </View>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <ControlButton
            icon="play-skip-back"
            onPress={onPreviousChapter}
            disabled={!canGoPrevious}
            label="Préc"
          />

          <ControlButton
            icon="play-back"
            onPress={onSeekBackward}
            label="-5s"
          />

          <ControlButton
            icon="stop"
            onPress={onStop}
            label="Stop"
          />

          <ControlButton
            icon="play-forward"
            onPress={onSeekForward}
            label="+5s"
          />

          <ControlButton
            icon="play-skip-forward"
            onPress={onNextChapter}
            disabled={!canGoNext}
            label="Suiv"
          />
        </View>
      </LinearGradient>
    </View>
  )
}
