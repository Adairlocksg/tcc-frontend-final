"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Plus, Pencil } from "lucide-react"
import { getUserGroups, setFavoriteGroup } from "@/lib/groups"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function GroupsPage() {
  const router = useRouter()
  const [groups, setGroups] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingGroup, setEditingGroup] = useState<any>(null)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getUserGroups()
        setGroups(data)
      } catch (error) {
        console.error("Failed to fetch groups:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGroups()
  }, [])

  const handleFavorite = async (groupId: string) => {
    try {
      await setFavoriteGroup(groupId)
      setGroups(
        groups.map((group) => ({
          ...group,
          isFavorite: group.id === groupId ? true : false,
        })),
      )
      toast.success("Favorite group updated")
    } catch (error) {
      console.error("Failed to set favorite group:", error)
      toast.error("Failed to update favorite group")
    }
  }

  const handleEdit = (group: any) => {
    setEditingGroup(group)
    setName(group.name)
    setDescription(group.description || "")
  }

  const handleSaveEdit = () => {
    // In a real app, this would call an API
    const updatedGroups = groups.map((group) => {
      if (group.id === editingGroup.id) {
        return { ...group, name, description }
      }
      return group
    })

    setGroups(updatedGroups)
    setEditingGroup(null)
    toast.success("Group updated successfully")
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container pb-20">
      <div className="py-6">
        <h1 className="text-2xl font-bold">My Groups</h1>
        <p className="text-muted-foreground">Manage your expense groups</p>
      </div>

      <div className="mb-6 flex justify-end">
        <Button onClick={() => router.push("/groups/new")} className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Create New Group
        </Button>
      </div>

      {groups.length === 0 ? (
        <Card className="text-center p-8">
          <p className="mb-4 text-muted-foreground">You haven't created any groups yet.</p>
          <Button onClick={() => router.push("/groups/new")}>Create Your First Group</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {groups.map((group) => (
            <Card key={group.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">{group.name}</h3>
                      <button onClick={() => handleFavorite(group.id)}>
                        <Star
                          className={`h-5 w-5 ${
                            group.isFavorite ? "fill-amber-500 text-amber-500" : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">{group.description || "No description"}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> {group.memberCount}
                  </Badge>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-muted/20 p-3">
                <Button variant="outline" size="sm" onClick={() => handleEdit(group)}>
                  <Pencil className="mr-1 h-3 w-3" />
                  Edit
                </Button>
                <Button size="sm" onClick={() => router.push(`/groups/${group.id}`)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!editingGroup} onOpenChange={(open) => !open && setEditingGroup(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Group</DialogTitle>
            <DialogDescription>Make changes to your group details.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Group Name</Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Home, Travel, Friends"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (Optional)</Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose of this group"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingGroup(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

