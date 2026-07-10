import { z } from "zod";
export const COMP_NAME = "MyComp";

export const CompositionProps = z.object({
  title: z.string(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  title: "Next.js and Remotion",
};

export const DURATION_IN_FRAMES = 200;
export const VIDEO_WIDTH = 1280;
export const VIDEO_HEIGHT = 720;
export const VIDEO_FPS = 30;

export const INTRO_COMP_NAME = "IntroVideo";

export const IntroVideoProps = z.object({
  companyName: z.string(),
  tagline: z.string(),
});

export const defaultIntroVideoProps: z.infer<typeof IntroVideoProps> = {
  companyName: "Chongbians Kitchen",
  tagline: "Chinese Cuisine at your home",
};

export const INTRO_DURATION_IN_FRAMES = 300;

export const POTATO_COMP_NAME = "PotatoHistory";
export const POTATO_WIDTH = 1080;
export const POTATO_HEIGHT = 1920;
export const POTATO_FPS = 30;
export const POTATO_DURATION_IN_FRAMES = 2070;
