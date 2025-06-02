"use client";

import { ApiResponse } from "@/lib/api";
import { unFavoriteGroup } from "@/lib/groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useUnfavoriteGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unFavoriteGroup,
    onSuccess: () => {
      toast.success("Grupo desfavoritado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
