// This is a mock implementation. In a real app, you would use a database.

import { api, ApiResponse, Id } from "./api";

interface Invitation {
  id: string;
  groupId: string;
  inviterId: string;
  inviteeId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface InviteDto {
  groupId: string;
}

// Mock data with expanded objects for UI display
const mockInvitations: any[] = [
  {
    id: "inv-1",
    group: {
      id: "group-4",
      name: "Office",
      description: "Work expenses",
    },
    inviter: {
      id: "user-2",
      name: "Jane Smith",
    },
    invitee: {
      id: "user-1",
      name: "John Doe",
    },
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: "inv-2",
    group: {
      id: "group-5",
      name: "Family",
      description: "Family expenses",
    },
    inviter: {
      id: "user-3",
      name: "Bob Johnson",
    },
    invitee: {
      id: "user-1",
      name: "John Doe",
    },
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export async function getUserInvitations(userId: string): Promise<any[]> {
  // In a real app, this would fetch from an API
  return mockInvitations.filter(
    (inv) => inv.invitee.id === userId && inv.status === "pending"
  );
}

export async function createInvite(dto: InviteDto): Promise<string> {
  const response = await api.post<ApiResponse<Id>>(`invites`, dto);

  return response.data.content.id;
}

export async function getInviteLink(groupId: string): Promise<string> {
  const response = await api.get<ApiResponse<string>>(`groups/${groupId}/link`);

  return response.data.content;
}

export async function acceptInvitation(formData: FormData): Promise<void> {
  // In a real app, this would update the database
  const invitationId = formData.get("invitationId") as string;
  console.log(`Accepted invitation ${invitationId}`);
}

export async function rejectInvitation(formData: FormData): Promise<void> {
  // In a real app, this would update the database
  const invitationId = formData.get("invitationId") as string;
  console.log(`Rejected invitation ${invitationId}`);
}
