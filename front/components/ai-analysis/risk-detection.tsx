"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import { FileDown, AlertTriangle, Calendar, ArrowRight, CheckCircle, XCircle, HelpCircle } from "lucide-react"

// Datos de ejemplo para niños con alertas
const childrenWithRisks = [
  {
    id: "C003",
    name: "María Rodríguez",
    age: "2 años",
    gender: "Femenino",
    riskScore: 75,
    riskLevel: "Alto",
    riskFactors: ["Bajo peso para la edad", "Estancamiento en crecimiento", "Disminución de percentil"],
    lastCheckup: "18/03/2023",
    trend: "declining",
  },
  {
    id: "C005",
    name: "Sofia Martínez",
    age: "1 año",
    gender: "Femenino",
    riskScore: 82,
    riskLevel: "Alto",
    riskFactors: ["Desnutrición aguda", "Bajo peso para la talla", "Factores socioeconómicos"],
    lastCheckup: "22/03/2023",
    trend: "stable",
  },
  {
    id: "C006",
    name: "Luis Gómez",
    age: "3 años",
    gender: "Masculino",
    riskScore: 65,
    riskLevel: "Medio",
    riskFactors: ["Estancamiento en crecimiento", "Historial de bajo peso"],
    lastCheckup: "25/03/2023",
    trend: "improving",
  },
  {
    id: "C007",
    name: "Pedro Sánchez",
    age: "4 años",
    gender: "Masculino",
    riskScore: 78,
    riskLevel: "Alto",
    riskFactors: ["Bajo peso para la talla", "Disminución de percentil", "Factores socioeconómicos"],
    lastCheckup: "27/03/2023",
    trend: "declining",
  },
  {
    id: "C008",
    name: "Ana Torres",
    age: "2 años",
    gender: "Femenino",
    riskScore: 58,
    riskLevel: "Medio",
    riskFactors: ["Riesgo de desnutrición", "Historial de bajo peso"],
    lastCheckup: "30/03/2023",
    trend: "stable",
  },
]

// Datos de ejemplo para el historial de mediciones de un niño con riesgo
const riskChildMeasurementHistory = [
  { date: "01/10/2022", weight: 10.2, height: 80.0, weightPercentile: 45, heightPercentile: 48 },
  { date: "01/11/2022", weight: 10.3, height: 80.5, weightPercentile: 42, heightPercentile: 47 },
  { date: "01/12/2022", weight: 10.3, height: 81.0, weightPercentile: 38, heightPercentile: 46 },
  { date: "01/01/2023", weight: 10.4, height: 81.5, weightPercentile: 35, heightPercentile: 45 },
  { date: "01/02/2023", weight: 10.4, height: 82.0, weightPercentile: 30, heightPercentile: 44 },
  { date: "01/03/2023", weight: 10.5, height: 82.0, weightPercentile: 25, heightPercentile: 42 },
]

