import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Generation } from "@prisma/client";
import { createGeneration, deleteGeneration } from "@/lib/actions/generations";
import { generationOptions } from "./generations-options";

export function useCreateGeneration() {
  const queryClient = useQueryClient();
  const { queryKey } = generationOptions();

  return useMutation({
    mutationFn: createGeneration,
    onSuccess: (newGeneration) => {
      queryClient.setQueryData<Generation[]>(queryKey, (old = []) => [
        newGeneration,
        ...old,
      ]);
    },
  });
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
