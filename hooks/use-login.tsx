"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/lib/users";
import { toast } from "sonner";
import { ApiResponse } from "@/lib/api";
import { AxiosError } from "axios";

export function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (token: string) => {
      toast.success("Login realizado com sucesso!");
      document.cookie = `token_share_the_bill=${token}`;
      router.push("/");
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
