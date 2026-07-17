"use client";

import { GenerationStatus } from "@prisma/client";
import { Loader } from "../layout/loader";
import { ErrorMessage } from "../layout/error-message";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUpdateGeneration } from "@/lib/query/use-generation-hooks";

const REFRESH_INTERVAL_MS = 10000;
const MAX_REFRESHES = 30;
const REGENERATE_AFTER_MS = 20000;

export function GenerationPoller({ generationId }: { generationId: string }) {
  const updateGenerationMutation = useUpdateGeneration();
  const router = useRouter();
  const [refreshCount, setRefreshCount] = useState(0);
  const [canRegenerate, setCanRegenerate] = useState(false);

  const isExhausted = refreshCount >= MAX_REFRESHES;

  async function handleRegenerate() {
    await updateGenerationMutation.mutateAsync({
      id: generationId,
      status: GenerationStatus.PENDING,
    });

    router.refresh();
  }

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

  const regenerateButton = (
    <Button
      onClick={handleRegenerate}
      disabled={updateGenerationMutation.isPending}
    >
      Regenerate
    </Button>
  );

  if (isExhausted) {
    return (
      <ErrorMessage
        title="Still generating. We've stopped checking for updates."
        action={regenerateButton}
      />
    );
  }

  return (
    <Loader
      title="Generating..."
      action={canRegenerate ? regenerateButton : undefined}
    />
  );
}
