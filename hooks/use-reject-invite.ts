"use client";

import { ApiResponse } from "@/lib/api";
import { rejectInvite } from "@/lib/invitations";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useRejectInvite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rejectInvite,
    onSuccess: () => {
      toast.success("Convite rejeitado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["invites"] });
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
