"use client";

import { Template, TemplateId } from "@/constants/templates";
import { useObject } from "@ai-sdk/react";
import z from "zod";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { generationOptions } from "@/lib/query/generations-options";
import {
  useFavoriteVariant,
  useUpdateGeneration,
} from "@/lib/query/use-generation-hooks";
import { GenerationStatus } from "@prisma/client";
import {
  EditGenerationForm,
  type EditGenerationFormValues,
} from "@/components/forms";
import { GenerationActions } from "./generation-actions";
import { GenerationErrorActions } from "./generation-error-actions";
import { GenerationFormWrapper } from "./generation-form-wrapper";
import { GenerationVariants } from "./generation-variants";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "../layout/error-message";

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

  // A stream always starts from a cleared pick — the API route resets the column
  // when it flips the row to STREAMING.
  const { favorite, toggleFavorite, resetFavorite } = useFavoriteVariant(
    id,
    null,
  );

  const [stopped, setStopped] = useState(false);

  // The `input`/`model` props are the server-rendered values. Regenerating from
  // here does not refresh the route, so keep the last submitted request around
  // for the form and the edit dialog.
  const [request, setRequest] = useState<{ input: unknown; model: string }>({
    input,
    model,
  });

  const template = Template[templateId];

  const { object, submit, isLoading, error, stop } = useObject({
    api: template.streamApiUrl,
    schema: template.outputSchema,
    onFinish: ({ error }) => {
      queryClient.invalidateQueries(generationOptions());

      if (!error) return;

      router.refresh();
    },
  });

  async function handleRegenerate(fields: EditGenerationFormValues) {
    const { model: nextModel, ...nextInput } = fields;

    await updateGenerationMutation.mutateAsync({
      id,
      input: nextInput,
      model: nextModel,
      status: GenerationStatus.PENDING,
      favorite: null,
    });

    setRequest({ input: nextInput, model: nextModel });
    setStopped(false);
    resetFavorite();
    submit({ id });
  }

  // The route rebuilds the prompt from the stored input, so an untouched
  // regenerate only has to re-submit.
  function handleInstantRegenerate() {
    setStopped(false);
    resetFavorite();
    submit({ id });
  }

  const typedVariants = useMemo(() => {
    const variants = object?.variants as
      | Array<Record<string, string | undefined> | undefined>
      | undefined;

    const filledVariants =
      variants?.map((variant) => {
        return Object.fromEntries(
          template.fields.map((field) => [
            field.key,
            variant?.[field.key] ?? "",
          ]),
        );
      }) ?? [];

    return z.array(template.variantSchema).safeParse(filledVariants);
  }, [object?.variants, template.fields, template.variantSchema]);

  const isStartedRef = useRef(false);

  useEffect(() => {
    if (isStartedRef.current) return; // guard: StrictMode runs effects twice in dev
    isStartedRef.current = true;
    submit({ id });
  }, [id, submit]);

  if (!typedVariants.success || error) {
    return (
      <ErrorMessage
        title="Something went wrong"
        action={
          <GenerationErrorActions
            templateId={templateId}
            input={request.input}
            model={request.model}
            retryLabel="Try again"
            onRetry={handleInstantRegenerate}
            onEditRegenerate={handleRegenerate}
          />
        }
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
          input={request.input}
          model={request.model}
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
      favorite={favorite}
      // Picking only makes sense once the variants have stopped changing.
      favoriteDisabled={isLoading}
      onToggleFavorite={toggleFavorite}
      actions={
        <GenerationActions
          templateId={templateId}
          input={request.input}
          model={request.model}
          disabled={isLoading}
          onRegenerate={handleInstantRegenerate}
          onEditRegenerate={handleRegenerate}
        />
      }
    />
  );
}
