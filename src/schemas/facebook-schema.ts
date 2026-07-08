import { Tone } from "@/constants/tone";
import z from "zod";

export const facebookSchema = z.object({
  productName: z.string().min(2).max(80),
  productDescription: z.string().min(10).max(600),
  targetAudience: z.string().min(3).max(120),
  tone: z
    .enum(Object.values(Tone))
    .or(z.literal(""))
    .refine((val) => val !== "", { message: "Please select a tone" }),
  specialOffer: z.string().max(120).optional(),
});

export type FacebookSchema = z.infer<typeof facebookSchema>;
