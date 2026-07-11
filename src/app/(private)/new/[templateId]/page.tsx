// Other title options - "What do you want to write today?", "Choose a template and get 5 copy variants in seconds"
import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

type Props = {
  params: Promise<{ templateId: TemplateId }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { templateId } = await params;

  const { title, description } = Template[templateId];

  return {
    title,
    description,
  };
}

export default async function Page({ params }: Props) {
  const { templateId } = await params;

  const generationTarget = Template[templateId];

  if (!generationTarget) notFound();

  const { title, form: Form } = generationTarget;

  return (
    <div className="flex flex-col justify-center items-center gap-8 h-full">
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
    </div>
  );
}
