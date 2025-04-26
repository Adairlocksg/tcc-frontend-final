// This is a mock implementation. In a real app, you would use a database.

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
]

export async function getUserInvitations(userId: string): Promise<any[]> {
  // In a real app, this would fetch from an API
  return mockInvitations.filter((inv) => inv.invitee.id === userId && inv.status === "pending")
}

