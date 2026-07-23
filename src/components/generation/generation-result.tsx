"use client";

import { useRouter } from "next/navigation";
import { GenerationStatus } from "@prisma/client";

import { type EditGenerationFormValues } from "@/components/forms";
import { Template, TemplateId } from "@/constants/templates";
import { useUpdateGeneration } from "@/lib/query/use-generation-hooks";
import { GenerationActions } from "./generation-actions";
import { GenerationVariants } from "./generation-variants";

type GenerationResultProps = {
  generationId: string;
  templateId: TemplateId;
  variants: Record<string, string>[];
  input: unknown;
  model: string;
};

export function GenerationResult({
  generationId,
  templateId,
  variants,
  input,
  model,
}: GenerationResultProps) {
  const updateGenerationMutation = useUpdateGeneration();
  const router = useRouter();

  const template = Template[templateId];

  // Moving back to PENDING hands the page over to `GenerationStreamer`, which
  // mounts fresh on refresh and starts the stream.
  async function handleRegenerate() {
    await updateGenerationMutation.mutateAsync({
      id: generationId,
      status: GenerationStatus.PENDING,
    });

    router.refresh();
  }

  async function handleEditRegenerate(fields: EditGenerationFormValues) {
    const { model: nextModel, ...nextInput } = fields;

    await updateGenerationMutation.mutateAsync({
      id: generationId,
      input: nextInput,
      model: nextModel,
      status: GenerationStatus.PENDING,
    });

    router.refresh();
  }

  return (
    <GenerationVariants
      variants={variants}
      fields={template.fields}
      actions={
        <GenerationActions
          templateId={templateId}
          input={input}
          model={model}
          disabled={updateGenerationMutation.isPending}
          onRegenerate={handleRegenerate}
          onEditRegenerate={handleEditRegenerate}
        />
      }
    />
  );
}
