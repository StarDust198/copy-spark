import { TemplateId } from "@/constants/templates";
import { ComponentType, ReactNode } from "react";
import { ProductDescriptionForm } from "@/schemas/description-schema";
import { EmailSubjectForm } from "@/schemas/email-schema";
import { FacebookAdForm } from "@/schemas/facebook-schema";
import { CreateDescriptionForm } from "./create-description-form";
import { CreateEmailForm } from "./create-email-form";
import { CreateFacebookForm } from "./create-facebook-form";
import { EditGenerationDescriptionForm } from "./edit-description-form";
import { EditGenerationEmailForm } from "./edit-email-form";
import { EditGenerationFacebookForm } from "./edit-facebook-form";

export const CreateGenerationForm: Record<TemplateId, ComponentType> = {
  [TemplateId.facebookAd]: CreateFacebookForm,
  [TemplateId.emailSubject]: CreateEmailForm,
  [TemplateId.productDescription]: CreateDescriptionForm,
};

export type EditGenerationFormValues =
  | ProductDescriptionForm
  | EmailSubjectForm
  | FacebookAdForm;

type EditGenerationFormProps = {
  input: unknown;
  model: string;
  disabled: boolean;
  onStop?: () => void;
  // Rendered after the fields, just above the submit button.
  error?: ReactNode;
  onSubmit: (fields: EditGenerationFormValues) => void | Promise<void>;
};

export const EditGenerationForm: Record<
  TemplateId,
  ComponentType<EditGenerationFormProps>
> = {
  [TemplateId.facebookAd]: EditGenerationFacebookForm,
  [TemplateId.emailSubject]: EditGenerationEmailForm,
  [TemplateId.productDescription]: EditGenerationDescriptionForm,
};
