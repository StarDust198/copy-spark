import { Length } from "@/constants/length";
import { Tone } from "@/constants/tone";
import z from "zod";
import { getOutputSchema } from "./generation";

export const productDescriptionRequestSchema = z.object({
  productName: z.string().min(2).max(80),
  keyFeatures: z.string().min(10).max(600),
  targetAudience: z.string().min(3).max(120),
  length: z
    .enum(Object.values(Length))
    .or(z.literal(""))
    .refine((val) => val !== "", { message: "Please select a length" }),
  tone: z
    .enum(Object.values(Tone))
    .or(z.literal(""))
    .refine((val) => val !== "", { message: "Please select a tone" }),
});

export type ProductDescriptionRequest = z.infer<
  typeof productDescriptionRequestSchema
>;

export const productDescriptionFormSchema =
  productDescriptionRequestSchema.extend({
    model: z.string().min(1),
  });

export type ProductDescriptionForm = z.infer<
  typeof productDescriptionFormSchema
>;

export const productDescriptionVariantSchema = z.object({
  description: z.string(),
});

export type ProductDescriptionVariant = z.infer<
  typeof productDescriptionVariantSchema
>;

export const productDescriptionOutputSchema = getOutputSchema(
  productDescriptionVariantSchema,
);

export type ProductDescriptionOutput = z.infer<
  typeof productDescriptionOutputSchema
>;
