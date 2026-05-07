"use client"

import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import Box from "@mui/material/Box"

interface ChartDataPoint {
  age: number
  averageWeight: number
  userWeight: number
}

interface WeightComparisonChartProps {
  data: ChartDataPoint[]
  userAge: number
}

export function WeightComparisonChart({ data, userAge }: WeightComparisonChartProps) {
  const primaryColor = "#2196f3"
  const accentColor = "#9c27b0"
  const gridColor = "rgba(255,255,255,0.08)"
  const textColor = "#9ca3af"

  return (
    <Box sx={{ width: "100%", height: 350 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="age" stroke={textColor} fontSize={12} tickLine={false} axisLine={false}
            label={{ value: "Age", position: "insideBottom", offset: -10, fill: textColor }} />
          <YAxis stroke={textColor} fontSize={12} tickLine={false} axisLine={false}
            label={{ value: "Weight (kg)", angle: -90, position: "insideLeft", fill: textColor }}
            domain={["dataMin - 10", "dataMax + 10"]} />
          <Tooltip
            contentStyle={{ background: "#162030", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#f5f5f5" }}
            labelStyle={{ color: "#9ca3af", marginBottom: 4 }}
          />
          <Legend wrapperStyle={{ paddingTop: 20, color: textColor }} />
          <ReferenceLine x={userAge} stroke={primaryColor} strokeDasharray="5 5" strokeWidth={2}
            label={{ value: "You", position: "top", fill: primaryColor, fontSize: 12, fontWeight: 600 }} />
          <Line type="monotone" dataKey="averageWeight" stroke={accentColor} strokeWidth={3}
            dot={false} name="Average Weight" activeDot={{ r: 6, fill: accentColor }} />
          <Line type="monotone" dataKey="userWeight" stroke={primaryColor} strokeWidth={3}
            dot={{ r: 4, fill: primaryColor }} name="Your Weight" activeDot={{ r: 8, fill: primaryColor }} />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}
