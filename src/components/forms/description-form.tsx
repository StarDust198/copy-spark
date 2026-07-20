"use client";

import { useForm } from "react-hook-form";
import { InputField } from "../fields/input-field";
import { SelectField } from "../fields/select-field";
import { TextareaField } from "../fields/textarea-field";
import { ModelSelectorField } from "../fields/model-selector-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectItem } from "../ui/select";
import { Tone } from "@/constants/tone";
import { Button } from "../ui/button";
import {
  ProductDescriptionForm,
  productDescriptionFormSchema,
} from "@/schemas/description-schema";
import { Length } from "@/constants/length";
import { useCreateProductDescriptionGeneration } from "@/lib/query/use-generation-hooks";
import { useRouter } from "next/navigation";
import { generateId } from "ai";
import { DEFAULT_MODEL } from "@/constants/model";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronDownIcon } from "lucide-react";

export function DescriptionForm() {
  const form = useForm({
    defaultValues: {
      productName: "",
      keyFeatures: "",
      targetAudience: "",
      length: Length.medium,
      tone: "" as const,
      model: DEFAULT_MODEL,
    },
    resolver: zodResolver(productDescriptionFormSchema),
  });

  const createProductDescriptionGenerationMutation =
    useCreateProductDescriptionGeneration();
  const router = useRouter();

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(fields: ProductDescriptionForm) {
    const id = generateId();

    const { model, ...request } = fields;

    const generation =
      await createProductDescriptionGenerationMutation.mutateAsync({
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
          label="Key features (one per line)"
          name="keyFeatures"
          placeholder="Natural cork surface · 5mm cushioning · carrying strap included"
          disabled={isSubmitting}
        />

        <InputField
          control={form.control}
          label="Who buys this? (optional)"
          name="targetAudience"
          placeholder="Home yoga beginners"
          disabled={isSubmitting}
        />

        <SelectField
          control={form.control}
          name="length"
          label="Length"
          placeholder="Select length"
          disabled={isSubmitting}
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

        <Collapsible>
          <CollapsibleTrigger className="flex items-center gap-2 py-1">
            <div>Additional Settings</div>

            <ChevronDownIcon size={16} />
          </CollapsibleTrigger>

          <CollapsibleContent>
            <ModelSelectorField
              control={form.control}
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
