"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getGroupExpenses } from "@/lib/expenses"
import { getCategories } from "@/lib/categories"

interface ExpenseListProps {
  groupId: string
}

export function ExpenseList({ groupId }: ExpenseListProps) {
  const router = useRouter()
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expensesData, categoriesData] = await Promise.all([getGroupExpenses(groupId), getCategories(groupId)])

        setExpenses(expensesData)
        setCategories(categoriesData)
      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [groupId])

  const filteredExpenses =
    selectedCategory === "all" ? expenses : expenses.filter((expense) => expense.category.id === selectedCategory)

  if (isLoading) {
    return <div>Loading expenses...</div>
  }

  if (expenses.length === 0) {
    return (
      <div className="text-center">
        <p className="mb-4">No expenses recorded for this group yet.</p>
        <Button onClick={() => router.push(`/groups/${groupId}/expenses/new`)}>Add First Expense</Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => router.push(`/groups/${groupId}/expenses/new`)}>Add Expense</Button>
      </div>

      {filteredExpenses.length === 0 ? (
        <Card className="p-6 text-center">
          <p>No expenses found for the selected category.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={expense.user.image} />
                    <AvatarFallback>{expense.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-muted-foreground">{expense.user.name}</p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-sm text-muted-foreground">{format(new Date(expense.date), "MMM d, yyyy")}</p>
                    </div>
                    {expense.recurrence && (
                      <Badge variant="outline" className="mt-1">
                        {expense.recurrence.type === "daily" && "Daily"}
                        {expense.recurrence.type === "weekly" && "Weekly"}
                        {expense.recurrence.type === "monthly" && "Monthly"}
                        {expense.recurrence.type === "custom" && `Every ${expense.recurrence.interval} days`}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="font-medium">R$ {expense.amount.toFixed(2)}</p>
                  <Badge className="mt-1">{expense.category.name}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

