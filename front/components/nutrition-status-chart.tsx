"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

const data = [
  { name: "Normal", value: 65 },
  { name: "Riesgo", value: 24 },
  { name: "Desnutrición", value: 11 },
]

const COLORS = ["#4ade80", "#fb923c", "#f87171"]

export function NutritionStatusChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

