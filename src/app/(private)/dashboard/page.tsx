// Other title options - "What do you want to write today?", "Choose a template and get 5 copy variants in seconds"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GenerationTarget } from "@/constants/generationTargets";
import { MegaphoneIcon } from "lucide-react";
import Link from "next/link";

const templates = Object.values(GenerationTarget);

export default function Page() {
  return (
    <div className="flex flex-col gap-8 h-full py-24 justify-evenly">
      <div className="shrink-0 flex flex-col gap-1">
        <h1 className="text-xl text-center">
          Pick a template, get ready-to-use variants in seconds
        </h1>

        <p className="text-muted-foreground text-center">
          What do you want to write today?
        </p>
      </div>

      <div className="flex gap-4 flex-wrap justify-around items-center shrink-0">
        {templates.map((template) => {
          return (
            <Link href={template.link} key={template.link}>
              <Card className="transition-colors hover:border-primary hover:bg-accent w-60 min-h-64 justify-between">
                <CardHeader className="gap-2">
                  <CardTitle className="flex items-center gap-2">
                    <MegaphoneIcon className="text-primary w-3 h-3 shrink-0" />

                    <p className="text-l">{template.title}</p>
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
    </div>
  );
}
