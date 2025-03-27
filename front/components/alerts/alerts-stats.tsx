"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts"
import { FileDown, Filter, Calendar, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

// Datos de ejemplo para el gráfico de tendencia de alertas
const alertsTrendData = [
  { month: "Ene", creadas: 15, resueltas: 10, activas: 5 },
  { month: "Feb", creadas: 18, resueltas: 12, activas: 11 },
  { month: "Mar", creadas: 20, resueltas: 15, activas: 16 },
  { month: "Abr", creadas: 22, resueltas: 18, activas: 20 },
  { month: "May", creadas: 25, resueltas: 20, activas: 25 },
  { month: "Jun", creadas: 20, resueltas: 22, activas: 23 },
  { month: "Jul", creadas: 18, resueltas: 20, activas: 21 },
  { month: "Ago", creadas: 15, resueltas: 18, activas: 18 },
  { month: "Sep", creadas: 20, resueltas: 19, activas: 19 },
  { month: "Oct", creadas: 22, resueltas: 20, activas: 21 },
  { month: "Nov", creadas: 25, resueltas: 22, activas: 24 },
  { month: "Dic", creadas: 28, resueltas: 24, activas: 28 },
]

// Datos de ejemplo para el gráfico de distribución por severidad
const severityDistributionData = [
  { name: "Alta", value: 12 },
  { name: "Media", value: 8 },
  { name: "Baja", value: 4 },
]

// Datos de ejemplo para el gráfico de tiempo de resolución
const resolutionTimeData = [
  { name: "< 1 día", value: 5 },
  { name: "1-3 días", value: 8 },
  { name: "3-7 días", value: 4 },
  { name: "1-2 semanas", value: 2 },
  { name: "> 2 semanas", value: 1 },
]

// Datos de ejemplo para el gráfico de distribución por tipo
const alertTypeData = [
  { name: "Bajo peso", value: 12 },
  { name: "Estancamiento", value: 8 },
  { name: "Desnutrición", value: 5 },
  { name: "Pérdida de peso", value: 4 },
  { name: "Otros", value: 3 },
]

// Colores para los gráficos
const COLORS = ["#f87171", "#fb923c", "#facc15", "#a3e635", "#4ade80", "#22d3ee"];

export function AlertsStats() {
  const [timeRange, setTimeRange] = useState("year")
  const [center, setCenter] = useState("all")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Alertas</CardTitle>
          <CardDescription>
            Análisis y métricas de alertas nutricionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="timeRange">Período de Tiempo</Label>
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="timeRange">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Último mes</SelectItem>
                  <SelectItem value="quarter">Último trimestre</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                  <SelectItem value="all">Todo el historial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="center">Centro</Label>
              <Select defaultValue={center} onValueChange={setCenter}>
                <SelectTrigger id="center">
                  <SelectValue placeholder="Seleccionar centro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los centros</SelectItem>
                  <SelectItem value="center1">Centro 1</SelectItem>
                  <SelectItem value="center2">Centro 2</SelectItem>
                  <SelectItem value="center3">Centro 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mb-6">
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar Datos
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">248</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+15%</span> vs período anterior
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Alertas Resueltas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">224</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+18%</span> vs período anterior
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Resolución</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">90.3%</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <span className="text-green-500">+2.5%</span> vs período anterior
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Promedio de Resolución</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2.4 días</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingDown className="h-3 w-3 text-green-500" />
                <span className="text-green-500">-0.8 días</span> vs período anterior
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Tendencia de Alertas</CardTitle>
            <CardDescription>Evolución de alertas creadas, resueltas y activas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={alertsTrendData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} alertas`, ""]} />
                  <Legend />
                  <Line type="monotone" dataKey="creadas" stroke="#f87171" name="Alertas Creadas" />
                  <Line type="monotone" dataKey="resueltas" stroke="#4ade80" name="Alertas Resueltas" />
                  <Line type="monotone" dataKey="activas" stroke="#4338ca" name="Alertas Activas" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Severidad</CardTitle>
              <CardDescription>Alertas activas por nivel de severidad</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityDistributionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {severityDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} alertas`, ""]} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tiempo de Resolución</CardTitle>
              <CardDescription>Distribución por tiempo de resolución</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={resolutionTimeData}
                    layout="vertical"
                    margin={{
                      top: 20,
                      right: 30,
                      left: 60,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip formatter={(value) => [`${value} alertas`, ""]} />
                    <Bar dataKey="value" fill="#4338ca" name="Alertas" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribución por Tipo de Alerta</CardTitle>
            <CardDescription>Alertas clasificadas por tipo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={alertTypeData}
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
                  <Tooltip formatter={(value) => [`${value} alertas`, ""]} />
                  <Bar dataKey="value" fill="#f87171" name="Alertas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Análisis de Tendencias</CardTitle>
            <CardDescription>Insights y patrones identificados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Tendencias Positivas
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span>
                      Reducción del 15% en el tiempo promedio de resolución de alertas en los últimos 3 meses.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span>
                      Aumento del 8% en la tasa de resolución de alertas de alta severidad.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  Áreas de Mejora
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span>
                      Incremento del 20% en alertas por estancamiento en crecimiento en niños de 2-3 años.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <span>
                      El 30% de las alertas de alta severidad tardan más de 3 días en ser asignadas.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-500" />
                  Patrones Estacionales
                </h3>
                <p className="text-sm text-muted-foreground">
                  Se observa un incremento del 25% en alertas nutricionales durante los meses de noviembre a febrero, posiblemente relacionado con cambios en patrones alimentarios durante la temporada de vacaciones y festividades.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
