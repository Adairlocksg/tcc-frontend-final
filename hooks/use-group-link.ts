import { getInviteLink } from "@/lib/invitations";
import { useQuery } from "@tanstack/react-query";

export function useGroupLink(groupId: string, enabled = false) {
  return useQuery({
    queryKey: ["group-link", groupId],
    queryFn: () => getInviteLink(groupId),
    enabled, // Só executa quando o botão for clicado
  });
}