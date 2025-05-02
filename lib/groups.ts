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

export async function setFavoriteGroup(groupId: string): Promise<void> {
  // In a real app, this would update the database
}

export async function isGroupAdmin(
  userId: string,
  groupId: string
): Promise<boolean> {
  // In a real app, this would check the database
  // For mock purposes, we'll assume the user is an admin of all groups
  return true;
}

export async function getGroupMembers(groupId: string): Promise<any[]> {
  // In a real app, this would fetch from an API
  return [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      isAdmin: true,
      isCurrentUser: true,
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      isAdmin: false,
      isCurrentUser: false,
    },
    {
      id: "user-3",
      name: "Bob Johnson",
      email: "bob@example.com",
      isAdmin: false,
      isCurrentUser: false,
    },
  ];
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
