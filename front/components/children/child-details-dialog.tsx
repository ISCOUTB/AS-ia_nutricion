"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { FileText, Printer, Download, Calendar, User, Phone, Weight, Ruler, AlertTriangle } from "lucide-react"

// Datos de ejemplo para el historial de mediciones
const measurementHistory = [
  { date: "01/01/2023", weight: 14.2, height: 92.0 },
  { date: "01/02/2023", weight: 14.5, height: 93.0 },
  { date: "01/03/2023", weight: 14.8, height: 93.5 },
  { date: "01/04/2023", weight: 15.0, height: 94.0 },
  { date: "01/05/2023", weight: 15.2, height: 95.0 },
]

interface ChildDetailsDialogProps {
  child: {
    id: string
    name: string
    age: string
    gender: string
    weight: string
    height: string
    birthdate: string
    guardian: string
    status: string
    lastCheckup: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChildDetailsDialog({ child, open, onOpenChange }: ChildDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback
                className={child.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}
              >
                {child.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span>{child.name}</span>
            <Badge
              variant={child.status === "Normal" ? "outline" : child.status === "Riesgo" ? "secondary" : "destructive"}
            >
              {child.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>Información detallada y seguimiento nutricional</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" size="sm" className="h-8">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm" className="h-8">
            <Download className="mr-2 h-4 w-4" />
            Exportar
          </Button>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Información Personal</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Nombre:</span>
                    <span>{child.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fecha de Nacimiento:</span>
                    <span>{child.birthdate}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Edad:</span>
                    <span>{child.age}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Género:</span>
                    <span>{child.gender}</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Información del Tutor</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Nombre:</span>
                    <span>{child.guardian}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Contacto:</span>
                    <span>+57 300 123 4567</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Parentesco:</span>
                    <span>Madre</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Última Medición</CardTitle>
                <CardDescription>Fecha: {child.lastCheckup}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                    <Weight className="h-5 w-5 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Peso</span>
                    <span className="text-lg font-semibold">{child.weight}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                    <Ruler className="h-5 w-5 text-primary mb-1" />
                    <span className="text-xs text-muted-foreground">Talla</span>
                    <span className="text-lg font-semibold">{child.height}</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                    <span className="text-xs text-muted-foreground">IMC</span>
                    <span className="text-lg font-semibold">16.8</span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 bg-muted rounded-md">
                    <span className="text-xs text-muted-foreground">Estado</span>
                    <Badge
                      variant={
                        child.status === "Normal" ? "outline" : child.status === "Riesgo" ? "secondary" : "destructive"
                      }
                      className="mt-1"
                    >
                      {child.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {child.status !== "Normal" && (
              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader className="pb-2 flex flex-row items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <CardTitle className="text-sm font-medium">Alerta Nutricional</CardTitle>
                    <CardDescription>Este niño requiere atención especial</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {child.status === "Riesgo"
                      ? "El niño presenta riesgo de desnutrición. Se recomienda seguimiento cercano y evaluación por especialista."
                      : "El niño presenta desnutrición. Requiere intervención inmediata y plan nutricional especializado."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Evolución de Crecimiento</CardTitle>
                <CardDescription>Historial de mediciones de peso y talla</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart
                    data={measurementHistory}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#4338ca" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="weight" stroke="#4338ca" name="Peso (kg)" />
                    <Line yAxisId="right" type="monotone" dataKey="height" stroke="#10b981" name="Talla (cm)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Registro de Mediciones</CardTitle>
                <CardDescription>Historial completo de mediciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs uppercase bg-muted">
                      <tr>
                        <th scope="col" className="px-4 py-2">
                          Fecha
                        </th>
                        <th scope="col" className="px-4 py-2">
                          Peso (kg)
                        </th>
                        <th scope="col" className="px-4 py-2">
                          Talla (cm)
                        </th>
                        <th scope="col" className="px-4 py-2">
                          IMC
                        </th>
                        <th scope="col" className="px-4 py-2">
                          Estado
                        </th>
                        <th scope="col" className="px-4 py-2">
                          Observaciones
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {measurementHistory.map((measurement, index) => (
                        <tr key={index} className="border-b">
                          <td className="px-4 py-2">{measurement.date}</td>
                          <td className="px-4 py-2">{measurement.weight}</td>
                          <td className="px-4 py-2">{measurement.height}</td>
                          <td className="px-4 py-2">
                            {(measurement.weight / (measurement.height / 100) ** 2).toFixed(1)}
                          </td>
                          <td className="px-4 py-2">
                            <Badge variant={index === 0 ? "outline" : "outline"}>Normal</Badge>
                          </td>
                          <td className="px-4 py-2">-</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recommendations" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones Nutricionales</CardTitle>
                <CardDescription>Generadas por el sistema de análisis con IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Plan de Alimentación Recomendado
                  </h4>
                  <p className="text-sm mb-2">
                    Basado en el análisis de los datos antropométricos y el estado nutricional actual, se recomienda el
                    siguiente plan de alimentación:
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Incrementar el consumo de proteínas de alto valor biológico</li>
                    <li>Asegurar la ingesta de 5 porciones de frutas y verduras al día</li>
                    <li>Incluir alimentos ricos en hierro y zinc</li>
                    <li>Mantener una hidratación adecuada</li>
                    <li>Evitar alimentos ultraprocesados y con alto contenido de azúcar</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Seguimiento Recomendado
                  </h4>
                  <p className="text-sm mb-2">Se recomienda el siguiente plan de seguimiento:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>Próxima evaluación antropométrica: en 1 mes</li>
                    <li>Consulta con nutricionista: programar en las próximas 2 semanas</li>
                    <li>Evaluación de laboratorio: hemograma completo y ferritina sérica</li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2">Observaciones Adicionales</h4>
                  <p className="text-sm">
                    El niño ha mostrado una tendencia de crecimiento estable en los últimos meses, pero se recomienda
                    vigilancia cercana para asegurar que continúe en esta trayectoria.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

