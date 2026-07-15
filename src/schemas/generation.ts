import z from "zod";

export function getOutputSchema<T extends z.ZodObject>(schema: T) {
  return z.object({
    title: z.string(),
    variants: z.array(schema),
  });
}
