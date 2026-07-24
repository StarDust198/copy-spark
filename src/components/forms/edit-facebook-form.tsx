"use client";

import { ReactNode } from "react";
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
  error,
  onSubmit,
}: {
  input: unknown;
  model: string;
  disabled: boolean;
  onStop?: () => void;
  error?: ReactNode;
  onSubmit: (fields: FacebookAdForm) => void | Promise<void>;
}) {
  const parsed = facebookAdRequestSchema.safeParse(input);

  return (
    <FacebookFormWithActions
      disabled={disabled}
      onStop={onStop}
      error={error}
      defaultValues={parsed.success ? { ...parsed.data, model } : { model }}
      onSubmit={onSubmit}
    />
  );
}
