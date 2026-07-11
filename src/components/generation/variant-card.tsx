import { CopyableSection } from "@/components/generation/copyable-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type VariantCardProps = {
  index: number;
  variant: Record<string, string>;
  fields: { label: string; key: string }[];
};

export function VariantCard({ index, variant, fields }: VariantCardProps) {
  return (
    <Card className="w-full max-w-64">
      <CardHeader>
        <CardTitle>
          <h2 className="text-xl font-semibold">Variant #{index + 1}</h2>
        </CardTitle>
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
