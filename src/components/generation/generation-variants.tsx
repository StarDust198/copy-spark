import { TemplateField } from "@/constants/templates";
import { VariantCard } from "./variant-card";
import { ErrorMessage } from "../layout/error-message";
import { Button } from "../ui/button";

type GenerationVariantsProps = {
  variants: Record<string, string>[];
  fields: TemplateField[];
  error?: boolean;
  onRetry?: () => void;
};

export function GenerationVariants({
  variants,
  fields,
  error,
  onRetry,
}: GenerationVariantsProps) {
  return (
    <div className="flex gap-6 flex-wrap justify-center items-start shrink-0">
      {error ? (
        <ErrorMessage
          title="Something went wrong"
          action={onRetry && <Button onClick={onRetry}>Try again</Button>}
        />
      ) : (
        variants.map((variant, index) => (
          <VariantCard
            key={index}
            index={index}
            variant={variant}
            fields={fields}
          />
        ))
      )}
    </div>
  );
}
