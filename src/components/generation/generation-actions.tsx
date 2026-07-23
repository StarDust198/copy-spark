"use client";

import { RefreshCw, SlidersHorizontal } from "lucide-react";

import { TemplateId } from "@/constants/templates";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { useGenerationDialogActions } from "./generation-dialog-provider";

type GenerationActionsProps = {
  templateId: TemplateId;
  input: unknown;
  model: string;
  disabled?: boolean;
  onRegenerate: () => void | Promise<void>;
};

export function GenerationActions({
  templateId,
  input,
  model,
  disabled,
  onRegenerate,
}: GenerationActionsProps) {
  // The dialog itself lives in the private layout so it can outlive the refresh that
  // an edit triggers; the submit handler comes from whichever view is registered.
  const { openDialog } = useGenerationDialogActions();

  return (
    <div className="flex items-center gap-2">
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Regenerate"
              disabled={disabled}
              onClick={() => onRegenerate()}
            />
          }
        >
          <RefreshCw />
        </TooltipTrigger>

        <TooltipContent>
          <p>Regenerate</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Edit inputs"
              disabled={disabled}
              onClick={() => openDialog({ templateId, input, model })}
            />
          }
        >
          <SlidersHorizontal />
        </TooltipTrigger>

        <TooltipContent>
          <p>Edit inputs</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
