"use client";
import { ApiResponse } from "@/lib/api";
import { createInvite } from "@/lib/invitations";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCreateInvite() {
  const router = useRouter();

  return useMutation({
    mutationFn: createInvite,
    onSuccess: () => {
      toast.success("Link de convite enviado com sucesso!");
      router.back();
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
