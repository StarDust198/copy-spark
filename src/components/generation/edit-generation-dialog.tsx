"use client";

import { EditGenerationForm } from "@/components/forms";
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
  const { target, isStreaming, hasController } = useGenerationDialogState();
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

        {/* Deliberately stays open past submit — `GenerationStreamer` closes it once
            the first token lands, so the loader underneath is never revealed empty. */}
        <GenerationForm
          input={target.input}
          model={target.model}
          // Swaps Generate for Stop while a run is in flight, and through the gap
          // between an edit submit and the remounted streamer registering.
          disabled={isStreaming || !hasController}
          // No handler means nothing live to abort, which renders Stop disabled
          // rather than letting the click do nothing.
          onStop={hasController ? stop : undefined}
          onSubmit={editRegenerate}
        />
      </DialogContent>
    </Dialog>
  );
}
