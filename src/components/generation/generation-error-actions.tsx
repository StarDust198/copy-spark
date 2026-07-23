"use client";

import { TemplateId } from "@/constants/templates";
import { Button } from "../ui/button";
import { useGenerationDialogActions } from "./generation-dialog-provider";

type GenerationErrorActionsProps = {
  templateId: TemplateId;
  input: unknown;
  model: string;
  retryLabel: string;
  disabled?: boolean;
  onRetry: () => void | Promise<void>;
};

export function GenerationErrorActions({
  templateId,
  input,
  model,
  retryLabel,
  disabled,
  onRetry,
}: GenerationErrorActionsProps) {
  const { openDialog } = useGenerationDialogActions();

  return (
    <div className="flex items-center gap-2">
      <Button type="button" disabled={disabled} onClick={() => onRetry()}>
        {retryLabel}
      </Button>

      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        onClick={() => openDialog({ templateId, input, model })}
      >
        Edit inputs
      </Button>
    </div>
  );
}
