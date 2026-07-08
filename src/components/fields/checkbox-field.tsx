import { ReactNode } from "react";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { BaseField } from "./base-field";
import { Checkbox } from "../ui/checkbox";

export type CheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
  label?: ReactNode;
  description?: ReactNode;
  className?: string;
};

export function CheckboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  control,
  className,
}: CheckboxFieldProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <BaseField
      name={name}
      label={label}
      control={control}
      horizontal
      controlFirst
    >
      {({ onChange, value, ...field }) => (
        <Checkbox {...field} checked={value} onCheckedChange={onChange} />
      )}
    </BaseField>
  );
}
