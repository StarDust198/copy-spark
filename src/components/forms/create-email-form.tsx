"use client";

import { generateId } from "ai";
import { useRouter } from "next/navigation";
import { EmailSubjectForm } from "@/schemas/email-schema";
import { useCreateEmailSubjectGeneration } from "@/lib/query/use-generation-hooks";
import { Button } from "../ui/button";
import { EmailForm } from "./email-form";

export function CreateEmailForm() {
  const createEmailSubjectGenerationMutation =
    useCreateEmailSubjectGeneration();
  const router = useRouter();

  async function onSubmit(fields: EmailSubjectForm) {
    const id = generateId();

    const { model, ...request } = fields;

    const generation = await createEmailSubjectGenerationMutation.mutateAsync({
      id,
      request,
      model,
    });

    router.push(`/generation/${generation.id}`);
  }

  return (
    <EmailForm onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Button type="submit" disabled={isSubmitting}>
          Generate
        </Button>
      )}
    </EmailForm>
  );
}
