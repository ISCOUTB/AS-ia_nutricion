"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { Download, FileDown, Filter, BarChart2, ArrowRight, Check, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Datos de ejemplo para comparación de centros
const centerComparisonData = [
  { indicator: "Peso Promedio", centro1: 16.8, centro2: 16.2, centro3: 17.1, promedio: 16.7 },
  { indicator: "Talla Promedio", centro1: 98.5, centro2: 97.2, centro3: 99.1, promedio: 98.3 },
  { indicator: "IMC Promedio", centro1: 16.5, centro2: 16.2, centro3: 16.7, promedio: 16.5 },
  { indicator: "% Normal", centro1: 75, centro2: 68, centro3: 82, promedio: 75 },
  { indicator: "% Riesgo", centro1: 15, centro2: 22, centro3: 10, promedio: 16 },
  { indicator: "% Desnutrición", centro1: 10, centro2: 10, centro3: 8, promedio: 9 },
]

// Datos de ejemplo para comparación de grupos de edad
const ageGroupComparisonData = [
  { age: "0-1", peso: 9.5, talla: 75.0, normal: 60, riesgo: 30, desnutricion: 10 },
  { age: "1-2", peso: 12.0, talla: 85.0, normal: 65, riesgo: 25, desnutricion: 10 },
  { age: "2-3", peso: 14.2, talla: 92.0, normal: 70, riesgo: 20, desnutricion: 10 },
  { age: "3-4", peso: 16.5, talla: 100.0, normal: 75, riesgo: 15, desnutricion: 10 },
  { age: "4-5", peso: 18.5, talla: 107.0, normal: 80, riesgo: 15, desnutricion: 5 },
  { age: "5-6", peso: 20.7, talla: 113.0, normal: 85, riesgo: 10, desnutricion: 5 },
]

// Datos de ejemplo para comparación con estándares
const standardsComparisonData = [
  { indicator: "Peso/Edad", actual: 75, estandar: 80, diferencia: -5 },
  { indicator: "Talla/Edad", actual: 78, estandar: 80, diferencia: -2 },
  { indicator: "IMC/Edad", actual: 82, estandar: 80, diferencia: 2 },
  { indicator: "Peso/Talla", actual: 80, estandar: 80, diferencia: 0 },
]

// Datos de ejemplo para comparación de períodos
const periodComparisonData = [
  { indicator: "Peso Promedio", anterior: 16.2, actual: 16.8, cambio: 0.6, porcentaje: 3.7 },
  { indicator: "Talla Promedio", anterior: 96.5, actual: 98.5, cambio: 2.0, porcentaje: 2.1 },
  { indicator: "IMC Promedio", anterior: 16.3, actual: 16.5, cambio: 0.2, porcentaje: 1.2 },
  { indicator: "% Normal", anterior: 68, actual: 75, cambio: 7, porcentaje: 10.3 },
  { indicator: "% Riesgo", anterior: 22, actual: 15, cambio: -7, porcentaje: -31.8 },
  { indicator: "% Desnutrición", anterior: 10, actual: 10, cambio: 0, porcentaje: 0 },
]

