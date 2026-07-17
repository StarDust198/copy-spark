"use client";

import { Button } from "../ui/button";
import { useUpdateGeneration } from "@/lib/query/use-generation-hooks";
import { GenerationStatus } from "@prisma/client";
import { ErrorMessage } from "../layout/error-message";
import { useRouter } from "next/navigation";

export function GenerationError({ generationId }: { generationId: string }) {
  const updateGenerationMutation = useUpdateGeneration();
  const router = useRouter();

  async function handleRegenerate() {
    await updateGenerationMutation.mutateAsync({
      id: generationId,
      status: GenerationStatus.PENDING,
    });

    router.refresh();
  }

  return (
    <ErrorMessage
      title="There was an error during generation"
      action={<Button onClick={handleRegenerate}>Try again</Button>}
    />
  );
}
