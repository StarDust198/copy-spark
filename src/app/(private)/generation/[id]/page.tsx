import { generationResults } from "@/components/generation/generation-results";
import { VariantCard } from "@/components/generation/variant-card";
import { PageContent } from "@/components/layout/page-content";
import { TemplateId } from "@/constants/templates";
import { getGeneration } from "@/lib/actions/generations";
import { notFound } from "next/navigation";
import z from "zod";

export default async function Page(props: PageProps<"/generation/[id]">) {
  const { id: generationId } = await props.params;

  const generation = await getGeneration({ generationId });

  if (!generation) {
    notFound();
  }

  const config = generationResults[generation.templateId as TemplateId];

  if (!config) {
    notFound();
  }

  const variants = z.array(config.variantSchema).parse(generation.output);

  return (
    <PageContent title={generation.title} description={config.description}>
      <div className="h-full flex flex-col justify-center">
        <div className="flex gap-6 flex-wrap justify-center items-start shrink-0">
          {variants.map((variant, index) => (
            <VariantCard
              key={index}
              index={index}
              variant={variant}
              fields={config.fields}
            />
          ))}
        </div>
      </div>
    </PageContent>
  );
}
