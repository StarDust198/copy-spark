import { ReactNode } from "react";
import { FieldValues, FieldPath, ControllerProps } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { BaseField } from "./base-field";
import { cn } from "@/lib/cn";

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
  className?: string;
  disabled?: boolean;
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
  className,
  disabled,
}: SelectFieldProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <BaseField
      name={name}
      control={control}
      description={description}
      label={label}
    >
      {({ onChange, onBlur, ...field }) => (
        <Select {...field} onValueChange={onChange} disabled={disabled}>
          <SelectTrigger
            onBlur={onBlur}
            id={field.id}
            aria-invalid={field["aria-invalid"]}
            className={cn("w-full max-w-48", className)}
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
