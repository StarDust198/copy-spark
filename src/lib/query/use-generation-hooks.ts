import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Generation } from "@prisma/client";
import { GenerationStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import type { EditGenerationFormValues } from "@/components/forms";
import {
  createEmailSubjectGeneration,
  createFacebookAdGeneration,
  createProductDescriptionGeneration,
  deleteGeneration,
  updateGeneration,
} from "@/lib/actions/generations";
import { generationOptions } from "./generations-options";

export function useCreateEmailSubjectGeneration() {
  const queryClient = useQueryClient();
  const { queryKey } = generationOptions();

  return useMutation({
    mutationFn: createEmailSubjectGeneration,
    onSuccess: (newGeneration) => {
      queryClient.setQueryData<Generation[]>(queryKey, (old = []) => [
        newGeneration,
        ...old,
      ]);
    },
  });
}
export function useCreateFacebookAdGeneration() {
  const queryClient = useQueryClient();
  const { queryKey } = generationOptions();

  return useMutation({
    mutationFn: createFacebookAdGeneration,
    onSuccess: (newGeneration) => {
      queryClient.setQueryData<Generation[]>(queryKey, (old = []) => [
        newGeneration,
        ...old,
      ]);
    },
  });
}
export function useCreateProductDescriptionGeneration() {
  const queryClient = useQueryClient();
  const { queryKey } = generationOptions();

  return useMutation({
    mutationFn: createProductDescriptionGeneration,
    onSuccess: (newGeneration) => {
      queryClient.setQueryData<Generation[]>(queryKey, (old = []) => [
        newGeneration,
        ...old,
      ]);
    },
  });
}

export function useUpdateGeneration() {
  const queryClient = useQueryClient();
  const { queryKey } = generationOptions();

  return useMutation({
    mutationFn: updateGeneration,
    onSuccess: (updatedGeneration) => {
      queryClient.setQueryData<Generation[]>(queryKey, (old = []) =>
        old.map((generation) => {
          return generation.id === updatedGeneration.id
            ? updatedGeneration
            : generation;
        }),
      );
    },
  });
}

// Moving back to PENDING hands the page over to `GenerationStreamer`, which
// mounts fresh on refresh and starts the stream.
export function useRegenerateGeneration(generationId: string) {
  const updateGenerationMutation = useUpdateGeneration();
  const router = useRouter();

  async function regenerate() {
    await updateGenerationMutation.mutateAsync({
      id: generationId,
      status: GenerationStatus.PENDING,
    });

    router.refresh();
  }

  async function editRegenerate(fields: EditGenerationFormValues) {
    const { model, ...input } = fields;

    await updateGenerationMutation.mutateAsync({
      id: generationId,
      input,
      model,
      status: GenerationStatus.PENDING,
    });

    router.refresh();
  }

  return {
    regenerate,
    editRegenerate,
    isPending: updateGenerationMutation.isPending,
  };
}

export function useDeleteGeneration() {
  const queryClient = useQueryClient();
  const { queryKey } = generationOptions();

  return useMutation({
    mutationFn: deleteGeneration,
    onSuccess: (deletedGeneration) => {
      queryClient.setQueryData<Generation[]>(queryKey, (old = []) =>
        old.filter((chat) => chat.id !== deletedGeneration.id),
      );
    },
  });
}
