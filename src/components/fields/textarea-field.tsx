import { ReactNode } from "react";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { BaseField } from "./base-field";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/cn";

export type TextareaFieldProps<
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
};

export function TextareaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  description,
  control,
  placeholder,
  className,
  disabled,
}: TextareaFieldProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <BaseField
      name={name}
      control={control}
      description={description}
      label={label}
    >
      {(field) => (
        <Textarea
          {...field}
          placeholder={placeholder}
          className={cn("min-h-20 resize-none", className)}
          disabled={disabled}
        />
      )}
    </BaseField>
  );
}
