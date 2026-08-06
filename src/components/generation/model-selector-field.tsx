import { ReactNode } from "react";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { ComboboxField } from "../fields/combobox-field";
import { MODELS, type Model, type ModelProvider } from "@/constants/model";

function ModelLogo({ provider }: { provider: ModelProvider }) {
  return (
    // A 12px remote SVG — routing it through next/image would mean a
    // `remotePatterns` entry for nothing at this size.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={`${provider} logo`}
      className="size-3 dark:invert"
      height={12}
      width={12}
      src={`https://models.dev/logos/${provider}.svg`}
    />
  );
}

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
  models?: readonly Model[];
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
  return (
    <ComboboxField
      name={name}
      control={control}
      label={label}
      description={description}
      className={className}
      placeholder={placeholder}
      emptyMessage="No models found."
      disabled={disabled}
      items={models}
      itemToValue={(model) => model.id}
      itemToLabel={(model) => model.label}
      renderAddon={(model) => model && <ModelLogo provider={model.provider} />}
    >
      {(model) => (
        <>
          <ModelLogo provider={model.provider} />
          {model.label}
        </>
      )}
    </ComboboxField>
  );
}
