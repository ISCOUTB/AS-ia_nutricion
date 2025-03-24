"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { Download, FileDown, Filter, TrendingUp, TrendingDown, AlertTriangle, ArrowRight } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para tendencias de peso
const weightTrendData = [
  { month: "Ene 2022", avg: 15.2, p25: 13.5, p75: 16.8 },
  { month: "Feb 2022", avg: 15.3, p25: 13.6, p75: 16.9 },
  { month: "Mar 2022", avg: 15.5, p25: 13.8, p75: 17.0 },
  { month: "Abr 2022", avg: 15.6, p25: 13.9, p75: 17.1 },
  { month: "May 2022", avg: 15.8, p25: 14.0, p75: 17.2 },
  { month: "Jun 2022", avg: 15.9, p25: 14.1, p75: 17.3 },
  { month: "Jul 2022", avg: 16.0, p25: 14.2, p75: 17.4 },
  { month: "Ago 2022", avg: 16.1, p25: 14.3, p75: 17.5 },
  { month: "Sep 2022", avg: 16.2, p25: 14.4, p75: 17.6 },
  { month: "Oct 2022", avg: 16.3, p25: 14.5, p75: 17.7 },
  { month: "Nov 2022", avg: 16.4, p25: 14.6, p75: 17.8 },
  { month: "Dic 2022", avg: 16.5, p25: 14.7, p75: 17.9 },
  { month: "Ene 2023", avg: 16.6, p25: 14.8, p75: 18.0 },
  { month: "Feb 2023", avg: 16.7, p25: 14.9, p75: 18.1 },
  { month: "Mar 2023", avg: 16.8, p25: 15.0, p75: 18.2 },
  { month: "Abr 2023", avg: 16.9, p25: 15.1, p75: 18.3 },
  { month: "May 2023", avg: 17.0, p25: 15.2, p75: 18.4 },
  { month: "Jun 2023", avg: 17.1, p25: 15.3, p75: 18.5 },
]

// Datos de ejemplo para tendencias de estado nutricional
const nutritionalStatusTrendData = [
  { month: "Ene 2022", normal: 60, riesgo: 30, desnutricion: 10 },
  { month: "Feb 2022", normal: 61, riesgo: 29, desnutricion: 10 },
  { month: "Mar 2022", normal: 62, riesgo: 28, desnutricion: 10 },
  { month: "Abr 2022", normal: 62, riesgo: 28, desnutricion: 10 },
  { month: "May 2022", normal: 63, riesgo: 27, desnutricion: 10 },
  { month: "Jun 2022", normal: 64, riesgo: 26, desnutricion: 10 },
  { month: "Jul 2022", normal: 64, riesgo: 26, desnutricion: 10 },
  { month: "Ago 2022", normal: 65, riesgo: 25, desnutricion: 10 },
  { month: "Sep 2022", normal: 65, riesgo: 25, desnutricion: 10 },
  { month: "Oct 2022", normal: 66, riesgo: 24, desnutricion: 10 },
  { month: "Nov 2022", normal: 66, riesgo: 24, desnutricion: 10 },
  { month: "Dic 2022", normal: 67, riesgo: 23, desnutricion: 10 },
  { month: "Ene 2023", normal: 67, riesgo: 23, desnutricion: 10 },
  { month: "Feb 2023", normal: 68, riesgo: 22, desnutricion: 10 },
  { month: "Mar 2023", normal: 68, riesgo: 22, desnutricion: 10 },
  { month: "Abr 2023", normal: 69, riesgo: 21, desnutricion: 10 },
  { month: "May 2023", normal: 69, riesgo: 21, desnutricion: 10 },
  { month: "Jun 2023", normal: 70, riesgo: 20, desnutricion: 10 },
]

