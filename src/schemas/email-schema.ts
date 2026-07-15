import { EmailGoal } from "@/constants/emailGoal";
import { Tone } from "@/constants/tone";
import z from "zod";
import { getOutputSchema } from "./generation";

export const emailSubjectRequestSchema = z.object({
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

export type EmailSubjectRequest = z.infer<typeof emailSubjectRequestSchema>;

export const emailSubjectVariantSchema = z.object({
  subject: z.string().describe("Max ~50 characters"),
  previewText: z
    .string()
    .describe("Complements the subject, max ~90 characters"),
});

export type EmailSubjectVariant = z.infer<typeof emailSubjectVariantSchema>;

export const emailSubjectOutputSchema = getOutputSchema(
  emailSubjectVariantSchema,
);

export type EmailSubjectOutput = z.infer<typeof emailSubjectOutputSchema>;
