import "server-only";

import { prisma } from "@/lib/prisma";
import { Generation, GenerationStatus } from "@prisma/client";
import {
  TemplateId,
  TemplateRequest,
  TemplateVariant,
} from "@/constants/templates";

export async function createGeneration({
  id,
  userId,
  input,
  title,
  templateId,
  model,
}: {
  id?: string;
  userId: string;
  input: TemplateRequest;
  title: string;
  templateId: TemplateId;
  model: string;
}) {
  return await prisma.generation.create({
    data: {
      id,
      userId,
      model,
      input,
      title,
      templateId,
      status: GenerationStatus.PENDING,
    },
  });
}

export async function updateGeneration({
  id,
  userId,
  status,
  title,
  output,
  input,
  model,
}: {
  id: string;
  userId: string;
  status?: GenerationStatus;
  output?: TemplateVariant[];
  title?: string;
  input?: TemplateRequest;
  model?: string;
}) {
  return await prisma.generation.update({
    where: {
      id,
      userId,
    },
    data: {
      title,
      status,
      model,
      // `undefined` means "leave this column alone" to Prisma — both fields have
      // to stay undefined when not supplied, or a title-only update wipes them.
      input,
      output,
    },
  });
}

export async function getGeneration({
  id,
  userId,
}: {
  id: string;
  userId: string;
}): Promise<Generation | null> {
  return await prisma.generation.findFirst({
    where: {
      id,
      userId,
    },
  });
}

export async function getGenerations({
  userId,
}: {
  userId: string;
}): Promise<Generation[]> {
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
  userId,
}: {
  id: string;
  userId: string;
}): Promise<Generation> {
  return await prisma.generation.delete({
    where: {
      id,
      userId,
    },
  });
}
