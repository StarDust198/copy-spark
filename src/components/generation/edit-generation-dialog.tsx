"use client";

import {
  EditGenerationForm,
  type EditGenerationFormValues,
} from "@/components/forms";
import { TemplateId } from "@/constants/templates";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";

type EditGenerationDialogProps = {
  templateId: TemplateId;
  input: unknown;
  model: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (fields: EditGenerationFormValues) => void | Promise<void>;
};

// Controlled rather than trigger-based: callers render their own trigger, which
// keeps the tooltip-wrapped icon buttons in `GenerationActions` from having to
// nest Base UI `render` props.
export function EditGenerationDialog({
  templateId,
  input,
  model,
  open,
  onOpenChange,
  onSubmit,
}: EditGenerationDialogProps) {
  const GenerationForm = EditGenerationForm[templateId];

  async function handleSubmit(fields: EditGenerationFormValues) {
    await onSubmit(fields);

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit and regenerate</DialogTitle>

          <DialogDescription>
            Adjust the inputs, then generate a new set of variants.
          </DialogDescription>
        </DialogHeader>

        <GenerationForm
          input={input}
          model={model}
          disabled={false}
          onSubmit={handleSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
