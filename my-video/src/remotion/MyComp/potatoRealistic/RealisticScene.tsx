import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { interpolate } from "remotion";
import React from "react";
import { RealisticPotato } from "./RealisticPotato";
import type { Mood } from "./types";

const MOOD_DISTANCE: Record<Mood, number> = {
  normal: 11,
  excited: 9.3,
  alarmed: 8.6,
  sneaky: 10.2,
  sad: 12.5,
  proud: 10.5,
};

const MOOD_SPEED: Record<Mood, number> = {
  normal: 1,
  excited: 1.6,
  alarmed: 1.9,
  sneaky: 0.7,
  sad: 0.35,
  proud: 0.8,
};

export const RealisticScene: React.FC<{
  bg: string;
  accent: string;
  mood: Mood;
  muted?: boolean;
  localFrame: number;
  overallFrame: number;
  duration: number;
}> = ({ bg, accent, mood, muted, localFrame, overallFrame, duration }) => {
  const distance = MOOD_DISTANCE[mood];
  const speed = muted ? 0.3 : MOOD_SPEED[mood];

  const popIn = interpolate(localFrame, [0, 16], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const popOut = interpolate(localFrame, [duration - 10, duration], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const pop = Math.min(popIn, popOut);
  const cameraDistance = distance + (1 - pop) * 3;

  const rotation = (overallFrame / 90) * speed;
  const bob = muted ? 0 : Math.sin(overallFrame / 20) * 0.05;

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 9, 20]} />
      <PerspectiveCamera
        makeDefault
        position={[0, 1.4, cameraDistance]}
        rotation={[-0.1, 0, 0]}
        fov={32}
      />
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[2, 4, 3]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-3, 1.5, -2]} intensity={0.5} color={accent} />
      <pointLight position={[0, 1, 3]} intensity={muted ? 0.2 : 0.6} color={accent} />
      <Environment resolution={128}>
        <mesh position={[0, 2, -3]}>
          <planeGeometry args={[8, 4]} />
          <meshBasicMaterial color="#fff4e0" />
        </mesh>
        <mesh position={[-3, 1, 2]} rotation={[0, Math.PI / 3, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial color={accent} />
        </mesh>
        <mesh position={[3, 0, 2]} rotation={[0, -Math.PI / 3, 0]}>
          <planeGeometry args={[4, 4]} />
          <meshBasicMaterial color={bg} />
        </mesh>
      </Environment>
      <group position={[0, bob, 0]} rotation={[0, rotation, 0]} scale={pop}>
        <RealisticPotato seed={3} />
      </group>
      <ContactShadows position={[0, -0.58, 0]} opacity={0.55} scale={6} blur={2.2} far={2} />
    </>
  );
};