// Datos de ejemplo para tendencias de alertas
const alertsTrendData = [
  { month: "Ene 2022", alertas: 40, porcentaje: 25 },
  { month: "Feb 2022", alertas: 39, porcentaje: 24 },
  { month: "Mar 2022", alertas: 38, porcentaje: 24 },
  { month: "Abr 2022", alertas: 38, porcentaje: 24 },
  { month: "May 2022", alertas: 37, porcentaje: 23 },
  { month: "Jun 2022", alertas: 36, porcentaje: 23 },
  { month: "Jul 2022", alertas: 36, porcentaje: 23 },
  { month: "Ago 2022", alertas: 35, porcentaje: 22 },
  { month: "Sep 2022", alertas: 35, porcentaje: 22 },
  { month: "Oct 2022", alertas: 34, porcentaje: 21 },
  { month: "Nov 2022", alertas: 34, porcentaje: 21 },
  { month: "Dic 2022", alertas: 33, porcentaje: 21 },
  { month: "Ene 2023", alertas: 33, porcentaje: 21 },
  { month: "Feb 2023", alertas: 32, porcentaje: 20 },
  { month: "Mar 2023", alertas: 32, porcentaje: 20 },
  { month: "Abr 2023", alertas: 31, porcentaje: 20 },
  { month: "May 2023", alertas: 31, porcentaje: 20 },
  { month: "Jun 2023", alertas: 30, porcentaje: 19 },
]

