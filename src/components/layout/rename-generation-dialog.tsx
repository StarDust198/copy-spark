"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Generation } from "@prisma/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputField } from "@/components/fields/input-field";
import { Button } from "@/components/ui/button";
import { useUpdateGeneration } from "@/lib/query/use-generation-hooks";
import {
  RenameGenerationRequest,
  renameGenerationSchema,
} from "@/schemas/rename-schema";

export type RenameGenerationDialogProps = {
  generation: Generation | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function RenameGenerationDialog({
  generation,
  open,
  onOpenChange,
}: RenameGenerationDialogProps) {
  const form = useForm({
    defaultValues: {
      title: generation?.title ?? "",
    },
    resolver: zodResolver(renameGenerationSchema),
  });

  const updateGenerationMutation = useUpdateGeneration();

  async function onSubmit(fields: RenameGenerationRequest) {
    if (!generation) return;

    await updateGenerationMutation.mutateAsync({
      id: generation.id,
      title: fields.title,
    });

    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename generation</DialogTitle>

          <DialogDescription>
            Enter a new name for this generation.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <InputField
            control={form.control}
            name="title"
            label="Name"
            placeholder="Generation name"
          />

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>

            <Button type="submit" disabled={form.formState.isSubmitting}>
              Rename
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
