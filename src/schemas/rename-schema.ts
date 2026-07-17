import z from "zod";

export const renameGenerationSchema = z.object({
  title: z.string().trim().min(1, "Name is required").max(100),
});

export type RenameGenerationRequest = z.infer<typeof renameGenerationSchema>;
