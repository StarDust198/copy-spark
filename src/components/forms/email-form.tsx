"use client";

import { useForm } from "react-hook-form";
import { TextareaField } from "../fields/textarea-field";
import { SelectField } from "../fields/select-field";
import { ModelSelectorField } from "../fields/model-selector-field";
import { Tone } from "@/constants/tone";
import { SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailSubjectForm,
  emailSubjectFormSchema,
} from "@/schemas/email-schema";
import { CheckboxField } from "../fields/checkbox-field";
import { EmailGoal } from "@/constants/emailGoal";
import { useCreateEmailSubjectGeneration } from "@/lib/query/use-generation-hooks";
import { useRouter } from "next/navigation";
import { generateId } from "ai";
import { DEFAULT_MODEL } from "@/constants/model";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDownIcon } from "lucide-react";

export function EmailForm() {
  const form = useForm({
    defaultValues: {
      emailGoal: "" as const,
      emailSummary: "",
      tone: "" as const,
      includeEmoji: false,
      model: DEFAULT_MODEL,
    },
    resolver: zodResolver(emailSubjectFormSchema),
  });

  const createEmailSubjectGenerationMutation =
    useCreateEmailSubjectGeneration();
  const router = useRouter();

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(fields: EmailSubjectForm) {
    const id = generateId();

    const { model, ...request } = fields;

    const generation = await createEmailSubjectGenerationMutation.mutateAsync({
      id,
      request,
      model,
    });

    router.push(`/generation/${generation.id}`);
  }

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
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />

        <SelectField
          control={form.control}
          name="tone"
          label="Tone"
          placeholder="Select tone"
          disabled={isSubmitting}
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
          disabled={isSubmitting}
        />

        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 py-1">
            <div>Additional Settings</div>

            <ChevronDownIcon size={16} />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <ModelSelectorField
              control={form.control}
              className="max-w-48"
              name="model"
              label="Model"
              disabled={isSubmitting}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        Generate
      </Button>
    </form>
  );
}
