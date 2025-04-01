"use client"

import { AlertCircle, AlertTriangle, CalendarClock } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Sample data - replace with actual API data
const alerts = [
  {
    id: "1",
    title: "Potential Cash Shortage",
    description: "Projected cash balance will be below $10,000 in 2 weeks",
    severity: "high",
    date: "2023-03-30",
  },
  {
    id: "2",
    title: "Tax Payment Due",
    description: "Quarterly tax payment of $5,200 due in 10 days",
    severity: "medium",
    date: "2023-03-25",
  },
  {
    id: "3",
    title: "Budget Exceeded",
    description: "Marketing budget exceeded by 15% this month",
    severity: "medium",
    date: "2023-03-20",
  },
]

export function UpcomingAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <Alert
          key={alert.id}
          variant={alert.severity === "high" ? "destructive" : "default"}
          className="flex items-center"
        >
          {alert.severity === "high" ? <AlertCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <div className="ml-3 flex-1">
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <CalendarClock className="mr-1 h-3 w-3" />
            {new Date(alert.date).toLocaleDateString()}
          </div>
        </Alert>
      ))}
    </div>
  )
}

