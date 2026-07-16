import { TemplateId } from "@/constants/templates";
import { ComponentType } from "react";
import { DescriptionForm } from "./description-form";
import { EmailForm } from "./email-form";
import { FacebookForm } from "./facebook-form";

export const TemplateForm: Record<TemplateId, ComponentType> = {
  [TemplateId.facebookAd]: FacebookForm,
  [TemplateId.emailSubject]: EmailForm,
  [TemplateId.productDescription]: DescriptionForm,
};
