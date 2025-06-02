"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGroupMembers } from "@/hooks/use-group-members";

interface GroupMembersProps {
  groupId: string;
}

export function GroupMembers({ groupId }: GroupMembersProps) {
  const { data: members, isLoading } = useGroupMembers(groupId);

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (members?.length === 0) {
    return (
      <div className="py-4 text-center text-muted-foreground">
        Nenhum membro encontrado para esse grupo
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members?.map((member) => (
        <div key={member.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {member.firstName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{member.firstName}</p>
                  {member.admin && (
                    <Badge
                      variant="outline"
                      className="bg-primary/10 text-primary"
                    >
                      Admin
                    </Badge>
                  )}
                  {member.isCurrentUser && (
                    <Badge
                      variant="outline"
                      className="bg-secondary text-secondary-foreground"
                    >
                      Você
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
