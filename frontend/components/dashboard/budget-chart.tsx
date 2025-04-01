"use client"

import { useTheme } from "next-themes"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import React, { useState, useEffect } from "react"

import { API_BASE_URL, budgets } from "../../services/api/urls"




export function BudgetChart() {
  const [budgetData, setBudgetData] = useState<any[]>([])

useEffect(() => {
  async function fetchBudgetData() {
    try {
      const response = await fetch(`${API_BASE_URL}${budgets}`,{
          method: "GET",
          credentials: "include", // Ensures cookies are sent
      })
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      setBudgetData(data)
    } catch (error) {
      console.error("Error fetching budget data:", error)
    }
  }
  fetchBudgetData()
}, [])

  const { theme } = useTheme()
  const isDark = theme === "dark"
  const textColor = isDark ? "#f8fafc" : "#0f172a"

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={budgetData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {budgetData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`$${value.toLocaleString()}`, "Budget"]}
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            color: textColor,
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

