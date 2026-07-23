import { GenerationError } from "@/components/generation/generation-error";
import { GenerationPoller } from "@/components/generation/generation-poller";
import { GenerationStreamer } from "@/components/generation/generation-streamer";
import { GenerationResult } from "@/components/generation/generation-result";
import { PageContent } from "@/components/layout/page-content";
import { Template, TemplateId } from "@/constants/templates";
import { getGeneration } from "@/lib/db/generations";
import { GenerationStatus } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import z from "zod";

export default async function Page(
  props: PageProps<"/generation/[generationId]">,
) {
  const { generationId } = await props.params;

  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/signin");
  }

  const generation = await getGeneration({ id: generationId, userId });

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
        return (
          <GenerationStreamer
            id={generationId}
            templateId={template.id}
            input={generation.input}
            model={generation.model}
          />
        );
      }

      case GenerationStatus.COMPLETED: {
        const variants = z
          .array(template.variantSchema)
          .safeParse(generation.output);

        if (!variants.success) {
          return (
            <GenerationError
              generationId={generationId}
              templateId={template.id}
              input={generation.input}
              model={generation.model}
            />
          );
        }

        return (
          <GenerationResult
            generationId={generationId}
            templateId={template.id}
            variants={variants.data}
            input={generation.input}
            model={generation.model}
            favorite={generation.favorite}
          />
        );
      }

      case GenerationStatus.ERROR: {
        return (
          <GenerationError
            generationId={generationId}
            templateId={template.id}
            input={generation.input}
            model={generation.model}
          />
        );
      }

      case GenerationStatus.STREAMING: {
        return (
          <GenerationPoller
            generationId={generationId}
            templateId={template.id}
            input={generation.input}
            model={generation.model}
          />
        );
      }
    }
  }

  return <PageContent>{renderContent()}</PageContent>;
}
