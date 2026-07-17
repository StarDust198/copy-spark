"use server";

import { prisma } from "@/lib/prisma";
import { Generation, GenerationStatus } from "@prisma/client";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { ProductDescriptionRequest } from "@/schemas/description-schema";
import { EmailSubjectRequest } from "@/schemas/email-schema";
import { FacebookAdRequest } from "@/schemas/facebook-schema";
import {
  TemplateId,
  TemplateRequest,
  TemplateVariant,
} from "@/constants/templates";

const model = "anthropic/claude-haiku-4.5";

async function getUserId() {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/signin");
  }

  return userId;
}

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

  const updatedGeneration = await prisma.generation.update({
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

  return updatedGeneration;
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
  const userId = await getUserId();

  return await prisma.generation.delete({
    where: {
      id,
      userId,
    },
  });
}
