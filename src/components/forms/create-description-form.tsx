"use client";

import { generateId } from "ai";
import { useRouter } from "next/navigation";
import { ProductDescriptionForm } from "@/schemas/description-schema";
import { useCreateProductDescriptionGeneration } from "@/lib/query/use-generation-hooks";
import { Button } from "../ui/button";
import { DescriptionForm } from "./description-form";

export function CreateDescriptionForm() {
  const createProductDescriptionGenerationMutation =
    useCreateProductDescriptionGeneration();
  const router = useRouter();

  async function onSubmit(fields: ProductDescriptionForm) {
    const id = generateId();

    const { model, ...request } = fields;

    const generation =
      await createProductDescriptionGenerationMutation.mutateAsync({
        id,
        request,
        model,
      });

    router.push(`/generation/${generation.id}`);
  }

  return (
    <DescriptionForm onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Button type="submit" disabled={isSubmitting}>
          Generate
        </Button>
      )}
    </DescriptionForm>
  );
}
