import { Length } from "@/constants/length";
import { Tone } from "@/constants/tone";
import z from "zod";

export const descriptionSchema = z.object({
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

export type DescriptionSchema = z.infer<typeof descriptionSchema>;
