import { ReactNode } from "react";
import { TemplateField } from "@/constants/templates";
import { VariantCard } from "./variant-card";
import { ErrorMessage } from "../layout/error-message";
import { Button } from "../ui/button";

type GenerationVariantsProps = {
  variants: Record<string, string>[];
  fields: TemplateField[];
  favorite: number | null;
  favoriteDisabled?: boolean;
  onToggleFavorite: (index: number) => void;
  actions?: ReactNode;
  error?: boolean;
  onRetry?: () => void;
};

export function GenerationVariants({
  variants,
  fields,
  favorite,
  favoriteDisabled,
  onToggleFavorite,
  actions,
  error,
  onRetry,
}: GenerationVariantsProps) {
  if (error) {
    return (
      <ErrorMessage
        title="Something went wrong"
        action={onRetry && <Button onClick={onRetry}>Try again</Button>}
      />
    );
  }

  return (
    <div className="flex w-full flex-col items-center gap-6">
      {actions}

      <div className="flex gap-6 flex-wrap justify-center items-start shrink-0">
        {variants.map((variant, index) => (
          <VariantCard
            key={index}
            index={index}
            variant={variant}
            fields={fields}
            isFavorite={favorite === index}
            disabled={favoriteDisabled}
            onToggleFavorite={() => onToggleFavorite(index)}
          />
        ))}
      </div>
    </div>
  );
}
