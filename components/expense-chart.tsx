"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ExpenseChart() {
  const [data, setData] = useState([])
  const [period, setPeriod] = useState("month")

  useEffect(() => {
    // This would be replaced with actual API call
    const mockData = [
      { name: "Jan", total: 1200 },
      { name: "Feb", total: 900 },
      { name: "Mar", total: 1500 },
      { name: "Apr", total: 800 },
      { name: "May", total: 1300 },
      { name: "Jun", total: 1700 },
      { name: "Jul", total: 1400 },
    ]

    setData(mockData)
  }, [period])

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$${value}`}
          />
          <Tooltip formatter={(value: number) => [`R$${value}`, "Total"]} labelFormatter={(label) => `${label}`} />
          <Bar dataKey="total" fill="#4f46e5" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

