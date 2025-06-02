"use client";

import { getMainDashboard } from "@/lib/dashboard";
import { useQuery } from "@tanstack/react-query";

export function useMainDashboard() {
  return useQuery({
    queryKey: ["main-dashboard"],
    queryFn: getMainDashboard,
    staleTime: 100 * 60 * 5,
  });
}
