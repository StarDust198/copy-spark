"use client";

import { DefaultValues, useForm } from "react-hook-form";
import { ReactNode } from "react";
import z from "zod";
import { TextareaField } from "../fields/textarea-field";
import { SelectField } from "../fields/select-field";
import { ModelSelectorField } from "../fields/model-selector-field";
import { Tone } from "@/constants/tone";
import { SelectItem } from "../ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailSubjectForm,
  emailSubjectFormSchema,
} from "@/schemas/email-schema";
import { CheckboxField } from "../fields/checkbox-field";
import { EmailGoal } from "@/constants/emailGoal";
import { DEFAULT_MODEL } from "@/constants/model";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleChevronTrigger,
} from "../ui/collapsible";

type EmailFormValues = z.input<typeof emailSubjectFormSchema>;

const EMAIL_FORM_DEFAULTS: EmailFormValues = {
  emailGoal: "",
  emailSummary: "",
  tone: "",
  includeEmoji: false,
  model: DEFAULT_MODEL,
};

type EmailFormProps = {
  defaultValues?: DefaultValues<EmailFormValues>;
  disabled?: boolean;
  onSubmit: (fields: EmailSubjectForm) => void | Promise<void>;
  children?: (state: { isSubmitting: boolean }) => ReactNode;
};

export function EmailForm({
  defaultValues,
  disabled,
  onSubmit,
  children,
}: EmailFormProps) {
  const form = useForm({
    defaultValues: { ...EMAIL_FORM_DEFAULTS, ...defaultValues },
    resolver: zodResolver(emailSubjectFormSchema),
  });

  const isSubmitting = form.formState.isSubmitting;
  const isDisabled = disabled || isSubmitting;

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col gap-6"
    >
      <div className="flex flex-col gap-4">
        <SelectField
          control={form.control}
          name="emailGoal"
          label="What kind of email?"
          placeholder="Select kind of email"
          disabled={isDisabled}
        >
          {Object.values(EmailGoal).map((emailGoal) => {
            return (
              <SelectItem key={emailGoal} value={emailGoal}>
                {emailGoal}
              </SelectItem>
            );
          })}
        </SelectField>

        <TextareaField
          control={form.control}
          label="What's the email about?"
          name="emailSummary"
          placeholder="Spring sale — all yoga gear 20% off until Sunday"
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

        <CheckboxField
          control={form.control}
          name="includeEmoji"
          label="Include emoji variants"
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
