"use client"

import { useTheme } from "next-themes"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data - replace with actual API data
const data = [
  { name: "Jan", inflow: 4000, outflow: 2400 },
  { name: "Feb", inflow: 3000, outflow: 1398 },
  { name: "Mar", inflow: 2000, outflow: 9800 },
  { name: "Apr", inflow: 2780, outflow: 3908 },
  { name: "May", inflow: 1890, outflow: 4800 },
  { name: "Jun", inflow: 2390, outflow: 3800 },
  { name: "Jul", inflow: 3490, outflow: 4300 },
  { name: "Aug", inflow: 4000, outflow: 2400 },
  { name: "Sep", inflow: 3000, outflow: 1398 },
  { name: "Oct", inflow: 2000, outflow: 9800 },
  { name: "Nov", inflow: 2780, outflow: 3908 },
  { name: "Dec", inflow: 1890, outflow: 4800 },
]

export function CashFlowChart() {
  const { theme } = useTheme()
  const isDark = theme === "dark"

  const textColor = isDark ? "#f8fafc" : "#0f172a"
  const gridColor = isDark ? "#334155" : "#e2e8f0"

  return (
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" stroke={textColor} tick={{ fill: textColor }} />
        <YAxis stroke={textColor} tick={{ fill: textColor }} tickFormatter={(value) => `$${value}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            color: textColor,
          }}
          formatter={(value) => [`$${value}`, undefined]}
        />
        <Area
          type="monotone"
          dataKey="inflow"
          stackId="1"
          stroke="#10b981"
          fill="#10b981"
          fillOpacity={0.6}
          name="Cash In"
        />
        <Area
          type="monotone"
          dataKey="outflow"
          stackId="2"
          stroke="#ef4444"
          fill="#ef4444"
          fillOpacity={0.6}
          name="Cash Out"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

