"use client";

import { DefaultValues, useForm } from "react-hook-form";
import { ReactNode } from "react";
import z from "zod";
import { InputField } from "../fields/input-field";
import { SelectField } from "../fields/select-field";
import { TextareaField } from "../fields/textarea-field";
import { ModelSelectorField } from "../fields/model-selector-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectItem } from "../ui/select";
import { Tone } from "@/constants/tone";
import {
  ProductDescriptionForm,
  productDescriptionFormSchema,
} from "@/schemas/description-schema";
import { Length } from "@/constants/length";
import { DEFAULT_MODEL } from "@/constants/model";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleChevronTrigger,
} from "../ui/collapsible";

type DescriptionFormValues = z.input<typeof productDescriptionFormSchema>;

const DESCRIPTION_FORM_DEFAULTS: DescriptionFormValues = {
  productName: "",
  keyFeatures: "",
  targetAudience: "",
  length: Length.medium,
  tone: "",
  model: DEFAULT_MODEL,
};

type DescriptionFormProps = {
  defaultValues?: DefaultValues<DescriptionFormValues>;
  disabled?: boolean;
  onSubmit: (fields: ProductDescriptionForm) => void | Promise<void>;
  children?: (state: { isSubmitting: boolean }) => ReactNode;
};

export function DescriptionForm({
  defaultValues,
  disabled,
  onSubmit,
  children,
}: DescriptionFormProps) {
  const form = useForm({
    defaultValues: { ...DESCRIPTION_FORM_DEFAULTS, ...defaultValues },
    resolver: zodResolver(productDescriptionFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;
  const isDisabled = disabled || isSubmitting;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <InputField
          control={form.control}
          label="Product name"
          name="productName"
          placeholder="GripFlow yoga mat"
          disabled={isDisabled}
        />

        <TextareaField
          control={form.control}
          label="Key features (one per line)"
          name="keyFeatures"
          placeholder="Natural cork surface · 5mm cushioning · carrying strap included"
          disabled={isDisabled}
        />

        <InputField
          control={form.control}
          label="Who buys this? (optional)"
          name="targetAudience"
          placeholder="Home yoga beginners"
          disabled={isDisabled}
        />

        <SelectField
          control={form.control}
          name="length"
          label="Length"
          placeholder="Select length"
          disabled={isDisabled}
        >
          {Object.values(Length).map((length) => {
            return (
              <SelectItem key={length} value={length}>
                {length}
              </SelectItem>
            );
          })}
        </SelectField>

        <SelectField
          control={form.control}
          name="tone"
          label="Tone"
          placeholder="Select tone"
          disabled={isDisabled}
        >
          {Object.values(Tone).map((tone) => {
            return (
              <SelectItem key={tone} value={tone}>
                {tone}
              </SelectItem>
            );
          })}
        </SelectField>

        <Collapsible>
          <CollapsibleChevronTrigger title="Additional Settings" />

          <CollapsibleContent>
            <ModelSelectorField
              control={form.control}
              name="model"
              label="Model"
              disabled={isDisabled}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {children?.({ isSubmitting })}
    </form>
  );
}
