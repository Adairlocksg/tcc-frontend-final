"use client"

import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Expense {
  id: string
  amount: number
  description: string
  date: string
  category: {
    name: string
  }
  user: {
    name: string
    image?: string
  }
  group: {
    name: string
  }
}

export function RecentExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // This would be replaced with actual API call
    const mockExpenses = [
      {
        id: "1",
        amount: 120.5,
        description: "Groceries",
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        category: { name: "Food" },
        user: { name: "John Doe" },
        group: { name: "Home" },
      },
      {
        id: "2",
        amount: 45.0,
        description: "Gas",
        date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        category: { name: "Transportation" },
        user: { name: "Jane Smith" },
        group: { name: "Travel" },
      },
      {
        id: "3",
        amount: 200.0,
        description: "Dinner",
        date: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        category: { name: "Entertainment" },
        user: { name: "John Doe" },
        group: { name: "Friends" },
      },
    ]

    setExpenses(mockExpenses)
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return <div>Loading recent expenses...</div>
  }

  if (expenses.length === 0) {
    return <div>No recent expenses found.</div>
  }

  return (
    <div className="space-y-4">
      {expenses.map((expense) => (
        <div key={expense.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={expense.user.image} />
              <AvatarFallback>{expense.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{expense.description}</p>
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">{expense.user.name}</p>
                <span className="text-xs text-muted-foreground">•</span>
                <p className="text-sm text-muted-foreground">{expense.group.name}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(expense.date), { addSuffix: true })}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="font-medium">R$ {expense.amount.toFixed(2)}</p>
            <Badge variant="outline" className="mt-1">
              {expense.category.name}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

