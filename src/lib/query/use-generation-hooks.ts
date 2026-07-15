import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Generation } from "@prisma/client";
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
