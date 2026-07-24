"use client";

import { ReactNode } from "react";
import {
  ProductDescriptionForm,
  productDescriptionRequestSchema,
} from "@/schemas/description-schema";
import { DescriptionForm } from "./description-form";
import { withEditActions } from "./with-form-actions";

const DescriptionFormWithActions = withEditActions(DescriptionForm);

export function EditGenerationDescriptionForm({
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
  onSubmit: (fields: ProductDescriptionForm) => void | Promise<void>;
}) {
  const parsed = productDescriptionRequestSchema.safeParse(input);

  return (
    <DescriptionFormWithActions
      disabled={disabled}
      onStop={onStop}
      error={error}
      defaultValues={parsed.success ? { ...parsed.data, model } : { model }}
      onSubmit={onSubmit}
    />
  );
}
