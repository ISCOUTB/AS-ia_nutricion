"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { AlertTriangle, FileText, TrendingUp, Users, Calendar, ArrowUpRight, ArrowDownRight, Star } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RecentReports } from "@/components/reports/recent-reports"

// Datos de ejemplo para las tarjetas de resumen
const summaryData = [
  {
    title: "Niños Registrados",
    value: "156",
    trend: "+12%",
    trendDirection: "up",
    icon: <Users className="h-5 w-5" />,
  },
  {
    title: "Reportes Generados",
    value: "48",
    trend: "+8%",
    trendDirection: "up",
    icon: <FileText className="h-5 w-5" />,
  },
  {
    title: "Alertas Nutricionales",
    value: "24",
    trend: "-5%",
    trendDirection: "down",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  {
    title: "Tendencia de Peso",
    value: "+0.8kg",
    trend: "Promedio",
    trendDirection: "up",
    icon: <TrendingUp className="h-5 w-5" />,
  },
]

// Datos de ejemplo para el gráfico de estado nutricional
const nutritionStatusData = [
  { name: "Normal", value: 65, color: "#4ade80" },
  { name: "Riesgo", value: 24, color: "#fb923c" },
  { name: "Desnutrición", value: 11, color: "#f87171" },
]

// Datos de ejemplo para el gráfico de tendencia de peso
const weightTrendData = [
  { month: "Ene", weight: 16.2 },
  { month: "Feb", weight: 16.5 },
  { month: "Mar", weight: 16.8 },
  { month: "Abr", weight: 17.0 },
  { month: "May", weight: 17.2 },
  { month: "Jun", weight: 17.5 },
  { month: "Jul", weight: 17.8 },
  { month: "Ago", weight: 18.0 },
  { month: "Sep", weight: 18.2 },
  { month: "Oct", weight: 18.3 },
  { month: "Nov", weight: 18.4 },
  { month: "Dic", weight: 18.5 },
]

// Datos de ejemplo para el gráfico de distribución por edad
const ageDistributionData = [
  { name: "0-1", value: 25 },
  { name: "1-2", value: 32 },
  { name: "2-3", value: 38 },
  { name: "3-4", value: 30 },
  { name: "4-5", value: 20 },
  { name: "5-6", value: 11 },
]

// Datos de ejemplo para niños con alertas
const childrenWithAlerts = [
  {
    id: "5",
    name: "Sofia Martínez",
    age: "1 año",
    gender: "Femenino",
    status: "Desnutrición",
    issue: "Desnutrición aguda",
    severity: "Alta",
  },
  {
    id: "7",
    name: "Pedro Sánchez",
    age: "4 años",
    gender: "Masculino",
    status: "Desnutrición",
    issue: "Bajo peso para la talla",
    severity: "Alta",
  },
  {
    id: "3",
    name: "María Rodríguez",
    age: "2 años",
    gender: "Femenino",
    status: "Riesgo",
    issue: "Bajo peso para la edad",
    severity: "Media",
  },
]

// Datos de ejemplo para reportes destacados
const featuredReports = [
  {
    id: "1",
    title: "Análisis Nutricional Trimestral",
    description: "Resumen del estado nutricional del último trimestre",
    date: "15/03/2023",
    type: "Periódico",
  },
  {
    id: "2",
    title: "Evolución de Indicadores Antropométricos",
    description: "Análisis de tendencias de peso y talla por grupo etario",
    date: "28/02/2023",
    type: "Analítico",
  },
  {
    id: "3",
    title: "Alertas Nutricionales Prioritarias",
    description: "Casos que requieren atención inmediata",
    date: "10/03/2023",
    type: "Alerta",
  },
]

interface ReportsDashboardProps {
  onSelectChild?: (childId: string) => void
}

export function ReportsDashboard({ onSelectChild }: ReportsDashboardProps) {
  return (
    <div className="space-y-6">
      {/* Tarjetas de resumen */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {summaryData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {item.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}</div>
              <p className="text-xs text-muted-foreground flex items-center">
                {item.trendDirection === "up" ? (
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                ) : (
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                )}
                <span className={item.trendDirection === "up" ? "text-green-500" : "text-red-500"}>{item.trend}</span>{" "}
                desde el mes pasado
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos principales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Tendencia de Peso Promedio</CardTitle>
            <CardDescription>Evolución del peso promedio en los últimos 12 meses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={["auto", "auto"]} />
                  <Tooltip formatter={(value) => [`${value} kg`, "Peso Promedio"]} />
                  <Legend />
                  <Line type="monotone" dataKey="weight" stroke="#4338ca" name="Peso (kg)" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Estado Nutricional</CardTitle>
            <CardDescription>Distribución por categorías</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={nutritionStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {nutritionStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sección inferior */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Distribución por Edad</CardTitle>
            <CardDescription>Número de niños por grupo etario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} niños`, "Cantidad"]} />
                  <Legend />
                  <Bar dataKey="value" fill="#4338ca" name="Niños" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-4">
          <Tabs defaultValue="alerts">
            <CardHeader className="pb-0">
              <div className="flex items-center justify-between">
                <CardTitle>Información Destacada</CardTitle>
                <TabsList>
                  <TabsTrigger value="alerts">Alertas</TabsTrigger>
                  <TabsTrigger value="featured">Destacados</TabsTrigger>
                  <TabsTrigger value="recent">Recientes</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <TabsContent value="alerts" className="m-0">
                <div className="space-y-4">
                  {childrenWithAlerts.map((child) => (
                    <div
                      key={child.id}
                      className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                      onClick={() => onSelectChild && onSelectChild(child.id)}
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback
                          className={
                            child.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                          }
                        >
                          {child.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-sm">{child.name}</h4>
                          <Badge
                            variant={child.severity === "Alta" ? "destructive" : "secondary"}
                            className="text-[10px]"
                          >
                            {child.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {child.age} • {child.issue}
                        </p>
                      </div>
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    Ver todas las alertas
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="featured" className="m-0">
                <div className="space-y-4">
                  {featuredReports.map((report) => (
                    <div
                      key={report.id}
                      className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50 cursor-pointer"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                        <Star className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{report.title}</h4>
                        <p className="text-xs text-muted-foreground">{report.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-[10px]">
                            {report.type}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" /> {report.date}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" className="w-full">
                    Ver todos los reportes
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="recent" className="m-0">
                <RecentReports />
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}

