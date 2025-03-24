"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
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
  ComposedChart,
  Line,
  LineChart,
} from "recharts"
import { FileDown, Filter, MapPin } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo para distribución por estado nutricional
const nutritionStatusData = [
  { name: "Normal", value: 65, color: "#4ade80" },
  { name: "Riesgo", value: 24, color: "#fb923c" },
  { name: "Desnutrición", value: 11, color: "#f87171" },
]

// Datos de ejemplo para distribución por edad y género
const ageGenderData = [
  { age: "0-1", masculino: 12, femenino: 13 },
  { age: "1-2", masculino: 15, femenino: 17 },
  { age: "2-3", masculino: 18, femenino: 20 },
  { age: "3-4", masculino: 16, femenino: 14 },
  { age: "4-5", masculino: 10, femenino: 10 },
  { age: "5-6", masculino: 6, femenino: 5 },
]

// Datos de ejemplo para tendencias por centro
const centerTrendsData = [
  { month: "Ene", centro1: 75, centro2: 68, centro3: 82 },
  { month: "Feb", centro1: 76, centro2: 70, centro3: 83 },
  { month: "Mar", centro1: 78, centro2: 72, centro3: 81 },
  { month: "Abr", centro1: 80, centro2: 74, centro3: 80 },
  { month: "May", centro1: 82, centro2: 75, centro3: 79 },
  { month: "Jun", centro1: 83, centro2: 78, centro3: 78 },
]

// Datos de ejemplo para distribución geográfica
const geographicData = [
  { region: "Norte", normal: 70, riesgo: 20, desnutricion: 10, total: 120 },
  { region: "Sur", normal: 65, riesgo: 25, desnutricion: 10, total: 150 },
  { region: "Este", normal: 60, riesgo: 30, desnutricion: 10, total: 100 },
  { region: "Oeste", normal: 75, riesgo: 15, desnutricion: 10, total: 130 },
  { region: "Centro", normal: 68, riesgo: 22, desnutricion: 10, total: 200 },
]

