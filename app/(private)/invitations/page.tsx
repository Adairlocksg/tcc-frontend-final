"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { acceptInvitation, rejectInvitation } from "@/lib/invitations";
import { getUserInvitations } from "@/lib/data";
import { MailIcon, Check, X, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function InvitationsPage() {
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  // Mock user ID since we removed authentication
  const userId = "user-1";

  useEffect(() => {
    const fetchInvitations = async () => {
      try {
        const data = await getUserInvitations(userId);
        setInvitations(data);
      } catch (error) {
        console.error("Failed to fetch invitations:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvitations();
  }, [userId]);

  const handleAccept = async (invitationId: string, groupName: string) => {
    try {
      const formData = new FormData();
      formData.append("invitationId", invitationId);
      await acceptInvitation(formData);

      // Update local state
      setInvitations(invitations.filter((inv) => inv.id !== invitationId));

      // Show toast notification
      toast.success(`You've joined ${groupName}`, {
        description: "You can now see expenses and add your own",
        action: {
          label: "View Group",
          onClick: () => (window.location.href = "/groups"),
        },
      });
    } catch (error) {
      toast.error("Failed to accept invitation");
      console.error("Failed to accept invitation:", error);
    }
  };

  const handleReject = async (invitationId: string, groupName: string) => {
    try {
      const formData = new FormData();
      formData.append("invitationId", invitationId);
      await rejectInvitation(formData);

      // Update local state
      setInvitations(invitations.filter((inv) => inv.id !== invitationId));

      // Show toast notification
      toast.info(`Invitation to ${groupName} declined`);
    } catch (error) {
      toast.error("Failed to decline invitation");
      console.error("Failed to reject invitation:", error);
    }
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
        <h1 className="text-2xl font-bold">Invitations</h1>
        <p className="text-muted-foreground">Manage your group invitations</p>
      </div>
      <div className="mb-6 flex justify-end">
        <Button
          onClick={() => router.push("/invitations/request")}
          className="flex items-center gap-1"
        >
          <UserPlus className="h-4 w-4" />
          Solicitar convite
        </Button>
      </div>

      {invitations.length === 0 ? (
        <Card className="bg-gradient-to-br from-background to-muted/30">
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 rounded-full bg-primary/10 p-3">
              <MailIcon className="h-6 w-6 text-primary" />
            </div>
            <p className="text-muted-foreground">
              You have no pending invitations.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <Card key={invitation.id} className="overflow-hidden">
              <div className="h-2 bg-primary/60" />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {invitation.group.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Invited by {invitation.inviter.name}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 rounded-full text-red-500"
                      onClick={() =>
                        handleReject(invitation.id, invitation.group.name)
                      }
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() =>
                        handleAccept(invitation.id, invitation.group.name)
                      }
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {invitation.group.description || "No description provided"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
