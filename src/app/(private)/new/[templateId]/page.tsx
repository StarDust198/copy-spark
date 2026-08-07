import type { Metadata } from "next";
import { GenerationFormWrapper } from "@/components/generation/generation-form-wrapper";
import { CreateGenerationForm } from "@/components/forms";
import { Template, TemplateId } from "@/constants/templates";
import { capitalizeFirstLetter } from "@/lib/capitalize-first-letter";
import { CircleChevronLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { notFound } from "next/navigation";
import z from "zod";

export async function generateMetadata({
  params,
}: PageProps<"/new/[templateId]">): Promise<Metadata> {
  const { templateId } = await params;

  const parsedTemplateId = z
    .enum(Object.values(TemplateId))
    .safeParse(templateId);

  const { title, description } = parsedTemplateId.success
    ? Template[parsedTemplateId.data]
    : {};

  return {
    title: title && capitalizeFirstLetter(title),
    description,
  };
}

export default async function Page({ params }: PageProps<"/new/[templateId]">) {
  const { templateId } = await params;

  const parsedTemplateId = z
    .enum(Object.values(TemplateId))
    .safeParse(templateId);

  if (!parsedTemplateId.success) {
    notFound();
  }

  const generationTarget = Template[parsedTemplateId.data];

  if (!generationTarget) notFound();

  const { title } = generationTarget;
  const CreateTemplateGenerationForm =
    CreateGenerationForm[parsedTemplateId.data];

  return (
    <GenerationFormWrapper
      title={
        <>
          <Tooltip>
            <TooltipTrigger>
              <Link
                href="/new"
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon-lg",
                })}
              >
                <CircleChevronLeft />
              </Link>
            </TooltipTrigger>

            <TooltipContent>
              <p>Back to templates</p>
            </TooltipContent>
          </Tooltip>

          <p>New {title}</p>
        </>
      }
    >
      <CreateTemplateGenerationForm />
    </GenerationFormWrapper>
  );
}
