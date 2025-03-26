"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import { FileDown, Brain, Lightbulb, Search, ArrowRight } from "lucide-react"

// Datos de ejemplo para el análisis de patrones
const correlationData = [
  { x: 8.2, y: 72, z: 10, name: "1 año" },
  { x: 10.5, y: 82, z: 10, name: "2 años" },
  { x: 14.2, y: 92, z: 10, name: "3 años" },
  { x: 16.5, y: 100, z: 10, name: "4 años" },
  { x: 18.5, y: 107, z: 10, name: "5 años" },
]

// Datos de ejemplo para factores de influencia
const influenceFactors = [
  { name: "Alimentación", value: 35 },
  { name: "Actividad Física", value: 20 },
  { name: "Factores Socioeconómicos", value: 15 },
  { name: "Acceso a Servicios", value: 12 },
  { name: "Educación Nutricional", value: 10 },
  { name: "Factores Genéticos", value: 8 },
]

// Datos de ejemplo para patrones por grupo
const groupPatterns = [
  { name: "0-1", normal: 60, riesgo: 30, desnutricion: 10 },
  { name: "1-2", normal: 65, riesgo: 25, desnutricion: 10 },
  { name: "2-3", normal: 70, riesgo: 20, desnutricion: 10 },
  { name: "3-4", normal: 75, riesgo: 15, desnutricion: 10 },
  { name: "4-5", normal: 80, riesgo: 15, desnutricion: 5 },
  { name: "5-6", normal: 85, riesgo: 10, desnutricion: 5 },
]

// Datos de ejemplo para patrones estacionales
const seasonalPatterns = [
  { month: "Ene", peso: 16.2, talla: 94.0, normal: 65 },
  { month: "Feb", peso: 16.5, talla: 94.5, normal: 66 },
  { month: "Mar", peso: 16.8, talla: 95.0, normal: 68 },
  { month: "Abr", peso: 17.0, talla: 95.8, normal: 70 },
  { month: "May", peso: 17.2, talla: 96.5, normal: 72 },
  { month: "Jun", peso: 17.5, talla: 97.2, normal: 73 },
  { month: "Jul", peso: 17.8, talla: 98.0, normal: 72 },
  { month: "Ago", peso: 18.0, talla: 98.8, normal: 70 },
  { month: "Sep", peso: 18.2, talla: 99.5, normal: 68 },
  { month: "Oct", peso: 18.3, talla: 100.2, normal: 67 },
  { month: "Nov", peso: 18.4, talla: 101.0, normal: 66 },
  { month: "Dic", peso: 18.5, talla: 102.0, normal: 65 },
]

// Colores para los gráficos
const COLORS = ["#4ade80", "#fb923c", "#f87171", "#60a5fa", "#c084fc", "#a3e635"]

