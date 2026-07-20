import { ReactNode, useState } from "react";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { BaseField } from "./base-field";
import { Button } from "../ui/button";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "../ai-elements/model-selector";
import { MODELS } from "@/constants/model";
import { cn } from "@/lib/cn";

export type ModelSelectorFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
  models?: readonly {
    id: string;
    label: string;
    provider: string;
  }[];
};

export function ModelSelectorField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  description,
  control,
  className,
  placeholder = "Select model",
  disabled,
  models = MODELS,
}: ModelSelectorFieldProps<TFieldValues, TName, TTransformedValues>) {
  const [open, setOpen] = useState(false);

  return (
    <BaseField
      name={name}
      control={control}
      description={description}
      label={label}
    >
      {({ value, onChange, onBlur, ...field }) => {
        const selected = models.find((model) => model.id === value);

        return (
          <ModelSelector open={open} onOpenChange={setOpen}>
            <ModelSelectorTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  id={field.id}
                  onBlur={onBlur}
                  disabled={disabled}
                  aria-invalid={field["aria-invalid"]}
                  className={cn("max-w-48 justify-between", className)}
                >
                  {selected ? (
                    <>
                      <ModelSelectorLogo provider={selected.provider} />
                      <ModelSelectorName>{selected.label}</ModelSelectorName>
                    </>
                  ) : (
                    <ModelSelectorName>{placeholder}</ModelSelectorName>
                  )}
                </Button>
              }
            />

            <ModelSelectorContent>
              <ModelSelectorInput placeholder="Search models..." />
              <ModelSelectorList>
                <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>

                {models.map((model) => (
                  <ModelSelectorItem
                    key={model.id}
                    value={model.id}
                    data-checked={value === model.id}
                    onSelect={(id) => {
                      onChange(id);
                      setOpen(false);
                    }}
                  >
                    <ModelSelectorLogo provider={model.provider} />

                    <ModelSelectorName>{model.label}</ModelSelectorName>
                  </ModelSelectorItem>
                ))}
              </ModelSelectorList>
            </ModelSelectorContent>
          </ModelSelector>
        );
      }}
    </BaseField>
  );
}
