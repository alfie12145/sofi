import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { z } from "zod";
import { IntroVideoProps } from "../../../types/constants";

const fontFamily =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const IntroVideo = ({
  companyName,
  tagline,
}: z.infer<typeof IntroVideoProps>) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const nameOpacity = spring({
    fps,
    frame,
    config: { damping: 200 },
    durationInFrames: 45,
  });

  const taglineStart = 60;
  const taglineProgress = spring({
    fps,
    frame: frame - taglineStart,
    config: { damping: 200 },
    durationInFrames: 45,
  });

  const taglineTranslateY = interpolate(taglineProgress, [0, 1], [80, 0]);
  const taglineOpacity = interpolate(taglineProgress, [0, 1], [0, 1]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#1d4ed8",
        justifyContent: "center",
        alignItems: "center",
        fontFamily,
      }}
    >
      <h1
        style={{
          fontSize: 90,
          fontWeight: 700,
          color: "white",
          opacity: nameOpacity,
          margin: 0,
          textAlign: "center",
        }}
      >
        {companyName}
      </h1>
      <div
        style={{
          marginTop: 24,
          fontSize: 40,
          color: "white",
          opacity: taglineOpacity,
          transform: `translateY(${taglineTranslateY}px)`,
          textAlign: "center",
        }}
      >
        {tagline}
      </div>
    </AbsoluteFill>
  );
};