export function GroupReports() {
  const [selectedCenter, setSelectedCenter] = useState("todos")
  const [dateRange, setDateRange] = useState({ from: "2023-01-01", to: "2023-06-30" })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reportes Grupales</CardTitle>
          <CardDescription>Análisis agregado de datos nutricionales por grupos y categorías</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="center">Centro</Label>
              <Select defaultValue="todos" onValueChange={setSelectedCenter}>
                <SelectTrigger id="center">
                  <SelectValue placeholder="Seleccionar centro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los centros</SelectItem>
                  <SelectItem value="centro1">Centro 1</SelectItem>
                  <SelectItem value="centro2">Centro 2</SelectItem>
                  <SelectItem value="centro3">Centro 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Desde</Label>
              <Input
                id="dateFrom"
                type="date"
                value={dateRange.from}
                onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">Hasta</Label>
              <Input
                id="dateTo"
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Checkbox id="includeAll" />
            <label
              htmlFor="includeAll"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Incluir todos los grupos de edad
            </label>
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

      <Tabs defaultValue="nutrition" className="space-y-4">
        <TabsList>
          <TabsTrigger value="nutrition">Estado Nutricional</TabsTrigger>
          <TabsTrigger value="demographics">Demografía</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="geographic">Geográfico</TabsTrigger>
        </TabsList>

        <TabsContent value="nutrition" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Estado Nutricional</CardTitle>
                <CardDescription>Porcentaje de niños en cada categoría nutricional</CardDescription>
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
                        outerRadius={100}
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
              <CardFooter>
                <div className="w-full text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Total de niños evaluados:</span>
                    <span className="font-medium">156</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Período:</span>
                    <span className="font-medium">01/01/2023 - 30/06/2023</span>
                  </div>
                </div>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Indicadores</CardTitle>
                <CardDescription>Análisis por diferentes indicadores antropométricos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Peso/Edad", normal: 70, riesgo: 20, desnutricion: 10 },
                        { name: "Talla/Edad", normal: 75, riesgo: 15, desnutricion: 10 },
                        { name: "IMC/Edad", normal: 65, riesgo: 25, desnutricion: 10 },
                        { name: "Peso/Talla", normal: 68, riesgo: 22, desnutricion: 10 },
                      ]}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="normal" stackId="a" fill="#4ade80" name="Normal" />
                      <Bar dataKey="riesgo" stackId="a" fill="#fb923c" name="Riesgo" />
                      <Bar dataKey="desnutricion" stackId="a" fill="#f87171" name="Desnutrición" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Análisis por Grupo de Edad</CardTitle>
              <CardDescription>Estado nutricional distribuido por grupos etarios</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { age: "0-1", normal: 18, riesgo: 5, desnutricion: 2 },
                      { age: "1-2", normal: 25, riesgo: 5, desnutricion: 2 },
                      { age: "2-3", normal: 30, riesgo: 6, desnutricion: 2 },
                      { age: "3-4", normal: 24, riesgo: 4, desnutricion: 2 },
                      { age: "4-5", normal: 16, riesgo: 3, desnutricion: 1 },
                      { age: "5-6", normal: 9, riesgo: 1, desnutricion: 1 },
                    ]}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="normal" stackId="a" fill="#4ade80" name="Normal" />
                    <Bar dataKey="riesgo" stackId="a" fill="#fb923c" name="Riesgo" />
                    <Bar dataKey="desnutricion" stackId="a" fill="#f87171" name="Desnutrición" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Edad y Género</CardTitle>
              <CardDescription>Número de niños por grupo etario y género</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={ageGenderData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="masculino" fill="#93c5fd" name="Masculino" />
                    <Bar dataKey="femenino" fill="#f9a8d4" name="Femenino" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Centro</CardTitle>
                <CardDescription>Número de niños evaluados por centro</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Centro 1", value: 65, color: "#4338ca" },
                          { name: "Centro 2", value: 45, color: "#6366f1" },
                          { name: "Centro 3", value: 46, color: "#818cf8" },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {nutritionStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} niños`, "Cantidad"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución Socioeconómica</CardTitle>
                <CardDescription>Distribución por nivel socioeconómico</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { level: "Bajo", value: 45 },
                        { level: "Medio-Bajo", value: 65 },
                        { level: "Medio", value: 35 },
                        { level: "Medio-Alto", value: 10 },
                        { level: "Alto", value: 1 },
                      ]}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="level" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} niños`, "Cantidad"]} />
                      <Legend />
                      <Bar dataKey="value" fill="#4338ca" name="Niños" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tendencias por Centro</CardTitle>
              <CardDescription>Evolución del porcentaje de niños con estado nutricional normal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={centerTrendsData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[60, 90]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Porcentaje"]} />
                    <Legend />
                    <Line type="monotone" dataKey="centro1" stroke="#4338ca" name="Centro 1" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="centro2" stroke="#6366f1" name="Centro 2" />
                    <Line type="monotone" dataKey="centro3" stroke="#818cf8" name="Centro 3" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Alertas</CardTitle>
                <CardDescription>Tendencia de alertas nutricionales en el tiempo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={[
                        { month: "Ene", alertas: 28, porcentaje: 18 },
                        { month: "Feb", alertas: 26, porcentaje: 17 },
                        { month: "Mar", alertas: 24, porcentaje: 15 },
                        { month: "Abr", alertas: 22, porcentaje: 14 },
                        { month: "May", alertas: 20, porcentaje: 13 },
                        { month: "Jun", alertas: 18, porcentaje: 12 },
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
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="alertas" fill="#f87171" name="Número de alertas" />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="porcentaje"
                        stroke="#4338ca"
                        name="Porcentaje (%)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolución de Cobertura</CardTitle>
                <CardDescription>Porcentaje de niños evaluados respecto a la población total</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={[
                        { month: "Ene", evaluados: 120, cobertura: 60 },
                        { month: "Feb", evaluados: 130, cobertura: 65 },
                        { month: "Mar", evaluados: 140, cobertura: 70 },
                        { month: "Abr", evaluados: 145, cobertura: 73 },
                        { month: "May", evaluados: 150, cobertura: 75 },
                        { month: "Jun", evaluados: 156, cobertura: 78 },
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
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Bar yAxisId="left" dataKey="evaluados" fill="#4338ca" name="Niños evaluados" />
                      <Line yAxisId="right" type="monotone" dataKey="cobertura" stroke="#10b981" name="Cobertura (%)" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribución Geográfica</CardTitle>
              <CardDescription>Estado nutricional por región geográfica</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={geographicData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="normal" stackId="a" fill="#4ade80" name="Normal" />
                    <Bar dataKey="riesgo" stackId="a" fill="#fb923c" name="Riesgo" />
                    <Bar dataKey="desnutricion" stackId="a" fill="#f87171" name="Desnutrición" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Mapa de Calor</CardTitle>
                <CardDescription>Concentración de alertas nutricionales por región</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <div className="p-6 border rounded-md text-center">
                  <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">Mapa interactivo disponible en la versión completa</p>
                  <Button variant="outline" size="sm" className="mt-4">
                    Ver mapa detallado
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Análisis por Comunidad</CardTitle>
                <CardDescription>Comparativa de indicadores por comunidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Comunidad A", normal: 75, riesgo: 15, desnutricion: 10 },
                        { name: "Comunidad B", normal: 65, riesgo: 25, desnutricion: 10 },
                        { name: "Comunidad C", normal: 60, riesgo: 30, desnutricion: 10 },
                        { name: "Comunidad D", normal: 80, riesgo: 15, desnutricion: 5 },
                      ]}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 80,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="normal" stackId="a" fill="#4ade80" name="Normal" />
                      <Bar dataKey="riesgo" stackId="a" fill="#fb923c" name="Riesgo" />
                      <Bar dataKey="desnutricion" stackId="a" fill="#f87171" name="Desnutrición" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

