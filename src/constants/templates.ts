import { DescriptionForm } from "@/components/forms/description-form";
import { EmailForm } from "@/components/forms/email-form";
import { FacebookForm } from "@/components/forms/facebook-form";
import {
  productDescriptionRequestSchema,
  productDescriptionVariantSchema,
} from "@/schemas/description-schema";
import {
  emailSubjectRequestSchema,
  emailSubjectVariantSchema,
} from "@/schemas/email-schema";
import {
  facebookAdRequestSchema,
  facebookAdVariantSchema,
} from "@/schemas/facebook-schema";
import z from "zod";

export type TemplateId = (typeof TemplateId)[keyof typeof TemplateId];

export const TemplateId = {
  facebookAd: "facebook-ad",
  emailSubject: "email-subject",
  productDescription: "product-description",
} as const;

export const Template = {
  [TemplateId.facebookAd]: {
    form: FacebookForm,
    title: "Facebook / Instagram ad",
    description: "Short, punchy ad text with a hook and a call to action.",
    link: "/new/facebook-ad",
    example: "Tired of yoga mats that slip? Meet the last mat you'll ever buy",
    inputSchema: facebookAdRequestSchema,
    outputSchema: z.object({
      title: z.string(),
      variants: z.array(facebookAdVariantSchema),
    }),
  },
  [TemplateId.emailSubject]: {
    form: EmailForm,
    title: "Email subject lines",
    description:
      "Subject lines that get your emails opened instead of deleted.",
    link: "/new/email-subject",
    example: "You left something behind (and it misses you)",
    inputSchema: emailSubjectRequestSchema,
    outputSchema: z.object({
      title: z.string(),
      variants: z.array(emailSubjectVariantSchema),
    }),
  },
  [TemplateId.productDescription]: {
    form: DescriptionForm,
    title: "Product description",
    description:
      "Persuasive copy for online store listings — features turned into benefits.",

    link: "/new/product-description",
    example:
      "Crafted from cork so grippy you'll hold poses you didn't know you could.",
    inputSchema: productDescriptionRequestSchema,
    outputSchema: z.object({
      title: z.string(),
      variants: z.array(productDescriptionVariantSchema),
    }),
  },
} as const;
