export type EmailGoal = (typeof EmailGoal)[keyof typeof EmailGoal];

export const EmailGoal = {
  promotion: "promotion",
  newsletter: "newsletter",
  productLaunch: "product launch",
  cartRecovery: "cart recovery",
  reEngagement: "re-engagement",
} as const;
