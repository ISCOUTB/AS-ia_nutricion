"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from "recharts"
import { FileDown, TrendingUp, Calendar, AlertTriangle, Info, ArrowRight } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Datos de ejemplo para las predicciones
const predictionData = [
  { age: "3a 0m", actual: 15.2, predicted: null, lower: null, upper: null },
  { age: "3a 1m", actual: 15.4, predicted: null, lower: null, upper: null },
  { age: "3a 2m", actual: 15.7, predicted: null, lower: null, upper: null },
  { age: "3a 3m", actual: 16.0, predicted: null, lower: null, upper: null },
  { age: "3a 4m", actual: 16.2, predicted: null, lower: null, upper: null },
  { age: "3a 5m", actual: 16.5, predicted: null, lower: null, upper: null },
  { age: "3a 6m", actual: 16.8, predicted: 16.8, lower: 16.8, upper: 16.8 },
  { age: "3a 7m", actual: null, predicted: 17.1, lower: 16.9, upper: 17.3 },
  { age: "3a 8m", actual: null, predicted: 17.4, lower: 17.1, upper: 17.7 },
  { age: "3a 9m", actual: null, predicted: 17.7, lower: 17.3, upper: 18.1 },
  { age: "3a 10m", actual: null, predicted: 18.0, lower: 17.5, upper: 18.5 },
  { age: "3a 11m", actual: null, predicted: 18.3, lower: 17.7, upper: 18.9 },
  { age: "4a 0m", actual: null, predicted: 18.6, lower: 17.9, upper: 19.3 },
]

// Datos de ejemplo para las predicciones de talla
const heightPredictionData = [
  { age: "3a 0m", actual: 95.0, predicted: null, lower: null, upper: null },
  { age: "3a 1m", actual: 95.5, predicted: null, lower: null, upper: null },
  { age: "3a 2m", actual: 96.0, predicted: null, lower: null, upper: null },
  { age: "3a 3m", actual: 96.5, predicted: null, lower: null, upper: null },
  { age: "3a 4m", actual: 97.0, predicted: null, lower: null, upper: null },
  { age: "3a 5m", actual: 97.5, predicted: null, lower: null, upper: null },
  { age: "3a 6m", actual: 98.0, predicted: 98.0, lower: 98.0, upper: 98.0 },
  { age: "3a 7m", actual: null, predicted: 98.5, lower: 98.2, upper: 98.8 },
  { age: "3a 8m", actual: null, predicted: 99.0, lower: 98.5, upper: 99.5 },
  { age: "3a 9m", actual: null, predicted: 99.5, lower: 98.8, upper: 100.2 },
  { age: "3a 10m", actual: null, predicted: 100.0, lower: 99.1, upper: 100.9 },
  { age: "3a 11m", actual: null, predicted: 100.5, lower: 99.4, upper: 101.6 },
  { age: "4a 0m", actual: null, predicted: 101.0, lower: 99.7, upper: 102.3 },
]

// Datos de ejemplo para las predicciones de IMC
const bmiPredictionData = [
  { age: "3a 0m", actual: 16.8, predicted: null, lower: null, upper: null },
  { age: "3a 1m", actual: 16.8, predicted: null, lower: null, upper: null },
  { age: "3a 2m", actual: 17.0, predicted: null, lower: null, upper: null },
  { age: "3a 3m", actual: 17.2, predicted: null, lower: null, upper: null },
  { age: "3a 4m", actual: 17.2, predicted: null, lower: null, upper: null },
  { age: "3a 5m", actual: 17.3, predicted: null, lower: null, upper: null },
  { age: "3a 6m", actual: 17.5, predicted: 17.5, lower: 17.5, upper: 17.5 },
  { age: "3a 7m", actual: null, predicted: 17.6, lower: 17.3, upper: 17.9 },
  { age: "3a 8m", actual: null, predicted: 17.7, lower: 17.2, upper: 18.2 },
  { age: "3a 9m", actual: null, predicted: 17.8, lower: 17.1, upper: 18.5 },
  { age: "3a 10m", actual: null, predicted: 18.0, lower: 17.0, upper: 19.0 },
  { age: "3a 11m", actual: null, predicted: 18.1, lower: 16.9, upper: 19.3 },
  { age: "4a 0m", actual: null, predicted: 18.2, lower: 16.8, upper: 19.6 },
]

