import { ReactNode } from "react";
import {
  Controller,
  ControllerProps,
  ControllerRenderProps,
  FieldPath,
  FieldValues,
} from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "../ui/field";

export type BaseFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
> = {
  name: TName;
  control: ControllerProps<TFieldValues, TName, TTransformedValues>["control"];
  label?: ReactNode;
  description?: ReactNode;
  children: (
    field: ControllerRenderProps<TFieldValues, TName> & {
      "aria-invalid": boolean;
      id: string;
    },
  ) => ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
};

export function BaseField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
  TTransformedValues = TFieldValues,
>({
  name,
  label,
  description,
  control,
  children,
  horizontal = false,
  controlFirst = false,
}: BaseFieldProps<TFieldValues, TName, TTransformedValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const labelElement = (label || description) && (
          <>
            {!!label && <FieldLabel htmlFor={field.name}>{label}</FieldLabel>}

            {!!description && (
              <FieldDescription>{description}</FieldDescription>
            )}
          </>
        );

        const controlElement = children({
          ...field,
          "aria-invalid": fieldState.invalid,
          id: field.name,
        });

        const errorElement = fieldState.invalid && (
          <FieldError errors={[fieldState.error]} />
        );

        return (
          <Field
            data-invalid={fieldState.invalid}
            orientation={horizontal ? "horizontal" : undefined}
          >
            {controlFirst ? (
              <>
                {controlElement}
                <FieldContent>
                  {labelElement}
                  {errorElement}
                </FieldContent>
              </>
            ) : (
              <>
                {labelElement && <FieldContent>{labelElement}</FieldContent>}

                {controlElement}

                {errorElement}
              </>
            )}
          </Field>
        );
      }}
    />
  );
}
