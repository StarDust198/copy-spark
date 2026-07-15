import { streamText, Output, createTextStreamResponse, toTextStream } from "ai";
import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import {
  emailSubjectOutputSchema,
  emailSubjectRequestSchema,
} from "@/schemas/email-schema";
import { createEmailSubjectPrompt } from "@/lib/prompts";
import { FREE_MODEL } from "@/constants/model";
import { after } from "next/server";
import { updateGeneration } from "@/lib/actions/generations";
import { GenerationStatus } from "@prisma/client";

// TODO: Deduplicate route handlers
export async function POST(req: Request) {
  const { isAuthenticated } = await auth();

  if (!isAuthenticated) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const parsed = z.object({ id: z.string() }).safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: "Invalid request", details: parsed.error.issues },
      { status: 400 },
    );
  }

  const { id } = parsed.data;

  const generation = await updateGeneration({
    id,
    status: GenerationStatus.STREAMING,
  });

  if (!generation) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const generationInput = generation.input;

  if (typeof generationInput !== "string") {
    return Response.json({ error: "Server error" }, { status: 500 });
  }

  const parsedRequest = emailSubjectRequestSchema.safeParse(
    JSON.parse(generationInput),
  );

  if (!parsedRequest.success) {
    return Response.json({ error: "Server error" }, { status: 500 });
  }

  const result = streamText({
    model: FREE_MODEL,
    system: `
      You are an expert AI copywriting assistant specialized in high-converting digital marketing content. Your goal is to analyze the user's provided template data and generate compelling, persuasive, and platform-appropriate copy variations.
    `,
    prompt: createEmailSubjectPrompt(parsedRequest.data),
    output: Output.object({
      schema: emailSubjectOutputSchema,
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
