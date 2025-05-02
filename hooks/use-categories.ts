"use client";

import { getCategories } from "@/lib/categories";
import { useQuery } from "@tanstack/react-query";

export function useCategories(groupId: string) {
  return useQuery({
    queryKey: ["categories", groupId],
    queryFn: () => getCategories(groupId),
    staleTime: 100 * 60 * 5,
    enabled: !!groupId,
    refetchOnWindowFocus: false,
  });
}
