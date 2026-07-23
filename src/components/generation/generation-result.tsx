"use client";

import { useRouter } from "next/navigation";
import { GenerationStatus } from "@prisma/client";

import { type EditGenerationFormValues } from "@/components/forms";
import { Template, TemplateId } from "@/constants/templates";
import {
  useFavoriteVariant,
  useUpdateGeneration,
} from "@/lib/query/use-generation-hooks";
import { GenerationActions } from "./generation-actions";
import { useRegisterGenerationController } from "./generation-dialog-provider";
import { GenerationVariants } from "./generation-variants";

type GenerationResultProps = {
  generationId: string;
  templateId: TemplateId;
  variants: Record<string, string>[];
  input: unknown;
  model: string;
  favorite: number | null;
};

export function GenerationResult({
  generationId,
  templateId,
  variants,
  input,
  model,
  favorite,
}: GenerationResultProps) {
  const updateGenerationMutation = useUpdateGeneration();
  const { favorite: pickedVariant, toggleFavorite } = useFavoriteVariant(
    generationId,
    favorite,
  );
  const router = useRouter();

  const template = Template[templateId];

  // Moving back to PENDING hands the page over to `GenerationStreamer`, which
  // mounts fresh on refresh and starts the stream.
  async function handleRegenerate() {
    await updateGenerationMutation.mutateAsync({
      id: generationId,
      status: GenerationStatus.PENDING,
      favorite: null,
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
      favorite: null,
    });

    router.refresh();
  }

  // The dialog outlives the refresh above, so it has to reach this handler through
  // the provider rather than holding the one captured when it opened.
  useRegisterGenerationController({
    isStreaming: false,
    editRegenerate: handleEditRegenerate,
  });

  return (
    <GenerationVariants
      variants={variants}
      fields={template.fields}
      favorite={pickedVariant}
      onToggleFavorite={toggleFavorite}
      actions={
        <GenerationActions
          templateId={templateId}
          input={input}
          model={model}
          disabled={updateGenerationMutation.isPending}
          onRegenerate={handleRegenerate}
        />
      }
    />
  );
}
