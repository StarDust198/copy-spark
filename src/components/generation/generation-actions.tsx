"use client";

import { useState } from "react";
import { RefreshCw, SlidersHorizontal } from "lucide-react";

import { type EditGenerationFormValues } from "@/components/forms";
import { TemplateId } from "@/constants/templates";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { EditGenerationDialog } from "./edit-generation-dialog";

type GenerationActionsProps = {
  templateId: TemplateId;
  input: unknown;
  model: string;
  disabled?: boolean;
  onRegenerate: () => void | Promise<void>;
  onEditRegenerate: (fields: EditGenerationFormValues) => void | Promise<void>;
};

export function GenerationActions({
  templateId,
  input,
  model,
  disabled,
  onRegenerate,
  onEditRegenerate,
}: GenerationActionsProps) {
  const [open, setOpen] = useState(false);

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
              onClick={() => setOpen(true)}
            />
          }
        >
          <SlidersHorizontal />
        </TooltipTrigger>

        <TooltipContent>
          <p>Edit inputs</p>
        </TooltipContent>
      </Tooltip>

      <EditGenerationDialog
        templateId={templateId}
        input={input}
        model={model}
        open={open}
        onOpenChange={setOpen}
        onSubmit={onEditRegenerate}
      />
    </div>
  );
}
