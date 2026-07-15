import { Tone } from "@/constants/tone";
import z from "zod";
import { getOutputSchema } from "./generation";

export const facebookAdRequestSchema = z.object({
  productName: z.string().min(2).max(80),
  productDescription: z.string().min(10).max(600),
  targetAudience: z.string().min(3).max(120),
  tone: z
    .enum(Object.values(Tone))
    .or(z.literal(""))
    .refine((val) => val !== "", { message: "Please select a tone" }),
  specialOffer: z.string().max(120).optional(),
});

export type FacebookAdRequest = z.infer<typeof facebookAdRequestSchema>;

export const facebookAdVariantSchema = z.object({
  headline: z.string().describe("Max 40 characters, the bold line"),
  primaryText: z.string().describe("1-3 sentences, the main ad copy"),
  cta: z.string().describe("Short call to action, e.g. 'Shop now'"),
});

export type FacebookAdVariant = z.infer<typeof facebookAdVariantSchema>;

export const facebookAdOutputSchema = getOutputSchema(facebookAdVariantSchema);

export type FacebookAdOutput = z.infer<typeof facebookAdOutputSchema>;
