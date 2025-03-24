"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Calendar, Download, FileText, Printer, Weight, Ruler, Brain, TrendingUp, AlertTriangle } from "lucide-react"

// Datos de ejemplo para un niño específico
const childData = {
  id: "C001",
  name: "Ana García",
  age: "3 años",
  gender: "Femenino",
  birthdate: "15/05/2020",
  guardian: "María García",
  status: "Normal",
  lastCheckup: "12/03/2023",
}

// Datos de ejemplo para el historial de mediciones
const measurementHistory = [
  { date: "01/01/2023", weight: 14.2, height: 92.0, bmi: 16.8, percentileWeight: 45, percentileHeight: 50 },
  { date: "01/02/2023", weight: 14.5, height: 93.0, bmi: 16.7, percentileWeight: 48, percentileHeight: 52 },
  { date: "01/03/2023", weight: 14.8, height: 93.5, bmi: 16.9, percentileWeight: 50, percentileHeight: 53 },
  { date: "12/03/2023", weight: 15.2, height: 95.0, bmi: 16.8, percentileWeight: 52, percentileHeight: 55 },
]

// Datos de ejemplo para los percentiles de referencia
const percentileData = [
  { age: 36, p3: 12.5, p15: 13.5, p50: 14.7, p85: 16.2, p97: 17.8 },
  { age: 37, p3: 12.7, p15: 13.7, p50: 14.9, p85: 16.4, p97: 18.0 },
  { age: 38, p3: 12.9, p15: 13.9, p50: 15.1, p85: 16.6, p97: 18.2 },
  { age: 39, p3: 13.1, p15: 14.1, p50: 15.3, p85: 16.8, p97: 18.4 },
]

// Datos de ejemplo para el análisis nutricional
const nutritionalAnalysis = {
  weightForAge: { status: "Normal", percentile: 52, zScore: 0.05 },
  heightForAge: { status: "Normal", percentile: 55, zScore: 0.13 },
  bmiForAge: { status: "Normal", percentile: 48, zScore: -0.05 },
  weightForHeight: { status: "Normal", percentile: 50, zScore: 0.0 },
}

// Datos de ejemplo para las recomendaciones
const recommendations = [
  "Mantener una dieta balanceada con adecuado aporte de proteínas, carbohidratos y grasas saludables.",
  "Asegurar el consumo de 5 porciones de frutas y verduras al día.",
  "Mantener una hidratación adecuada (aproximadamente 1 litro de agua al día).",
  "Realizar actividad física regular, al menos 60 minutos diarios.",
  "Próxima evaluación antropométrica recomendada en 3 meses.",
]

interface IndividualReportsProps {
  childId: string
}

