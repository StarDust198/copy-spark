import { ReactNode } from "react";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { BaseField } from "./base-field";
import { cn } from "@/lib/cn";
import { Input } from "../ui/input";

export type InputFieldProps<
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
};

export function InputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  description,
  control,
  className,
  placeholder,
}: InputFieldProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <BaseField
      name={name}
      control={control}
      description={description}
      label={label}
    >
      {(field) => (
        <Input
          {...field}
          placeholder={placeholder}
          className={cn("shrink-0", className)}
        />
      )}
    </BaseField>
  );
}
