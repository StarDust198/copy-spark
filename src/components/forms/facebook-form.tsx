"use client";

import { useForm } from "react-hook-form";
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
import { Button } from "../ui/button";
import { useCreateFacebookAdGeneration } from "@/lib/query/use-generation-hooks";
import { useRouter } from "next/navigation";
import { generateId } from "ai";
import { DEFAULT_MODEL } from "@/constants/model";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDownIcon } from "lucide-react";

export function FacebookForm() {
  const form = useForm({
    defaultValues: {
      productName: "",
      productDescription: "",
      targetAudience: "",
      tone: "",
      specialOffer: "",
      model: DEFAULT_MODEL,
    },
    resolver: zodResolver(facebookAdFormSchema),
  });

  const createFacebookAdGenerationMutation = useCreateFacebookAdGeneration();
  const router = useRouter();

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(fields: FacebookAdForm) {
    const id = generateId();

    const { model, ...request } = fields;

    const generation = await createFacebookAdGenerationMutation.mutateAsync({
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
        <InputField
          control={form.control}
          label="Product name"
          name="productName"
          placeholder="GripFlow yoga mat"
          disabled={isSubmitting}
        />

        <TextareaField
          control={form.control}
          label="What is it and what makes it good?"
          name="productDescription"
          placeholder="A non-slip cork yoga mat with extra cushioning for home workouts"
          disabled={isSubmitting}
        />

        <InputField
          control={form.control}
          label="Who is this ad for?"
          name="targetAudience"
          placeholder="Busy moms who do yoga at home"
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

        <InputField
          control={form.control}
          label="Special offer (optional)"
          name="specialOffer"
          placeholder="20% off this week"
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
