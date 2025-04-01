"use client"

import { useEffect, useState } from "react"
import { CalendarIcon, Download, LineChart, TrendingDown, TrendingUp } from "lucide-react"
import { API_BASE_URL, forecast13week } from "@/services/api/urls"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DashboardLayout } from "@/components/dashboard-layout"
import { ForecastChart } from "@/components/dashboard/forecast-chart"
import { cn } from "@/lib/utils"

// Sample data - replace with actual API data
// const forecastData = [
//   {
//     week: 1,
//     startDate: "2023-03-20",
//     endDate: "2023-03-26",
//     openingBalance: 45000,
//     projectedInflow: 12000,
//     projectedOutflow: 8500,
//     closingBalance: 48500,
//     status: "actual",
//   },
//   {
//     week: 2,
//     startDate: "2023-03-27",
//     endDate: "2023-04-02",
//     openingBalance: 48500,
//     projectedInflow: 8000,
//     projectedOutflow: 9200,
//     closingBalance: 47300,
//     status: "actual",
//   },
//   {
//     week: 3,
//     startDate: "2023-04-03",
//     endDate: "2023-04-09",
//     openingBalance: 47300,
//     projectedInflow: 15000,
//     projectedOutflow: 8800,
//     closingBalance: 53500,
//     status: "current",
//   },
//   {
//     week: 4,
//     startDate: "2023-04-10",
//     endDate: "2023-04-16",
//     openingBalance: 53500,
//     projectedInflow: 10000,
//     projectedOutflow: 12000,
//     closingBalance: 51500,
//     status: "forecast",
//   },
//   {
//     week: 5,
//     startDate: "2023-04-17",
//     endDate: "2023-04-23",
//     openingBalance: 51500,
//     projectedInflow: 9000,
//     projectedOutflow: 8500,
//     closingBalance: 52000,
//     status: "forecast",
//   },
//   {
//     week: 6,
//     startDate: "2023-04-24",
//     endDate: "2023-04-30",
//     openingBalance: 52000,
//     projectedInflow: 8500,
//     projectedOutflow: 9000,
//     closingBalance: 51500,
//     status: "forecast",
//   },
//   {
//     week: 7,
//     startDate: "2023-05-01",
//     endDate: "2023-05-07",
//     openingBalance: 51500,
//     projectedInflow: 12000,
//     projectedOutflow: 8500,
//     closingBalance: 55000,
//     status: "forecast",
//   },
//   {
//     week: 8,
//     startDate: "2023-05-08",
//     endDate: "2023-05-14",
//     openingBalance: 55000,
//     projectedInflow: 9000,
//     projectedOutflow: 10000,
//     closingBalance: 54000,
//     status: "forecast",
//   },
//   {
//     week: 9,
//     startDate: "2023-05-15",
//     endDate: "2023-05-21",
//     openingBalance: 54000,
//     projectedInflow: 8000,
//     projectedOutflow: 9500,
//     closingBalance: 52500,
//     status: "forecast",
//   },
//   {
//     week: 10,
//     startDate: "2023-05-22",
//     endDate: "2023-05-28",
//     openingBalance: 52500,
//     projectedInflow: 15000,
//     projectedOutflow: 8000,
//     closingBalance: 59500,
//     status: "forecast",
//   },
//   {
//     week: 11,
//     startDate: "2023-05-29",
//     endDate: "2023-06-04",
//     openingBalance: 59500,
//     projectedInflow: 10000,
//     projectedOutflow: 12000,
//     closingBalance: 57500,
//     status: "forecast",
//   },
//   {
//     week: 12,
//     startDate: "2023-06-05",
//     endDate: "2023-06-11",
//     openingBalance: 57500,
//     projectedInflow: 9000,
//     projectedOutflow: 8500,
//     closingBalance: 58000,
//     status: "forecast",
//   },
//   {
//     week: 13,
//     startDate: "2023-06-12",
//     endDate: "2023-06-18",
//     openingBalance: 58000,
//     projectedInflow: 12000,
//     projectedOutflow: 9000,
//     closingBalance: 61000,
//     status: "forecast",
//   },
// ]

