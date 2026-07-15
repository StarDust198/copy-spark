import { generationResults } from "@/components/generation/generation-results";
import { GenerationStreamer } from "@/components/generation/generation-streamer";
import { VariantCard } from "@/components/generation/variant-card";
import { PageContent } from "@/components/layout/page-content";
import { TemplateId } from "@/constants/templates";
import { getGeneration } from "@/lib/actions/generations";
import { GenerationStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import z from "zod";

export default async function Page(props: PageProps<"/generation/[id]">) {
  const { id } = await props.params;

  const generation = await getGeneration({ id });

  if (!generation) {
    notFound();
  }

  const templateId = generation.templateId as TemplateId;
  const config = generationResults[templateId];

  if (!config) {
    notFound();
  }

  function renderContent() {
    switch (generation?.status) {
      case GenerationStatus.PENDING: {
        return <GenerationStreamer id={id} templateId={templateId} />;
      }

      case GenerationStatus.COMPLETED: {
        const variants = z.array(config.variantSchema).parse(generation.output);

        return variants.map((variant, index) => (
          <VariantCard
            key={index}
            index={index}
            variant={variant}
            fields={config.fields}
          />
        ));
      }
    }
  }

  return (
    <PageContent title={generation.title} description={config.description}>
      <div className="h-full flex flex-col justify-center">
        <div className="flex gap-6 flex-wrap justify-center items-start shrink-0">
          {renderContent()}
        </div>
      </div>
    </PageContent>
  );
}
