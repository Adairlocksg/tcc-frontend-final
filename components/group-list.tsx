"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon } from "lucide-react"
import { getGroups, Group, setFavoriteGroup } from "@/lib/groups"

export function GroupList() {
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const data = await getGroups()
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
    } catch (error) {
      console.error("Failed to set favorite group:", error)
    }
  }

  if (isLoading) {
    return <div>Loading groups...</div>
  }

  if (groups.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <p className="mb-4">You haven't joined any groups yet.</p>
          <Button onClick={() => router.push("/groups/new")}>Create a Group</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {groups.map((group) => (
        <Card key={group.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle>{group.name}</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleFavorite(group.id)}
                className={group.favorite ? "text-yellow-500" : ""}
              >
                <StarIcon className="h-5 w-5" />
              </Button>
            </div>
            <CardDescription>
              {group.members} {group.members === 1 ? "member" : "members"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{group.description || "No description provided"}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/groups/${group.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                View Group
              </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
      <Card className="flex flex-col items-center justify-center p-6">
        <p className="mb-4 text-center text-muted-foreground">Create a new group to track expenses with others</p>
        <Button onClick={() => router.push("/groups/new")}>Create a Group</Button>
      </Card>
    </div>
  )
}

