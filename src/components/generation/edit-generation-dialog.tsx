"use client";

import { AlertTriangle } from "lucide-react";
import { EditGenerationForm } from "@/components/forms";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  useGenerationDialogActions,
  useGenerationDialogState,
} from "./generation-dialog-provider";

// Mounted once by the private layout, above the route. Callers open it through
// `openDialog` instead of rendering their own instance — an open dialog is what tells
// the generation page the user arrived here through a form, so there can only be one.
export function EditGenerationDialog() {
  const { target, isStreaming, hasController, hasError } =
    useGenerationDialogState();
  const { closeDialog, stop, editRegenerate } = useGenerationDialogActions();

  // Unmounting between opens is what lets the form pick up fresh default values.
  if (!target) return null;

  const GenerationForm = EditGenerationForm[target.templateId];

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) closeDialog();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit and regenerate</DialogTitle>

          <DialogDescription>
            Adjust the inputs, then generate a new set of variants.
          </DialogDescription>
        </DialogHeader>

        <GenerationForm
          input={target.input}
          model={target.model}
          disabled={isStreaming || !hasController}
          onStop={hasController ? stop : undefined}
          error={
            hasError ? (
              <Alert variant="destructive">
                <AlertTriangle />
                <AlertTitle>Couldn&apos;t generate</AlertTitle>
                <AlertDescription>
                  Something went wrong starting the generation. Try a different
                  model or try again later.
                </AlertDescription>
              </Alert>
            ) : undefined
          }
          onSubmit={editRegenerate}
        />
      </DialogContent>
    </Dialog>
  );
}
