import { DescriptionForm } from "@/components/forms/description-form";
import { EmailForm } from "@/components/forms/email-form";
import { FacebookForm } from "@/components/forms/facebook-form";

export type GenerationTargetId = keyof typeof GenerationTarget;

export const GenerationTarget = {
  facebook: {
    form: FacebookForm,
    title: "Facebook / Instagram ad",
    description: "Short, punchy ad text with a hook and a call to action.",
    link: "/new/facebook",
    example: "Tired of yoga mats that slip? Meet the last mat you'll ever buy",
  },
  email: {
    form: EmailForm,
    title: "Email subject lines",
    description:
      "Subject lines that get your emails opened instead of deleted.",
    link: "/new/email",
    example: "You left something behind (and it misses you)",
  },
  description: {
    form: DescriptionForm,
    title: "Product description",
    description:
      "Persuasive copy for online store listings — features turned into benefits.",

    link: "/new/description",
    example:
      "Crafted from cork so grippy you'll hold poses you didn't know you could.",
  },
} as const;
