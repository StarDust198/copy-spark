"use client";

import {
  EmailSubjectForm,
  emailSubjectRequestSchema,
} from "@/schemas/email-schema";
import { EmailForm } from "./email-form";
import { withEditActions } from "./with-form-actions";

const EmailFormWithActions = withEditActions(EmailForm);

export function EditGenerationEmailForm({
  input,
  model,
  disabled,
  onStop,
  onSubmit,
}: {
  input: unknown;
  model: string;
  disabled: boolean;
  onStop: () => void;
  onSubmit: (fields: EmailSubjectForm) => void | Promise<void>;
}) {
  const parsed = emailSubjectRequestSchema.safeParse(input);

  return (
    <EmailFormWithActions
      disabled={disabled}
      onStop={onStop}
      defaultValues={parsed.success ? { ...parsed.data, model } : { model }}
      onSubmit={onSubmit}
    />
  );
}
