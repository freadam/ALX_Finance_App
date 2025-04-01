"use client"

import { useState } from "react"
import type { DateRange } from "react-day-picker"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { CashFlowChart } from "@/components/dashboard/cash-flow-chart"
import { DateRangePicker } from "@/components/date-range-picker"

export default function CashFlowPage() {
  const [date, setDate] = useState<DateRange | undefined>()

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Cash Flow</h2>
            <p className="text-muted-foreground">Track and analyze your cash inflows and outflows</p>
          </div>
          <DateRangePicker date={date} onDateChange={setDate} />
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="inflows">Inflows</TabsTrigger>
            <TabsTrigger value="outflows">Outflows</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cash Inflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Cash Outflow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600">$32,450.00</div>
                  <p className="text-xs text-muted-foreground">+4.3% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">$12,781.89</div>
                  <p className="text-xs text-muted-foreground">+15.3% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$8,500/mo</div>
                  <p className="text-xs text-muted-foreground">Based on last 3 months average</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cash Flow Overview</CardTitle>
                <CardDescription>Visualize your cash inflows and outflows over time</CardDescription>
              </CardHeader>
              <CardContent>
                <CashFlowChart />
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Top Income Sources</CardTitle>
                  <CardDescription>Your biggest sources of income</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                          <span>Client Payments</span>
                        </div>
                        <span className="font-medium">$32,450</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[75%] rounded-full bg-green-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-green-400" />
                          <span>Investments</span>
                        </div>
                        <span className="font-medium">$10,000</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[25%] rounded-full bg-green-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-green-300" />
                          <span>Grants</span>
                        </div>
                        <span className="font-medium">$2,781</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[10%] rounded-full bg-green-300" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Expenses</CardTitle>
                  <CardDescription>Your biggest expense categories</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
                          <span>Salaries</span>
                        </div>
                        <span className="font-medium">$18,500</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[60%] rounded-full bg-red-500" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-red-400" />
                          <span>Rent</span>
                        </div>
                        <span className="font-medium">$5,000</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[20%] rounded-full bg-red-400" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-red-300" />
                          <span>Marketing</span>
                        </div>
                        <span className="font-medium">$4,500</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[15%] rounded-full bg-red-300" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <div className="mr-2 h-3 w-3 rounded-full bg-red-200" />
                          <span>Software</span>
                        </div>
                        <span className="font-medium">$2,450</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted">
                        <div className="h-full w-[10%] rounded-full bg-red-200" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="inflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cash Inflows</CardTitle>
                <CardDescription>Detailed breakdown of your income sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">{/* Detailed inflows chart would go here */}</div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="outflows" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Cash Outflows</CardTitle>
                <CardDescription>Detailed breakdown of your expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">{/* Detailed outflows chart would go here */}</div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

