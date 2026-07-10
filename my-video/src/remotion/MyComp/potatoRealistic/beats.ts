export function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Beat = {
  localStart: number;
  localEnd: number;
  words: string[];
  emphasisIndex: number;
  cameraAngle: number;
  cameraDistanceMul: number;
  cameraHeight: number;
  isSceneStart: boolean;
};

function pickEmphasisIndex(words: string[]): number {
  const upperIdx = words.findIndex((w) => /[A-Z]{2,}/.test(w.replace(/[^A-Za-z]/g, "")));
  if (upperIdx !== -1) return upperIdx;
  return words.length - 1;
}

export function buildSceneBeats(
  text: string,
  duration: number,
  sceneIndex: number,
): Beat[] {
  const words = text.split(" ");
  const beatCount = duration >= 100 ? 3 : duration >= 55 ? 2 : 1;

  const wordsPerBeat = Math.ceil(words.length / beatCount);
  const wordChunks: string[][] = [];
  for (let i = 0; i < beatCount; i++) {
    const chunk = words.slice(i * wordsPerBeat, (i + 1) * wordsPerBeat);
    if (chunk.length > 0) wordChunks.push(chunk);
  }

  const actualBeatCount = wordChunks.length;
  const framesPerBeat = Math.floor(duration / actualBeatCount);

  const beats: Beat[] = [];
  let cursor = 0;
  for (let i = 0; i < actualBeatCount; i++) {
    const isLast = i === actualBeatCount - 1;
    const localStart = cursor;
    const localEnd = isLast ? duration : cursor + framesPerBeat;
    const rand = mulberry32(sceneIndex * 97 + i * 13 + 7);

    beats.push({
      localStart,
      localEnd,
      words: wordChunks[i],
      emphasisIndex: pickEmphasisIndex(wordChunks[i]),
      cameraAngle: (rand() - 0.5) * 1.1,
      cameraDistanceMul: 1.05 + rand() * 0.3,
      cameraHeight: 0.75 + (rand() - 0.5) * 0.4,
      isSceneStart: i === 0,
    });
    cursor = localEnd;
  }

  return beats;
}
