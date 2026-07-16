import { GenerationStreamer } from "@/components/generation/generation-streamer";
import { VariantCard } from "@/components/generation/variant-card";
import { PageContent } from "@/components/layout/page-content";
import { Template, TemplateId } from "@/constants/templates";
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

  const parsedTemplateId = z
    .enum(Object.values(TemplateId))
    .safeParse(generation.templateId);

  if (!parsedTemplateId.success) {
    notFound();
  }

  const template = Template[parsedTemplateId.data];

  function renderContent() {
    switch (generation?.status) {
      case GenerationStatus.PENDING: {
        return <GenerationStreamer id={id} templateId={template.id} />;
      }

      case GenerationStatus.COMPLETED: {
        const variants = z
          .array(template.variantSchema)
          .parse(generation.output);

        return variants.map((variant, index) => (
          <VariantCard
            key={index}
            index={index}
            variant={variant}
            fields={template.fields}
          />
        ));
      }

      case GenerationStatus.ERROR: {
        // TODO: Add retry button here
        return <div>Add retry button here</div>;
      }

      case GenerationStatus.STREAMING: {
        // TODO: Add loader and and refetch here
        return <div>Add loader and and refetch here</div>;
      }
    }
  }

  return (
    <PageContent title={generation.title} description={template.title}>
      <div className="flex gap-6 flex-wrap justify-center items-start shrink-0">
        {renderContent()}
      </div>
    </PageContent>
  );
}
