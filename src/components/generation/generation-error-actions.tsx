"use client";

import { useState } from "react";

import { type EditGenerationFormValues } from "@/components/forms";
import { TemplateId } from "@/constants/templates";
import { Button } from "../ui/button";
import { EditGenerationDialog } from "./edit-generation-dialog";

type GenerationErrorActionsProps = {
  templateId: TemplateId;
  input: unknown;
  model: string;
  retryLabel: string;
  disabled?: boolean;
  onRetry: () => void | Promise<void>;
  onEditRegenerate: (fields: EditGenerationFormValues) => void | Promise<void>;
};

export function GenerationErrorActions({
  templateId,
  input,
  model,
  retryLabel,
  disabled,
  onRetry,
  onEditRegenerate,
}: GenerationErrorActionsProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button type="button" disabled={disabled} onClick={() => onRetry()}>
        {retryLabel}
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => setOpen(true)}
      >
        Edit inputs
      </Button>

      <EditGenerationDialog
        templateId={templateId}
        input={input}
        model={model}
        open={open}
        onOpenChange={setOpen}
        onSubmit={onEditRegenerate}
      />
    </div>
  );
}
