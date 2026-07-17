import "server-only";

import { EmailGoal } from "@/constants/emailGoal";
import { Length } from "@/constants/length";
import { Tone } from "@/constants/tone";
import {
  ProductDescriptionRequest,
  productDescriptionRequestSchema,
} from "@/schemas/description-schema";
import {
  EmailSubjectRequest,
  emailSubjectRequestSchema,
} from "@/schemas/email-schema";
import {
  FacebookAdRequest,
  facebookAdRequestSchema,
} from "@/schemas/facebook-schema";
import { BuildPromptResult, Template, TemplateId } from "@/constants/templates";
import z from "zod";

// same widening as defineTemplate: requestSchema and createPrompt stay paired
// inside the generic, so callers reach a uniform (input) => BuildPromptResult
function definePromptBuilder<TRequest extends z.ZodType>(config: {
  requestSchema: TRequest;
  title: string;
  createPrompt: (request: z.infer<TRequest>, title: string) => string;
}) {
  return (input: unknown): BuildPromptResult => {
    const parsed = config.requestSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: parsed.error };
    return {
      success: true,
      prompt: config.createPrompt(parsed.data, config.title),
    };
  };
}

export const buildPrompt: Record<
  TemplateId,
  (input: unknown) => BuildPromptResult
> = {
  [TemplateId.facebookAd]: definePromptBuilder({
    requestSchema: facebookAdRequestSchema,
    title: Template[TemplateId.facebookAd].title,
    createPrompt: createFacebookAdPrompt,
  }),
  [TemplateId.emailSubject]: definePromptBuilder({
    requestSchema: emailSubjectRequestSchema,
    title: Template[TemplateId.emailSubject].title,
    createPrompt: createEmailSubjectPrompt,
  }),
  [TemplateId.productDescription]: definePromptBuilder({
    requestSchema: productDescriptionRequestSchema,
    title: Template[TemplateId.productDescription].title,
    createPrompt: createProductDescriptionPrompt,
  }),
};

export const SYSTEM_PROMPT = `
  You are an expert AI copywriting assistant specialized in high-converting digital marketing content. Your goal is to analyze the user's provided template data and generate compelling, persuasive, and platform-appropriate copy variations.
`;

export const tonePrompts = {
  [Tone.professional]: `**Professional Tone:** Authoritative, clear, and trustworthy. Focus on credibility, industry standards, and clear value without hype.`,
  [Tone.playful]: `**Playful Tone:** Fun, energetic, and conversational. Use witty phrasing, relatable language, and a casual vibe to build a friendly connection.`,
  [Tone.urgent]: `**Urgent Tone:** Time-sensitive, compelling, and action-oriented. Emphasize scarcity, deadlines, or immediate benefits to drive quick decisions.`,
  [Tone.luxury]: `**Luxury Tone:** Elegant, premium, and exclusive. Focus on high quality, sophisticated phrasing, status, and the exceptional experience of the product.`,
};

export const lengthPrompts = {
  [Length.short]: `**Short Length:** Keep the entire copy around 50 words. It should be highly concise, snappy, and deliver the core message or benefit immediately in 1 short paragraph.`,
  [Length.medium]: `**Medium Length:** Keep the entire copy around 100 words. Provide a balanced description across 1-2 well-structured paragraphs, expanding slightly on the value proposition.`,
  [Length.long]: `**Large Length:** Keep the entire copy around 200 words. Deliver a comprehensive overview across 2-3 paragraphs or use a mix of descriptive paragraphs and clean, benefit-driven bullet points.`,
};

export const emailGoalPrompts = {
  [EmailGoal.cartRecovery]: `**Cart Recovery:** Remind them of what they left behind, inject subtle FOMO, or offer an incentive.`,
  [EmailGoal.newsletter]: `**Newsletter:** Highlight curiosity, high-value insights, or what the reader will learn.`,
  [EmailGoal.productLaunch]: `**Product Launch:** Build hype, exclusivity, and excitement around something brand new.`,
  [EmailGoal.promotion]: `**Promotion:** Focus on value, discounts, or special offers (e.g., "Save big," "Inside: Your discount").`,
  [EmailGoal.reEngagement]: `**Re-engagement:** Use "we miss you" angles, updates on what they've missed, or an irresistible reason to return.`,
};

export function createFacebookAdPrompt(
  request: FacebookAdRequest,
  title: string,
) {
  let prompt = "\n\n### Task Instructions:\n";
  prompt += `1. Create a clear, concise title for the generation. Example: "Yoga mat ${title}". Try to keep it under 25 letters.`;
  prompt += `
    2. Create 5 short, punchy **${title}s**. Each variation must include a compelling hook and a clear Call to Action (CTA).\n\n
  `;

  prompt += `### Input Data:\n`;
  prompt += `- **Product Name:** ${request.productName}\n`;
  prompt += `- **Product Description:** ${request.productDescription}\n`;
  prompt += `- **Target Audience:** ${request.targetAudience}\n`;

  if (request.specialOffer) {
    prompt += `- **Special Offer:** ${request.specialOffer}\n`;
  }

  prompt += `\n### Style Constraints:\n`;
  prompt += tonePrompts[request.tone];

  return prompt;
}

export function createProductDescriptionPrompt(
  request: ProductDescriptionRequest,
  title: string,
) {
  let prompt = "\n\n### Task Instructions:\n";
  prompt += `1. Create a clear, concise title for the generation (e.g., "XOT Yoga mat ${title}").`;
  prompt += `
    2. Create 3 engaging, persuasive **${title}s** tailored for an online store listing. Focus heavily on turning raw product features into emotional, customer-centric benefits.\n\n
  `;

  prompt += `### Input Data:\n`;
  prompt += `- **Product Name:** ${request.productName}\n`;
  prompt += `- **Key Features:** ${request.keyFeatures}\n`;
  prompt += `- **Target Audience:** ${request.targetAudience}\n`;

  prompt += `\n### Formatting Constraints:\n`;
  prompt += `- ${lengthPrompts[request.length]}\n`;
  prompt += tonePrompts[request.tone];

  return prompt;
}

export function createEmailSubjectPrompt(
  request: EmailSubjectRequest,
  title: string,
) {
  let prompt = "\n\n### Task Instructions:\n";
  prompt += `1. Create a clear, concise title for the generation (e.g., "XOT Yoga mat ${title}").`;
  prompt += `
    2. Generate 10 high-converting **${title}s** tailored to the specific email goal.\n\n
  `;

  prompt += `\n### Strategy & Guardrails:\n`;
  prompt += `- ${emailGoalPrompts[request.emailGoal]}\n`;

  prompt += `### Input Data:\n`;
  prompt += `- **Email Summary:** ${request.emailSummary}\n`;

  prompt += `\n### Style Constraints:\n`;

  const emojiConstraint = request.includeEmoji
    ? "Include appropriate, contextual emojis to catch the reader's eye, but do not overdo it."
    : "Do not use any emojis under any circumstances.";
  prompt += `- **Emoji Usage:** ${emojiConstraint}\n`;
  prompt += tonePrompts[request.tone];

  return prompt;
}
