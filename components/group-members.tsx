"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UserMinusIcon, ShieldIcon } from "lucide-react"
import { getGroupMembers, removeGroupMember, promoteToAdmin } from "@/lib/groups"
import { toast } from "sonner"

interface GroupMembersProps {
  groupId: string
  isAdmin: boolean
}

export function GroupMembers({ groupId, isAdmin }: GroupMembersProps) {
  const [members, setMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [confirmRemove, setConfirmRemove] = useState<any>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getGroupMembers(groupId)
        setMembers(data)
      } catch (error) {
        console.error("Failed to fetch members:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMembers()
  }, [groupId])

  const handleRemoveMember = async () => {
    if (!confirmRemove) return

    try {
      await removeGroupMember(groupId, confirmRemove.id)
      setMembers(members.filter((member) => member.id !== confirmRemove.id))
      setConfirmRemove(null)
      toast.success(`${confirmRemove.name} removed from group`)
    } catch (error) {
      console.error("Failed to remove member:", error)
      toast.error("Failed to remove member")
    }
  }

  const handlePromoteToAdmin = async (memberId: string, memberName: string) => {
    try {
      await promoteToAdmin(groupId, memberId)
      setMembers(members.map((member) => (member.id === memberId ? { ...member, isAdmin: true } : member)))
      toast.success(`${memberName} is now an admin`)
    } catch (error) {
      console.error("Failed to promote member:", error)
      toast.error("Failed to promote member")
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (members.length === 0) {
    return <div className="py-4 text-center text-muted-foreground">No members found for this group.</div>
  }

  return (
    <div className="space-y-3">
      {members.map((member) => (
        <div key={member.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 border-2 border-primary/10">
                <AvatarImage src={member.image} />
                <AvatarFallback className="bg-primary/10 text-primary">{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center space-x-2">
                  <p className="font-medium">{member.name}</p>
                  {member.isAdmin && (
                    <Badge variant="outline" className="bg-primary/10 text-primary">
                      Admin
                    </Badge>
                  )}
                  {member.isCurrentUser && (
                    <Badge variant="outline" className="bg-secondary text-secondary-foreground">
                      You
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            {isAdmin && !member.isCurrentUser && (
              <div className="flex space-x-2">
                {!member.isAdmin && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePromoteToAdmin(member.id, member.name)}
                    className="h-8"
                  >
                    <ShieldIcon className="mr-1 h-3 w-3" />
                    Make Admin
                  </Button>
                )}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-red-500"
                      onClick={() => setConfirmRemove(member)}
                    >
                      <UserMinusIcon className="mr-1 h-3 w-3" />
                      Remove
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Remove Member</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to remove {confirmRemove?.name} from this group? This action cannot be
                        undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setConfirmRemove(null)}>
                        Cancel
                      </Button>
                      <Button variant="destructive" onClick={handleRemoveMember}>
                        Remove
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