export function PredictionDashboard() {
  const [selectedChild, setSelectedChild] = useState("ana-garcia")
  const [predictionPeriod, setPredictionPeriod] = useState("6")
  const [confidenceLevel, setConfidenceLevel] = useState("90")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Predicciones de Crecimiento</CardTitle>
          <CardDescription>
            Proyecciones basadas en el historial de mediciones y patrones de crecimiento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="childSelect">Seleccionar Niño</Label>
              <Select defaultValue={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger id="childSelect">
                  <SelectValue placeholder="Seleccionar niño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ana-garcia">Ana García (3 años)</SelectItem>
                  <SelectItem value="carlos-lopez">Carlos López (4 años)</SelectItem>
                  <SelectItem value="maria-rodriguez">María Rodríguez (2 años)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="predictionPeriod">Período de Predicción</Label>
              <Select defaultValue={predictionPeriod} onValueChange={setPredictionPeriod}>
                <SelectTrigger id="predictionPeriod">
                  <SelectValue placeholder="Seleccionar período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 meses</SelectItem>
                  <SelectItem value="6">6 meses</SelectItem>
                  <SelectItem value="12">12 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confidenceLevel">Nivel de Confianza</Label>
              <Select defaultValue={confidenceLevel} onValueChange={setConfidenceLevel}>
                <SelectTrigger id="confidenceLevel">
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="80">80%</SelectItem>
                  <SelectItem value="90">90%</SelectItem>
                  <SelectItem value="95">95%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarFallback className="bg-pink-100 text-pink-800">AG</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">Ana García</h3>
              <p className="text-sm text-muted-foreground">3 años • Femenino • ID: C001</p>
            </div>
            <Badge variant="outline" className="ml-auto">
              Normal
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Predicción a 6 meses</div>
                <div className="text-xs text-muted-foreground">Basada en 6 mediciones previas</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Próxima medición recomendada</div>
                <div className="text-xs text-muted-foreground">15/07/2023 (en 1 mes)</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Confianza de la predicción</div>
                <div className="text-xs text-muted-foreground">90% (±0.4 kg, ±0.7 cm)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="weight" className="space-y-4">
        <TabsList>
          <TabsTrigger value="weight">Peso</TabsTrigger>
          <TabsTrigger value="height">Talla</TabsTrigger>
          <TabsTrigger value="bmi">IMC</TabsTrigger>
          <TabsTrigger value="combined">Análisis Combinado</TabsTrigger>
        </TabsList>

        <TabsContent value="weight" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predicción de Peso</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Proyección de peso para los próximos 6 meses
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                      <Info className="h-3 w-3" />
                      <span className="sr-only">Más información</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Acerca de esta predicción</h4>
                      <p className="text-sm text-muted-foreground">
                        La predicción se basa en el historial de mediciones, patrones de crecimiento estándar y datos de
                        niños con características similares. El área sombreada representa el intervalo de confianza del
                        90%.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={predictionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis domain={[14, 20]} />
                    <Tooltip formatter={(value) => (value ? `${value} kg` : "N/A")} />
                    <Legend />
                    <defs>
                      <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="upper"
                      stroke="transparent"
                      fill="url(#splitColor)"
                      fillOpacity={1}
                      name="Intervalo superior"
                    />
                    <Area
                      type="monotone"
                      dataKey="lower"
                      stroke="transparent"
                      fill="#ffffff"
                      fillOpacity={1}
                      name="Intervalo inferior"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#4338ca"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Peso real (kg)"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#8884d8"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Peso predicho (kg)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">
                  Predicción a 6 meses: <span className="font-medium">18.6 kg</span>
                </span>
              </div>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar datos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="height" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predicción de Talla</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Proyección de talla para los próximos 6 meses
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                      <Info className="h-3 w-3" />
                      <span className="sr-only">Más información</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Acerca de esta predicción</h4>
                      <p className="text-sm text-muted-foreground">
                        La predicción de talla considera la velocidad de crecimiento histórica y los patrones esperados
                        según la edad y el género. El área sombreada representa el intervalo de confianza del 90%.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={heightPredictionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis domain={[90, 105]} />
                    <Tooltip formatter={(value) => (value ? `${value} cm` : "N/A")} />
                    <Legend />
                    <defs>
                      <linearGradient id="splitColorHeight" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="upper"
                      stroke="transparent"
                      fill="url(#splitColorHeight)"
                      fillOpacity={1}
                      name="Intervalo superior"
                    />
                    <Area
                      type="monotone"
                      dataKey="lower"
                      stroke="transparent"
                      fill="#ffffff"
                      fillOpacity={1}
                      name="Intervalo inferior"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#10b981"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Talla real (cm)"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#10b981"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="Talla predicha (cm)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-green-600" />
                <span className="text-sm text-muted-foreground">
                  Predicción a 6 meses: <span className="font-medium">101.0 cm</span>
                </span>
              </div>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar datos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="bmi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predicción de IMC</CardTitle>
              <CardDescription className="flex items-center gap-2">
                Proyección de índice de masa corporal para los próximos 6 meses
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-5 w-5 rounded-full">
                      <Info className="h-3 w-3" />
                      <span className="sr-only">Más información</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium">Acerca de esta predicción</h4>
                      <p className="text-sm text-muted-foreground">
                        La predicción de IMC se calcula a partir de las proyecciones de peso y talla. El intervalo de
                        confianza es más amplio debido a la propagación de incertidumbre de ambas medidas.
                      </p>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={bmiPredictionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis domain={[16, 20]} />
                    <Tooltip formatter={(value) => (value ? `${value}` : "N/A")} />
                    <Legend />
                    <defs>
                      <linearGradient id="splitColorBMI" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area
                      type="monotone"
                      dataKey="upper"
                      stroke="transparent"
                      fill="url(#splitColorBMI)"
                      fillOpacity={1}
                      name="Intervalo superior"
                    />
                    <Area
                      type="monotone"
                      dataKey="lower"
                      stroke="transparent"
                      fill="#ffffff"
                      fillOpacity={1}
                      name="Intervalo inferior"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#f59e0b"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="IMC real"
                    />
                    <Line
                      type="monotone"
                      dataKey="predicted"
                      stroke="#f59e0b"
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      name="IMC predicho"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-muted-foreground">
                  Predicción a 6 meses: <span className="font-medium">18.2</span>
                </span>
              </div>
              <Button variant="outline" size="sm">
                <FileDown className="mr-2 h-4 w-4" />
                Exportar datos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="combined" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Combinado</CardTitle>
              <CardDescription>Evaluación integral de las predicciones de crecimiento y desarrollo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Resumen de Predicciones</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Peso a 6 meses</div>
                        <div className="text-xs text-muted-foreground">18.6 kg (±0.7 kg)</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">Talla a 6 meses</div>
                        <div className="text-xs text-muted-foreground">101.0 cm (±1.3 cm)</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                        <TrendingUp className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">IMC a 6 meses</div>
                        <div className="text-xs text-muted-foreground">18.2 (±1.4)</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Interpretación</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Basado en el análisis de las predicciones, se espera que Ana mantenga un patrón de crecimiento
                    normal durante los próximos 6 meses. Las proyecciones indican:
                  </p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Ganancia de peso esperada: aproximadamente 1.8 kg en 6 meses</li>
                    <li>Crecimiento en talla esperado: aproximadamente 3.0 cm en 6 meses</li>
                    <li>El IMC se mantendrá dentro del rango normal para su edad y género</li>
                    <li>No se detectan señales de alerta en la trayectoria de crecimiento proyectada</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Recomendaciones</h3>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Mantener el plan alimentario actual</li>
                    <li>Realizar la próxima evaluación antropométrica en 3 meses</li>
                    <li>Continuar con la actividad física regular</li>
                    <li>No se requieren intervenciones nutricionales específicas en este momento</li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Generar informe completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