export function PatternAnalysis() {
  const [analysisType, setAnalysisType] = useState("correlations")
  const [timeRange, setTimeRange] = useState("12m")
  const [dataPoints, setDataPoints] = useState("all")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Análisis de Patrones</CardTitle>
          <CardDescription>Descubrimiento de patrones y correlaciones en los datos nutricionales</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="analysisType">Tipo de Análisis</Label>
              <Select defaultValue={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger id="analysisType">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="correlations">Correlaciones</SelectItem>
                  <SelectItem value="factors">Factores de Influencia</SelectItem>
                  <SelectItem value="groups">Patrones por Grupo</SelectItem>
                  <SelectItem value="seasonal">Patrones Estacionales</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeRange">Período de Tiempo</Label>
              <Select defaultValue={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger id="timeRange">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6m">Últimos 6 meses</SelectItem>
                  <SelectItem value="12m">Último año</SelectItem>
                  <SelectItem value="24m">Últimos 2 años</SelectItem>
                  <SelectItem value="all">Todo el historial</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataPoints">Puntos de Datos</Label>
              <Select defaultValue={dataPoints} onValueChange={setDataPoints}>
                <SelectTrigger id="dataPoints">
                  <SelectValue placeholder="Seleccionar datos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los datos</SelectItem>
                  <SelectItem value="normal">Estado Normal</SelectItem>
                  <SelectItem value="risk">En Riesgo</SelectItem>
                  <SelectItem value="malnutrition">Desnutrición</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2 mb-6">
            <Label>Indicadores a Analizar</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox id="weight" defaultChecked />
                <label
                  htmlFor="weight"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Peso
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="height" defaultChecked />
                <label
                  htmlFor="height"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Talla
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="bmi" defaultChecked />
                <label
                  htmlFor="bmi"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  IMC
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="status" defaultChecked />
                <label
                  htmlFor="status"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Estado Nutricional
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm">
              <Search className="mr-2 h-4 w-4" />
              Analizar Datos
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar Resultados
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysisType === "correlations" && (
        <Card>
          <CardHeader>
            <CardTitle>Correlaciones entre Indicadores</CardTitle>
            <CardDescription>Relación entre peso y talla por grupo de edad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis type="number" dataKey="x" name="Peso (kg)" unit="kg" />
                  <YAxis type="number" dataKey="y" name="Talla (cm)" unit="cm" />
                  <ZAxis type="number" dataKey="z" range={[100, 500]} name="Tamaño" />
                  <Tooltip cursor={{ strokeDasharray: "3 3" }} formatter={(value) => [`${value}`, ""]} />
                  <Legend />
                  <Scatter name="Relación Peso-Talla" data={correlationData} fill="#8884d8">
                    {correlationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="p-4 border rounded-md w-full">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                Patrones Identificados
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Correlación positiva fuerte (r=0.94)</span>
                    <p className="text-xs text-muted-foreground">
                      Existe una correlación positiva fuerte entre el peso y la talla en todos los grupos de edad.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Agrupamiento por edad</span>
                    <p className="text-xs text-muted-foreground">
                      Los datos se agrupan claramente por grupos de edad, con transiciones suaves entre grupos.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Variabilidad creciente</span>
                    <p className="text-xs text-muted-foreground">
                      La variabilidad en la relación peso-talla aumenta con la edad, especialmente después de los 3
                      años.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <Button variant="outline" className="w-full">
              <FileDown className="mr-2 h-4 w-4" />
              Descargar Análisis Completo
            </Button>
          </CardFooter>
        </Card>
      )}

      {analysisType === "factors" && (
        <Card>
          <CardHeader>
            <CardTitle>Factores de Influencia</CardTitle>
            <CardDescription>Análisis de factores que influyen en el estado nutricional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={influenceFactors}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={150}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {influenceFactors.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, "Influencia"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="p-4 border rounded-md w-full">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                Factores Identificados
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Alimentación (35%)</span>
                    <p className="text-xs text-muted-foreground">
                      El factor más influyente en el estado nutricional es la calidad y cantidad de la alimentación.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Actividad Física (20%)</span>
                    <p className="text-xs text-muted-foreground">
                      El segundo factor más importante es el nivel de actividad física regular.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Factores Socioeconómicos (15%)</span>
                    <p className="text-xs text-muted-foreground">
                      Las condiciones socioeconómicas tienen un impacto significativo en el estado nutricional.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <Button variant="outline" className="w-full">
              <FileDown className="mr-2 h-4 w-4" />
              Descargar Análisis Completo
            </Button>
          </CardFooter>
        </Card>
      )}

      {analysisType === "groups" && (
        <Card>
          <CardHeader>
            <CardTitle>Patrones por Grupo de Edad</CardTitle>
            <CardDescription>Análisis de patrones nutricionales por grupo etario</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={groupPatterns}
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
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                  <Legend />
                  <Bar dataKey="normal" stackId="a" fill="#4ade80" name="Normal (%)" />
                  <Bar dataKey="riesgo" stackId="a" fill="#fb923c" name="Riesgo (%)" />
                  <Bar dataKey="desnutricion" stackId="a" fill="#f87171" name="Desnutrición (%)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="p-4 border rounded-md w-full">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                Patrones Identificados
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Mejora progresiva con la edad</span>
                    <p className="text-xs text-muted-foreground">
                      El porcentaje de niños con estado nutricional normal aumenta progresivamente con la edad.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Mayor riesgo en edades tempranas</span>
                    <p className="text-xs text-muted-foreground">
                      Los grupos de 0-1 y 1-2 años presentan los mayores porcentajes de riesgo nutricional.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Reducción de desnutrición en mayores</span>
                    <p className="text-xs text-muted-foreground">
                      La desnutrición se reduce a la mitad en los grupos de 4-5 y 5-6 años comparado con edades menores.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <Button variant="outline" className="w-full">
              <FileDown className="mr-2 h-4 w-4" />
              Descargar Análisis Completo
            </Button>
          </CardFooter>
        </Card>
      )}

      {analysisType === "seasonal" && (
        <Card>
          <CardHeader>
            <CardTitle>Patrones Estacionales</CardTitle>
            <CardDescription>Análisis de variaciones estacionales en indicadores nutricionales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={seasonalPatterns}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis yAxisId="left" orientation="left" />
                  <YAxis yAxisId="right" orientation="right" domain={[60, 75]} />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="peso" fill="#4338ca" name="Peso Promedio (kg)" />
                  <Bar yAxisId="right" dataKey="normal" fill="#4ade80" name="% Estado Normal" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <div className="p-4 border rounded-md w-full">
              <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-600" />
                Patrones Estacionales Identificados
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Mejora en meses de verano</span>
                    <p className="text-xs text-muted-foreground">
                      El porcentaje de niños con estado nutricional normal alcanza su pico en los meses de mayo a julio.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Ciclo anual</span>
                    <p className="text-xs text-muted-foreground">
                      Se observa un patrón cíclico anual en el estado nutricional, con mejoras en la primera mitad del
                      año.
                    </p>
                  </div>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                    <Lightbulb className="h-3 w-3" />
                  </div>
                  <div>
                    <span className="font-medium">Correlación con disponibilidad de alimentos</span>
                    <p className="text-xs text-muted-foreground">
                      Los patrones estacionales correlacionan con la disponibilidad de alimentos frescos en diferentes
                      épocas del año.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            <Button variant="outline" className="w-full">
              <FileDown className="mr-2 h-4 w-4" />
              Descargar Análisis Completo
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

