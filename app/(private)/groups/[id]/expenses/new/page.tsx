"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { ChevronLeft } from "lucide-react"
import { createExpense } from "@/lib/expenses"
import { getCategories } from "@/lib/categories"
import { getGroupMembers, getGroup } from "@/lib/groups"

interface NewExpensePageProps {
  params: {
    id: string
  }
}

export default function NewExpensePage({ params }: NewExpensePageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [group, setGroup] = useState<any>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [isAdmin, setIsAdmin] = useState(true) // Assuming admin access for all users
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceType, setRecurrenceType] = useState("monthly")
  const [customInterval, setCustomInterval] = useState(1)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [groupData, categoriesData, membersData] = await Promise.all([
          getGroup(params.id),
          getCategories(params.id),
          getGroupMembers(params.id),
        ])

        setGroup(groupData)
        setCategories(categoriesData)
        setMembers(membersData)
      } catch (error) {
        setError("Failed to load data")
      }
    }

    fetchData()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const amount = Number.parseFloat((formData.get("amount") as string).replace(/[^\d.-]/g, ""))
    const description = formData.get("description") as string
    const categoryId = formData.get("category") as string
    const userId = (formData.get("user") as string) || "user-1" // Default user ID

    const recurrence = isRecurring
      ? {
          type: recurrenceType,
          interval: recurrenceType === "custom" ? customInterval : 1,
        }
      : null

    try {
      await createExpense({
        groupId: params.id,
        amount,
        description,
        categoryId,
        userId,
        recurrence,
      })

      router.push(`/groups/${params.id}`)
    } catch (error) {
      setError("Failed to create expense. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d]/g, "")
    if (value) {
      value = (Number.parseInt(value) / 100).toFixed(2)
      e.target.value = `R$ ${value}`
    } else {
      e.target.value = ""
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

      <h1 className="mb-2 text-2xl font-bold">Add Expense</h1>
      {group && <p className="mb-6 text-sm text-muted-foreground">to {group.name}</p>}

      <Card className="mx-auto">
        <form onSubmit={handleSubmit}>
          <CardHeader className="pb-3">
            <div className="h-1 w-12 rounded-full bg-primary"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && <div className="rounded-md bg-red-950 p-2 text-sm text-red-400">{error}</div>}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                name="amount"
                placeholder="R$ 0.00"
                onChange={formatCurrency}
                className="text-lg"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" name="description" placeholder="What is this expense for?" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select name="category" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {isAdmin && (
              <div className="space-y-2">
                <Label htmlFor="user">Paid by</Label>
                <Select name="user" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Switch id="recurring" checked={isRecurring} onCheckedChange={setIsRecurring} />
              <Label htmlFor="recurring">Recurring Expense</Label>
            </div>
            {isRecurring && (
              <div className="space-y-4 rounded-md border p-4">
                <RadioGroup value={recurrenceType} onValueChange={setRecurrenceType}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="daily" id="daily" />
                    <Label htmlFor="daily">Daily</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <Label htmlFor="weekly">Weekly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <Label htmlFor="monthly">Monthly</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="custom" id="custom" />
                    <Label htmlFor="custom">Custom</Label>
                  </div>
                </RadioGroup>
                {recurrenceType === "custom" && (
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="interval">Every</Label>
                    <Input
                      id="interval"
                      type="number"
                      min="1"
                      className="w-20"
                      value={customInterval}
                      onChange={(e) => setCustomInterval(Number.parseInt(e.target.value))}
                    />
                    <span>days</span>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating..." : "Add Expense"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

