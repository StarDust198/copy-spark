"use client";

import { generateId } from "ai";
import { useRouter } from "next/navigation";
import { FacebookAdForm } from "@/schemas/facebook-schema";
import { useCreateFacebookAdGeneration } from "@/lib/query/use-generation-hooks";
import { Button } from "../ui/button";
import { FacebookForm } from "./facebook-form";

export function CreateFacebookForm() {
  const createFacebookAdGenerationMutation = useCreateFacebookAdGeneration();
  const router = useRouter();

  async function onSubmit(fields: FacebookAdForm) {
    const id = generateId();

    const { model, ...request } = fields;

    const generation = await createFacebookAdGenerationMutation.mutateAsync({
      id,
      request,
      model,
    });

    router.push(`/generation/${generation.id}`);
  }

  return (
    <FacebookForm onSubmit={onSubmit}>
      {({ isSubmitting }) => (
        <Button type="submit" disabled={isSubmitting}>
          Generate
        </Button>
      )}
    </FacebookForm>
  );
}
