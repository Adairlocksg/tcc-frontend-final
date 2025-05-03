"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MailIcon, Check, X, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useInvites } from "@/hooks/use-invites";
import { useAcceptInvite } from "@/hooks/use-accept-invite";
import { useRejectInvite } from "@/hooks/use-reject-invite";

export default function InvitationsPage() {
  const { data: invites, isLoading } = useInvites();
  const { mutate: acceptInvite } = useAcceptInvite();
  const { mutate: rejectInvite } = useRejectInvite();

  const router = useRouter();

  const handleAccept = async (inviteId: string) => {
    acceptInvite(inviteId);
  };

  const handleReject = async (inviteId: string) => {
    rejectInvite(inviteId);
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container pb-20">
      <div className="py-6">
        <h1 className="text-2xl font-bold">Convites</h1>
        <p className="text-muted-foreground">
          Gerencie as solicitações de convites dos grupos que você é
          administrador
        </p>
      </div>
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => router.push("/invitations/request")}
          className="flex items-center gap-1"
        >
          <UserPlus className="h-4 w-4" />
          Solicitar convite a outro grupo
        </Button>
      </div>

      {invites?.length === 0 ? (
        <Card className="bg-gradient-to-br from-background to-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <MailIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground">
              Você não possui solicitações de convites pendentes.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invites?.map((invite) => (
            <Card key={invite.id} className="overflow-hidden">
              <div className="h-2 bg-primary/60" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {invite.groupName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Solicitado por {invite.userName}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full text-red-500"
                      onClick={() => handleReject(invite.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => handleAccept(invite.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {invite.groupDescription || "Grupo não possui descriçãp"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
