"use client";

import { getGroups } from "@/lib/groups";
import { useQuery } from "@tanstack/react-query";

export function useGroups() {
  return useQuery({
    queryKey: ["groups"],
    queryFn: getGroups,
    staleTime: 100 * 60 * 5,
  });
}
