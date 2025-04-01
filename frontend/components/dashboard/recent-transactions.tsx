"use client"

import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import React, { useState, useEffect } from "react"
import { API_BASE_URL, transactions as transactionURL } from "../../services/api/urls"

interface Transaction {
  id: string
  user: string
  category: {
    id: string
    name: string
    description?: string
    created_at: string
    updated_at: string
  }
  amount: number
  type: string
  date: string
  note: string
  client: string
  completed: boolean
  created_at: string
  updated_at: string
}

export function RecentTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch(`${API_BASE_URL}${transactionURL}`, {
          method: "GET",
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setTransactions(data)
        setIsLoading(false) // Set loading to false after successful fetch
      } catch (error) {
        console.error("Error fetching budget data:", error)
        setError("Failed to load transactions") // Set error message
        setIsLoading(false) // Set loading to false even if there's an error
      }
    }
    fetchTransactions()
  }, [])

  if (isLoading) {
    return <div className="text-center py-4">Loading recent transactions...</div>
  }

  return (
    <div className="space-y-4">
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                transaction.type === "income"
                  ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                  : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400",
              )}
            >
              {transaction.type === "income" ? <ArrowUpIcon className="h-5 w-5" /> : <ArrowDownIcon className="h-5 w-5" />}
            </div>
            <div>
              <p className="text-sm font-medium leading-none">{transaction.note}</p>
              <p className="text-sm text-muted-foreground">{transaction.category.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className={cn("text-sm font-medium", transaction.type === "income" ? "text-green-600" : "text-red-600")}>
              {transaction.type === "income" ? "+" : ""}${Math.abs(transaction.amount).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">{new Date(transaction.date).toLocaleDateString()}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
