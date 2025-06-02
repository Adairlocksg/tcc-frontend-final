"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGroupMembers } from "@/hooks/use-group-members";

interface MemberSelect {
  groupId: string;
  selectedMember: string;
  onChange: (memberId: string) => void;
  includeAllOption?: boolean;
  placeholder?: string;
}

export function MemberSelect({
  groupId,
  selectedMember,
  onChange,
  includeAllOption = true,
  placeholder = "Filtrar por membros",
}: MemberSelect) {
  const { data: members, isLoading, error } = useGroupMembers(groupId);

  if (isLoading) return <div>Carregando membros...</div>;
  if (error) return <div>Erro ao carregar membros do grupo.</div>;

  return (
    <Select value={selectedMember} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAllOption && (
          <SelectItem value="all">Todos os membros</SelectItem>
        )}
        {members?.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.firstName} {member.lastName}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
