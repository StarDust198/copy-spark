"use client";

import type { ComponentType, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { routes } from "@/constants/routes";
import { generationOptions } from "@/lib/query/generations-options";

const NEW_GENERATION_TITLE = "New generation";
const GENERATION_TITLE = "Generation";

/** `"/new/[templateId]"` -> `"templateId"` */
type ParamName<TPattern extends string> =
  TPattern extends `${string}[${infer TParam}]${infer TRest}`
    ? TParam | ParamName<TRest>
    : never;

type TitleProps<TPattern extends string> = {
  params: Record<ParamName<TPattern>, string>;
};

type TitleRoute = {
  pattern: string;
  render: (params: Record<string, string>) => ReactNode;
};

// A title is a component rather than a `(params) => string` function because
// only the matched route renders, and that decision is made in a loop. A
// component gets its own hook scope, so a title may fetch its own data without
// the hook order changing as routes come and go.
function defineTitleRoute<TPattern extends string>({
  pattern,
  Title,
}: {
  pattern: TPattern;
  Title: ComponentType<TitleProps<TPattern>>;
}): TitleRoute {
  return {
    pattern,
    render: (params) => (
      <Title params={params as Record<ParamName<TPattern>, string>} />
    ),
  };
}

function TemplateTitle() {
  // In case we should show template name
  // const template = Object.values(Template).find(
  //   ({ id }) => id === params.templateId,
  // );

  // return template?.title ?? NEW_GENERATION_TITLE;

  return NEW_GENERATION_TITLE;
}

function GenerationTitle({ params }: TitleProps<"/generation/[generationId]">) {
  const { data: generations } = useQuery(generationOptions());

  const generation = generations?.find(({ id }) => id === params.generationId);

  return generation?.title ?? GENERATION_TITLE;
}

const titleRoutes: TitleRoute[] = [
  // Static patterns are matched first so a `[param]` cannot shadow a literal.
  ...Object.values(routes).map((route) =>
    defineTitleRoute({ pattern: route.url, Title: () => route.title }),
  ),
  defineTitleRoute({ pattern: "/new/[templateId]", Title: TemplateTitle }),
  defineTitleRoute({
    pattern: "/generation/[generationId]",
    Title: GenerationTitle,
  }),
];

function compileTitleRoute({ pattern, render }: TitleRoute) {
  const paramNames: string[] = [];

  const source = pattern
    .split(/(\[\w+\])/)
    .map((part) => {
      const param = /^\[(\w+)\]$/.exec(part);

      if (!param) return part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      paramNames.push(param[1]);

      return "([^/]+)";
    })
    .join("");

  return { regex: new RegExp(`^${source}$`), paramNames, render };
}

const titleMatchers = titleRoutes.map(compileTitleRoute);

export function RouteTitle() {
  const pathname = usePathname();

  for (const { regex, paramNames, render } of titleMatchers) {
    const match = regex.exec(pathname);

    if (!match) continue;

    return render(
      Object.fromEntries(paramNames.map((name, i) => [name, match[i + 1]])),
    );
  }

  return null;
}
