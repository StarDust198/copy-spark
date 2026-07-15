"use client";

import { useForm } from "react-hook-form";
import { TextareaField } from "../fields/textarea-field";
import { SelectField } from "../fields/select-field";
import { Tone } from "@/constants/tone";
import { SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EmailSubjectRequest,
  emailSubjectRequestSchema,
} from "@/schemas/email-schema";
import { CheckboxField } from "../fields/checkbox-field";
import { EmailGoal } from "@/constants/emailGoal";
import { useCreateEmailSubjectGeneration } from "@/lib/query/use-generation-hooks";
import { useRouter } from "next/navigation";
import { generateId } from "ai";
import { FREE_MODEL } from "@/constants/model";

export function EmailForm() {
  const form = useForm({
    defaultValues: {
      emailGoal: "" as const,
      emailSummary: "",
      tone: "" as const,
      includeEmoji: false,
    },
    resolver: zodResolver(emailSubjectRequestSchema),
  });

  const createEmailSubjectGenerationMutation =
    useCreateEmailSubjectGeneration();
  const router = useRouter();

  async function onSubmit(fields: EmailSubjectRequest) {
    const id = generateId();

    const generation = await createEmailSubjectGenerationMutation.mutateAsync({
      id,
      request: fields,
      model: FREE_MODEL,
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
        />

        <SelectField
          control={form.control}
          name="tone"
          label="Tone"
          placeholder="Select tone"
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
        />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        Generate
      </Button>
    </form>
  );
}
