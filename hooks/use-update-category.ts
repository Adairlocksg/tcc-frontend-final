"use client";

import { ApiResponse } from "@/lib/api";
import { Category, CategoryDto, updateCategory } from "@/lib/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUpdateCategory() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      id,
      dto,
    }: {
      groupId: string;
      id: string;
      dto: CategoryDto;
    }) => updateCategory(groupId, id, dto),
    onSuccess: (category: Category) => {
      toast.success("Categoria alterada com sucesso!");
      queryClient.invalidateQueries({
        queryKey: ["categories", category.groupId],
      });
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
