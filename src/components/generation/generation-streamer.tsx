"use client";

import { Template, TemplateId } from "@/constants/templates";
import { useObject } from "@ai-sdk/react";
import { VariantCard } from "./variant-card";
import z from "zod";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { generationOptions } from "@/lib/query/generations-options";
import { Loader } from "../layout/loader";
import { ErrorMessage } from "../layout/error-message";
import { Button } from "../ui/button";

export function GenerationStreamer({
  templateId,
  id,
}: {
  templateId: TemplateId;
  id: string;
}) {
  const queryClient = useQueryClient();

  const template = Template[templateId];

  const { object, submit, isLoading, error } = useObject({
    api: template.streamApiUrl,
    schema: template.outputSchema,
    onFinish: () => queryClient.invalidateQueries(generationOptions()),
  });

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

  if (isLoading && !object) {
    return <Loader title="Generation starting..." />;
  }

  return typedVariants.data.map((variant, index) => {
    return (
      <VariantCard
        key={index}
        index={index}
        variant={variant}
        fields={template.fields}
      />
    );
  });
}
