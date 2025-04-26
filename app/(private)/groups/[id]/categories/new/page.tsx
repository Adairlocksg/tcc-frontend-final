"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"
import { createCategory } from "@/lib/categories"
import { getGroup } from "@/lib/groups"
import { useEffect } from "react"

interface NewCategoryPageProps {
  params: {
    id: string
  }
}

export default function NewCategoryPage({ params }: NewCategoryPageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [group, setGroup] = useState<any>(null)

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        const groupData = await getGroup(params.id)
        setGroup(groupData)
      } catch (error) {
        console.error("Failed to fetch group:", error)
      }
    }

    fetchGroup()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string

    try {
      await createCategory(params.id, name)
      router.push(`/groups/${params.id}`)
    } catch (error) {
      setError("Failed to create category. Please try again.")
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

      <h1 className="mb-2 text-2xl font-bold">Add Category</h1>
      {group && <p className="mb-6 text-sm text-muted-foreground">to {group.name}</p>}

      <Card className="mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-3">
            <div className="h-1 w-12 rounded-full bg-primary"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-red-950 p-2 text-sm text-red-400">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" name="name" placeholder="e.g. Food, Transport, Entertainment" required />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Create Category"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

