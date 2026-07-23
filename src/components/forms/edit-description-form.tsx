"use client";

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
  onSubmit,
}: {
  input: unknown;
  model: string;
  disabled: boolean;
  onStop?: () => void;
  onSubmit: (fields: ProductDescriptionForm) => void | Promise<void>;
}) {
  const parsed = productDescriptionRequestSchema.safeParse(input);

  return (
    <DescriptionFormWithActions
      disabled={disabled}
      onStop={onStop}
      defaultValues={parsed.success ? { ...parsed.data, model } : { model }}
      onSubmit={onSubmit}
    />
  );
}
