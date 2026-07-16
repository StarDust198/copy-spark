import { streamText, Output, createTextStreamResponse, toTextStream } from "ai";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { SYSTEM_PROMPT } from "@/lib/prompts";
import { FREE_MODEL } from "@/constants/model";
import { after } from "next/server";
import { getGeneration, updateGeneration } from "@/lib/actions/generations";
import { GenerationStatus } from "@prisma/client";
import { Template, TemplateId } from "@/constants/templates";
import { getOutputSchema } from "@/schemas/generation";

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/generate/[templateId]">,
) {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { templateId } = await ctx.params;

  const parsedTemplateId = z
    .enum(Object.values(TemplateId))
    .safeParse(templateId);

  if (!parsedTemplateId.success) {
    return Response.json({ error: "Unknown template" }, { status: 404 });
  }

  const template = Template[parsedTemplateId.data];

  const body = await req.json();
  const parsedBody = z.object({ id: z.string() }).safeParse(body);

  if (!parsedBody.success) {
    return Response.json(
      { error: "Invalid request", details: parsedBody.error.issues },
      { status: 400 },
    );
  }

  const { id } = parsedBody.data;

  const generation = await getGeneration({ id });

  if (!generation) {
    return Response.json({ error: "Generation not found" }, { status: 404 });
  }

  const generationInput = generation.input;

  if (typeof generationInput !== "string") {
    return Response.json({ error: "Server error" }, { status: 500 });
  }

  const builtPrompt = template.buildPrompt(JSON.parse(generationInput));

  if (!builtPrompt.success) {
    return Response.json(
      {
        error: "Stored input does not match the template schema",
        details: builtPrompt.error.issues,
      },
      { status: 500 },
    );
  }

  await updateGeneration({ id, status: GenerationStatus.STREAMING });

  const result = streamText({
    model: FREE_MODEL,
    system: SYSTEM_PROMPT,
    prompt: builtPrompt.prompt,
    // built from `variantSchema` rather than reusing `template.outputSchema`:
    // `template` is a union, and `Output.object` would infer its generic from
    // the first member only. `getOutputSchema` collapses the union first.
    output: Output.object({
      schema: getOutputSchema(template.variantSchema),
    }),
  });

  // consume the stream to ensure it runs to completion & triggers onEnd
  // even when the client response is aborted:
  result.consumeStream(); // no await

  // on Vercel, once the response finishes streaming, the function can be
  // frozen. that wrapper helps to avoid it
  after(async () => {
    const { title, variants } = await result.output;

    updateGeneration({
      id,
      status: GenerationStatus.COMPLETED,
      output: variants,
      title: title,
    });
  });

  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}
