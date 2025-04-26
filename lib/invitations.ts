// This is a mock implementation. In a real app, you would use a database.

interface Invitation {
  id: string
  groupId: string
  inviterId: string
  inviteeId: string
  status: "pending" | "accepted" | "rejected"
  createdAt: string
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
]

export async function getUserInvitations(userId: string): Promise<any[]> {
  // In a real app, this would fetch from an API
  return mockInvitations.filter((inv) => inv.invitee.id === userId && inv.status === "pending")
}

export async function generateInviteLink(groupId: string): Promise<string> {
  // In a real app, this would generate a unique link
  const token = Math.random().toString(36).substring(2, 15)
  return `${window.location.origin}/invite/${groupId}/${token}`
}

export async function acceptInvitation(formData: FormData): Promise<void> {
  // In a real app, this would update the database
  const invitationId = formData.get("invitationId") as string
  console.log(`Accepted invitation ${invitationId}`)
}

export async function rejectInvitation(formData: FormData): Promise<void> {
  // In a real app, this would update the database
  const invitationId = formData.get("invitationId") as string
  console.log(`Rejected invitation ${invitationId}`)
}

