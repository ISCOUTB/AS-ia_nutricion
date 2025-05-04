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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, FileText, Plus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { cn } from "@/lib/utils"

export function NuevoConsentimientoDialog() {
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState<Date>()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Consentimiento</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Consentimiento</DialogTitle>
          <DialogDescription>Complete la información para crear un nuevo consentimiento</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="informacion">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="informacion">Información Básica</TabsTrigger>
            <TabsTrigger value="documento">Documento</TabsTrigger>
            <TabsTrigger value="opciones">Opciones Adicionales</TabsTrigger>
          </TabsList>

          <TabsContent value="informacion" className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paciente">Paciente</Label>
                <Select>
                  <SelectTrigger id="paciente">
                    <SelectValue placeholder="Seleccionar paciente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ana">Ana María Rodríguez</SelectItem>
                    <SelectItem value="carlos">Carlos Mendoza</SelectItem>
                    <SelectItem value="lucia">Lucía Fernández</SelectItem>
                    <SelectItem value="miguel">Miguel Ángel Torres</SelectItem>
                    <SelectItem value="valentina">Valentina Gómez</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipo-consentimiento">Tipo de Consentimiento</Label>
                <Select>
                  <SelectTrigger id="tipo-consentimiento">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="evaluacion">Evaluación Nutricional</SelectItem>
                    <SelectItem value="seguimiento">Seguimiento Nutricional</SelectItem>
                    <SelectItem value="intervencion">Intervención Nutricional</SelectItem>
                    <SelectItem value="investigacion">Uso de Datos para Investigación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea id="descripcion" placeholder="Describa brevemente el propósito de este consentimiento" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fecha-expiracion">Fecha de Expiración</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus locale={es} />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigo">Código</Label>
                <Input id="codigo" value="CON-2023-094" disabled />
                <p className="text-xs text-muted-foreground">Generado automáticamente</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documento" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="plantilla">Plantilla de Documento</Label>
              <Select>
                <SelectTrigger id="plantilla">
                  <SelectValue placeholder="Seleccionar plantilla" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="evaluacion">Consentimiento para Evaluación Nutricional</SelectItem>
                  <SelectItem value="seguimiento">Consentimiento para Seguimiento Nutricional</SelectItem>
                  <SelectItem value="intervencion">Consentimiento para Intervención Nutricional</SelectItem>
                  <SelectItem value="investigacion">Consentimiento para Uso de Datos en Investigación</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <FileText className="h-8 w-8 text-muted-foreground" />
              <div className="flex-1">
                <h4 className="font-medium">Consentimiento para Evaluación Nutricional</h4>
                <p className="text-sm text-muted-foreground">Plantilla estándar para evaluación nutricional inicial</p>
              </div>
              <Button variant="outline" size="sm">
                Vista previa
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="personalizar">Personalizar Contenido</Label>
              <Textarea
                id="personalizar"
                className="min-h-[200px]"
                placeholder="Añada contenido personalizado o modifique el texto de la plantilla"
              />
              <p className="text-xs text-muted-foreground">
                Deje en blanco para usar el contenido predeterminado de la plantilla
              </p>
            </div>

            <div className="space-y-2">
              <Label>Adjuntar Archivos</Label>
              <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="font-medium">Arrastre y suelte archivos aquí</h3>
                <p className="text-sm text-muted-foreground mb-4">Soporta PDF, DOCX, JPG, PNG (máx. 5MB)</p>
                <Button variant="outline">Seleccionar archivos</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="opciones" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="enviar-inmediatamente" className="rounded border-gray-300" />
                <Label htmlFor="enviar-inmediatamente">Enviar inmediatamente para firma</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="recordatorios" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="recordatorios">Activar recordatorios automáticos</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="firma-electronica" className="rounded border-gray-300" defaultChecked />
                <Label htmlFor="firma-electronica">Permitir firma electrónica</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="requiere-testigo" className="rounded border-gray-300" />
                <Label htmlFor="requiere-testigo">Requiere firma de testigo</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="metodo-entrega">Método de Entrega</Label>
              <Select defaultValue="email">
                <SelectTrigger id="metodo-entrega">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Correo Electrónico</SelectItem>
                  <SelectItem value="sms">SMS con Enlace</SelectItem>
                  <SelectItem value="presencial">Firma Presencial</SelectItem>
                  <SelectItem value="app">Notificación en App</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas-internas">Notas Internas</Label>
              <Textarea id="notas-internas" placeholder="Añada notas internas que no serán visibles para el paciente" />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button onClick={() => setOpen(false)} className="gap-2">
            <Check className="h-4 w-4" />
            <span>Crear Consentimiento</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
