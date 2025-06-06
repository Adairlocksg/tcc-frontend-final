"use client";

import { ExpenseSummaryDto, getExpenseSummaryByGroup } from "@/lib/expenses";
import { useQuery } from "@tanstack/react-query";

export function useExpenseSummary(
  groupId: string,
  startDate: string,
  endDate: string,
  categoryId?: string | null,
) {
  const dto: ExpenseSummaryDto = {
    groupId,
    startDate,
    endDate,
    categoryId
  };

  return useQuery({
    queryKey: ["expenses-summary", groupId, startDate, endDate, categoryId],
    queryFn: () => getExpenseSummaryByGroup(dto),
    staleTime: 100 * 60 * 5,
    enabled: !!groupId,
    refetchOnWindowFocus: false,
  });
}
