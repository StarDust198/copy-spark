"use client";

import { Template, TemplateId } from "@/constants/templates";
import { useObject } from "@ai-sdk/react";
import { generationResults } from "./generation-results";
import { VariantCard } from "./variant-card";
import z from "zod";
import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { generationOptions } from "@/lib/query/generations-options";

export function GenerationStreamer({
  templateId,
  id,
}: {
  templateId: TemplateId;
  id: string;
}) {
  const queryClient = useQueryClient();

  const { object, submit } = useObject({
    api: Template[templateId].streamApiUrl,
    schema: Template[templateId].outputSchema,
    onFinish: () => queryClient.invalidateQueries(generationOptions()),
  });

  const config = generationResults[templateId];
  const variants = object?.variants as
    | Array<Record<string, string | undefined> | undefined>
    | undefined;

  const filledVariants =
    variants?.map((variant) => {
      return Object.fromEntries(
        config.fields.map((field) => [field.key, variant?.[field.key] ?? ""]),
      );
    }) ?? [];

  const isStartedRef = useRef(false);

  useEffect(() => {
    if (isStartedRef.current) return; // guard: StrictMode runs effects twice in dev
    isStartedRef.current = true;
    submit({ id });
  }, [id, submit]);

  const typedVariants = z.array(config.variantSchema).safeParse(filledVariants);

  if (!typedVariants.success) {
    // TODO: Correct error message
    return <div>Error</div>;
  }

  return typedVariants.data.map((variant, index) => {
    return (
      <VariantCard
        key={index}
        index={index}
        variant={variant}
        fields={config.fields}
      />
    );
  });
}
