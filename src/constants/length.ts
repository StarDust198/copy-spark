export type Length = (typeof Length)[keyof typeof Length];

export const Length = {
  short: "short",
  medium: "medium",
  long: "long",
} as const;
