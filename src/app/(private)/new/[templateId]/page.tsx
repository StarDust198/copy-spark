import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TemplateForm } from "@/components/forms";
import { Template, TemplateId } from "@/constants/templates";
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
import { PageContent } from "@/components/layout/page-content";

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
    title,
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
  const Form = TemplateForm[parsedTemplateId.data];

  return (
    <PageContent>
      <Card className="w-full max-w-96">
        <CardHeader className="gap-2">
          <CardTitle className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger>
                <Link
                  href="/dashboard"
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

            <p>
              Create a new{" "}
              <span className="inline-block first-letter:lowercase">
                {title}
              </span>
            </p>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <Form />
        </CardContent>
      </Card>
    </PageContent>
  );
}
