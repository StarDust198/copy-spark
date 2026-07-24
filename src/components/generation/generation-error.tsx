"use client";

import { TemplateId } from "@/constants/templates";
import { useRegenerateGeneration } from "@/lib/query/use-generation-hooks";
import { ErrorMessage } from "../layout/error-message";
import { useRegisterGenerationController } from "./generation-dialog-provider";
import { GenerationErrorActions } from "./generation-error-actions";

export function GenerationError({
  generationId,
  templateId,
  input,
  model,
}: {
  generationId: string;
  templateId: TemplateId;
  input: unknown;
  model: string;
}) {
  const { regenerate, editRegenerate, isPending } =
    useRegenerateGeneration(generationId);

  // This view only renders for a persisted error (ERROR status, or COMPLETED
  // output that no longer parses), so the dialog opened over it shows the error.
  useRegisterGenerationController({
    isStreaming: false,
    hasError: true,
    editRegenerate,
  });

  return (
    <ErrorMessage
      title="There was an error during generation"
      action={
        <GenerationErrorActions
          templateId={templateId}
          input={input}
          model={model}
          retryLabel="Try again"
          disabled={isPending}
          onRetry={regenerate}
        />
      }
    />
  );
}
