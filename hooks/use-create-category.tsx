"use client";

import { ApiResponse } from "@/lib/api";
import { CategoryDto, createCategory } from "@/lib/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCreateCategory() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: CategoryDto }) =>
      createCategory(id, dto),
    onSuccess: (id: string) => {
      toast.success("Categoria criada com sucesso!");
      router.back();
    //   queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
