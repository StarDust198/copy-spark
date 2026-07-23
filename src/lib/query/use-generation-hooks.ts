import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Generation } from "@prisma/client";
import { GenerationStatus } from "@prisma/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
      favorite: null,
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
      favorite: null,
    });

    router.refresh();
  }

  return {
    regenerate,
    editRegenerate,
    isPending: updateGenerationMutation.isPending,
  };
}

export function useFavoriteVariant(
  generationId: string,
  initialFavorite: number | null,
) {
  const updateGenerationMutation = useUpdateGeneration();
  const [favorite, setFavorite] = useState(initialFavorite);

  // Optimistic: the star flips right away and rolls back if the write fails.
  async function toggleFavorite(index: number) {
    const previous = favorite;
    const next = favorite === index ? null : index;

    setFavorite(next);

    try {
      await updateGenerationMutation.mutateAsync({
        id: generationId,
        favorite: next,
      });
    } catch {
      setFavorite(previous);
      toast.error("Could not save your pick");
    }
  }

  function resetFavorite() {
    setFavorite(null);
  }

  return { favorite, toggleFavorite, resetFavorite };
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