export function TrendReports() {
  const [timeRange, setTimeRange] = useState("18m")
  const [indicator, setIndicator] = useState("weight")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Tendencias</CardTitle>
          <CardDescription>Evolución de indicadores nutricionales a lo largo del tiempo</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="timeRange">Período de Tiempo</Label>
              <Select defaultValue="18m" onValueChange={setTimeRange}>
                <SelectTrigger id="timeRange">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="12m">Último año</SelectItem>
                  <SelectItem value="18m">Últimos 18 meses</SelectItem>
                  <SelectItem value="24m">Últimos 2 años</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="indicator">Indicador Principal</Label>
              <Select defaultValue="weight" onValueChange={setIndicator}>
                <SelectTrigger id="indicator">
                  <SelectValue placeholder="Seleccionar indicador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight">Peso</SelectItem>
                  <SelectItem value="height">Talla</SelectItem>
                  <SelectItem value="bmi">IMC</SelectItem>
                  <SelectItem value="status">Estado Nutricional</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ageGroup">Grupo de Edad</Label>
              <Select defaultValue="all">
                <SelectTrigger id="ageGroup">
                  <SelectValue placeholder="Seleccionar grupo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="0-1">0-1 años</SelectItem>
                  <SelectItem value="1-2">1-2 años</SelectItem>
                  <SelectItem value="2-3">2-3 años</SelectItem>
                  <SelectItem value="3-4">3-4 años</SelectItem>
                  <SelectItem value="4-5">4-5 años</SelectItem>
                  <SelectItem value="5-6">5-6 años</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
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

      <Tabs defaultValue="weight" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weight">Peso</TabsTrigger>
          <TabsTrigger value="status">Estado Nutricional</TabsTrigger>
          <TabsTrigger value="alerts">Alertas</TabsTrigger>
          <TabsTrigger value="seasonal">Estacionalidad</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Peso Promedio</CardTitle>
              <CardDescription>Evolución del peso promedio en los últimos 18 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={weightTrendData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={["auto", "auto"]} />
                    <Tooltip formatter={(value) => [`${value} kg`, ""]} />
                    <Legend />
                    <defs>
                      <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4338ca" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4338ca" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="p75"
                      stroke="#c7d2fe"
                      fill="#c7d2fe"
                      fillOpacity={0.3}
                      name="Percentil 75"
                    />
                    <Area
                      type="monotone"
                      dataKey="p25"
                      stroke="#c7d2fe"
                      fill="#ffffff"
                      fillOpacity={0.3}
                      name="Percentil 25"
                    />
                    <Line
                      type="monotone"
                      dataKey="avg"
                      stroke="#4338ca"
                      strokeWidth={2}
                      name="Peso Promedio (kg)"
                      dot={{ r: 3 }}
                      activeDot={{ r: 8 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Tendencia</div>
                    <div className="text-xs text-muted-foreground">Incremento constante</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Variación</div>
                    <div className="text-xs text-muted-foreground">+1.9 kg en 18 meses</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Badge variant="outline" className="h-5 border-green-600">
                      Normal
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Evaluación</div>
                    <div className="text-xs text-muted-foreground">Dentro de parámetros esperados</div>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Estado Nutricional</CardTitle>
              <CardDescription>Evolución del porcentaje de niños en cada categoría nutricional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={nutritionalStatusTrendData}
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
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <defs>
                      <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4ade80" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorRiesgo" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb923c" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#fb923c" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorDesnutricion" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f87171" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="normal"
                      stroke="#4ade80"
                      fillOpacity={1}
                      fill="url(#colorNormal)"
                      name="Normal (%)"
                    />
                    <Area
                      type="monotone"
                      dataKey="riesgo"
                      stroke="#fb923c"
                      fillOpacity={1}
                      fill="url(#colorRiesgo)"
                      name="Riesgo (%)"
                    />
                    <Area
                      type="monotone"
                      dataKey="desnutricion"
                      stroke="#f87171"
                      fillOpacity={1}
                      fill="url(#colorDesnutricion)"
                      name="Desnutrición (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Normal</div>
                    <div className="text-xs text-green-600">+10% en 18 meses</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                    <TrendingDown className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Riesgo</div>
                    <div className="text-xs text-orange-600">-10% en 18 meses</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Desnutrición</div>
                    <div className="text-xs text-muted-foreground">Sin cambios significativos</div>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Alertas Nutricionales</CardTitle>
              <CardDescription>Evolución del número y porcentaje de alertas nutricionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
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
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="alertas"
                      stroke="#f87171"
                      name="Número de alertas"
                      activeDot={{ r: 8 }}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="porcentaje" stroke="#4338ca" name="Porcentaje (%)" />
                    <ReferenceLine yAxisId="right" y={20} stroke="#6b7280" strokeDasharray="3 3" label="Meta: 20%" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <TrendingDown className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Tendencia</div>
                    <div className="text-xs text-green-600">Disminución constante</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Reducción</div>
                    <div className="text-xs text-muted-foreground">-10 alertas en 18 meses</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 border rounded-md">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <Badge variant="outline" className="h-5 border-green-600">
                      Meta
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Evaluación</div>
                    <div className="text-xs text-muted-foreground">Meta alcanzada en Jun 2023</div>
                  </div>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis de Estacionalidad</CardTitle>
              <CardDescription>Patrones estacionales en indicadores nutricionales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: "Ene", "2022": 15.2, "2023": 16.6 },
                      { month: "Feb", "2022": 15.3, "2023": 16.7 },
                      { month: "Mar", "2022": 15.5, "2023": 16.8 },
                      { month: "Abr", "2022": 15.6, "2023": 16.9 },
                      { month: "May", "2022": 15.8, "2023": 17.0 },
                      { month: "Jun", "2022": 15.9, "2023": 17.1 },
                      { month: "Jul", "2022": 16.0, "2023": null },
                      { month: "Ago", "2022": 16.1, "2023": null },
                      { month: "Sep", "2022": 16.2, "2023": null },
                      { month: "Oct", "2022": 16.3, "2023": null },
                      { month: "Nov", "2022": 16.4, "2023": null },
                      { month: "Dic", "2022": 16.5, "2023": null },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[15, 17.5]} />
                    <Tooltip formatter={(value) => [`${value} kg`, ""]} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="2022"
                      stroke="#6366f1"
                      name="Peso Promedio 2022"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="2023"
                      stroke="#4338ca"
                      name="Peso Promedio 2023"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter>
              <div className="space-y-4 w-full">
                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Análisis de Estacionalidad</h3>
                  <p className="text-sm text-muted-foreground">
                    Se observa un patrón estacional con incrementos más significativos durante los meses de marzo a
                    mayo, posiblemente relacionados con cambios en la disponibilidad de alimentos o factores climáticos.
                    La comparación interanual muestra una mejora consistente en los indicadores nutricionales.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar Análisis Completo
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

