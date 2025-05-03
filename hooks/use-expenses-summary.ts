"use client";

import { ExpenseSummaryDto, getExpenseSummaryByGroup } from "@/lib/expenses";
import { useQuery } from "@tanstack/react-query";

export function useExpenseSummary(
  groupId: string,
  startDate: string,
  endDate: string
) {
  const dto: ExpenseSummaryDto = {
    groupId,
    startDate,
    endDate,
  };

  return useQuery({
    queryKey: ["expenses-summary", groupId, startDate, endDate],
    queryFn: () => getExpenseSummaryByGroup(dto),
    staleTime: 100 * 60 * 5,
    enabled: !!groupId,
    refetchOnWindowFocus: false,
  });
}
