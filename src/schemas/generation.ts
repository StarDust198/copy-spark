import z from "zod";
import { MODELS } from "@/constants/model";

// The model id reaches `streamText` as-is, so it has to be checked server-side —
// the select in the UI only constrains what a well-behaved client sends.
export const modelIdSchema = z.enum(MODELS.map((model) => model.id));

export function getOutputSchema<T extends z.ZodObject>(schema: T) {
  return z.object({
    title: z.string(),
    variants: z.array(schema),
  });
}
