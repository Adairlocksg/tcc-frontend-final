"use client";

import { ApiResponse } from "@/lib/api";
import { favoriteGroup } from "@/lib/groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useFavoriteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: favoriteGroup,
    onSuccess: () => {
      toast.success("Grupo favoritado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
