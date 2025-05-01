import { ApiResponse } from "@/lib/api";
import { register, User } from "@/lib/users";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
    onSuccess: () => {
      toast.success("Usuário cadastrado com sucesso!");
      router.push("/login");
    },
    onError: (error: AxiosError<ApiResponse<User>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