export function IndividualReports({ childId }: IndividualReportsProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback
                  className={
                    childData.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                  }
                >
                  {childData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{childData.name}</CardTitle>
                <CardDescription>
                  {childData.age} • {childData.gender} • ID: {childId}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={
                  childData.status === "Normal"
                    ? "outline"
                    : childData.status === "Riesgo"
                      ? "secondary"
                      : "destructive"
                }
              >
                {childData.status}
              </Badge>
              <Button variant="outline" size="sm" className="h-8">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir
              </Button>
              <Button variant="outline" size="sm" className="h-8">
                <Download className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="growth" className="space-y-4">
        <TabsList>
          <TabsTrigger value="growth">Curva de Crecimiento</TabsTrigger>
          <TabsTrigger value="analysis">Análisis Nutricional</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Curva de Crecimiento</CardTitle>
              <CardDescription>Evolución del peso en relación a los percentiles de referencia</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="age"
                      type="number"
                      domain={[36, 39]}
                      label={{ value: "Edad (meses)", position: "insideBottom", offset: -5 }}
                    />
                    <YAxis label={{ value: "Peso (kg)", angle: -90, position: "insideLeft" }} domain={[12, 19]} />
                    <Tooltip formatter={(value) => [`${value} kg`, ""]} />
                    <Legend />

                    {/* Líneas de percentiles de referencia */}
                    <Line
                      data={percentileData}
                      type="monotone"
                      dataKey="p3"
                      stroke="#d1d5db"
                      strokeDasharray="3 3"
                      name="P3"
                      dot={false}
                    />
                    <Line
                      data={percentileData}
                      type="monotone"
                      dataKey="p15"
                      stroke="#9ca3af"
                      strokeDasharray="3 3"
                      name="P15"
                      dot={false}
                    />
                    <Line
                      data={percentileData}
                      type="monotone"
                      dataKey="p50"
                      stroke="#6b7280"
                      name="P50 (Mediana)"
                      dot={false}
                    />
                    <Line
                      data={percentileData}
                      type="monotone"
                      dataKey="p85"
                      stroke="#9ca3af"
                      strokeDasharray="3 3"
                      name="P85"
                      dot={false}
                    />
                    <Line
                      data={percentileData}
                      type="monotone"
                      dataKey="p97"
                      stroke="#d1d5db"
                      strokeDasharray="3 3"
                      name="P97"
                      dot={false}
                    />

                    {/* Línea del niño */}
                    <Line
                      data={[
                        { age: 36, weight: 14.2 },
                        { age: 37, weight: 14.5 },
                        { age: 38, weight: 14.8 },
                        { age: 39, weight: 15.2 },
                      ]}
                      type="monotone"
                      dataKey="weight"
                      stroke="#4338ca"
                      strokeWidth={2}
                      name="Peso del niño"
                      dot={{ r: 5 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolución del Peso</CardTitle>
                <CardDescription>Registro histórico de mediciones de peso</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={measurementHistory}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} kg`, "Peso"]} />
                      <Legend />
                      <Line type="monotone" dataKey="weight" stroke="#4338ca" name="Peso (kg)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Evolución de la Talla</CardTitle>
                <CardDescription>Registro histórico de mediciones de talla</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={measurementHistory}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`${value} cm`, "Talla"]} />
                      <Legend />
                      <Line type="monotone" dataKey="height" stroke="#10b981" name="Talla (cm)" activeDot={{ r: 8 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Nutricional</CardTitle>
              <CardDescription>Evaluación antropométrica según estándares OMS</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Weight className="h-4 w-4 text-primary" />
                      Peso para la Edad
                    </h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Percentil: {nutritionalAnalysis.weightForAge.percentile}</span>
                      <Badge variant="outline">{nutritionalAnalysis.weightForAge.status}</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${nutritionalAnalysis.weightForAge.percentile}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Z-score: {nutritionalAnalysis.weightForAge.zScore}
                    </p>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Ruler className="h-4 w-4 text-primary" />
                      Talla para la Edad
                    </h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Percentil: {nutritionalAnalysis.heightForAge.percentile}</span>
                      <Badge variant="outline">{nutritionalAnalysis.heightForAge.status}</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${nutritionalAnalysis.heightForAge.percentile}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Z-score: {nutritionalAnalysis.heightForAge.zScore}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      IMC para la Edad
                    </h3>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm">Percentil: {nutritionalAnalysis.bmiForAge.percentile}</span>
                      <Badge variant="outline">{nutritionalAnalysis.bmiForAge.status}</Badge>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${nutritionalAnalysis.bmiForAge.percentile}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Z-score: {nutritionalAnalysis.bmiForAge.zScore}
                    </p>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-primary" />
                      Interpretación
                    </h3>
                    <p className="text-sm">
                      El niño presenta un estado nutricional normal para su edad y sexo. Todos los indicadores
                      antropométricos se encuentran dentro de los rangos esperados.
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <AlertTriangle className="h-4 w-4 text-green-500" />
                      <p className="text-xs text-green-600">No se detectan alertas nutricionales</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparativa con Mediciones Anteriores</CardTitle>
              <CardDescription>Evolución de percentiles en el tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={measurementHistory}
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
                    <Tooltip formatter={(value) => [`${value}`, "Percentil"]} />
                    <Legend />
                    <ReferenceLine y={50} stroke="#6b7280" strokeDasharray="3 3" label="Mediana (P50)" />
                    <ReferenceLine y={3} stroke="#f87171" strokeDasharray="3 3" label="P3" />
                    <ReferenceLine y={97} stroke="#f87171" strokeDasharray="3 3" label="P97" />
                    <Line
                      type="monotone"
                      dataKey="percentileWeight"
                      stroke="#4338ca"
                      name="Percentil Peso"
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="percentileHeight" stroke="#10b981" name="Percentil Talla" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones Nutricionales</CardTitle>
              <CardDescription>Basadas en el análisis antropométrico y estado nutricional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 border rounded-md mb-4">
                <h3 className="text-sm font-medium mb-2">Plan Alimentario</h3>
                <ul className="space-y-2">
                  {recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Necesidades Nutricionales Estimadas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Calorías:</span>
                      <span className="font-medium">1200-1400 kcal/día</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Proteínas:</span>
                      <span className="font-medium">30-35 g/día</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Calcio:</span>
                      <span className="font-medium">700 mg/día</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Hierro:</span>
                      <span className="font-medium">7 mg/día</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Zinc:</span>
                      <span className="font-medium">3 mg/día</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Seguimiento Recomendado</h3>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Próxima evaluación antropométrica:</span>
                        <p className="text-muted-foreground">En 3 meses (12/06/2023)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <span className="font-medium">Evaluaciones complementarias:</span>
                        <p className="text-muted-foreground">No se requieren en este momento</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <Printer className="mr-2 h-4 w-4" />
                Imprimir Recomendaciones
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Mediciones</CardTitle>
              <CardDescription>Registro completo de mediciones antropométricas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="py-2 px-4 text-left font-medium">Fecha</th>
                      <th className="py-2 px-4 text-left font-medium">Peso (kg)</th>
                      <th className="py-2 px-4 text-left font-medium">Talla (cm)</th>
                      <th className="py-2 px-4 text-left font-medium">IMC</th>
                      <th className="py-2 px-4 text-left font-medium">P. Peso</th>
                      <th className="py-2 px-4 text-left font-medium">P. Talla</th>
                      <th className="py-2 px-4 text-left font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {measurementHistory.map((measurement, index) => (
                      <tr key={index} className={index === 0 ? "bg-muted/50" : ""}>
                        <td className="py-2 px-4">{measurement.date}</td>
                        <td className="py-2 px-4">{measurement.weight}</td>
                        <td className="py-2 px-4">{measurement.height}</td>
                        <td className="py-2 px-4">{measurement.bmi}</td>
                        <td className="py-2 px-4">P{measurement.percentileWeight}</td>
                        <td className="py-2 px-4">P{measurement.percentileHeight}</td>
                        <td className="py-2 px-4">
                          <Badge variant="outline">Normal</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">
                <FileText className="mr-2 h-4 w-4" />
                Generar Informe
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Exportar Datos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

