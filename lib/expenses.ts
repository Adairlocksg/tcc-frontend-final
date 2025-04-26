// This is a mock implementation. In a real app, you would use a database.

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  categoryId: string
  userId: string
  recurrence?: {
    type: "daily" | "weekly" | "monthly" | "custom"
    interval?: number
  }
}

// Mock data with expanded objects for UI display and varied dates
const mockExpenses: Record<string, any[]> = {
  "group-1": [
    {
      id: "exp-1",
      amount: 120.5,
      description: "Groceries",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      category: { id: "cat-1", name: "Food" },
      user: { id: "user-1", name: "John Doe" },
      recurrence: null,
    },
    {
      id: "exp-2",
      amount: 45.0,
      description: "Gas",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      category: { id: "cat-2", name: "Transportation" },
      user: { id: "user-2", name: "Jane Smith" },
      recurrence: { type: "monthly", interval: 1 },
    },
    {
      id: "exp-3",
      amount: 200.0,
      description: "Dinner",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      category: { id: "cat-3", name: "Entertainment" },
      user: { id: "user-1", name: "John Doe" },
      recurrence: null,
    },
    // Previous month expenses
    {
      id: "exp-4",
      amount: 150.0,
      description: "Internet Bill",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 35).toISOString(),
      category: { id: "cat-4", name: "Utilities" },
      user: { id: "user-1", name: "John Doe" },
      recurrence: { type: "monthly", interval: 1 },
    },
    {
      id: "exp-5",
      amount: 75.0,
      description: "Movie Tickets",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 40).toISOString(),
      category: { id: "cat-3", name: "Entertainment" },
      user: { id: "user-2", name: "Jane Smith" },
      recurrence: null,
    },
    // Two months ago
    {
      id: "exp-6",
      amount: 300.0,
      description: "New Shoes",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24 * 65).toISOString(),
      category: { id: "cat-5", name: "Shopping" },
      user: { id: "user-1", name: "John Doe" },
      recurrence: null,
    },
  ],
}

export async function getGroupExpenses(groupId: string): Promise<any[]> {
  // In a real app, this would fetch from an API
  return mockExpenses[groupId] || []
}

export async function getGroupExpensesByDateRange(groupId: string, startDate: Date, endDate: Date): Promise<any[]> {
  const expenses = mockExpenses[groupId] || []

  return expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate >= startDate && expenseDate <= endDate
  })
}

export async function createExpense(data: {
  groupId: string
  amount: number
  description: string
  categoryId: string
  userId: string
  recurrence: {
    type: "daily" | "weekly" | "monthly" | "custom"
    interval?: number
  } | null
}): Promise<string> {
  // In a real app, this would create an expense in the database
  if (!mockExpenses[data.groupId]) {
    mockExpenses[data.groupId] = []
  }

  const newExpense = {
    id: `exp-${Date.now()}`,
    amount: data.amount,
    description: data.description,
    date: new Date().toISOString(),
    category: { id: data.categoryId, name: "Mock Category" },
    user: { id: data.userId, name: "Mock User" },
    recurrence: data.recurrence,
  }

  mockExpenses[data.groupId].unshift(newExpense)

  return newExpense.id
}

