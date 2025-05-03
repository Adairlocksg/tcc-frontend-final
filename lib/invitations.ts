// This is a mock implementation. In a real app, you would use a database.

import { api, ApiResponse, Id } from "./api";

interface Invite {
  id: string;
  groupId: string;
  userId: string;
  userName: string;
  groupName: string;
  groupDescription: string;
  status: InviteStatus;
}

export interface InviteDto {
  groupId: string;
}

export enum InviteStatus {
  PENDING = 0,
  ACCEPTED = 1,
  REJECTED = 2,
}

export const inviteStatusDescription: Record<InviteStatus, string> = {
  [InviteStatus.PENDING]: "Pendente",
  [InviteStatus.ACCEPTED]: "Aceito",
  [InviteStatus.REJECTED]: "Rejeitado",
};

export async function getPendingInvites(): Promise<Invite[]> {
  const response = await api.get<ApiResponse<Invite[]>>(`invites/pending`);

  return response.data.content;
}

export async function createInvite(dto: InviteDto): Promise<string> {
  const response = await api.post<ApiResponse<Id>>(`invites`, dto);

  return response.data.content.id;
}

export async function getInviteLink(groupId: string): Promise<string> {
  const response = await api.get<ApiResponse<string>>(`groups/${groupId}/link`);

  return response.data.content;
}

export async function acceptInvite(id: string): Promise<void> {
  const response = await api.put<ApiResponse<void>>(`invites/${id}/accept`);

  return response.data.content;
}

export async function rejectInvite(id: string): Promise<void> {
  const response = await api.put<ApiResponse<void>>(`invites/${id}/reject`);

  return response.data.content;
}
