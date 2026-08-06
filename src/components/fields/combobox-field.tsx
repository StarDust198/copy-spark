import { ReactNode } from "react";
import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { BaseField } from "./base-field";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "../ui/combobox";
import { InputGroupAddon } from "../ui/input-group";
import { cn } from "@/lib/cn";

export type ComboboxFieldProps<
  TItem,
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
  emptyMessage?: ReactNode;
  disabled?: boolean;
  items: readonly TItem[];
  itemToValue: (item: TItem) => string;
  itemToLabel: (item: TItem) => string;
  children?: (item: TItem) => ReactNode;
  renderAddon?: (item: TItem | undefined) => ReactNode;
};

export function ComboboxField<
  TItem,
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
  emptyMessage = "No results found.",
  disabled,
  items,
  itemToValue,
  itemToLabel,
  children,
  renderAddon,
}: ComboboxFieldProps<TItem, TFieldValues, TName, TTransformedValues>) {
  return (
    <BaseField
      name={name}
      control={control}
      description={description}
      label={label}
    >
      {({ value, onChange, onBlur, ...field }) => {
        // The form stores the item's value, Base UI selects on the item itself —
        // resolving through `items` keeps the reference identity its default
        // `Object.is` comparison relies on.
        const selected = items.find((item) => itemToValue(item) === value);

        return (
          <Combobox
            items={items}
            value={selected ?? null}
            onValueChange={(item) => onChange(item ? itemToValue(item) : "")}
            itemToStringLabel={itemToLabel}
            disabled={disabled}
          >
            <ComboboxInput
              id={field.id}
              onBlur={onBlur}
              disabled={disabled}
              placeholder={placeholder}
              aria-invalid={field["aria-invalid"]}
              className={cn("w-full max-w-48", className)}
            >
              {renderAddon && (
                <InputGroupAddon>{renderAddon(selected)}</InputGroupAddon>
              )}
            </ComboboxInput>

            {/* The registry default pads the popup past the anchor to make up
                for the mis-anchoring fixed in `ui/combobox`; match the control. */}
            <ComboboxContent className="min-w-(--anchor-width)">
              <ComboboxEmpty>{emptyMessage}</ComboboxEmpty>

              <ComboboxList>
                {(item: TItem) => (
                  <ComboboxItem key={itemToValue(item)} value={item}>
                    {children ? children(item) : itemToLabel(item)}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        );
      }}
    </BaseField>
  );
}
