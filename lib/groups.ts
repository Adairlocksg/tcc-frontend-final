import { api, ApiResponse, Id } from "./api";

export interface Group {
  id: string;
  name: string;
  description: string;
  active: boolean;
  members: number;
  favorite: boolean;
  admin: boolean;
}

export interface GroupDto {
  name: string;
  description: string;
}

export interface GroupMember {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  admin: boolean;
  isCurrentUser: boolean;
}

export async function getGroups(): Promise<Group[]> {
  const response = await api.get<ApiResponse<Group[]>>("groups");

  return response.data.content;
}

export async function getGroup(id: string): Promise<Group | null> {
  const repsponse = await api.get<ApiResponse<Group>>(`groups/${id}`);

  return repsponse.data.content;
}

export async function createGroup(dto: GroupDto): Promise<string> {
  const respnose = await api.post<ApiResponse<Id>>("groups", dto);
  return respnose.data.content.id;
}

export async function updateGroup(id: string, dto: GroupDto) {
  const response = await api.put<ApiResponse<Id>>(`groups/${id}`, dto);
  return response.data.content.id;
}

export async function favoriteGroup(groupId: string) {
  const response = await api.put<ApiResponse<Id>>(`groups/${groupId}/favorite`);
  return response.data.content.id;
}

export async function unFavoriteGroup(groupId: string) {
  const response = await api.put<ApiResponse<Id>>(`groups/${groupId}/unfavorite`);
  return response.data.content.id;
}

export async function getGroupMembers(groupId: string): Promise<GroupMember[]> {
  const response = await api.get<ApiResponse<GroupMember[]>>(`groups/${groupId}/members`);
  return response.data.content;
}

export async function removeGroupMember(
  groupId: string,
  userId: string
): Promise<void> {
  // In a real app, this would update the database
  console.log(`Removed user ${userId} from group ${groupId}`);
}

export async function promoteToAdmin(
  groupId: string,
  userId: string
): Promise<void> {
  // In a real app, this would update the database
  console.log(`Promoted user ${userId} to admin in group ${groupId}`);
}
