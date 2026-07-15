import { DescriptionForm } from "@/components/forms/description-form";
import { EmailForm } from "@/components/forms/email-form";
import { FacebookForm } from "@/components/forms/facebook-form";
import {
  productDescriptionOutputSchema,
  productDescriptionRequestSchema,
  productDescriptionVariantSchema,
} from "@/schemas/description-schema";
import {
  emailSubjectOutputSchema,
  emailSubjectRequestSchema,
  emailSubjectVariantSchema,
} from "@/schemas/email-schema";
import {
  facebookAdOutputSchema,
  facebookAdRequestSchema,
  facebookAdVariantSchema,
} from "@/schemas/facebook-schema";

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
    createUrl: "/new/facebook-ad",
    example: "Tired of yoga mats that slip? Meet the last mat you'll ever buy",
    inputSchema: facebookAdRequestSchema,
    variantSchema: facebookAdVariantSchema,
    outputSchema: facebookAdOutputSchema,
    streamApiUrl: "/api/generate/facebook-ad",
  },
  [TemplateId.emailSubject]: {
    form: EmailForm,
    title: "Email subject lines",
    description:
      "Subject lines that get your emails opened instead of deleted.",
    createUrl: "/new/email-subject",
    example: "You left something behind (and it misses you)",
    inputSchema: emailSubjectRequestSchema,
    variantSchema: emailSubjectVariantSchema,
    outputSchema: emailSubjectOutputSchema,
    streamApiUrl: "/api/generate/email-subject",
  },
  [TemplateId.productDescription]: {
    form: DescriptionForm,
    title: "Product description",
    description:
      "Persuasive copy for online store listings — features turned into benefits.",

    createUrl: "/new/product-description",
    example:
      "Crafted from cork so grippy you'll hold poses you didn't know you could.",
    inputSchema: productDescriptionRequestSchema,
    variantSchema: productDescriptionVariantSchema,
    outputSchema: productDescriptionOutputSchema,
    streamApiUrl: "/api/generate/product-description",
  },
} as const;
