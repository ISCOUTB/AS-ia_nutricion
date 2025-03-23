"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  {
    name: "Ene",
    total: 16.2,
  },
  {
    name: "Feb",
    total: 16.5,
  },
  {
    name: "Mar",
    total: 16.8,
  },
  {
    name: "Abr",
    total: 17.0,
  },
  {
    name: "May",
    total: 17.2,
  },
  {
    name: "Jun",
    total: 17.5,
  },
  {
    name: "Jul",
    total: 17.8,
  },
  {
    name: "Ago",
    total: 18.0,
  },
  {
    name: "Sep",
    total: 18.2,
  },
  {
    name: "Oct",
    total: 18.3,
  },
  {
    name: "Nov",
    total: 18.4,
  },
  {
    name: "Dic",
    total: 18.5,
  },
]

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}kg`}
        />
        <Tooltip formatter={(value) => [`${value} kg`, "Peso Promedio"]} labelFormatter={(label) => `Mes: ${label}`} />
        <Bar dataKey="total" fill="#4338ca" radius={[4, 4, 0, 0]} className="fill-primary" />
      </BarChart>
    </ResponsiveContainer>
  )
}

