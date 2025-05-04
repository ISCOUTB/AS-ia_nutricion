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
import { FileText, Download, Printer, Share2 } from "lucide-react"
import { useState } from "react"

export function VisualizarDocumentoDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FileText className="h-4 w-4" />
          <span className="sr-only">Ver documento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Consentimiento para Evaluación Nutricional</DialogTitle>
          <DialogDescription>CON-2023-089 - Ana María Rodríguez</DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mb-4">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Descargar</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Printer className="h-3.5 w-3.5" />
            <span>Imprimir</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Share2 className="h-3.5 w-3.5" />
            <span>Compartir</span>
          </Button>
        </div>

        <div className="border rounded-lg p-6 min-h-[500px] overflow-y-auto bg-white">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold">CONSENTIMIENTO INFORMADO PARA EVALUACIÓN NUTRICIONAL</h2>
            <p className="text-sm text-muted-foreground">Código: CON-2023-089</p>
          </div>

          <div className="space-y-4">
            <p>
              Yo, <strong>Ana María Rodríguez</strong>, con documento de identidad número <strong>12345678</strong>, por
              medio del presente documento manifiesto que:
            </p>

            <ol className="list-decimal pl-6 space-y-2">
              <li>
                He sido informado/a sobre el procedimiento de evaluación nutricional que se me realizará, el cual
                incluye mediciones antropométricas, análisis de composición corporal y evaluación de hábitos
                alimentarios.
              </li>
              <li>
                Comprendo que esta evaluación tiene como objetivo determinar mi estado nutricional actual y establecer
                recomendaciones personalizadas para mejorar mi salud.
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

            <div className="mt-8 pt-4 border-t">
              <div>
                <p className="font-medium">Firma del Profesional de Salud:</p>
                <div className="mt-2 h-12 w-48 bg-gray-100 rounded flex items-center justify-center">
                  <p className="text-sm italic text-gray-600">Dr. Juan Pérez</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
