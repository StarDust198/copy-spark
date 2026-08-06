// Other title options - "What do you want to write today?", "Choose a template and get 5 copy variants in seconds"

import { PageTitle } from "@/components/layout/page-title";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Template } from "@/constants/templates";
import Link from "next/link";

const templates = Object.values(Template);

export default function Page() {
  return (
    <>
      <PageTitle
        title="Pick a template, get ready-to-use variants in seconds"
        description="What do you want to write today?"
        className="shrink-0"
      />

      <div className="flex gap-6 flex-wrap justify-center items-start shrink-0">
        {templates.map((template) => {
          const Icon = template.icon;

          return (
            <Link href={template.createUrl} key={template.createUrl}>
              <Card className="transition-colors hover:border-primary hover:bg-accent w-60 min-h-64 justify-between">
                <CardHeader className="gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="text-primary w-3 h-3 shrink-0" />

                    <p>{template.title}</p>
                  </CardTitle>

                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <p className="bg-background p-3 rounded-md text-muted-foreground italic text-sm before:content-['“'] after:content-['”']">
                    {template.example}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </>
  );
}
