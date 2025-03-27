"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  PieChart,
  Pie,
  Cell
} from "recharts"
import { AlertTriangle, Calendar, Clock, Filter, FileDown, ArrowRight, CheckCircle, XCircle } from 'lucide-react'

// Datos de ejemplo para el gráfico de alertas por tipo
const alertsByTypeData = [
  { name: "Bajo peso", value: 12 },
  { name: "Estancamiento", value: 8 },
  { name: "Desnutrición", value: 5 },
  { name: "Pérdida de peso", value: 4 },
  { name: "Otros", value: 3 },
]

// Datos de ejemplo para el gráfico de alertas por grupo de edad
const alertsByAgeData = [
  { name: "0-1", value: 8 },
  { name: "1-2", value: 10 },
  { name: "2-3", value: 6 },
  { name: "3-4", value: 4 },
  { name: "4-5", value: 3 },
  { name: "5-6", value: 1 },
]

// Datos de ejemplo para el gráfico de alertas por mes
const alertsByMonthData = [
  { name: "Ene", value: 10 },
  { name: "Feb", value: 12 },
  { name: "Mar", value: 15 },
  { name: "Abr", value: 14 },
  { name: "May", value: 18 },
  { name: "Jun", value: 16 },
  { name: "Jul", value: 14 },
  { name: "Ago", value: 12 },
  { name: "Sep", value: 15 },
  { name: "Oct", value: 18 },
  { name: "Nov", value: 20 },
  { name: "Dic", value: 24 },
]

// Datos de ejemplo para alertas recientes
const recentAlertsData = [
  {
    id: "A001",
    childName: "María Rodríguez",
    childId: "C003",
    age: "2 años",
    gender: "Femenino",
    alertType: "Bajo peso para la edad",
    severity: "Alta",
    status: "Pendiente",
    createdAt: "18/03/2023 10:15",
    assignedTo: "Dr. Martínez",
  },
  {
    id: "A002",
    childName: "Sofia Martínez",
    childId: "C005",
    age: "1 año",
    gender: "Femenino",
    alertType: "Desnutrición aguda",
    severity: "Alta",
    status: "En revisión",
    createdAt: "22/03/2023 09:30",
    assignedTo: "Dra. Gómez",
  },
  {
    id: "A003",
    childName: "Luis Gómez",
    childId: "C006",
    age: "3 años",
    gender: "Masculino",
    alertType: "Estancamiento en crecimiento",
    severity: "Media",
    status: "Pendiente",
    createdAt: "25/03/2023 14:45",
    assignedTo: "Sin asignar",
  },
  {
    id: "A004",
    childName: "Pedro Sánchez",
    childId: "C007",
    age: "4 años",
    gender: "Masculino",
    alertType: "Bajo peso para la talla",
    severity: "Alta",
    status: "En revisión",
    createdAt: "27/03/2023 11:20",
    assignedTo: "Dr. Martínez",
  },
  {
    id: "A005",
    childName: "Ana Torres",
    childId: "C008",
    age: "2 años",
    gender: "Femenino",
    alertType: "Riesgo de desnutrición",
    severity: "Media",
    status: "Pendiente",
    createdAt: "30/03/2023 16:10",
    assignedTo: "Sin asignar",
  },
]

// Colores para los gráficos
const COLORS = ["#f87171", "#fb923c", "#facc15", "#a3e635", "#4ade80", "#22d3ee"];

