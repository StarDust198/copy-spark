"use client";

import { Template, TemplateId } from "@/constants/templates";
import { useObject } from "@ai-sdk/react";
import z from "zod";
import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { generationOptions } from "@/lib/query/generations-options";
import { useUpdateGeneration } from "@/lib/query/use-generation-hooks";
import { GenerationStatus } from "@prisma/client";
import {
  EditGenerationForm,
  type EditGenerationFormValues,
} from "@/components/forms";
import { GenerationFormWrapper } from "./generation-form-wrapper";
import { GenerationVariants } from "./generation-variants";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "../layout/error-message";
import { Button } from "@base-ui/react";

export function GenerationStreamer({
  templateId,
  id,
  input,
  model,
}: {
  templateId: TemplateId;
  id: string;
  input: unknown;
  model: string;
}) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const updateGenerationMutation = useUpdateGeneration();

  const [stopped, setStopped] = useState(false);

  const template = Template[templateId];

  const { object, submit, isLoading, error, stop } = useObject({
    api: template.streamApiUrl,
    schema: template.outputSchema,
    onFinish: ({ error }) => {
      queryClient.invalidateQueries(generationOptions());

      console.log("onFinish", { error });

      if (!error) return;

      router.refresh();
    },
    onError: () => {
      console.log("onError", { error });
    },
  });

  async function handleRegenerate(fields: EditGenerationFormValues) {
    const { model: nextModel, ...request } = fields;

    await updateGenerationMutation.mutateAsync({
      id,
      input: request,
      model: nextModel,
      status: GenerationStatus.PENDING,
    });

    setStopped(false);
    submit({ id });
  }

  console.log("GenerationStreamer", { object, isLoading, error });

  const variants = object?.variants as
    | Array<Record<string, string | undefined> | undefined>
    | undefined;

  const filledVariants =
    variants?.map((variant) => {
      return Object.fromEntries(
        template.fields.map((field) => [field.key, variant?.[field.key] ?? ""]),
      );
    }) ?? [];

  const isStartedRef = useRef(false);

  useEffect(() => {
    if (isStartedRef.current) return; // guard: StrictMode runs effects twice in dev
    isStartedRef.current = true;
    submit({ id });
  }, [id, submit]);

  const typedVariants = z
    .array(template.variantSchema)
    .safeParse(filledVariants);

  if (!typedVariants.success || error) {
    return (
      <ErrorMessage
        title="Something went wrong"
        action={<Button onClick={() => submit({ id })}>Try again</Button>}
      />
    );
  }

  if (stopped || (isLoading && !object)) {
    const GenerationForm = EditGenerationForm[templateId];

    return (
      <GenerationFormWrapper
        title={
          <p>{stopped ? "Edit and regenerate" : "Creating new generation"}</p>
        }
      >
        <GenerationForm
          input={input}
          model={model}
          disabled={!stopped}
          onStop={() => {
            stop();
            setStopped(true);
          }}
          onSubmit={handleRegenerate}
        />
      </GenerationFormWrapper>
    );
  }

  return (
    <GenerationVariants
      variants={typedVariants.data}
      fields={template.fields}
    />
  );
}
