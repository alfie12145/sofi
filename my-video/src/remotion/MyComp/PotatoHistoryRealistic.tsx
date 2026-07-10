import { ThreeCanvas } from "@remotion/three";
import React, { Suspense, useLayoutEffect, useMemo } from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  staticFile,
  useCurrentFrame,
  useDelayRender,
} from "remotion";
import {
  POTATO_DURATION_IN_FRAMES,
  POTATO_HEIGHT,
  POTATO_WIDTH,
} from "../../../types/constants";
import { Beat, buildSceneBeats } from "./potatoRealistic/beats";
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

type GlobalBeat = Beat & { absStart: number; absEnd: number; sceneIndex: number };

const globalBeats: GlobalBeat[] = scenes.flatMap((scene, sceneIndex) =>
  buildSceneBeats(scene.text, scene.duration, sceneIndex).map((beat) => ({
    ...beat,
    absStart: starts[sceneIndex] + beat.localStart,
    absEnd: starts[sceneIndex] + beat.localEnd,
    sceneIndex,
  })),
);

function findSceneIndex(frame: number): number {
  for (let i = 0; i < scenes.length; i++) {
    if (frame < starts[i] + scenes[i].duration) return i;
  }
  return scenes.length - 1;
}

function findBeatIndex(frame: number): number {
  for (let i = 0; i < globalBeats.length; i++) {
    if (frame < globalBeats[i].absEnd) return i;
  }
  return globalBeats.length - 1;
}

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
  const sceneIndex = findSceneIndex(frame);
  const beatIndex = findBeatIndex(frame);
  const scene = scenes[sceneIndex];
  const beat = globalBeats[beatIndex];

  return (
    <RealisticScene
      bg={scene.bg}
      accent={scene.accent}
      mood={scene.mood}
      muted={scene.muted}
      beat={beat}
      beatLocalFrame={frame - beat.absStart}
      overallFrame={frame}
      sceneLocalFrame={frame - starts[sceneIndex]}
      sceneDuration={scene.duration}
    />
  );
};

const CutFlash: React.FC = () => {
  const frame = useCurrentFrame();
  const beatIndex = findBeatIndex(frame);
  const beat = globalBeats[beatIndex];
  const localFrame = frame - beat.absStart;

  if (frame === 0) return null;

  const opacity = interpolate(localFrame, [0, 1, 4], [0, 0.28, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  if (opacity <= 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "white",
        opacity,
        pointerEvents: "none",
      }}
    />
  );
};

const CutStingers: React.FC = () => (
  <>
    {globalBeats.map((beat, i) => {
      if (beat.absStart === 0) return null;
      const src = beat.isSceneStart ? "whoosh.wav" : "pop.wav";
      return (
        <Sequence key={i} from={beat.absStart - 2} durationInFrames={20}>
          <Audio src={staticFile(`sfx/${src}`)} volume={beat.isSceneStart ? 0.55 : 0.35} />
        </Sequence>
      );
    })}
  </>
);

const WordCaption: React.FC = () => {
  const frame = useCurrentFrame();
  const beatIndex = findBeatIndex(frame);
  const beat = globalBeats[beatIndex];
  const localFrame = frame - beat.absStart;
  const beatDuration = beat.absEnd - beat.absStart;

  const opacity = interpolate(
    localFrame,
    [0, 6, Math.max(6, beatDuration - 6), beatDuration],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 230,
        display: "flex",
        justifyContent: "center",
        padding: "0 64px",
        opacity,
      }}
    >
      <div
        style={{
          fontSize: 66,
          fontWeight: 800,
          color: "white",
          textAlign: "center",
          lineHeight: 1.15,
          fontFamily,
          textShadow: "0 4px 24px rgba(0,0,0,0.6)",
        }}
      >
        {beat.words.map((w, i) => (
          <span
            key={i}
            style={{
              color: i === beat.emphasisIndex ? "#fde047" : "white",
              marginRight: 16,
            }}
          >
            {w}
          </span>
        ))}
      </div>
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
      <CutFlash />
      <CutStingers />
      <WordCaption />
      <ProgressBar />
      <Watermark />
    </AbsoluteFill>
  );
};