export function AlertsDashboard() {
  const [timeRange, setTimeRange] = useState("30d")
  const [alertType, setAlertType] = useState("all")
  const [center, setCenter] = useState("all")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Panel de Alertas</CardTitle>
          <CardDescription>
            Resumen y análisis de alertas nutricionales activas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="timeRange">Período de Tiempo</Label>
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="timeRange">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Últimos 7 días</SelectItem>
                  <SelectItem value="30d">Últimos 30 días</SelectItem>
                  <SelectItem value="90d">Últimos 90 días</SelectItem>
                  <SelectItem value="year">Último año</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alertType">Tipo de Alerta</Label>
              <Select defaultValue={alertType} onValueChange={setAlertType}>
                <SelectTrigger id="alertType">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las alertas</SelectItem>
                  <SelectItem value="weight">Bajo peso</SelectItem>
                  <SelectItem value="stagnation">Estancamiento</SelectItem>
                  <SelectItem value="malnutrition">Desnutrición</SelectItem>
                  <SelectItem value="weightLoss">Pérdida de peso</SelectItem>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Alertas por Tipo</CardTitle>
            <CardDescription>Distribución de alertas activas por categoría</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={alertsByTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {alertsByTypeData.map((entry, index) => (
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
            <CardTitle>Alertas por Grupo de Edad</CardTitle>
            <CardDescription>Distribución de alertas por grupo etario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={alertsByAgeData}
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
            <CardTitle>Tendencia de Alertas</CardTitle>
            <CardDescription>Evolución de alertas en los últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={alertsByMonthData}
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
                  <Bar dataKey="value" fill="#4338ca" name="Alertas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas Recientes</CardTitle>
          <CardDescription>Últimas alertas generadas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentAlertsData.map((alert) => (
              <div key={alert.id} className="p-4 border rounded-md">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    alert.severity === "Alta" 
                      ? "bg-red-100 text-red-600" 
                      : "bg-amber-100 text-amber-600"
                  }`}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{alert.alertType}</h3>
                        <Badge 
                          variant={alert.severity === "Alta" ? "destructive" : "secondary"}
                        >
                          {alert.severity}
                        </Badge>
                        <Badge 
                          variant={
                            alert.status === "Pendiente" 
                              ? "outline" 
                              : alert.status === "En revisión" 
                                ? "secondary" 
                                : "default"
                          }
                        >
                          {alert.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {alert.createdAt}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback
                          className={
                            alert.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                          }
                        >
                          {alert.childName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{alert.childName}</span>
                      <span className="text-xs text-muted-foreground">
                        {alert.age} • ID: {alert.childId}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        Asignado a: {alert.assignedTo}
                      </div>
                      <Button variant="outline" size="sm">
                        Ver detalles
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver todas las alertas
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acciones Prioritarias</CardTitle>
          <CardDescription>Acciones recomendadas para las alertas más críticas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border rounded-md border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                Alertas Críticas que Requieren Acción Inmediata
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                    <XCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Sofia Martínez (1 año) - Desnutrición aguda</span>
                    <p className="text-xs text-muted-foreground">
                      Requiere evaluación médica inmediata y plan de intervención nutricional.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                    <XCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Pedro Sánchez (4 años) - Bajo peso para la talla</span>
                    <p className="text-xs text-muted-foreground">
                      Pérdida significativa de peso en los últimos 2 meses. Requiere evaluación.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-md border-amber-200 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Alertas que Requieren Seguimiento
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">María Rodríguez (2 años) - Bajo peso para la edad</span>
                    <p className="text-xs text-muted-foreground">
                      Programar evaluación nutricional en los próximos 7 días.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Luis Gómez (3 años) - Estancamiento en crecimiento</span>
                    <p className="text-xs text-muted-foreground">
                      Revisar historial de mediciones y programar seguimiento.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="p-4 border rounded-md">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                Alertas Recientemente Resueltas
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Carlos López (4 años) - Riesgo de bajo peso</span>
                    <p className="text-xs text-muted-foreground">
                      Alerta resuelta tras implementación de plan nutricional. Seguimiento regular programado.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Ana García (3 años) - Estancamiento temporal</span>
                    <p className="text-xs text-muted-foreground">
                      Recuperó trayectoria de crecimiento normal tras intervención.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <Calendar className="mr-2 h-4 w-4" />
            Programar seguimiento
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
