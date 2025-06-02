"use client";

import { getGroupMembers } from "@/lib/groups";
import { useQuery } from "@tanstack/react-query";

export function useGroupMembers(groupId: string) {
  return useQuery({
    queryKey: ["groupMembers", groupId],
    queryFn: () => getGroupMembers(groupId),
    staleTime: 100 * 60 * 5,
    enabled: !!groupId,
    refetchOnWindowFocus: false,
  });
}
