"use client";

import { Loader } from "../layout/loader";
import { ErrorMessage } from "../layout/error-message";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TemplateId } from "@/constants/templates";
import { useRegenerateGeneration } from "@/lib/query/use-generation-hooks";
import { useRegisterGenerationController } from "./generation-dialog-provider";
import { GenerationErrorActions } from "./generation-error-actions";

const REFRESH_INTERVAL_MS = 10000;
const MAX_REFRESHES = 30;
const REGENERATE_AFTER_MS = 20000;

export function GenerationPoller({
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
  const router = useRouter();

  useRegisterGenerationController({ isStreaming: false, editRegenerate });
  const [refreshCount, setRefreshCount] = useState(0);
  const [canRegenerate, setCanRegenerate] = useState(false);

  const isExhausted = refreshCount >= MAX_REFRESHES;

  useEffect(() => {
    if (isExhausted) return;

    const intervalId = setInterval(() => {
      setRefreshCount((count) => count + 1);
      router.refresh();
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, [isExhausted, router]);

  useEffect(() => {
    const timeoutId = setTimeout(
      () => setCanRegenerate(true),
      REGENERATE_AFTER_MS,
    );

    return () => clearTimeout(timeoutId);
  }, []);

  if (isExhausted) {
    return (
      <ErrorMessage
        title="Still generating. We've stopped checking for updates."
        action={
          <GenerationErrorActions
            templateId={templateId}
            input={input}
            model={model}
            retryLabel="Regenerate"
            disabled={isPending}
            onRetry={regenerate}
          />
        }
      />
    );
  }

  return (
    <Loader
      title="Generating..."
      action={
        canRegenerate ? (
          <Button onClick={regenerate} disabled={isPending}>
            Regenerate
          </Button>
        ) : undefined
      }
    />
  );
}
