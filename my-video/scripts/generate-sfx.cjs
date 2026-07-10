const fs = require("fs");
const path = require("path");

const SAMPLE_RATE = 44100;

function writeWav(filePath, samples) {
  const numSamples = samples.length;
  const dataSize = numSamples * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(1, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < numSamples; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(s * 32767), 44 + i * 2);
  }

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, buffer);
  console.log("wrote", filePath, `${(numSamples / SAMPLE_RATE).toFixed(3)}s`);
}

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Whip-pan whoosh: filtered-noise sweep with a falling pitch tone, ~200ms
function generateWhoosh() {
  const duration = 0.22;
  const n = Math.floor(SAMPLE_RATE * duration);
  const rand = mulberry32(42);
  const samples = new Float32Array(n);
  let lp = 0;
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.sin(Math.PI * t) ** 0.7;
    const noise = rand() * 2 - 1;
    lp += (noise - lp) * 0.35;
    const toneFreq = 900 - 650 * t;
    const tone = Math.sin((2 * Math.PI * toneFreq * i) / SAMPLE_RATE);
    samples[i] = (lp * 0.75 + tone * 0.35) * env * 0.7;
  }
  return samples;
}

// Snap/pop: short percussive click, ~90ms
function generatePop() {
  const duration = 0.09;
  const n = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const t = i / n;
    const env = Math.exp(-t * 18);
    const freq = 520 - 300 * t;
    samples[i] = Math.sin((2 * Math.PI * freq * i) / SAMPLE_RATE) * env * 0.8;
  }
  return samples;
}

const outDir = path.join(__dirname, "..", "public", "sfx");
writeWav(path.join(outDir, "whoosh.wav"), generateWhoosh());
writeWav(path.join(outDir, "pop.wav"), generatePop());
