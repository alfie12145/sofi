import { Composition } from "remotion";
import {
  COMP_NAME,
  defaultIntroVideoProps,
  defaultMyCompProps,
  DURATION_IN_FRAMES,
  INTRO_COMP_NAME,
  INTRO_DURATION_IN_FRAMES,
  POTATO_COMP_NAME,
  POTATO_DURATION_IN_FRAMES,
  POTATO_FPS,
  POTATO_HEIGHT,
  POTATO_WIDTH,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "../../types/constants";
import { IntroVideo } from "./MyComp/IntroVideo";
import { Main } from "./MyComp/Main";
import { NextLogo } from "./MyComp/NextLogo";
import { PotatoHistory } from "./MyComp/PotatoHistory";
import { PotatoHistoryRealistic } from "./MyComp/PotatoHistoryRealistic";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id={COMP_NAME}
        component={Main}
        durationInFrames={DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultMyCompProps}
      />
      <Composition
        id="NextLogo"
        component={NextLogo}
        durationInFrames={300}
        fps={30}
        width={140}
        height={140}
        defaultProps={{
          outProgress: 0,
        }}
      />
      <Composition
        id={INTRO_COMP_NAME}
        component={IntroVideo}
        durationInFrames={INTRO_DURATION_IN_FRAMES}
        fps={VIDEO_FPS}
        width={VIDEO_WIDTH}
        height={VIDEO_HEIGHT}
        defaultProps={defaultIntroVideoProps}
      />
      <Composition
        id={POTATO_COMP_NAME}
        component={PotatoHistory}
        durationInFrames={POTATO_DURATION_IN_FRAMES}
        fps={POTATO_FPS}
        width={POTATO_WIDTH}
        height={POTATO_HEIGHT}
      />
      <Composition
        id="PotatoHistoryRealistic"
        component={PotatoHistoryRealistic}
        durationInFrames={POTATO_DURATION_IN_FRAMES}
        fps={POTATO_FPS}
        width={POTATO_WIDTH}
        height={POTATO_HEIGHT}
      />
    </>
  );
};
