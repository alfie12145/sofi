import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { POTATO_DURATION_IN_FRAMES } from "../../../types/constants";

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

type SceneData = {
  text: string;
  sub?: string;
  emoji: string;
  bg: string;
  duration: number;
  muted?: boolean;
};

const scenes: SceneData[] = [
  {
    text: "This vegetable got BANNED by an entire country.",
    sub: "Yeah. The potato.",
    emoji: "🥔",
    bg: "#78350f",
    duration: 127,
  },
  {
    text: "History's most slept-on icon.",
    emoji: "😤",
    bg: "#b45309",
    duration: 63,
  },
  {
    text: "Peru. About 8,000 years ago.",
    emoji: "🏔️",
    bg: "#166534",
    duration: 84,
  },
  {
    text: "Andean farmers domesticate the potato.",
    emoji: "🌱",
    bg: "#15803d",
    duration: 77,
  },
  {
    text: "Humanity's first real glow-up.",
    emoji: "✨",
    bg: "#d97706",
    duration: 71,
  },
  {
    text: "Enter: Spanish conquistadors.",
    emoji: "⚔️",
    bg: "#1e3a8a",
    duration: 48,
  },
  {
    text: "Looking for gold.",
    emoji: "🪙",
    bg: "#b45309",
    duration: 56,
  },
  {
    text: "Found potatoes instead.",
    emoji: "🥔",
    bg: "#1e40af",
    duration: 37,
  },
  {
    text: "Took those too.",
    emoji: "😅",
    bg: "#1d4ed8",
    duration: 48,
  },
  {
    text: "Shipped to Europe. Nobody's impressed.",
    emoji: "😐",
    bg: "#475569",
    duration: 37,
  },
  {
    text: "Potatoes are related to deadly nightshade.",
    emoji: "☠️",
    bg: "#7f1d1d",
    duration: 72,
  },
  {
    text: "Europe: “yep, that'll kill us.”",
    emoji: "🚫",
    bg: "#991b1b",
    duration: 73,
  },
  {
    text: "France BANS growing potatoes. Illegal produce.",
    emoji: "🚨",
    bg: "#7f1d1d",
    duration: 61,
  },
  {
    text: "Then one guy, Parmentier, has an idea.",
    emoji: "💡",
    bg: "#b45309",
    duration: 102,
  },
  {
    text: "Guard the potato fields... by day.",
    emoji: "👮",
    bg: "#78350f",
    duration: 55,
  },
  {
    text: "Leave them wide open at night.",
    emoji: "🌙",
    bg: "#1e1b4b",
    duration: 80,
  },
  {
    text: "Peasants think: “must be valuable” — steal it all.",
    emoji: "🥷",
    bg: "#d97706",
    duration: 131,
  },
  {
    text: "Congrats France, you got marketed by a vegetable.",
    emoji: "🎯",
    bg: "#b45309",
    duration: 74,
  },
  {
    text: "Potatoes go mainstream. Population booms.",
    emoji: "📈",
    bg: "#166534",
    duration: 85,
  },
  {
    text: "Ireland leans a little too hard into ONE variety.",
    emoji: "🇮🇪",
    bg: "#15803d",
    duration: 96,
  },
  {
    text: "1840s blight wipes it out.",
    emoji: "🥀",
    bg: "#334155",
    duration: 93,
  },
  {
    text: "The Great Famine. A real tragedy that changed history.",
    emoji: "🕯️",
    bg: "#1e293b",
    duration: 105,
    muted: true,
  },
  {
    text: "Today: the 4th biggest food crop on Earth.",
    emoji: "🌍",
    bg: "#166534",
    duration: 128,
  },
  {
    text: "NASA even tested growing potatoes on simulated Mars soil.",
    emoji: "🚀",
    bg: "#1e1b4b",
    duration: 114,
  },
  {
    text: "Potatoes said: “bet.”",
    emoji: "🔥",
    bg: "#d97706",
    duration: 47,
  },
  {
    text: "Follow for food history nobody asked for, but everybody needed.",
    emoji: "❤️",
    bg: "#b45309",
    duration: 106,
  },
];

const Scene: React.FC<SceneData> = ({ text, sub, emoji, bg, duration, muted }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeFrames = 8;
  const opacity = interpolate(
    frame,
    [0, fadeFrames, duration - fadeFrames, duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  const scale = muted
    ? 1
    : spring({
        fps,
        frame,
        config: { damping: 12, mass: 0.5 },
        durationInFrames: 15,
      });

  const emojiScale = muted
    ? 1
    : spring({
        fps,
        frame: frame - 4,
        config: { damping: 10 },
        durationInFrames: 20,
      });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: bg,
        justifyContent: "center",
        alignItems: "center",
        padding: 90,
      }}
    >
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 36,
        }}
      >
        <div style={{ fontSize: 150, transform: `scale(${emojiScale})` }}>
          {emoji}
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 800,
            color: "white",
            textAlign: "center",
            lineHeight: 1.15,
            fontFamily,
          }}
        >
          {text}
        </div>
        {sub && (
          <div
            style={{
              fontSize: 42,
              color: "rgba(255,255,255,0.85)",
              textAlign: "center",
              fontFamily,
              fontWeight: 600,
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

const ProgressBar: React.FC = () => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [0, POTATO_DURATION_IN_FRAMES], [0, 100], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 24,
        left: 24,
        right: 24,
        height: 6,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.25)",
      }}
    >
      <div
        style={{
          width: `${progress}%`,
          height: "100%",
          borderRadius: 3,
          backgroundColor: "white",
        }}
      />
    </div>
  );
};

const Watermark: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 50,
        left: 24,
        opacity,
        display: "flex",
        alignItems: "center",
        gap: 10,
        backgroundColor: "rgba(0,0,0,0.35)",
        padding: "10px 18px",
        borderRadius: 999,
        fontFamily,
      }}
    >
      <span style={{ fontSize: 28 }}>🥔</span>
      <span style={{ fontSize: 26, fontWeight: 700, color: "white" }}>
        Potato History
      </span>
    </div>
  );
};

export const PotatoHistory: React.FC = () => {
  let cursor = 0;
  const starts = scenes.map((s) => {
    const start = cursor;
    cursor += s.duration;
    return start;
  });

  return (
    <AbsoluteFill style={{ fontFamily }}>
      <Audio src={staticFile("potato-voiceover.mp3")} />
      {scenes.map((s, i) => (
        <Sequence key={i} from={starts[i]} durationInFrames={s.duration}>
          <Scene {...s} />
        </Sequence>
      ))}
      <ProgressBar />
      <Watermark />
    </AbsoluteFill>
  );
};
