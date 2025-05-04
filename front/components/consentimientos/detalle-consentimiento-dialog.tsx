"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Send, CheckCircle, Eye, Printer, RotateCcw, X } from "lucide-react"
import { useState } from "react"

export function DetalleConsentimientoDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <Eye className="h-3.5 w-3.5" />
          <span>Ver Detalles</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Consentimiento CON-2023-089</DialogTitle>
            <Badge className="bg-green-500">Firmado</Badge>
          </div>
          <DialogDescription>Detalles completos del consentimiento</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="informacion">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="informacion">Información</TabsTrigger>
            <TabsTrigger value="documento">Documento</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="acciones">Acciones</TabsTrigger>
          </TabsList>

          <TabsContent value="informacion" className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Paciente</h3>
                  <p className="text-lg font-medium">Ana María Rodríguez</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Tipo de Consentimiento</h3>
                  <p>Evaluación Nutricional</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Descripción</h3>
                  <p>
                    Consentimiento para realizar evaluación nutricional inicial y seguimiento del estado nutricional del
                    paciente.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Código</h3>
                  <p>CON-2023-089</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha de Creación</h3>
                  <p>15/11/2023</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha de Firma</h3>
                  <p>15/11/2023 (14:35)</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Fecha de Expiración</h3>
                  <p>15/11/2024</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Información Adicional</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Método de Entrega</h4>
                  <p>Correo Electrónico</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Creado por</h4>
                  <p>Dr. Juan Pérez</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Firma Electrónica</h4>
                  <p>Sí (Verificada)</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">IP de Firma</h4>
                  <p>192.168.1.45</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-muted-foreground">Notas Internas</h4>
                <p>Consentimiento estándar para evaluación nutricional. El paciente firmó sin observaciones.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documento" className="space-y-6">
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Download className="h-3.5 w-3.5" />
                <span>Descargar</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Printer className="h-3.5 w-3.5" />
                <span>Imprimir</span>
              </Button>
            </div>

            <div className="border rounded-lg p-6 min-h-[400px] bg-white">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">CONSENTIMIENTO INFORMADO PARA EVALUACIÓN NUTRICIONAL</h2>
                <p className="text-sm text-muted-foreground">Código: CON-2023-089</p>
              </div>

              <div className="space-y-4">
                <p>
                  Yo, <strong>Ana María Rodríguez</strong>, con documento de identidad número <strong>12345678</strong>,
                  por medio del presente documento manifiesto que:
                </p>

                <ol className="list-decimal pl-6 space-y-2">
                  <li>
                    He sido informado/a sobre el procedimiento de evaluación nutricional que se me realizará, el cual
                    incluye mediciones antropométricas, análisis de composición corporal y evaluación de hábitos
                    alimentarios.
                  </li>
                  <li>
                    Comprendo que esta evaluación tiene como objetivo determinar mi estado nutricional actual y
                    establecer recomendaciones personalizadas para mejorar mi salud.
                  </li>
                  <li>
                    He tenido la oportunidad de hacer preguntas y todas ellas han sido respondidas satisfactoriamente.
                  </li>
                  <li>
                    Entiendo que los datos obtenidos serán tratados con confidencialidad y utilizados exclusivamente con
                    fines de atención sanitaria.
                  </li>
                  <li>Autorizo al personal de salud a realizar la evaluación nutricional descrita.</li>
                </ol>

                <p>
                  Este consentimiento tiene validez por un año a partir de la fecha de firma, a menos que sea revocado
                  expresamente por mí.
                </p>

                <div className="mt-8 pt-4 border-t">
                  <div className="flex justify-between">
                    <div>
                      <p className="font-medium">Firma del Paciente:</p>
                      <div className="mt-2 h-12 w-48 bg-gray-100 rounded flex items-center justify-center">
                        <p className="text-sm italic text-gray-600">Ana María Rodríguez</p>
                      </div>
                    </div>

                    <div>
                      <p className="font-medium">Fecha y Hora:</p>
                      <p className="mt-2">15/11/2023 14:35</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium">Archivos Adjuntos</h3>
              <div className="flex items-center gap-4 p-4 border rounded-lg">
                <FileText className="h-6 w-6 text-muted-foreground" />
                <div className="flex-1">
                  <h4 className="font-medium">Información_Adicional.pdf</h4>
                  <p className="text-sm text-muted-foreground">245 KB - Adjuntado el 15/11/2023</p>
                </div>
                <Button variant="ghost" size="icon">
                  <Download className="h-4 w-4" />
                  <span className="sr-only">Descargar</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="historial" className="space-y-6">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Consentimiento firmado</span>
                    <span className="text-sm text-muted-foreground">15/11/2023 14:35</span>
                  </div>
                  <p className="text-sm mt-1">El paciente ha firmado el consentimiento electrónicamente</p>
                  <div className="mt-2 p-3 bg-muted rounded-md text-sm">Firmado electrónicamente sin observaciones</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <Send className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Consentimiento enviado</span>
                    <span className="text-sm text-muted-foreground">15/11/2023 11:20</span>
                  </div>
                  <p className="text-sm mt-1">El consentimiento ha sido enviado al paciente para su firma</p>
                  <div className="mt-2 p-3 bg-muted rounded-md text-sm">
                    Enviado por correo electrónico a: ana.rodriguez@email.com
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Consentimiento creado</span>
                    <span className="text-sm text-muted-foreground">15/11/2023 10:45</span>
                  </div>
                  <p className="text-sm mt-1">Se ha creado un nuevo consentimiento</p>
                  <div className="mt-2 p-3 bg-muted rounded-md text-sm">Creado por: Dr. Juan Pérez</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="acciones" className="space-y-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Button variant="outline" className="h-20 flex flex-col gap-2 justify-center items-center">
                <Download className="h-5 w-5" />
                <span>Descargar Consentimiento</span>
              </Button>

              <Button variant="outline" className="h-20 flex flex-col gap-2 justify-center items-center">
                <Printer className="h-5 w-5" />
                <span>Imprimir Consentimiento</span>
              </Button>

              <Button variant="outline" className="h-20 flex flex-col gap-2 justify-center items-center">
                <RotateCcw className="h-5 w-5" />
                <span>Renovar Consentimiento</span>
              </Button>

              <Button variant="outline" className="h-20 flex flex-col gap-2 justify-center items-center text-red-500">
                <X className="h-5 w-5" />
                <span>Anular Consentimiento</span>
              </Button>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Añadir Comentario</h3>
              <textarea
                className="w-full min-h-[100px] p-3 border rounded-md"
                placeholder="Escriba un comentario sobre este consentimiento..."
              ></textarea>
              <div className="flex justify-end">
                <Button>Guardar Comentario</Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
