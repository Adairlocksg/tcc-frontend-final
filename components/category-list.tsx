"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { PencilIcon, TrashIcon } from "lucide-react"
import { getCategories, updateCategory, deleteCategory } from "@/lib/categories"
import { toast } from "sonner"

interface CategoryListProps {
  groupId: string
  isAdmin: boolean
}

export function CategoryList({ groupId, isAdmin }: CategoryListProps) {
  const [categories, setCategories] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editCategory, setEditCategory] = useState<any>(null)
  const [editName, setEditName] = useState("")
  const [editActive, setEditActive] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories(groupId)
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [groupId])

  const handleEdit = (category: any) => {
    setEditCategory(category)
    setEditName(category.name)
    setEditActive(category.active)
  }

  const handleUpdate = async () => {
    try {
      await updateCategory(groupId, editCategory.id, {
        name: editName,
        active: editActive,
      })

      setCategories(
        categories.map((cat) => (cat.id === editCategory.id ? { ...cat, name: editName, active: editActive } : cat)),
      )

      setEditCategory(null)
      toast.success("Category updated successfully")
    } catch (error) {
      console.error("Failed to update category:", error)
      toast.error("Failed to update category")
    }
  }

  const handleDelete = async (categoryId: string, categoryName: string) => {
    if (confirm(`Are you sure you want to delete "${categoryName}"? This action cannot be undone.`)) {
      try {
        await deleteCategory(groupId, categoryId)
        setCategories(categories.filter((cat) => cat.id !== categoryId))
        toast.success(`Category "${categoryName}" deleted`)
      } catch (error) {
        console.error("Failed to delete category:", error)
        toast.error("Failed to delete category")
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="mb-4 text-muted-foreground">No categories created for this group yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {categories.map((category, index) => (
        <div key={category.id} className="rounded-lg border p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`h-3 w-3 rounded-full ${category.active ? "bg-emerald-500" : "bg-gray-400"}`} />
              <span className="font-medium">{category.name}</span>
            </div>
            {isAdmin && (
              <div className="flex space-x-1">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(category)}>
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Category</DialogTitle>
                      <DialogDescription>Make changes to the category. Click save when you're done.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={editName} onChange={(e) => setEditName(e.target.value)} />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="active" checked={editActive} onCheckedChange={setEditActive} />
                        <Label htmlFor="active">Active</Label>
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setEditCategory(null)}>
                        Cancel
                      </Button>
                      <Button onClick={handleUpdate}>Save Changes</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500"
                  onClick={() => handleDelete(category.id, category.name)}
                >
                  <TrashIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

