"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Printer, Download, Calendar, User, Weight, Ruler, AlertTriangle } from "lucide-react"

interface MeasurementDetailsDialogProps {
  measurement: {
    id: string
    childName: string
    childId: string
    age: string
    gender: string
    weight: string
    height: string
    bmi: string
    date: string
    status: string
    hasAlert: boolean
    measuredBy: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MeasurementDetailsDialog({ measurement, open, onOpenChange }: MeasurementDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Detalles de Medición</span>
            <Badge
              variant={
                measurement.status === "Normal"
                  ? "outline"
                  : measurement.status === "Riesgo"
                    ? "secondary"
                    : "destructive"
              }
            >
              {measurement.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Medición de {measurement.childName} realizada el {measurement.date}
          </DialogDescription>
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

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Datos de la Medición</CardTitle>
                  <CardDescription>Fecha: {measurement.date}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Weight className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Peso:</span>
                    <span>{measurement.weight}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Ruler className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Talla:</span>
                    <span>{measurement.height}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">IMC:</span>
                    <span>{measurement.bmi}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Estado Nutricional:</span>
                    <Badge
                      variant={
                        measurement.status === "Normal"
                          ? "outline"
                          : measurement.status === "Riesgo"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {measurement.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Información Adicional</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Responsable:</span>
                    <span>{measurement.measuredBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Fecha de Registro:</span>
                    <span>{measurement.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">Observaciones:</span>
                    <span>Sin observaciones adicionales</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {measurement.hasAlert && (
              <Card className="border-amber-200 dark:border-amber-800">
                <CardHeader className="pb-2 flex flex-row items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <div>
                    <CardTitle className="text-sm font-medium">Alerta Nutricional</CardTitle>
                    <CardDescription>Esta medición ha generado una alerta</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">
                    {measurement.status === "Riesgo"
                      ? "El niño presenta riesgo de desnutrición. Se recomienda seguimiento cercano y evaluación por especialista."
                      : "El niño presenta desnutrición. Requiere intervención inmediata y plan nutricional especializado."}
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Nutricional</CardTitle>
                <CardDescription>Generado por el sistema de análisis con IA</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Evaluación del Estado Nutricional
                  </h4>
                  <p className="text-sm mb-2">
                    Basado en los parámetros antropométricos y la edad del niño, el sistema ha determinado:
                  </p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      Peso para la edad:{" "}
                      <span className={measurement.status === "Normal" ? "text-green-600" : "text-red-600"}>
                        {measurement.status}
                      </span>
                    </li>
                    <li>
                      Talla para la edad: <span className="text-green-600">Normal</span>
                    </li>
                    <li>
                      Peso para la talla:{" "}
                      <span className={measurement.status === "Normal" ? "text-green-600" : "text-amber-600"}>
                        En observación
                      </span>
                    </li>
                    <li>
                      IMC para la edad:{" "}
                      <span className={measurement.status === "Normal" ? "text-green-600" : "text-red-600"}>
                        {measurement.status}
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Recomendaciones
                  </h4>
                  <p className="text-sm mb-2">Basado en el análisis, se recomienda:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    {measurement.status === "Normal" ? (
                      <>
                        <li>Continuar con el plan alimentario actual</li>
                        <li>Próxima evaluación en 3 meses</li>
                        <li>Mantener actividad física regular</li>
                      </>
                    ) : measurement.status === "Riesgo" ? (
                      <>
                        <li>Evaluación por nutricionista en las próximas 2 semanas</li>
                        <li>Incrementar aporte calórico y proteico</li>
                        <li>Seguimiento mensual de parámetros antropométricos</li>
                        <li>Evaluación de posibles causas subyacentes</li>
                      </>
                    ) : (
                      <>
                        <li>Intervención nutricional inmediata</li>
                        <li>Evaluación médica completa</li>
                        <li>Plan de recuperación nutricional supervisado</li>
                        <li>Seguimiento semanal</li>
                        <li>Considerar suplementación nutricional</li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

