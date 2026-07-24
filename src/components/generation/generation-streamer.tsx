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
import { type EditGenerationFormValues } from "@/components/forms";
import { GenerationActions } from "./generation-actions";
import { GenerationErrorActions } from "./generation-error-actions";
import {
  useGenerationDialogActions,
  useGenerationDialogState,
  useRegisterGenerationController,
} from "./generation-dialog-provider";
import { GenerationVariants } from "./generation-variants";
import { useRouter } from "next/navigation";
import { ErrorMessage } from "../layout/error-message";
import { Loader } from "../layout/loader";
import { StoppedMessage } from "../layout/stopped-message";
import { Button } from "../ui/button";

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

  const { openDialog, ensureDialogOpen, closeDialog } =
    useGenerationDialogActions();
  const { target: dialogTarget } = useGenerationDialogState();

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

  // Closing on the first token rather than on submit keeps the dialog up while the
  // loader underneath still has nothing to show.
  const hasClosedDialogRef = useRef(false);

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
    hasClosedDialogRef.current = false;
    submit({ id });
  }

  // The route rebuilds the prompt from the stored input, so an untouched
  // regenerate only has to re-submit.
  function handleInstantRegenerate() {
    setStopped(false);
    resetFavorite();
    hasClosedDialogRef.current = false;
    submit({ id });
  }

  const editTarget = { templateId, input: request.input, model: request.model };

  function handleStop() {
    stop();
    setStopped(true);
    // Stopping is a request to edit, so the form comes to the user — whether they
    // stopped from the dialog or from the loader.
    ensureDialogOpen(editTarget);
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

  const hasError = !typedVariants.success || !!error;

  // `isLoading` is still false between mount and the submit effect below. Treating
  // that window as running keeps the loader up and stops the dialog's button from
  // flashing "Generate" before the request is even in flight.
  const isRunning = isLoading || (!stopped && !object && !hasError);

  useRegisterGenerationController({
    isStreaming: isRunning,
    hasError,
    stop: handleStop,
    editRegenerate: handleRegenerate,
  });

  const isStartedRef = useRef(false);

  useEffect(() => {
    if (isStartedRef.current) return; // guard: StrictMode runs effects twice in dev
    isStartedRef.current = true;
    submit({ id });
  }, [id, submit]);

  useEffect(() => {
    if (!object || hasClosedDialogRef.current) return;

    hasClosedDialogRef.current = true;
    closeDialog();
  }, [object, closeDialog]);

  if (hasError) {
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
          />
        }
      />
    );
  }

  if (stopped) {
    return (
      <StoppedMessage
        title="Generation stopped"
        action={
          <Button onClick={() => openDialog(editTarget)}>
            Edit and regenerate
          </Button>
        }
      />
    );
  }

  if (isRunning && !object) {
    return (
      <Loader
        title="Generating..."
        action={
          dialogTarget ? undefined : (
            <Button variant="outline" onClick={handleStop}>
              Stop
            </Button>
          )
        }
      />
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
        />
      }
    />
  );
}
