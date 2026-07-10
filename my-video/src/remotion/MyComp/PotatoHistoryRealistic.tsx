import { ThreeCanvas } from "@remotion/three";
import React, { Suspense, useLayoutEffect } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  staticFile,
  useCurrentFrame,
  useDelayRender,
} from "remotion";
import {
  POTATO_DURATION_IN_FRAMES,
  POTATO_HEIGHT,
  POTATO_WIDTH,
} from "../../../types/constants";
import { RealisticScene } from "./potatoRealistic/RealisticScene";
import { Mood } from "./potatoRealistic/types";

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

type SceneData = {
  text: string;
  sub?: string;
  mood: Mood;
  bg: string;
  accent: string;
  duration: number;
  muted?: boolean;
};

const scenes: SceneData[] = [
  { text: "This vegetable got BANNED by an entire country.", sub: "Yeah. The potato.", mood: "alarmed", bg: "#78350f", accent: "#fdba74", duration: 127 },
  { text: "History's most slept-on icon.", mood: "proud", bg: "#b45309", accent: "#fde68a", duration: 63 },
  { text: "Peru. About 8,000 years ago.", mood: "normal", bg: "#166534", accent: "#86efac", duration: 84 },
  { text: "Andean farmers domesticate the potato.", mood: "normal", bg: "#15803d", accent: "#bbf7d0", duration: 77 },
  { text: "Humanity's first real glow-up.", mood: "excited", bg: "#d97706", accent: "#fef3c7", duration: 71 },
  { text: "Enter: Spanish conquistadors.", mood: "alarmed", bg: "#1e3a8a", accent: "#93c5fd", duration: 48 },
  { text: "Looking for gold.", mood: "sneaky", bg: "#b45309", accent: "#fde68a", duration: 56 },
  { text: "Found potatoes instead.", mood: "alarmed", bg: "#1e40af", accent: "#93c5fd", duration: 37 },
  { text: "Took those too.", mood: "sneaky", bg: "#1d4ed8", accent: "#bfdbfe", duration: 48 },
  { text: "Shipped to Europe. Nobody's impressed.", mood: "sad", bg: "#475569", accent: "#cbd5e1", duration: 37 },
  { text: "Potatoes are related to deadly nightshade.", mood: "alarmed", bg: "#7f1d1d", accent: "#fca5a5", duration: 72 },
  { text: "Europe: “yep, that'll kill us.”", mood: "alarmed", bg: "#991b1b", accent: "#fecaca", duration: 73 },
  { text: "France BANS growing potatoes. Illegal produce.", mood: "alarmed", bg: "#7f1d1d", accent: "#fca5a5", duration: 61 },
  { text: "Then one guy, Parmentier, has an idea.", mood: "sneaky", bg: "#b45309", accent: "#fde68a", duration: 102 },
  { text: "Guard the potato fields... by day.", mood: "sneaky", bg: "#78350f", accent: "#fdba74", duration: 55 },
  { text: "Leave them wide open at night.", mood: "sneaky", bg: "#1e1b4b", accent: "#a5b4fc", duration: 80 },
  { text: "Peasants think: “must be valuable” — steal it all.", mood: "excited", bg: "#d97706", accent: "#fef3c7", duration: 131 },
  { text: "Congrats France, you got marketed by a vegetable.", mood: "proud", bg: "#b45309", accent: "#fde68a", duration: 74 },
  { text: "Potatoes go mainstream. Population booms.", mood: "excited", bg: "#166534", accent: "#86efac", duration: 85 },
  { text: "Ireland leans a little too hard into ONE variety.", mood: "normal", bg: "#15803d", accent: "#bbf7d0", duration: 96 },
  { text: "1840s blight wipes it out.", mood: "sad", bg: "#334155", accent: "#cbd5e1", duration: 93 },
  { text: "The Great Famine. A real tragedy that changed history.", mood: "sad", bg: "#1e293b", accent: "#94a3b8", duration: 105, muted: true },
  { text: "Today: the 4th biggest food crop on Earth.", mood: "proud", bg: "#166534", accent: "#86efac", duration: 128 },
  { text: "NASA even tested growing potatoes on simulated Mars soil.", mood: "excited", bg: "#1e1b4b", accent: "#a5b4fc", duration: 114 },
  { text: "Potatoes said: “bet.”", mood: "sneaky", bg: "#d97706", accent: "#fef3c7", duration: 47 },
  { text: "Follow for food history nobody asked for, but everybody needed.", mood: "excited", bg: "#b45309", accent: "#fde68a", duration: 106 },
];

let cursor = 0;
const starts = scenes.map((s) => {
  const start = cursor;
  cursor += s.duration;
  return start;
});

const SuspenseUnblocker: React.FC = () => {
  const { delayRender, continueRender } = useDelayRender();
  useLayoutEffect(() => {
    const handle = delayRender("Waiting for 3D assets to load");
    return () => continueRender(handle);
  }, [delayRender, continueRender]);
  return null;
};

const Scene3D: React.FC = () => {
  const frame = useCurrentFrame();

  let activeIndex = scenes.length - 1;
  for (let i = 0; i < scenes.length; i++) {
    if (frame < starts[i] + scenes[i].duration) {
      activeIndex = i;
      break;
    }
  }
  const scene = scenes[activeIndex];
  const localFrame = frame - starts[activeIndex];

  return (
    <RealisticScene
      bg={scene.bg}
      accent={scene.accent}
      mood={scene.mood}
      muted={scene.muted}
      localFrame={localFrame}
      overallFrame={frame}
      duration={scene.duration}
    />
  );
};

const CaptionOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  let activeIndex = scenes.length - 1;
  for (let i = 0; i < scenes.length; i++) {
    if (frame < starts[i] + scenes[i].duration) {
      activeIndex = i;
      break;
    }
  }
  const scene = scenes[activeIndex];
  const localFrame = frame - starts[activeIndex];

  const opacity = interpolate(
    localFrame,
    [0, 10, scene.duration - 8, scene.duration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const rise = interpolate(localFrame, [0, 14], [24, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 210,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 70px",
        opacity,
        transform: `translateY(${rise}px)`,
      }}
    >
      <div
        style={{
          fontSize: 62,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          lineHeight: 1.2,
          fontFamily,
          textShadow: "0 4px 24px rgba(0,0,0,0.55)",
        }}
      >
        {scene.text}
      </div>
      {scene.sub && (
        <div
          style={{
            marginTop: 18,
            fontSize: 36,
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            textAlign: "center",
            fontFamily,
            textShadow: "0 2px 16px rgba(0,0,0,0.5)",
          }}
        >
          {scene.sub}
        </div>
      )}
    </div>
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

export const PotatoHistoryRealistic: React.FC = () => {
  return (
    <AbsoluteFill>
      <Audio src={staticFile("potato-voiceover.mp3")} />
      <ThreeCanvas width={POTATO_WIDTH} height={POTATO_HEIGHT} shadows>
        <Suspense fallback={<SuspenseUnblocker />}>
          <Scene3D />
        </Suspense>
      </ThreeCanvas>
      <CaptionOverlay />
      <ProgressBar />
      <Watermark />
    </AbsoluteFill>
  );
};
