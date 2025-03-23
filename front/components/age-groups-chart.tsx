"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "0-1", peso: 9.5, talla: 75.0 },
  { name: "1-2", peso: 12.0, talla: 85.0 },
  { name: "2-3", peso: 14.2, talla: 92.0 },
  { name: "3-4", peso: 16.5, talla: 100.0 },
  { name: "4-5", peso: 18.5, talla: 107.0 },
  { name: "5-6", peso: 20.7, talla: 113.0 },
]

export function AgeGroupsChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" label={{ value: "Edad (años)", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "Peso (kg)", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value, name) => [value, name === "peso" ? "Peso (kg)" : "Talla (cm)"]} />
        <Legend />
        <Bar dataKey="peso" fill="#4338ca" name="Peso (kg)" />
      </BarChart>
    </ResponsiveContainer>
  )
}

