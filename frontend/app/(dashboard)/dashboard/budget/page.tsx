"use client"
import { CalendarIcon, Download, PlusIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import { BudgetChart } from "@/components/dashboard/budget-chart"
import { BudgetDialog } from "@/components/dashboard/budget-dialog"
import { cn } from "@/lib/utils"

// Sample data - replace with actual API data
import React, { useState, useEffect } from "react"
import { API_BASE_URL, budgets } from "../../../../services/api/urls"

export default function BudgetPage() {
  const [budgetData, setBudgetData] = useState<any[]>([])

  useEffect(() => {
    async function fetchBudgetData() {
      try {
        const response = await fetch(`${API_BASE_URL}${budgets}`, {
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

  const [period, setPeriod] = useState("march-2025")
  const [showBudgetDialog, setShowBudgetDialog] = useState(false)

  const totalBudgeted = budgetData.reduce((sum, item) => sum + item.budgeted, 0)
  const totalActual = budgetData.reduce((sum, item) => sum + item.actual, 0)
  const totalRemaining = totalBudgeted - totalActual
  const overallPercentUsed = (totalActual / totalBudgeted) * 100

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Budget Management</h2>
            <p className="text-muted-foreground">Track and manage your budget allocations</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px]">
                <CalendarIcon className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="january-2023">January 2023</SelectItem>
                <SelectItem value="february-2023">February 2023</SelectItem>
                <SelectItem value="march-2023">March 2023</SelectItem>
                <SelectItem value="q1-2023">Q1 2023</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => setShowBudgetDialog(true)}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Budget
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Budgeted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalBudgeted.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">For current period</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalActual.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{overallPercentUsed.toFixed(1)}% of budget</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Remaining Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalRemaining.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">{(100 - overallPercentUsed).toFixed(1)}% remaining</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Budget Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">Good</div>
              <p className="text-xs text-muted-foreground">On track with projections</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-7">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Visual breakdown of your budget allocations and spending</CardDescription>
            </CardHeader>
            <CardContent>
              <BudgetChart />
            </CardContent>
          </Card>

          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Budget vs. Actual</CardTitle>
              <CardDescription>Compare your budgeted amounts with actual spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetData.slice(0, 5).map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="font-medium">{item.category}</div>
                      <div className="text-right">
                        <span className="font-medium">${item.amount}</span>
                        <span className="text-muted-foreground"> / ${item.amount}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={cn(
                          "h-full rounded-full",
                          item.percentUsed > 90
                            ? "bg-red-500"
                            : item.percentUsed > 75
                              ? "bg-yellow-500"
                              : "bg-green-500",
                        )}
                        style={{ width: `${((item.amount_spent / item.budget_amount) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Export Budget Report
              </Button>
            </CardFooter>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Budget Details</CardTitle>
              <CardDescription>Detailed breakdown of all budget categories</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Budgeted</TableHead>
                    <TableHead className="text-right">Used</TableHead>
                    <TableHead className="text-right">Remaining</TableHead>
                    <TableHead className="text-right">Usage %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {budgetData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.category}</TableCell>
                      <TableCell className="text-right">${item.budget_amount}</TableCell>
                      <TableCell className="text-right">${item.amount_spent}</TableCell>
                      <TableCell className="text-right">{((item.amount_remaining / item.budget_amount) * 100).toFixed(2)}%</TableCell>
                      <TableCell className="text-right">
                        <span
                          className={cn(
                            "font-medium",
                            (item.amount_spent / item.budget_amount) * 100 > 90
                              ? "text-red-600"
                              : (item.amount_spent / item.budget_amount) * 100 > 75
                                ? "text-yellow-600"
                                : "text-green-600",
                          )}
                        >
                          {((item.amount_spent / item.budget_amount) * 100).toFixed(2)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <BudgetDialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog} />
    </DashboardLayout>
  )
}

