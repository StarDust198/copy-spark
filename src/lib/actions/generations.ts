"use server";

import { prisma } from "@/lib/prisma";
import { Generation, GenerationStatus } from "@prisma/client";
import { generateText, Output } from "ai";
// import { anthropic } from "@ai-sdk/anthropic";
// import { metadataSchema, MyUIMessage } from "@/types/generation";
// import { tools } from "../tools";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ProductDescriptionRequest } from "@/schemas/description-schema";
import { EmailSubjectRequest } from "@/schemas/email-schema";
import { FacebookAdRequest } from "@/schemas/facebook-schema";
import {
  Template,
  TemplateId,
  TemplateRequest,
  TemplateVariant,
} from "@/constants/templates";
import z from "zod";
import { SYSTEM_PROMPT } from "../prompts";

const model = "anthropic/claude-haiku-4.5";

async function getUserId() {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/signin");
  }

  return userId;
}

// export async function createGenerationTitle(
//   textToSummarize: string,
// ): Promise<string> {
//   const { text } = await generateText({
//     model: "anthropic/claude-haiku-4.5",
//     system:
//       "You are a precise text summarizer. Assume text provided is a first message of the user in a conversation and provide a concise, up to 4-5 words summary - title of the possible conversation. Do not add outside knowledge.",
//     prompt: `Summarize the following text:\n\n${textToSummarize}`,
//     output: Output.text(),
//   });

//   return text;
// }

async function generateVariants<TVariantSchema extends z.ZodType>({
  prompt,
  outputSchema,
}: {
  prompt: string;
  outputSchema: TVariantSchema;
}): Promise<{ title: string; variants: z.infer<TVariantSchema>[] }> {
  const { output } = await generateText({
    model,
    system: SYSTEM_PROMPT,
    prompt,
    output: Output.object({
      schema: z.object({
        title: z.string(),
        variants: z.array(outputSchema),
      }),
    }),
  });

  return output;
}

type GenerateArgs =
  | { templateId: typeof TemplateId.facebookAd; request: FacebookAdRequest }
  | { templateId: typeof TemplateId.emailSubject; request: EmailSubjectRequest }
  | {
      templateId: typeof TemplateId.productDescription;
      request: ProductDescriptionRequest;
    };

// export async function saveGeneration({
//   generationId,
//   messages,
// }: {
//   generationId: string;
//   messages: MyUIMessage[];
// }): Promise<Generation> {
//   const userId = await getUserId();

//   const JSONMessages = JSON.stringify(messages, null, 2);

//   return await prisma.generation.update({
//     where: {
//       id: generationId,
//       userId,
//     },
//     data: {
//       messages: JSONMessages,
//     },
//   });
// }

export async function createDBGeneration({
  userId,
  request,
  variants,
  title,
  templateId,
}: {
  userId: string;
  title: string;
  request: TemplateRequest;
  variants: TemplateVariant[];
  templateId: TemplateId;
}) {
  return await prisma.generation.create({
    data: {
      userId,
      model,
      input: JSON.stringify(request),
      output: JSON.stringify(variants),
      title,
      templateId,
    },
  });
}

export async function createGeneration(
  options: GenerateArgs,
): Promise<Generation> {
  const userId = await getUserId();

  const template = Template[options.templateId];
  const builtPrompt = template.buildPrompt(options.request);

  if (!builtPrompt.success) {
    throw new Error(`Invalid request for template "${options.templateId}"`, {
      cause: builtPrompt.error,
    });
  }

  const { title, variants } = await generateVariants({
    prompt: builtPrompt.prompt,
    outputSchema: template.variantSchema,
  });

  return await createDBGeneration({
    title,
    userId,
    variants,
    templateId: options.templateId,
    request: options.request,
  });
}

export async function createEmailSubjectGeneration({
  id,
  request,
  model,
}: {
  id?: string;
  request: EmailSubjectRequest;
  model: string;
}) {
  const userId = await getUserId();

  return await prisma.generation.create({
    data: {
      id,
      userId,
      model,
      input: JSON.stringify(request),
      title: "Email Subject Generation",
      templateId: TemplateId.emailSubject,
      status: GenerationStatus.PENDING,
    },
  });
}

export async function createFacebookAdGeneration({
  id,
  request,
  model,
}: {
  id?: string;
  request: FacebookAdRequest;
  model: string;
}) {
  const userId = await getUserId();

  return await prisma.generation.create({
    data: {
      id,
      userId,
      model,
      input: JSON.stringify(request),
      title: "Facebook Ad Generation",
      templateId: TemplateId.facebookAd,
      status: GenerationStatus.PENDING,
    },
  });
}

export async function createProductDescriptionGeneration({
  id,
  request,
  model,
}: {
  id?: string;
  request: ProductDescriptionRequest;
  model: string;
}) {
  const userId = await getUserId();

  return await prisma.generation.create({
    data: {
      id,
      userId,
      model,
      input: JSON.stringify(request),
      title: "Product Description Generation",
      templateId: TemplateId.productDescription,
      status: GenerationStatus.PENDING,
    },
  });
}

export async function updateGeneration({
  id,
  status,
  title,
  output,
}: {
  id: string;
  status?: GenerationStatus;
  output?: TemplateVariant[];
  title?: string;
}) {
  const userId = await getUserId();

  return await prisma.generation.update({
    where: {
      id,
      userId,
    },
    data: {
      title,
      status,
      output: JSON.stringify(output),
    },
  });
}

export async function getGeneration({
  id,
}: {
  id: string;
}): Promise<Generation | null> {
  const userId = await getUserId();

  const generation = await prisma.generation.findFirst({
    where: {
      id,
      userId,
    },
  });

  if (!generation) return null;

  const output =
    typeof generation.output === "string" ? JSON.parse(generation.output) : [];

  return {
    ...generation,
    output,
  };
}

export async function getGenerations(): Promise<Generation[]> {
  const userId = await getUserId();

  return await prisma.generation.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function deleteGeneration({
  id,
}: {
  id: string;
}): Promise<Generation> {
  return await prisma.generation.delete({
    where: {
      id,
    },
  });
}
