"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "Ene", peso: 16.2, talla: 94.0 },
  { name: "Feb", peso: 16.5, talla: 94.5 },
  { name: "Mar", peso: 16.8, talla: 95.0 },
  { name: "Abr", peso: 17.0, talla: 95.8 },
  { name: "May", peso: 17.2, talla: 96.5 },
  { name: "Jun", peso: 17.5, talla: 97.2 },
  { name: "Jul", peso: 17.8, talla: 98.0 },
  { name: "Ago", peso: 18.0, talla: 98.8 },
  { name: "Sep", peso: 18.2, talla: 99.5 },
  { name: "Oct", peso: 18.3, talla: 100.2 },
  { name: "Nov", peso: 18.4, talla: 101.0 },
  { name: "Dic", peso: 18.5, talla: 102.0 },
]

export function GrowthTrendChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis yAxisId="left" orientation="left" stroke="#4338ca" />
        <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="peso" stroke="#4338ca" activeDot={{ r: 8 }} name="Peso (kg)" />
        <Line yAxisId="right" type="monotone" dataKey="talla" stroke="#10b981" name="Talla (cm)" />
      </LineChart>
    </ResponsiveContainer>
  )
}

