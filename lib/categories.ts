// This is a mock implementation. In a real app, you would use a database.

interface Category {
  id: string
  name: string
  active: boolean
}

// Mock data
const mockCategories: Record<string, Category[]> = {
  "group-1": [
    { id: "cat-1", name: "Food", active: true },
    { id: "cat-2", name: "Transportation", active: true },
    { id: "cat-3", name: "Entertainment", active: true },
    { id: "cat-4", name: "Utilities", active: true },
    { id: "cat-5", name: "Shopping", active: false },
  ],
}

export async function getCategories(groupId: string): Promise<Category[]> {
  // In a real app, this would fetch from an API
  return mockCategories[groupId] || []
}

export async function createCategory(groupId: string, name: string): Promise<string> {
  // In a real app, this would create a category in the database
  if (!mockCategories[groupId]) {
    mockCategories[groupId] = []
  }

  const newCategory: Category = {
    id: `cat-${Date.now()}`,
    name,
    active: true,
  }

  mockCategories[groupId].push(newCategory)

  return newCategory.id
}

export async function updateCategory(groupId: string, categoryId: string, data: Partial<Category>): Promise<void> {
  // In a real app, this would update the database
  const categories = mockCategories[groupId] || []
  const index = categories.findIndex((cat) => cat.id === categoryId)

  if (index !== -1) {
    mockCategories[groupId][index] = {
      ...mockCategories[groupId][index],
      ...data,
    }
  }
}

export async function deleteCategory(groupId: string, categoryId: string): Promise<void> {
  // In a real app, this would update the database
  const categories = mockCategories[groupId] || []
  mockCategories[groupId] = categories.filter((cat) => cat.id !== categoryId)
}

