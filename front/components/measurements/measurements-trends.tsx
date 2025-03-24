"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// Datos de ejemplo para las tendencias
const monthlyData = [
  { name: "Ene", normal: 65, riesgo: 24, desnutricion: 11 },
  { name: "Feb", normal: 68, riesgo: 22, desnutricion: 10 },
  { name: "Mar", normal: 70, riesgo: 20, desnutricion: 10 },
  { name: "Abr", normal: 72, riesgo: 19, desnutricion: 9 },
  { name: "May", normal: 75, riesgo: 17, desnutricion: 8 },
  { name: "Jun", normal: 78, riesgo: 15, desnutricion: 7 },
]

const ageGroupData = [
  { name: "0-1", normal: 60, riesgo: 30, desnutricion: 10 },
  { name: "1-2", normal: 65, riesgo: 25, desnutricion: 10 },
  { name: "2-3", normal: 70, riesgo: 20, desnutricion: 10 },
  { name: "3-4", normal: 75, riesgo: 15, desnutricion: 10 },
  { name: "4-5", normal: 80, riesgo: 15, desnutricion: 5 },
  { name: "5-6", normal: 85, riesgo: 10, desnutricion: 5 },
]

const statusData = [
  { name: "Normal", value: 75, color: "#4ade80" },
  { name: "Riesgo", value: 17, color: "#fb923c" },
  { name: "Desnutrición", value: 8, color: "#f87171" },
]

export function MeasurementsTrends() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendencias y Análisis</CardTitle>
        <CardDescription>Visualización de tendencias nutricionales y estadísticas</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="monthly" className="space-y-4">
          <TabsList>
            <TabsTrigger value="monthly">Tendencia Mensual</TabsTrigger>
            <TabsTrigger value="age">Por Grupo de Edad</TabsTrigger>
            <TabsTrigger value="status">Estado Actual</TabsTrigger>
          </TabsList>

          <TabsContent value="monthly">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthlyData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="normal" stroke="#4ade80" name="Normal" />
                  <Line type="monotone" dataKey="riesgo" stroke="#fb923c" name="Riesgo" />
                  <Line type="monotone" dataKey="desnutricion" stroke="#f87171" name="Desnutrición" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="age">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ageGroupData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="normal" stackId="a" fill="#4ade80" name="Normal" />
                  <Bar dataKey="riesgo" stackId="a" fill="#fb923c" name="Riesgo" />
                  <Bar dataKey="desnutricion" stackId="a" fill="#f87171" name="Desnutrición" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="status">
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

