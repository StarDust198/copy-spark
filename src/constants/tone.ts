export type Tone = (typeof Tone)[keyof typeof Tone];

export const Tone = {
  playful: "playful",
  professional: "professional",
  urgent: "urgent",
  luxury: "luxury",
} as const;
