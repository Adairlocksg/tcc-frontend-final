// This is a mock implementation. In a real app, you would use a database.

import { api, ApiResponse, Id } from "./api";

export interface Category {
  id: string;
  description: string;
  groupId: string;
  active: boolean;
}

export interface CategoryDto {
  description: string;
}

export async function getCategories(groupId: string): Promise<Category[]> {
  return [];
}

export async function createCategory(
  groupId: string,
  dto: CategoryDto
): Promise<string> {
  const response = await api.post<ApiResponse<Id>>(
    `groups/${groupId}/categories`,
    dto
  );

  return response.data.content.id;
}

export async function updateCategory(
  groupId: string,
  categoryId: string,
  data: Partial<Category>
): Promise<void> {
  // In a real app, this would update the database
}

export async function deleteCategory(
  groupId: string,
  categoryId: string
): Promise<void> {}
