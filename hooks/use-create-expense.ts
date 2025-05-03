import { ApiResponse } from "@/lib/api";
import { createExpense } from "@/lib/expenses";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useCreateExpense() {
  const router = useRouter();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      toast.success("Despesa criada com sucesso!");
      router.back();
    },
    onError: (error: AxiosError<ApiResponse<string>>) => {
      toast.error(error?.response?.data?.message);
    },
  });
}
