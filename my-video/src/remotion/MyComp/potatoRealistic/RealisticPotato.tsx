import React, { useMemo } from "react";
import { createPotatoGeometry, createPotatoTextures } from "./potatoGeometry";

export const RealisticPotato: React.FC<{ seed?: number }> = ({ seed = 1 }) => {
  const geometry = useMemo(() => createPotatoGeometry(seed), [seed]);
  const { diffuseTexture, roughnessTexture } = useMemo(
    () => createPotatoTextures(seed),
    [seed],
  );

  return (
    <mesh geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        map={diffuseTexture}
        roughnessMap={roughnessTexture}
        roughness={1}
        metalness={0}
        bumpMap={roughnessTexture}
        bumpScale={0.015}
      />
    </mesh>
  );
};
