import { getExpenseById } from "@/lib/expenses";
import { useQuery } from "@tanstack/react-query";

export function useGetExpense(expenseId: string) {
  return useQuery({
    queryKey: ["expense", expenseId],
    queryFn: () => getExpenseById(expenseId),
    staleTime: 1000 * 60 * 5,
    enabled: !!expenseId,
    refetchOnWindowFocus: false,
  });
}
