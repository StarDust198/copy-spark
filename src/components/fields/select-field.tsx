import { ReactNode } from "react";
import { FieldValues, FieldPath, ControllerProps } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BaseField } from "./base-field";

export type SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
  label?: ReactNode;
  description?: ReactNode;
  children: ReactNode;
  placeholder?: string;
  getTriggerText?: (option: string) => ReactNode;
};

export function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  description,
  control,
  getTriggerText,
  placeholder,
  children,
}: SelectFieldProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <BaseField
      name={name}
      control={control}
      description={description}
      label={label}
    >
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange}>
          <SelectTrigger
            onBlur={onBlur}
            id={field.id}
            aria-invalid={field["aria-invalid"]}
            className="w-full max-w-48"
          >
            <SelectValue placeholder={placeholder}>
              {(value) =>
                getTriggerText ? getTriggerText(value) : value || placeholder
              }
            </SelectValue>
          </SelectTrigger>

          <SelectContent id={field.name}>{children}</SelectContent>
        </Select>
      )}
    </BaseField>
  );
}
