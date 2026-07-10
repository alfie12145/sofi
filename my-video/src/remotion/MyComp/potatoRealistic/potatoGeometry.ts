import { createNoise3D } from "simplex-noise";
import * as THREE from "three";

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createPotatoGeometry(seed = 1): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(1, 96, 96);
  const rand = mulberry32(seed);
  const noise3D = createNoise3D(rand);

  const position = geometry.attributes.position;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i);
    const dir = vertex.clone().normalize();

    const large = noise3D(dir.x * 1.1, dir.y * 1.1, dir.z * 1.1) * 0.16;
    const medium = noise3D(dir.x * 3.2 + 10, dir.y * 3.2 + 10, dir.z * 3.2 + 10) * 0.05;
    const fine = noise3D(dir.x * 8 + 30, dir.y * 8 + 30, dir.z * 8 + 30) * 0.02;

    const displacement = 1 + large + medium + fine;
    vertex.copy(dir).multiplyScalar(displacement);
    position.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.scale(1.25, 0.92, 1);
  geometry.computeVertexNormals();
  return geometry;
}

export function createPotatoTextures(seed = 1) {
  const size = 512;
  const rand = mulberry32(seed + 999);
  const noise3D = createNoise3D(rand);

  const diffuseCanvas = document.createElement("canvas");
  diffuseCanvas.width = size;
  diffuseCanvas.height = size;
  const dctx = diffuseCanvas.getContext("2d")!;

  const roughnessCanvas = document.createElement("canvas");
  roughnessCanvas.width = size;
  roughnessCanvas.height = size;
  const rctx = roughnessCanvas.getContext("2d")!;

  const base = { r: 196, g: 154, b: 97 };

  const dImage = dctx.createImageData(size, size);
  const rImage = rctx.createImageData(size, size);

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      const n1 = noise3D(u * 6, v * 6, 0);
      const n2 = noise3D(u * 20, v * 20, 5) * 0.5;
      const n3 = noise3D(u * 60, v * 60, 15) * 0.25;
      const spot = noise3D(u * 30, v * 30, 25);

      const shade = (n1 + n2 + n3) * 18;
      const isEye = spot > 0.72 ? (spot - 0.72) * 3.2 : 0;

      const idx = (y * size + x) * 4;
      dImage.data[idx] = Math.max(0, Math.min(255, base.r + shade - isEye * 90));
      dImage.data[idx + 1] = Math.max(0, Math.min(255, base.g + shade - isEye * 70));
      dImage.data[idx + 2] = Math.max(0, Math.min(255, base.b + shade - isEye * 40));
      dImage.data[idx + 3] = 255;

      const roughVal = Math.max(0, Math.min(255, 200 + shade * 2 - isEye * 60));
      rImage.data[idx] = roughVal;
      rImage.data[idx + 1] = roughVal;
      rImage.data[idx + 2] = roughVal;
      rImage.data[idx + 3] = 255;
    }
  }

  dctx.putImageData(dImage, 0, 0);
  rctx.putImageData(rImage, 0, 0);

  const diffuseTexture = new THREE.CanvasTexture(diffuseCanvas);
  diffuseTexture.wrapS = diffuseTexture.wrapT = THREE.RepeatWrapping;
  diffuseTexture.colorSpace = THREE.SRGBColorSpace;

  const roughnessTexture = new THREE.CanvasTexture(roughnessCanvas);
  roughnessTexture.wrapS = roughnessTexture.wrapT = THREE.RepeatWrapping;

  return { diffuseTexture, roughnessTexture };
}
