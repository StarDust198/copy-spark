"use client";

import { useForm } from "react-hook-form";
import { InputField } from "../fields/input-field";
import { SelectField } from "../fields/select-field";
import { TextareaField } from "../fields/textarea-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectItem } from "../ui/select";
import { Tone } from "@/constants/tone";
import { Button } from "../ui/button";
import {
  ProductDescriptionRequest,
  productDescriptionRequestSchema,
} from "@/schemas/description-schema";
import { Length } from "@/constants/length";
import { useCreateProductDescriptionGeneration } from "@/lib/query/use-generation-hooks";
import { useRouter } from "next/navigation";
import { generateId } from "ai";
import { FREE_MODEL } from "@/constants/model";

export function DescriptionForm() {
  const form = useForm({
    defaultValues: {
      productName: "",
      keyFeatures: "",
      targetAudience: "",
      length: Length.medium,
      tone: "" as const,
    },
    resolver: zodResolver(productDescriptionRequestSchema),
  });

  const createProductDescriptionGenerationMutation =
    useCreateProductDescriptionGeneration();
  const router = useRouter();

  async function onSubmit(fields: ProductDescriptionRequest) {
    const id = generateId();

    const generation =
      await createProductDescriptionGenerationMutation.mutateAsync({
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
        <InputField
          control={form.control}
          label="Product name"
          name="productName"
          placeholder="GripFlow yoga mat"
        />

        <TextareaField
          control={form.control}
          label="Key features (one per line)"
          name="keyFeatures"
          placeholder="Natural cork surface · 5mm cushioning · carrying strap included"
        />

        <InputField
          control={form.control}
          label="Who buys this? (optional)"
          name="targetAudience"
          placeholder="Home yoga beginners"
        />

        <SelectField
          control={form.control}
          name="length"
          label="Length"
          placeholder="Select length"
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
        >
          {Object.values(Tone).map((tone) => {
            return (
              <SelectItem key={tone} value={tone}>
                {tone}
              </SelectItem>
            );
          })}
        </SelectField>
      </div>

      <Button type="submit" disabled={form.formState.isSubmitting}>
        Generate
      </Button>
    </form>
  );
}
