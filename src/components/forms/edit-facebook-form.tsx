"use client";

import {
  FacebookAdForm,
  facebookAdRequestSchema,
} from "@/schemas/facebook-schema";
import { FacebookForm } from "./facebook-form";
import { withEditActions } from "./with-form-actions";

const FacebookFormWithActions = withEditActions(FacebookForm);

export function EditGenerationFacebookForm({
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
  onSubmit: (fields: FacebookAdForm) => void | Promise<void>;
}) {
  const parsed = facebookAdRequestSchema.safeParse(input);

  return (
    <FacebookFormWithActions
      disabled={disabled}
      onStop={onStop}
      defaultValues={parsed.success ? { ...parsed.data, model } : { model }}
      onSubmit={onSubmit}
    />
  );
}
