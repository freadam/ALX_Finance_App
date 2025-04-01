"use client"

import { ArrowDownIcon, ArrowUpIcon, PlusIcon, SearchIcon } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar as CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { TransactionDialog } from "@/components/dashboard/transaction-dialog"
import { cn } from "@/lib/utils"
import { API_BASE_URL, transactions as transactionsEndpoint } from "../../../../services/api/urls"

import React, { useState, useEffect } from "react"
// Sample data - replace with actual API data
// const transactions = [
//   {
//     id: "1",
//     description: "Payroll",
//     amount: -12500,
//     date: "2023-03-15",
//     category: "Salaries",
//     client: "Internal",
//     completed: true,
//   },
//   {
//     id: "2",
//     description: "Client Payment - ABC Corp",
//     amount: 8000,
//     date: "2023-03-14",
//     category: "Revenue",
//     client: "ABC Corp",
//     completed: true,
//   },
//   {
//     id: "3",
//     description: "Office Rent",
//     amount: -3500,
//     date: "2023-03-10",
//     category: "Rent",
//     client: "Property Management Inc",
//     completed: true,
//   },
//   {
//     id: "4",
//     description: "Software Subscription",
//     amount: -99,
//     date: "2023-03-08",
//     category: "Software",
//     client: "SaaS Provider",
//     completed: true,
//   },
//   {
//     id: "5",
//     description: "Client Payment - XYZ Inc",
//     amount: 5500,
//     date: "2023-03-05",
//     category: "Revenue",
//     client: "XYZ Inc",
//     completed: true,
//   },
//   {
//     id: "6",
//     description: "Marketing Campaign",
//     amount: -2000,
//     date: "2023-03-03",
//     category: "Marketing",
//     client: "Ad Agency",
//     completed: true,
//   },
//   {
//     id: "7",
//     description: "Utility Bills",
//     amount: -450,
//     date: "2023-03-02",
//     category: "Utilities",
//     client: "Utility Company",
//     completed: true,
//   },
//   {
//     id: "8",
//     description: "Equipment Purchase",
//     amount: -3200,
//     date: "2023-03-01",
//     category: "Equipment",
//     client: "Tech Supplier",
//     completed: true,
//   },
//   {
//     id: "9",
//     description: "Investor Funding",
//     amount: 50000,
//     date: "2023-02-28",
//     category: "Investment",
//     client: "Angel Investor",
//     completed: true,
//   },
//   {
//     id: "10",
//     description: "Legal Services",
//     amount: -1500,
//     date: "2023-02-25",
//     category: "Legal",
//     client: "Law Firm LLP",
//     completed: true,
//   },
// ]


export default function TransactionsPage() {
  const [transactionsData, setTransactionsData] = useState<any[]>([])
  const [date, setDate] = useState<DateRange | undefined>({
    from: undefined,
    to: undefined,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [transactionType, setTransactionType] = useState("all")
  const [showTransactionDialog, setShowTransactionDialog] = useState(false)

  useEffect(() => {
    async function fetchTransactionsData() {
      try {
        const response = await fetch(`${API_BASE_URL}${transactionsEndpoint}`, {
          method: "GET",
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setTransactionsData(data)
      } catch (error) {
        console.error("Error fetching transactions data:", error)
      }
    }
    fetchTransactionsData()
  }, [])

  const categories = ["All Categories", ...new Set(transactionsData.map(transaction => transaction.category.name))];


  // Filter transactions based on search, category, and type
  const filteredTransactions = transactionsData.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.client.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === "All Categories" || transaction.category.name === selectedCategory

    const matchesType =
      transactionType === "all" ||
      (transactionType === "income" && transaction.type === "income") ||
      (transactionType === "expense" && transaction.type === "expense")

    return matchesSearch && matchesCategory && matchesType
  })

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
            <p className="text-muted-foreground">Manage and track your financial transactions</p>
          </div>
          <Button onClick={() => setShowTransactionDialog(true)}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>View, filter, and manage all your financial transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex items-center gap-2">
                <SearchIcon className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  className="h-9 w-full md:w-[200px] lg:w-[300px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex flex-1 items-center gap-2">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-9 w-full md:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={transactionType} onValueChange={setTransactionType}>
                  <SelectTrigger className="h-9 w-full md:w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Transactions</SelectItem>
                    <SelectItem value="income">Income Only</SelectItem>
                    <SelectItem value="expense">Expenses Only</SelectItem>
                  </SelectContent>
                </Select>

                <div className="ml-auto">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[300px] justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="h-24 text-center">
                        No transactions found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.description}</TableCell>
                        <TableCell>{transaction.category.name}</TableCell>
                        <TableCell>{transaction.client}</TableCell>
                        <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <span
                            className={cn("font-medium", transaction.type === "income" ? "text-green-600" : "text-red-600")}
                          >
                            {transaction.type === "income" ? (
                              <ArrowUpIcon className="mr-1 inline h-4 w-4" />
                            ) : (
                              <ArrowDownIcon className="mr-1 inline h-4 w-4" />
                            )}
                            ${Math.abs(transaction.amount).toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <TransactionDialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog} />
    </DashboardLayout>
  )
}

