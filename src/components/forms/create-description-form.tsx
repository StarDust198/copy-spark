"use client";

import { generateId } from "ai";
import { useRouter } from "next/navigation";
import { ProductDescriptionForm } from "@/schemas/description-schema";
import { useCreateProductDescriptionGeneration } from "@/lib/query/use-generation-hooks";
import { DescriptionForm } from "./description-form";
import { withCreateActions } from "./with-form-actions";

const DescriptionFormWithActions = withCreateActions(DescriptionForm);

export function CreateDescriptionForm() {
  const createProductDescriptionGenerationMutation =
    useCreateProductDescriptionGeneration();
  const router = useRouter();

  async function onSubmit(fields: ProductDescriptionForm) {
    const id = generateId();

    const { model, ...input } = fields;

    const generation =
      await createProductDescriptionGenerationMutation.mutateAsync({
        id,
        input,
        model,
      });

    router.push(`/generation/${generation.id}`);
  }

  return <DescriptionFormWithActions onSubmit={onSubmit} />;
}
