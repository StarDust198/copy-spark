"use client";

import { generateId } from "ai";
import { useRouter } from "next/navigation";
import { FacebookAdForm } from "@/schemas/facebook-schema";
import { useCreateFacebookAdGeneration } from "@/lib/query/use-generation-hooks";
import { FacebookForm } from "./facebook-form";
import { withCreateActions } from "./with-form-actions";

const FacebookFormWithActions = withCreateActions(FacebookForm);

export function CreateFacebookForm() {
  const createFacebookAdGenerationMutation = useCreateFacebookAdGeneration();
  const router = useRouter();

  async function onSubmit(fields: FacebookAdForm) {
    const id = generateId();

    const { model, ...input } = fields;

    const generation = await createFacebookAdGenerationMutation.mutateAsync({
      id,
      input,
      model,
    });

    router.push(`/generation/${generation.id}`);
  }

  return <FacebookFormWithActions onSubmit={onSubmit} />;
}
