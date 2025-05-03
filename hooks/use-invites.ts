"use client";

import { getPendingInvites } from "@/lib/invitations";
import { useQuery } from "@tanstack/react-query";

export function useInvites() {
  return useQuery({
    queryKey: ["invites"],
    queryFn: getPendingInvites,
    staleTime: 100 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
