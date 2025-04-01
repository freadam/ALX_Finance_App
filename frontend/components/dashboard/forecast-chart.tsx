"use client"

import { useTheme } from "next-themes"
import { Bar, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis, ComposedChart } from "recharts"

// Sample data - replace with actual API data
const data = [
  { week: "W1", balance: 45000, inflow: 12000, outflow: 8500 },
  { week: "W2", balance: 48500, inflow: 8000, outflow: 9200 },
  { week: "W3", balance: 47300, inflow: 15000, outflow: 8800 },
  { week: "W4", balance: 53500, inflow: 10000, outflow: 12000 },
  { week: "W5", balance: 51500, inflow: 9000, outflow: 8500 },
  { week: "W6", balance: 52000, inflow: 8500, outflow: 9000 },
  { week: "W7", balance: 51500, inflow: 12000, outflow: 8500 },
  { week: "W8", balance: 55000, inflow: 9000, outflow: 10000 },
  { week: "W9", balance: 54000, inflow: 8000, outflow: 9500 },
  { week: "W10", balance: 52500, inflow: 15000, outflow: 8000 },
  { week: "W11", balance: 59500, inflow: 10000, outflow: 12000 },
  { week: "W12", balance: 57500, inflow: 9000, outflow: 8500 },
  { week: "W13", balance: 58000, inflow: 12000, outflow: 9000 },
]

export function ForecastChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 20,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="week" stroke={textColor} tick={{ fill: textColor }} />
        <YAxis stroke={textColor} tick={{ fill: textColor }} tickFormatter={(value) => `$${value / 1000}k`} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            color: textColor,
          }}
          formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
        />
        <Bar dataKey="inflow" fill="#10b981" name="Cash Inflow" />
        <Bar dataKey="outflow" fill="#ef4444" name="Cash Outflow" />
        <Line
          type="monotone"
          dataKey="balance"
          stroke="#3b82f6"
          strokeWidth={2}
          dot={{ r: 4 }}
          name="Projected Balance"
        />
      </ComposedChart>
    </ResponsiveContainer>
  )
}

