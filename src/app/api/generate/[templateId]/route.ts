import { streamText, Output, createTextStreamResponse, toTextStream } from "ai";
import { after } from "next/server";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { buildPrompt, SYSTEM_PROMPT } from "@/lib/prompts";
import { getGeneration, updateGeneration } from "@/lib/db/generations";
import { GenerationStatus } from "@prisma/client";
import { Template, TemplateId } from "@/constants/templates";
import { getOutputSchema } from "@/schemas/generation";

export async function POST(
  req: Request,
  ctx: RouteContext<"/api/generate/[templateId]">,
) {
  const { userId, isAuthenticated } = await auth();

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

  const generation = await getGeneration({ id, userId });

  if (!generation) {
    return Response.json({ error: "Generation not found" }, { status: 404 });
  }

  // buildPrompt takes `unknown` and safeParses, so a malformed stored input is
  // reported below rather than thrown here
  const builtPrompt = buildPrompt[parsedTemplateId.data](generation.input);

  if (!builtPrompt.success) {
    updateGeneration({
      id,
      userId,
      status: GenerationStatus.ERROR,
    });

    return Response.json(
      {
        error: "Stored input does not match the template schema",
        details: builtPrompt.error.issues,
      },
      { status: 500 },
    );
  }

  // Every run passes through here — including the streamer's instant regenerate,
  // which never touches the DB from the client — so this is the one place that can
  // guarantee the picked variant is dropped before new variants replace it.
  await updateGeneration({
    id,
    userId,
    status: GenerationStatus.STREAMING,
    favorite: null,
  });

  const result = streamText({
    model: generation.model,
    system: SYSTEM_PROMPT,
    prompt: builtPrompt.prompt,
    output: Output.object({
      schema: getOutputSchema(template.variantSchema),
    }),
    onError: (error) => {
      console.log("onError", { error });
    },
    onAbort: ({ steps }) => {
      console.log("onAbort", { steps });
    },
    onEnd: ({ content, finishReason }) => {
      console.log("onEnd", { finishReason, content });
    },
    abortSignal: req.signal,
  });

  // deliberately no result.consumeStream()
  after(async () => {
    try {
      const { title, variants } = await result.output;

      await updateGeneration({
        id,
        userId,
        title,
        output: variants,
        status: GenerationStatus.COMPLETED,
      });
    } catch {
      await updateGeneration({
        userId,
        id,
        status: req.signal.aborted
          ? GenerationStatus.PENDING
          : GenerationStatus.ERROR,
      });
    }
  });

  return createTextStreamResponse({
    stream: toTextStream({ stream: result.stream }),
  });
}
