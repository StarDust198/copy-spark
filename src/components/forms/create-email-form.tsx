"use client";

import { generateId } from "ai";
import { useRouter } from "next/navigation";
import { EmailSubjectForm } from "@/schemas/email-schema";
import { useCreateEmailSubjectGeneration } from "@/lib/query/use-generation-hooks";
import { EmailForm } from "./email-form";
import { withCreateActions } from "./with-form-actions";

const EmailFormWithActions = withCreateActions(EmailForm);

export function CreateEmailForm() {
  const createEmailSubjectGenerationMutation =
    useCreateEmailSubjectGeneration();
  const router = useRouter();

  async function onSubmit(fields: EmailSubjectForm) {
    const id = generateId();

    const { model, ...input } = fields;

    const generation = await createEmailSubjectGenerationMutation.mutateAsync({
      id,
      input,
      model,
    });

    router.push(`/generation/${generation.id}`);
  }

  return <EmailFormWithActions onSubmit={onSubmit} />;
}
