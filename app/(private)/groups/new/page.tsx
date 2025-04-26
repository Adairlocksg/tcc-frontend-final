"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft } from "lucide-react"
import { createGroup } from "@/lib/groups"

export default function NewGroupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const description = formData.get("description") as string

    try {
      const groupId = await createGroup(name, description)
      router.push(`/groups/${groupId}`)
    } catch (error) {
      setError("Failed to create group. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container px-4 py-6">
      <div className="mb-6">
        <button onClick={() => router.back()} className="flex items-center text-sm text-muted-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </button>
      </div>

      <h1 className="mb-6 text-2xl font-bold">Create New Group</h1>

      <Card className="mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-3">
            <div className="h-1 w-12 rounded-full bg-primary"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-red-950 p-2 text-sm text-red-400">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">Group Name</Label>
              <Input id="name" name="name" placeholder="e.g. Home, Travel, Friends" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea id="description" name="description" placeholder="Describe the purpose of this group" rows={3} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Group"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

