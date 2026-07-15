import { TemplateId } from "@/constants/templates";
import { productDescriptionVariantSchema } from "@/schemas/description-schema";
import { emailSubjectVariantSchema } from "@/schemas/email-schema";
import { facebookAdVariantSchema } from "@/schemas/facebook-schema";
import z from "zod";

type ResultConfig<T extends z.ZodType> = {
  description: string;
  variantSchema: T;
  fields: { label: string; key: string }[];
};

export const generationResults = {
  [TemplateId.emailSubject]: {
    description: "Email Subject Lines",
    variantSchema: emailSubjectVariantSchema,
    fields: [
      { label: "Subject", key: "subject" },
      { label: "Text preview", key: "previewText" },
    ],
  },
  [TemplateId.facebookAd]: {
    description: "Facebook / Instagram ad",
    variantSchema: facebookAdVariantSchema,
    fields: [
      { label: "Headline", key: "headline" },
      { label: "Primary Text", key: "primaryText" },
      { label: "Call To Action", key: "cta" },
    ],
  },
  [TemplateId.productDescription]: {
    description: "Product Description",
    variantSchema: productDescriptionVariantSchema,
    fields: [{ label: "Description", key: "description" }],
  },
} satisfies Record<TemplateId, ResultConfig<z.ZodType>>;
