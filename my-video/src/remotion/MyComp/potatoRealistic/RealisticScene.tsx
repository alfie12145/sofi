import { ContactShadows, Environment, PerspectiveCamera } from "@react-three/drei";
import { interpolate } from "remotion";
import React from "react";
import { RealisticPotato } from "./RealisticPotato";
import type { Beat } from "./beats";
import type { Mood } from "./types";

const MOOD_DISTANCE: Record<Mood, number> = {
  normal: 12,
  excited: 10.3,
  alarmed: 9.6,
  sneaky: 11.2,
  sad: 13.5,
  proud: 11.5,
};

export const RealisticScene: React.FC<{
  bg: string;
  accent: string;
  mood: Mood;
  muted?: boolean;
  beat: Beat;
  beatLocalFrame: number;
  overallFrame: number;
  sceneLocalFrame: number;
  sceneDuration: number;
}> = ({
  bg,
  accent,
  mood,
  muted,
  beat,
  beatLocalFrame,
  overallFrame,
  sceneLocalFrame,
  sceneDuration,
}) => {
  const baseDistance = MOOD_DISTANCE[mood];
  const distance = baseDistance * beat.cameraDistanceMul;

  const camX = Math.sin(beat.cameraAngle) * distance * 0.5;
  const camZ = Math.cos(beat.cameraAngle) * distance;
  const camY = beat.cameraHeight;
  const yaw = Math.atan2(camX, camZ);

  const scenePopIn = interpolate(sceneLocalFrame, [0, 14], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const scenePopOut = interpolate(
    sceneLocalFrame,
    [sceneDuration - 10, sceneDuration],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );
  const scenePop = Math.min(scenePopIn, scenePopOut);

  const punch = muted
    ? 1
    : interpolate(beatLocalFrame, [0, 6], [1.09, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  const rotationSpeed = muted ? 0.012 : 0.045;
  const rotation = overallFrame * rotationSpeed;
  const bob = muted ? 0 : Math.sin(overallFrame / 20) * 0.05;

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 9, 20]} />
      <PerspectiveCamera
        makeDefault
        position={[camX, camY, camZ]}
        rotation={[-0.08, yaw, 0]}
        fov={34}
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
      <group position={[0, bob, 0]} rotation={[0, rotation, 0]} scale={scenePop * punch}>
        <RealisticPotato seed={3} />
      </group>
      <ContactShadows position={[0, -0.58, 0]} opacity={0.55} scale={6} blur={2.2} far={2} />
    </>
  );
};
