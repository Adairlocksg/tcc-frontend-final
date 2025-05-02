"use client";

import { ApiResponse } from "@/lib/api";
import { GroupDto, updateGroup } from "@/lib/groups";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useUpdateGroup() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: GroupDto }) =>
      updateGroup(id, dto),
    onSuccess: () => {
      toast.success("Grupo alterado com sucesso!");
      router.push(`/groups`);
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
