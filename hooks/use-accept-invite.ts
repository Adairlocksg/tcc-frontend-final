"use client";

import { ApiResponse } from "@/lib/api";
import { acceptInvite } from "@/lib/invitations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useAcceptInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptInvite,
    onSuccess: () => {
      toast.success("Convite aceito com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
