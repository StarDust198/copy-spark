"use server";

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
import { modelIdSchema } from "@/schemas/generation";
import * as db from "@/lib/db/generations";

async function getUserId() {
  const { userId, isAuthenticated } = await auth();

  if (!isAuthenticated) {
    redirect("/signin");
  }

  return userId;
}

export async function createEmailSubjectGeneration({
  id,
  input,
  model,
}: {
  id?: string;
  input: EmailSubjectRequest;
  model: string;
}) {
  const userId = await getUserId();

  return await db.createGeneration({
    id,
    userId,
    input,
    model: modelIdSchema.parse(model),
    title: "Email Subject Generation",
    templateId: TemplateId.emailSubject,
  });
}

export async function createFacebookAdGeneration({
  id,
  input,
  model,
}: {
  id?: string;
  input: FacebookAdRequest;
  model: string;
}) {
  const userId = await getUserId();

  return await db.createGeneration({
    id,
    userId,
    input,
    model: modelIdSchema.parse(model),
    title: "Facebook Ad Generation",
    templateId: TemplateId.facebookAd,
  });
}

export async function createProductDescriptionGeneration({
  id,
  input,
  model,
}: {
  id?: string;
  input: ProductDescriptionRequest;
  model: string;
}) {
  const userId = await getUserId();

  return await db.createGeneration({
    id,
    userId,
    input,
    model: modelIdSchema.parse(model),
    title: "Product Description Generation",
    templateId: TemplateId.productDescription,
  });
}

export async function updateGeneration({
  id,
  status,
  title,
  output,
  input,
  model,
}: {
  id: string;
  status?: GenerationStatus;
  output?: TemplateVariant[];
  title?: string;
  input?: TemplateRequest;
  model?: string;
}) {
  const userId = await getUserId();

  return await db.updateGeneration({
    id,
    userId,
    status,
    title,
    output,
    input,
    model: modelIdSchema.optional().parse(model),
  });
}

export async function getGenerations(): Promise<Generation[]> {
  const userId = await getUserId();

  return await db.getGenerations({ userId });
}

export async function deleteGeneration({
  id,
}: {
  id: string;
}): Promise<Generation> {
  const userId = await getUserId();

  return await db.deleteGeneration({ id, userId });
}
