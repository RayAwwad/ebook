"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import type { TooltipProps } from "recharts"
import React from "react"

// ✅ Move tooltip OUTSIDE component
function CustomTooltip({
  active,
  payload,
  label,
}: TooltipProps<number, string>) {
  if (active && payload && payload.length) {
    return (
      <div style={{ padding: 12, backgroundColor: '#1A1A2E', borderRadius: '10px' }}>
        <div style={{ color: "#2196f3", fontSize: 13, marginBottom: 4 }}>
          {label}
        </div>
        <div style={{ fontWeight: 700, fontSize: 15 }}>
          <span style={{ color: "#2196f3" }}>TDEE: {payload[0].value} kcal</span>
        </div>
      </div>
    )
  }
  return null
}

export default function TDEEChart({
  data,
  userLevel,
}: {
  data: { level: string; tdee: number }[]
  userLevel: string
}) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
      >
        <XAxis
          dataKey="level"
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{
            value: "Activity Level",
            position: "insideBottom",
            offset: -10,
            fill: "#9ca3af",
          }}
        />

        <YAxis
          stroke="#9ca3af"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          label={{
            value: "TDEE (kcal)",
            angle: -90,
            position: "insideLeft",
            fill: "#9ca3af",
          }}
        />

        <Tooltip
          content={<CustomTooltip />}
          contentStyle={{
            background: "#162030",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 8,
            color: "#f5f5f5",
          }}
          labelStyle={{ color: "#9ca3af", marginBottom: 4 }}
        />

        <Bar
          dataKey="tdee"
          radius={[6, 6, 0, 0]}
          isAnimationActive
          name="TDEE"
        >
          {data.map((entry, idx) => (
            <Cell
              key={`${entry.level}-${idx}`}
              fill={entry.level === userLevel ? "#9c27b0" : "#2196f3"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}