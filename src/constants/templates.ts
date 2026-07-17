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
import { getOutputSchema } from "@/schemas/generation";
import z from "zod";

export type TemplateId = (typeof TemplateId)[keyof typeof TemplateId];

export const TemplateId = {
  facebookAd: "facebook-ad",
  emailSubject: "email-subject",
  productDescription: "product-description",
} as const;

export type TemplateField = { label: string; key: string };

export type BuildPromptResult =
  | { success: true; prompt: string }
  | { success: false; error: z.ZodError };

function defineTemplate<
  TTemplateId extends TemplateId,
  TRequest extends z.ZodType,
  TVariant extends z.ZodObject,
>(config: {
  id: TTemplateId;
  title: string;
  description: string;
  example: string;
  requestSchema: TRequest;
  variantSchema: TVariant;
  fields: { label: string; key: keyof z.infer<TVariant> & string }[];
}) {
  const createUrl: `/new/${TTemplateId}` = `/new/${config.id}`;
  const streamApiUrl: `/api/generate/${TTemplateId}` = `/api/generate/${config.id}`;

  // `fields` are deliberately widened here. Each entry keeps its own request/variant
  // types at the definition site above, but callers reach entries through
  // `Template[templateId]` — a union — and a union of differently-typed signatures
  // is not callable.
  const fields: TemplateField[] = config.fields;

  return {
    ...config,
    fields,
    createUrl,
    streamApiUrl,
    outputSchema: getOutputSchema(config.variantSchema),
  };
}

export const Template = {
  [TemplateId.facebookAd]: defineTemplate({
    id: TemplateId.facebookAd,
    title: "Facebook / Instagram ad",
    description: "Short, punchy ad text with a hook and a call to action.",
    example: "Tired of yoga mats that slip? Meet the last mat you'll ever buy",
    requestSchema: facebookAdRequestSchema,
    variantSchema: facebookAdVariantSchema,
    fields: [
      { label: "Headline", key: "headline" },
      { label: "Primary Text", key: "primaryText" },
      { label: "Call To Action", key: "cta" },
    ],
  }),
  [TemplateId.emailSubject]: defineTemplate({
    id: TemplateId.emailSubject,
    title: "Email subject lines",
    description:
      "Subject lines that get your emails opened instead of deleted.",
    example: "You left something behind (and it misses you)",
    requestSchema: emailSubjectRequestSchema,
    variantSchema: emailSubjectVariantSchema,
    fields: [
      { label: "Subject", key: "subject" },
      { label: "Text preview", key: "previewText" },
    ],
  }),
  [TemplateId.productDescription]: defineTemplate({
    id: TemplateId.productDescription,
    title: "Product description",
    description:
      "Persuasive copy for online store listings — features turned into benefits.",
    example:
      "Crafted from cork so grippy you'll hold poses you didn't know you could.",
    requestSchema: productDescriptionRequestSchema,
    variantSchema: productDescriptionVariantSchema,
    fields: [{ label: "Description", key: "description" }],
  }),
} satisfies { [K in TemplateId]: { id: K } };

export type TemplateRequest = z.infer<
  (typeof Template)[TemplateId]["requestSchema"]
>;

export type TemplateVariant = z.infer<
  (typeof Template)[TemplateId]["variantSchema"]
>;