export function RiskDetection() {
  const [selectedChild, setSelectedChild] = useState("maria-rodriguez")
  const [riskThreshold, setRiskThreshold] = useState("medium")
  const [selectedRiskChild, setSelectedRiskChild] = useState(childrenWithRisks[0])

  const handleSelectRiskChild = (child: (typeof childrenWithRisks)[0]) => {
    setSelectedRiskChild(child)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Detección de Riesgos Nutricionales</CardTitle>
          <CardDescription>
            Identificación temprana de posibles problemas nutricionales mediante análisis de patrones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="riskThreshold">Umbral de Riesgo</Label>
              <Select defaultValue={riskThreshold} onValueChange={setRiskThreshold}>
                <SelectTrigger id="riskThreshold">
                  <SelectValue placeholder="Seleccionar umbral" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Bajo (mostrar todos los riesgos)</SelectItem>
                  <SelectItem value="medium">Medio (riesgos moderados y altos)</SelectItem>
                  <SelectItem value="high">Alto (solo riesgos altos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="centerSelect">Centro</Label>
              <Select defaultValue="all">
                <SelectTrigger id="centerSelect">
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

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Niño</TableHead>
                  <TableHead>Edad</TableHead>
                  <TableHead>Nivel de Riesgo</TableHead>
                  <TableHead>Factores de Riesgo</TableHead>
                  <TableHead>Última Revisión</TableHead>
                  <TableHead>Tendencia</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {childrenWithRisks.map((child) => (
                  <TableRow
                    key={child.id}
                    className={child.riskLevel === "Alto" ? "bg-red-50/50 dark:bg-red-950/20" : ""}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
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
                        <span>{child.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>{child.age}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge variant={child.riskLevel === "Alto" ? "destructive" : "secondary"} className="w-fit">
                          {child.riskLevel}
                        </Badge>
                        <div className="flex items-center gap-2">
                          <Progress value={child.riskScore} className="h-2" />
                          <span className="text-xs text-muted-foreground">{child.riskScore}%</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ul className="list-disc pl-4 text-xs space-y-0.5">
                        {child.riskFactors.map((factor, index) => (
                          <li key={index}>{factor}</li>
                        ))}
                      </ul>
                    </TableCell>
                    <TableCell>{child.lastCheckup}</TableCell>
                    <TableCell>
                      {child.trend === "improving" ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Mejorando
                        </Badge>
                      ) : child.trend === "stable" ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Estable
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                          Empeorando
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleSelectRiskChild(child)}>
                        Analizar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card
        className={
          selectedRiskChild.riskLevel === "Alto"
            ? "border-red-200 dark:border-red-800"
            : "border-amber-200 dark:border-amber-800"
        }
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback
                  className={
                    selectedRiskChild.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                  }
                >
                  {selectedRiskChild.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{selectedRiskChild.name}</CardTitle>
                <CardDescription>
                  {selectedRiskChild.age} • {selectedRiskChild.gender} • ID: {selectedRiskChild.id}
                </CardDescription>
              </div>
            </div>
            <Badge variant={selectedRiskChild.riskLevel === "Alto" ? "destructive" : "secondary"}>
              Riesgo {selectedRiskChild.riskLevel}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="analysis" className="space-y-4">
            <TabsList>
              <TabsTrigger value="analysis">Análisis de Riesgo</TabsTrigger>
              <TabsTrigger value="trends">Tendencias</TabsTrigger>
              <TabsTrigger value="actions">Acciones Recomendadas</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Factores de Riesgo Detectados
                </h3>
                <ul className="space-y-2">
                  {selectedRiskChild.riskFactors.map((factor, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">{factor}</span>
                        <p className="text-xs text-muted-foreground">
                          {factor === "Bajo peso para la edad" &&
                            "El peso está por debajo del percentil 25 para la edad y género."}
                          {factor === "Estancamiento en crecimiento" &&
                            "No se observa ganancia de peso significativa en los últimos 3 meses."}
                          {factor === "Disminución de percentil" &&
                            "Descenso progresivo en el percentil de peso en los últimos 6 meses."}
                          {factor === "Desnutrición aguda" && "Relación peso/talla por debajo del percentil 10."}
                          {factor === "Bajo peso para la talla" &&
                            "El peso está por debajo de lo esperado para la talla actual."}
                          {factor === "Factores socioeconómicos" &&
                            "Factores socioeconómicos identificados que pueden afectar la nutrición."}
                          {factor === "Historial de bajo peso" && "Antecedentes de bajo peso en evaluaciones previas."}
                          {factor === "Riesgo de desnutrición" &&
                            "Indicadores que sugieren riesgo de desarrollar desnutrición."}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Análisis de Indicadores</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Peso para la Edad:</span>
                      <span className="font-medium text-red-600">Percentil 25 ↓</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    <p className="text-xs text-muted-foreground">Por debajo del rango esperado (P25-P75)</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Talla para la Edad:</span>
                      <span className="font-medium text-amber-600">Percentil 42 ↓</span>
                    </div>
                    <Progress value={42} className="h-2" />
                    <p className="text-xs text-muted-foreground">Ligeramente por debajo del rango esperado</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Evaluación de Riesgo</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                      <AlertTriangle className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Nivel de Riesgo: {selectedRiskChild.riskLevel}</div>
                      <div className="text-xs text-muted-foreground">Puntuación: {selectedRiskChild.riskScore}/100</div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    El análisis de IA ha detectado un patrón de estancamiento en el crecimiento y disminución progresiva
                    en los percentiles de peso y talla. Estos indicadores, combinados con otros factores de riesgo
                    identificados, sugieren un riesgo nutricional significativo que requiere atención.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Tendencias de Percentiles</CardTitle>
                  <CardDescription>Evolución de percentiles de peso y talla en los últimos 6 meses</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={riskChildMeasurementHistory}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip formatter={(value) => `Percentil ${value}`} />
                        <Legend />
                        <ReferenceLine y={25} stroke="#f87171" strokeDasharray="3 3" label="Umbral de riesgo (P25)" />
                        <Line
                          type="monotone"
                          dataKey="weightPercentile"
                          stroke="#4338ca"
                          name="Percentil de Peso"
                          activeDot={{ r: 8 }}
                        />
                        <Line type="monotone" dataKey="heightPercentile" stroke="#10b981" name="Percentil de Talla" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full text-sm text-muted-foreground">
                    <p>
                      Se observa una tendencia descendente en los percentiles de peso y talla durante los últimos 6
                      meses. El percentil de peso ha caído por debajo del umbral de riesgo (P25), lo que indica un
                      posible problema nutricional que requiere intervención.
                    </p>
                  </div>
                </CardFooter>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Análisis de Velocidad de Crecimiento</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">Ganancia de peso insuficiente</span>
                        <p className="text-xs text-muted-foreground">
                          Ganancia de solo 0.3 kg en 6 meses, por debajo de lo esperado para la edad (1.0-1.5 kg).
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                        <HelpCircle className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">Crecimiento en talla lento</span>
                        <p className="text-xs text-muted-foreground">
                          Incremento de 2.0 cm en 6 meses, ligeramente por debajo de lo esperado para la edad (2.5-3.5
                          cm).
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">Estancamiento reciente</span>
                        <p className="text-xs text-muted-foreground">
                          No se observa ganancia de peso ni incremento en talla en el último mes.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Comparación con Patrones Esperados</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">Desviación de la curva esperada</span>
                        <p className="text-xs text-muted-foreground">
                          La trayectoria de crecimiento se desvía significativamente del patrón esperado para la edad y
                          género.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                        <XCircle className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">Caída de percentiles</span>
                        <p className="text-xs text-muted-foreground">
                          Descenso de más de 20 puntos percentiles en peso durante los últimos 6 meses.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                        <HelpCircle className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">Relación peso/talla</span>
                        <p className="text-xs text-muted-foreground">
                          La relación peso/talla está en el límite inferior del rango aceptable.
                        </p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  Acciones Prioritarias
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">Evaluación nutricional completa</span>
                      <p className="text-xs text-muted-foreground">
                        Programar una evaluación nutricional detallada en los próximos 7 días.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">Evaluación médica</span>
                      <p className="text-xs text-muted-foreground">
                        Derivar para evaluación médica para descartar causas subyacentes del estancamiento en el
                        crecimiento.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-red-100 flex items-center justify-center text-red-600 flex-shrink-0 mt-0.5">
                      <ArrowRight className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">Plan de seguimiento intensivo</span>
                      <p className="text-xs text-muted-foreground">
                        Implementar un plan de seguimiento con evaluaciones antropométricas cada 2 semanas.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Recomendaciones Nutricionales</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">Plan alimentario de recuperación</span>
                      <p className="text-xs text-muted-foreground">
                        Desarrollar un plan alimentario específico para recuperación nutricional con aporte calórico y
                        proteico incrementado.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">Suplementación nutricional</span>
                      <p className="text-xs text-muted-foreground">
                        Considerar suplementación nutricional específica según evaluación detallada.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">Educación nutricional familiar</span>
                      <p className="text-xs text-muted-foreground">
                        Proporcionar educación nutricional a la familia sobre alimentación adecuada para la edad.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="p-4 border rounded-md">
                <h3 className="text-sm font-medium mb-2">Seguimiento y Monitoreo</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                      <Calendar className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">Próxima evaluación</span>
                      <p className="text-xs text-muted-foreground">Programada para el 15/07/2023 (en 2 semanas)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                      <Calendar className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">Evaluación de progreso</span>
                      <p className="text-xs text-muted-foreground">
                        Reevaluación completa del estado nutricional en 1 mes
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                      <Calendar className="h-3 w-3" />
                    </div>
                    <div>
                      <span className="font-medium">Ajuste de plan</span>
                      <p className="text-xs text-muted-foreground">
                        Revisión y ajuste del plan de intervención según resultados en 6 semanas
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            <FileDown className="mr-2 h-4 w-4" />
            Generar informe de riesgo
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

