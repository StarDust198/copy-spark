import { EmailGoal } from "@/constants/emailGoal";
import { Tone } from "@/constants/tone";
import z from "zod";

export const emailSchema = z.object({
  emailGoal: z
    .enum(Object.values(EmailGoal))
    .or(z.literal(""))
    .refine((val) => val !== "", { message: "Please select an email goal" }),
  emailSummary: z.string().min(10).max(600),
  tone: z
    .enum(Object.values(Tone))
    .or(z.literal(""))
    .refine((val) => val !== "", { message: "Please select a tone" }),
  includeEmoji: z.boolean(),
});

export type EmailSchema = z.infer<typeof emailSchema>;
