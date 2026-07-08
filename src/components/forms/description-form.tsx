"use client";

import { useForm } from "react-hook-form";
import { InputField } from "../fields/input-field";
import { SelectField } from "../fields/select-field";
import { TextareaField } from "../fields/textarea-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { SelectItem } from "../ui/select";
import { Tone } from "@/constants/tone";
import { Button } from "../ui/button";
import { descriptionSchema } from "@/schemas/description-schema";
import { Length } from "@/constants/length";

export function DescriptionForm() {
  const form = useForm({
    defaultValues: {
      productName: "",
      keyFeatures: "",
      targetAudience: "",
      length: Length.medium,
      tone: "" as const,
    },
    resolver: zodResolver(descriptionSchema),
  });

  function onSubmit(fields: unknown) {
    console.log("DescriptionForm onSubmit", fields);
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

      <Button type="submit">Generate</Button>
    </form>
  );
}
