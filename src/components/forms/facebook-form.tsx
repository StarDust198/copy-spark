"use client";

import { useForm } from "react-hook-form";
import { Tone } from "@/constants/tone";
import { SelectItem } from "../ui/select";
import { SelectField } from "../fields/select-field";
import { InputField } from "../fields/input-field";
import { TextareaField } from "../fields/textarea-field";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FacebookAdRequest,
  facebookAdRequestSchema,
} from "@/schemas/facebook-schema";
import { Button } from "../ui/button";
import { TemplateId } from "@/constants/templates";
import { useCreateGeneration } from "@/lib/query/use-generation-hooks";
import { useRouter } from "next/navigation";

export function FacebookForm() {
  const form = useForm({
    defaultValues: {
      productName: "",
      productDescription: "",
      targetAudience: "",
      tone: "",
      specialOffer: "",
    },
    resolver: zodResolver(facebookAdRequestSchema),
  });

  const createGenerationMutation = useCreateGeneration();
  const router = useRouter();

  async function onSubmit(fields: FacebookAdRequest) {
    const generation = await createGenerationMutation.mutateAsync({
      request: fields,
      templateId: TemplateId.facebookAd,
    });

    router.push(`/generation/${generation.id}`);
  }

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
        />

        <TextareaField
          control={form.control}
          label="What is it and what makes it good?"
          name="productDescription"
          placeholder="A non-slip cork yoga mat with extra cushioning for home workouts"
        />

        <InputField
          control={form.control}
          label="Who is this ad for?"
          name="targetAudience"
          placeholder="Busy moms who do yoga at home"
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

        <InputField
          control={form.control}
          label="Special offer (optional)"
          name="specialOffer"
          placeholder="Busy moms who do yoga at home"
        />
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        Generate
      </Button>
    </form>
  );
}
