"use client";

import { ApiResponse } from "@/lib/api";
import { createGroup } from "@/lib/groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCreateGroup() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: (id: string) => {
      toast.success("Grupo criado com sucesso!");
      router.push(`/groups`);
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
