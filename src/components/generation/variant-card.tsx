import { Star } from "lucide-react";

import { CopyableSection } from "@/components/generation/copyable-section";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

type VariantCardProps = {
  index: number;
  variant: Record<string, string>;
  fields: { label: string; key: string }[];
  isFavorite: boolean;
  disabled?: boolean;
  onToggleFavorite: () => void;
};

export function VariantCard({
  index,
  variant,
  fields,
  isFavorite,
  disabled,
  onToggleFavorite,
}: VariantCardProps) {
  const favoriteLabel = isFavorite ? "Remove favorite" : "Mark as favorite";

  return (
    <Card className="w-full max-w-64">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-semibold">Variant #{index + 1}</h2>
        </CardTitle>

        <CardAction>
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label={favoriteLabel}
                  aria-pressed={isFavorite}
                  disabled={disabled}
                  onClick={onToggleFavorite}
                />
              }
            >
              <Star
                className={cn(
                  "transition-colors",
                  isFavorite
                    ? "fill-amber-500 text-amber-500"
                    : "text-muted-foreground group-hover/button:text-amber-500",
                )}
              />
            </TooltipTrigger>

            <TooltipContent>
              <p>{favoriteLabel}</p>
            </TooltipContent>
          </Tooltip>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-3">
        {fields.map((field) => (
          <CopyableSection
            key={field.key}
            title={field.label}
            content={variant[field.key]}
          />
        ))}
      </CardContent>
    </Card>
  );
}
