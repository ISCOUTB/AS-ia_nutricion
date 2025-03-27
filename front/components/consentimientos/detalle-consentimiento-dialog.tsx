"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer, Send, Clock, CheckCircle, XCircle } from "lucide-react"

interface DetalleConsentimientoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  consentimiento: any
}

export function DetalleConsentimientoDialog({ open, onOpenChange, consentimiento }: DetalleConsentimientoDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Detalle del Consentimiento</DialogTitle>
          <DialogDescription>Información completa del consentimiento {consentimiento.id}</DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="informacion" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="informacion">Información</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
            <TabsTrigger value="documento">Documento</TabsTrigger>
          </TabsList>
          <TabsContent value="informacion" className="space-y-4 mt-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{consentimiento.nombre}</h3>
                <p className="text-sm text-muted-foreground">ID: {consentimiento.id}</p>
              </div>
              <Badge
                className={
                  consentimiento.estado === "firmado" || consentimiento.estado === "activo"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : consentimiento.estado === "pendiente"
                      ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                      : consentimiento.estado === "rechazado"
                        ? "bg-red-100 text-red-800 hover:bg-red-100"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                }
              >
                {consentimiento.estado === "firmado" || consentimiento.estado === "activo"
                  ? "Firmado"
                  : consentimiento.estado === "pendiente"
                    ? "Pendiente"
                    : consentimiento.estado === "rechazado"
                      ? "Rechazado"
                      : "Por renovar"}
              </Badge>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">Información del Niño/a</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nombre:</span>
                    <span className="text-sm font-medium">{consentimiento.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Documento:</span>
                    <span className="text-sm font-medium">RC 1234567890</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Edad:</span>
                    <span className="text-sm font-medium">5 años</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium">Información del Representante</h4>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Nombre:</span>
                    <span className="text-sm font-medium">{consentimiento.representante}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Documento:</span>
                    <span className="text-sm font-medium">CC 98765432</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Contacto:</span>
                    <span className="text-sm font-medium">correo@ejemplo.com</span>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            <div>
              <h4 className="text-sm font-medium">Detalles del Consentimiento</h4>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <span className="text-sm font-medium">{consentimiento.tipo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de creación:</span>
                  <span className="text-sm font-medium">08/11/2023</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de firma:</span>
                  <span className="text-sm font-medium">{consentimiento.fechaFirma || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Fecha de expiración:</span>
                  <span className="text-sm font-medium">{consentimiento.fechaExpiracion || "—"}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="historial" className="space-y-4 mt-4">
            <h4 className="text-sm font-medium">Historial de eventos</h4>
            <div className="space-y-4">
              {consentimiento.eventos?.map((evento: any, index: number) => (
                <div key={index} className="flex items-start">
                  <div className="mr-4 flex flex-col items-center">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center ${
                        evento.accion === "Firmado"
                          ? "bg-green-100 text-green-800"
                          : evento.accion === "Rechazado"
                            ? "bg-red-100 text-red-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {evento.accion === "Firmado" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : evento.accion === "Rechazado" ? (
                        <XCircle className="h-4 w-4" />
                      ) : evento.accion === "Recordatorio enviado" ? (
                        <Send className="h-4 w-4" />
                      ) : evento.accion === "Enviado" ? (
                        <Send className="h-4 w-4" />
                      ) : (
                        <Clock className="h-4 w-4" />
                      )}
                    </div>
                    {index < consentimiento.eventos?.length - 1 && <div className="h-10 w-px bg-border"></div>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{evento.accion}</p>
                      <p className="text-xs text-muted-foreground">{evento.fecha}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{evento.usuario}</p>
                    {evento.comentario && (
                      <p className="text-sm italic border-l-2 pl-2 mt-1 border-muted">"{evento.comentario}"</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="documento" className="space-y-4 mt-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-medium">Vista previa del documento</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="mr-2 h-4 w-4" />
                  Imprimir
                </Button>
              </div>
            </div>
            <div className="border rounded-md p-4 h-[300px] overflow-y-auto bg-muted/50">
              <div className="text-center mb-4">
                <h3 className="font-bold">
                  Consentimiento Informado para la Participación en el Estudio de Evaluación de Nutrición en Niños
                </h3>
              </div>
              <p className="font-semibold">Título del Estudio:</p>
              <p className="mb-2">Evaluación Nutricional Infantil mediante Sistema Digital de Monitoreo</p>

              <p className="font-semibold">Investigador Principal:</p>
              <p className="mb-2">Edwin Alexander Puertas Del Castillo</p>
              <p className="mb-2">Profesor(a) de Tiempo Completo</p>
              <p className="mb-2">epuerta@utb.edu.co</p>

              <p className="font-semibold">Co-investigadores:</p>
              <p className="mb-2">Fabián Camilo Quintero Pareja</p>
              <p className="mb-2">Estudiante de Ingeniería de Sistemas y Computación</p>
              <p className="mb-2">parejaf@utb.edu.co</p>

              <p className="mb-2">Santiago Quintero Pareja</p>
              <p className="mb-2">Estudiante de Ingeniería de Sistemas y Computación</p>
              <p className="mb-2">squintero@utb.edu.co</p>

              <p className="font-semibold">Institución:</p>
              <p className="mb-2">Universidad Tecnológica de Bolívar</p>

              <p className="font-semibold">Introducción y Objetivo</p>
              <p className="mb-2">
                El presente estudio tiene como finalidad desarrollar y evaluar un sistema digital para el monitoreo y
                análisis del estado nutricional en niños. La recolección automatizada de datos antropométricos (peso,
                talla, estatura, entre otros) permitirá identificar tempranamente condiciones de desnutrición y apoyar
                la toma de decisiones en salud.
              </p>

              <p className="text-sm text-muted-foreground italic">(Documento resumido para visualización)</p>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter className="flex justify-between">
          <div>
            {consentimiento.estado === "pendiente" && (
              <Button variant="outline" className="text-amber-600">
                <Send className="mr-2 h-4 w-4" />
                Enviar recordatorio
              </Button>
            )}
          </div>
          <Button onClick={() => onOpenChange(false)}>Cerrar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

