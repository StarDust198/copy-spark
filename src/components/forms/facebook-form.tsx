"use client";

import { DefaultValues, useForm } from "react-hook-form";
import { ReactNode } from "react";
import z from "zod";
import { Tone } from "@/constants/tone";
import { SelectItem } from "../ui/select";
import { SelectField } from "../fields/select-field";
import { InputField } from "../fields/input-field";
import { TextareaField } from "../fields/textarea-field";
import { ModelSelectorField } from "../fields/model-selector-field";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FacebookAdForm,
  facebookAdFormSchema,
} from "@/schemas/facebook-schema";
import { DEFAULT_MODEL } from "@/constants/model";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleChevronTrigger,
} from "../ui/collapsible";

type FacebookFormValues = z.input<typeof facebookAdFormSchema>;

const FACEBOOK_FORM_DEFAULTS: FacebookFormValues = {
  productName: "",
  productDescription: "",
  targetAudience: "",
  tone: "",
  specialOffer: "",
  model: DEFAULT_MODEL,
};

type FacebookFormProps = {
  defaultValues?: DefaultValues<FacebookFormValues>;
  disabled?: boolean;
  onSubmit: (fields: FacebookAdForm) => void | Promise<void>;
  children?: (state: { isSubmitting: boolean }) => ReactNode;
};

export function FacebookForm({
  defaultValues,
  disabled,
  onSubmit,
  children,
}: FacebookFormProps) {
  const form = useForm({
    defaultValues: { ...FACEBOOK_FORM_DEFAULTS, ...defaultValues },
    resolver: zodResolver(facebookAdFormSchema),
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
          label="What is it and what makes it good?"
          name="productDescription"
          placeholder="A non-slip cork yoga mat with extra cushioning for home workouts"
          disabled={isDisabled}
        />

        <InputField
          control={form.control}
          label="Who is this ad for?"
          name="targetAudience"
          placeholder="Busy moms who do yoga at home"
          disabled={isDisabled}
        />

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

        <InputField
          control={form.control}
          label="Special offer (optional)"
          name="specialOffer"
          placeholder="20% off this week"
          disabled={isDisabled}
        />

        <Collapsible>
          <CollapsibleChevronTrigger title="Additional Settings" />

          <CollapsibleContent>
            <ModelSelectorField
              control={form.control}
              className="max-w-48"
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
