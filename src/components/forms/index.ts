import { TemplateId } from "@/constants/templates";
import { ComponentType } from "react";
import { CreateDescriptionForm } from "./create-description-form";
import { CreateEmailForm } from "./create-email-form";
import { CreateFacebookForm } from "./create-facebook-form";

export const TemplateForm: Record<TemplateId, ComponentType> = {
  [TemplateId.facebookAd]: CreateFacebookForm,
  [TemplateId.emailSubject]: CreateEmailForm,
  [TemplateId.productDescription]: CreateDescriptionForm,
};