export function ComparativeReports() {
  const [comparisonType, setComparisonType] = useState("centers")
  const [period1, setPeriod1] = useState("2023-01")
  const [period2, setPeriod2] = useState("2023-06")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reportes Comparativos</CardTitle>
          <CardDescription>Comparación de indicadores nutricionales entre diferentes grupos y períodos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="comparisonType">Tipo de Comparación</Label>
              <Select defaultValue="centers" onValueChange={setComparisonType}>
                <SelectTrigger id="comparisonType">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="centers">Entre Centros</SelectItem>
                  <SelectItem value="ageGroups">Entre Grupos de Edad</SelectItem>
                  <SelectItem value="standards">Con Estándares</SelectItem>
                  <SelectItem value="periods">Entre Períodos</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="period1">Período 1 / Referencia</Label>
              <Input id="period1" type="month" value={period1} onChange={(e) => setPeriod1(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="period2">Período 2 / Comparación</Label>
              <Input id="period2" type="month" value={period2} onChange={(e) => setPeriod2(e.target.value)} />
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

      <Tabs defaultValue="visual" className="space-y-4">
        <TabsList>
          <TabsTrigger value="visual">Visualización</TabsTrigger>
          <TabsTrigger value="table">Tabla Comparativa</TabsTrigger>
          <TabsTrigger value="radar">Análisis Radar</TabsTrigger>
          <TabsTrigger value="summary">Resumen</TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-4">
          {comparisonType === "centers" && (
            <Card>
              <CardHeader>
                <CardTitle>Comparación entre Centros</CardTitle>
                <CardDescription>Indicadores nutricionales por centro (Enero - Junio 2023)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={centerComparisonData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="indicator" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="centro1" fill="#4338ca" name="Centro 1" />
                      <Bar dataKey="centro2" fill="#6366f1" name="Centro 2" />
                      <Bar dataKey="centro3" fill="#818cf8" name="Centro 3" />
                      <Bar dataKey="promedio" fill="#c7d2fe" name="Promedio" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {comparisonType === "ageGroups" && (
            <Card>
              <CardHeader>
                <CardTitle>Comparación entre Grupos de Edad</CardTitle>
                <CardDescription>Indicadores nutricionales por grupo etario (Enero - Junio 2023)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={ageGroupComparisonData}
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
                      <Bar dataKey="normal" stackId="a" fill="#4ade80" name="Normal (%)" />
                      <Bar dataKey="riesgo" stackId="a" fill="#fb923c" name="Riesgo (%)" />
                      <Bar dataKey="desnutricion" stackId="a" fill="#f87171" name="Desnutrición (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {comparisonType === "standards" && (
            <Card>
              <CardHeader>
                <CardTitle>Comparación con Estándares</CardTitle>
                <CardDescription>Indicadores nutricionales vs. estándares de referencia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={standardsComparisonData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="indicator" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="actual" fill="#4338ca" name="Valor Actual (%)" />
                      <Bar dataKey="estandar" fill="#c7d2fe" name="Estándar (%)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {comparisonType === "periods" && (
            <Card>
              <CardHeader>
                <CardTitle>Comparación entre Períodos</CardTitle>
                <CardDescription>Indicadores nutricionales: Enero 2023 vs. Junio 2023</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={periodComparisonData}
                      layout="vertical"
                      margin={{
                        top: 20,
                        right: 30,
                        left: 100,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis dataKey="indicator" type="category" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="anterior" fill="#c7d2fe" name="Enero 2023" />
                      <Bar dataKey="actual" fill="#4338ca" name="Junio 2023" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tabla Comparativa</CardTitle>
              <CardDescription>Datos detallados para análisis comparativo</CardDescription>
            </CardHeader>
            <CardContent>
              {comparisonType === "centers" && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Indicador</TableHead>
                        <TableHead>Centro 1</TableHead>
                        <TableHead>Centro 2</TableHead>
                        <TableHead>Centro 3</TableHead>
                        <TableHead>Promedio</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {centerComparisonData.map((row) => (
                        <TableRow key={row.indicator}>
                          <TableCell className="font-medium">{row.indicator}</TableCell>
                          <TableCell>{row.centro1}</TableCell>
                          <TableCell>{row.centro2}</TableCell>
                          <TableCell>{row.centro3}</TableCell>
                          <TableCell>{row.promedio}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {comparisonType === "ageGroups" && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Grupo</TableHead>
                        <TableHead>Peso (kg)</TableHead>
                        <TableHead>Talla (cm)</TableHead>
                        <TableHead>Normal (%)</TableHead>
                        <TableHead>Riesgo (%)</TableHead>
                        <TableHead>Desnutrición (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {ageGroupComparisonData.map((row) => (
                        <TableRow key={row.age}>
                          <TableCell className="font-medium">{row.age}</TableCell>
                          <TableCell>{row.peso}</TableCell>
                          <TableCell>{row.talla}</TableCell>
                          <TableCell>{row.normal}</TableCell>
                          <TableCell>{row.riesgo}</TableCell>
                          <TableCell>{row.desnutricion}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {comparisonType === "standards" && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Indicador</TableHead>
                        <TableHead>Valor Actual (%)</TableHead>
                        <TableHead>Estándar (%)</TableHead>
                        <TableHead>Diferencia</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {standardsComparisonData.map((row) => (
                        <TableRow key={row.indicator}>
                          <TableCell className="font-medium">{row.indicator}</TableCell>
                          <TableCell>{row.actual}</TableCell>
                          <TableCell>{row.estandar}</TableCell>
                          <TableCell>{row.diferencia > 0 ? `+${row.diferencia}` : row.diferencia}</TableCell>
                          <TableCell>
                            {row.diferencia >= 0 ? (
                              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                Cumple
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                                No Cumple
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              {comparisonType === "periods" && (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[200px]">Indicador</TableHead>
                        <TableHead>Enero 2023</TableHead>
                        <TableHead>Junio 2023</TableHead>
                        <TableHead>Cambio</TableHead>
                        <TableHead>Cambio (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {periodComparisonData.map((row) => (
                        <TableRow key={row.indicator}>
                          <TableCell className="font-medium">{row.indicator}</TableCell>
                          <TableCell>{row.anterior}</TableCell>
                          <TableCell>{row.actual}</TableCell>
                          <TableCell
                            className={row.cambio > 0 ? "text-green-600" : row.cambio < 0 ? "text-red-600" : ""}
                          >
                            {row.cambio > 0 ? `+${row.cambio}` : row.cambio}
                          </TableCell>
                          <TableCell
                            className={row.porcentaje > 0 ? "text-green-600" : row.porcentaje < 0 ? "text-red-600" : ""}
                          >
                            {row.porcentaje > 0 ? `+${row.porcentaje.toFixed(1)}%` : `${row.porcentaje.toFixed(1)}%`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Radar</CardTitle>
              <CardDescription>Visualización multidimensional de indicadores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[500px]">
                <ResponsiveContainer width="100%" height="100%">
                  {(() => {
                    if (comparisonType === "centers") {
                      return (
                        <RadarChart
                          outerRadius={150}
                          width={500}
                          height={500}
                          data={[
                            { subject: "Peso Promedio", centro1: 90, centro2: 85, centro3: 95 },
                            { subject: "Talla Promedio", centro1: 92, centro2: 90, centro3: 93 },
                            { subject: "IMC Promedio", centro1: 88, centro2: 85, centro3: 90 },
                            { subject: "% Normal", centro1: 75, centro2: 68, centro3: 82 },
                            { subject: "% Riesgo", centro1: 85, centro2: 78, centro3: 90 },
                            { subject: "% Desnutrición", centro1: 90, centro2: 90, centro3: 92 },
                          ]}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="Centro 1" dataKey="centro1" stroke="#4338ca" fill="#4338ca" fillOpacity={0.6} />
                          <Radar name="Centro 2" dataKey="centro2" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                          <Radar name="Centro 3" dataKey="centro3" stroke="#818cf8" fill="#818cf8" fillOpacity={0.6} />
                          <Legend />
                        </RadarChart>
                      )
                    } else if (comparisonType === "ageGroups") {
                      return (
                        <RadarChart
                          outerRadius={150}
                          width={500}
                          height={500}
                          data={[
                            { subject: "Peso", "0-1": 60, "1-2": 70, "2-3": 80, "3-4": 85, "4-5": 90, "5-6": 95 },
                            { subject: "Talla", "0-1": 65, "1-2": 75, "2-3": 82, "3-4": 87, "4-5": 92, "5-6": 97 },
                            { subject: "% Normal", "0-1": 60, "1-2": 65, "2-3": 70, "3-4": 75, "4-5": 80, "5-6": 85 },
                            { subject: "% Riesgo", "0-1": 70, "1-2": 75, "2-3": 80, "3-4": 85, "4-5": 85, "5-6": 90 },
                            {
                              subject: "% Desnutrición",
                              "0-1": 70,
                              "1-2": 75,
                              "2-3": 80,
                              "3-4": 85,
                              "4-5": 90,
                              "5-6": 95,
                            },
                          ]}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar name="0-1 años" dataKey="0-1" stroke="#4338ca" fill="#4338ca" fillOpacity={0.6} />
                          <Radar name="1-2 años" dataKey="1-2" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                          <Radar name="2-3 años" dataKey="2-3" stroke="#818cf8" fill="#818cf8" fillOpacity={0.6} />
                          <Radar name="3-4 años" dataKey="3-4" stroke="#a5b4fc" fill="#a5b4fc" fillOpacity={0.6} />
                          <Radar name="4-5 años" dataKey="4-5" stroke="#c7d2fe" fill="#c7d2fe" fillOpacity={0.6} />
                          <Radar name="5-6 años" dataKey="5-6" stroke="#e0e7ff" fill="#e0e7ff" fillOpacity={0.6} />
                          <Legend />
                        </RadarChart>
                      )
                    } else if (comparisonType === "standards") {
                      return (
                        <RadarChart
                          outerRadius={150}
                          width={500}
                          height={500}
                          data={[
                            { subject: "Peso/Edad", actual: 75, estandar: 80 },
                            { subject: "Talla/Edad", actual: 78, estandar: 80 },
                            { subject: "IMC/Edad", actual: 82, estandar: 80 },
                            { subject: "Peso/Talla", actual: 80, estandar: 80 },
                            { subject: "% Normal", actual: 75, estandar: 80 },
                            { subject: "% Riesgo", actual: 85, estandar: 80 },
                          ]}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name="Valor Actual"
                            dataKey="actual"
                            stroke="#4338ca"
                            fill="#4338ca"
                            fillOpacity={0.6}
                          />
                          <Radar name="Estándar" dataKey="estandar" stroke="#c7d2fe" fill="#c7d2fe" fillOpacity={0.6} />
                          <Legend />
                        </RadarChart>
                      )
                    } else {
                      // Caso por defecto para "periods" o cualquier otro valor
                      return (
                        <RadarChart
                          outerRadius={150}
                          width={500}
                          height={500}
                          data={[
                            { subject: "Peso Promedio", anterior: 80, actual: 85 },
                            { subject: "Talla Promedio", anterior: 82, actual: 87 },
                            { subject: "IMC Promedio", anterior: 85, actual: 88 },
                            { subject: "% Normal", anterior: 68, actual: 75 },
                            { subject: "% Riesgo", anterior: 78, actual: 85 },
                            { subject: "% Desnutrición", anterior: 90, actual: 90 },
                          ]}
                        >
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} />
                          <Radar
                            name="Enero 2023"
                            dataKey="anterior"
                            stroke="#c7d2fe"
                            fill="#c7d2fe"
                            fillOpacity={0.6}
                          />
                          <Radar name="Junio 2023" dataKey="actual" stroke="#4338ca" fill="#4338ca" fillOpacity={0.6} />
                          <Legend />
                        </RadarChart>
                      )
                    }
                  })()}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumen Comparativo</CardTitle>
              <CardDescription>Análisis de hallazgos principales y conclusiones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {comparisonType === "centers" && (
                  <>
                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">Hallazgos Principales</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>
                            El Centro 3 muestra los mejores indicadores nutricionales, con un 82% de niños en estado
                            normal.
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>
                            El Centro 2 presenta el mayor porcentaje de niños en riesgo (22%), sugiriendo la necesidad
                            de intervención.
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>
                            Los tres centros mantienen un porcentaje similar de desnutrición (8-10%), indicando un
                            desafío común.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Centro Destacado</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <BarChart2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Centro 3</div>
                            <div className="text-xs text-muted-foreground">Mejores indicadores generales</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Centro con Desafíos</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Centro 2</div>
                            <div className="text-xs text-muted-foreground">Mayor porcentaje en riesgo</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Recomendación</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Badge variant="outline" className="h-5 border-green-600">
                              Acción
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Compartir prácticas</div>
                            <div className="text-xs text-muted-foreground">Del Centro 3 al Centro 2</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {comparisonType === "ageGroups" && (
                  <>
                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">Hallazgos Principales</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>
                            Se observa una mejora progresiva en el estado nutricional a medida que aumenta la edad.
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>
                            El grupo de 0-1 años presenta el mayor porcentaje de riesgo (30%), requiriendo atención
                            prioritaria.
                          </span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>
                            Los grupos de 4-5 y 5-6 años muestran los mejores indicadores, con 80-85% en estado normal.
                          </span>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Grupo Prioritario</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">0-1 años</div>
                            <div className="text-xs text-muted-foreground">Mayor porcentaje en riesgo</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Grupo Destacado</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <BarChart2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">5-6 años</div>
                            <div className="text-xs text-muted-foreground">Mejores indicadores generales</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Recomendación</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Badge variant="outline" className="h-5 border-green-600">
                              Acción
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Intervención temprana</div>
                            <div className="text-xs text-muted-foreground">Enfoque en 0-1 años</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {comparisonType === "standards" && (
                  <>
                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">Hallazgos Principales</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>El indicador IMC/Edad supera el estándar de referencia en un 2%.</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                            <X className="h-3 w-3" />
                          </div>
                          <span>El indicador Peso/Edad está 5% por debajo del estándar, siendo el más crítico.</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>El indicador Peso/Talla cumple exactamente con el estándar de referencia.</span>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Indicador Destacado</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <BarChart2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">IMC/Edad</div>
                            <div className="text-xs text-muted-foreground">Supera el estándar</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Indicador Crítico</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Peso/Edad</div>
                            <div className="text-xs text-muted-foreground">5% por debajo del estándar</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Recomendación</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Badge variant="outline" className="h-5 border-green-600">
                              Acción
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Plan de mejora</div>
                            <div className="text-xs text-muted-foreground">Enfoque en Peso/Edad</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {comparisonType === "periods" && (
                  <>
                    <div className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">Hallazgos Principales</h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>El porcentaje de niños en estado normal aumentó un 10.3% (de 68% a 75%).</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                            <Check className="h-3 w-3" />
                          </div>
                          <span>El porcentaje de niños en riesgo disminuyó un 31.8% (de 22% a 15%).</span>
                        </li>
                        <li className="flex items-start gap-2 text-sm">
                          <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                          <span>El porcentaje de desnutrición se mantuvo sin cambios (10%).</span>
                        </li>
                      </ul>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Mayor Mejora</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <BarChart2 className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">% Riesgo</div>
                            <div className="text-xs text-green-600">-31.8% de cambio</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Sin Cambios</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                            <ArrowRight className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">% Desnutrición</div>
                            <div className="text-xs text-muted-foreground">0% de cambio</div>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border rounded-md">
                        <h3 className="text-sm font-medium mb-2">Recomendación</h3>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                            <Badge variant="outline" className="h-5 border-green-600">
                              Acción
                            </Badge>
                          </div>
                          <div>
                            <div className="text-sm font-medium">Enfoque específico</div>
                            <div className="text-xs text-muted-foreground">En casos de desnutrición</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Informe Completo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