interface ForecastData {
  week: number
  week_start: string
  week_end: string
  opening_balance: number
  cash_in: number
  cash_out: number
  closing_balance: number
}

export default function ForecastPage() {
  const [showWeeks, setShowWeeks] = useState(13)
  const [forecastData, setForecastData] = useState<ForecastData[]>([])

  useEffect(() => {
    async function fetchForecastData() {
      try {
        const response = await fetch(`${API_BASE_URL}${forecast13week}`, {
          credentials: "include",
        })
        if (!response.ok) {
          throw new Error("Failed to fetch forecast data")
        }
        const data = await response.json()
        // Transform API data to match our UI format
        const transformedData = data.map((item: any, index: number) => ({
          week: index + 1,
          week_start: item.week_start,
          week_end: item.week_end,
          opening_balance: parseFloat(item.opening_balance) || 0,
          cash_in: parseFloat(item.cash_in) || 0,
          cash_out: parseFloat(item.cash_out) || 0,
          closing_balance: parseFloat(item.closing_balance) || 0
        }))
        console.log('Transformed data:', transformedData) // Debug log
        setForecastData(transformedData)
      } catch (error) {
        console.error("Error fetching forecast data:", error)
      }
    }

    fetchForecastData()
  }, [])

  return (
    <DashboardLayout>
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">13-Week Cash Flow Forecast</h2>
            <p className="text-muted-foreground">Projected cash flow for the next 13 weeks</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Update Projections
            </Button>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Cash Balance</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${forecastData[0]?.opening_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">As of current week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projected End Balance</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${forecastData[forecastData.length - 1]?.closing_balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">In 13 weeks</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lowest Projected Balance</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${Math.min(...forecastData.map(week => week.closing_balance)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
              </div>
              <p className="text-xs text-muted-foreground">Lowest point</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Projected Growth</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {forecastData.length > 0 
                  ? `${(((forecastData[forecastData.length - 1]?.closing_balance - forecastData[0]?.opening_balance) / forecastData[0]?.opening_balance) * 100).toFixed(1)}%`
                  : '0.0%'}
              </div>
              <p className="text-xs text-muted-foreground">Over 13 weeks</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Cash Flow Projection</CardTitle>
            <CardDescription>Visualize your projected cash flow over the next 13 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ForecastChart />
          </CardContent>
          <CardFooter>
            <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-blue-500" />
                <span>Projected Balance</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-green-500" />
                <span>Cash Inflow</span>
              </div>
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 rounded-full bg-red-500" />
                <span>Cash Outflow</span>
              </div>
            </div>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Weekly Forecast Details</CardTitle>
              <CardDescription>Detailed breakdown of your 13-week cash flow forecast</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowWeeks(showWeeks === 13 ? 6 : 13)}>
                Show {showWeeks === 13 ? "Less" : "All"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Week</TableHead>
                    <TableHead>Date Range</TableHead>
                    <TableHead className="text-right">Opening Balance</TableHead>
                    <TableHead className="text-right">Projected Inflow</TableHead>
                    <TableHead className="text-right">Projected Outflow</TableHead>
                    <TableHead className="text-right">Closing Balance</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {forecastData.slice(0, showWeeks).map((week) => (
                    <TableRow key={week.week}>
                      <TableCell className="font-medium">
                        Week {week.week}
                      </TableCell>
                      <TableCell>
                        {week.week_start && week.week_end ? 
                          `${new Date(week.week_start).toLocaleDateString()} - ${new Date(week.week_end).toLocaleDateString()}` 
                          : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        ${(week.opening_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        ${(week.cash_in || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(week.cash_out || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(week.closing_balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

