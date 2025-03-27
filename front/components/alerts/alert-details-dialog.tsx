"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertTriangle, Calendar, Clock, User, FileText, CheckCircle, ArrowRight, MessageSquare, Printer, Download } from 'lucide-react'

// Datos de ejemplo para el historial de la alerta
const alertHistoryData = [
  {
    date: "18/03/2023 10:15",
    action: "Alerta creada",
    user: "Sistema",
    details: "Alerta generada automáticamente por el sistema de monitoreo.",
  },
  {
    date: "18/03/2023 14:30",
    action: "Alerta asignada",
    user: "Admin",
    details: "Alerta asignada al Dr. Martínez para su revisión.",
  },
  {
    date: "20/03/2023 09:45",
    action: "Comentario añadido",
    user: "Dr. Martínez",
    details: "Se ha programado evaluación nutricional para el 25/03/2023.",
  },
  {
    date: "25/03/2023 11:20",
    action: "Actualización de estado",
    user: "Dr. Martínez",
    details: "Se realizó evaluación nutricional. Se requiere seguimiento en 2 semanas.",
  },
]

// Datos de ejemplo para comentarios
const commentsData = [
  {
    id: "C001",
    user: "Dr. Martínez",
    date: "20/03/2023 09:45",
    text: "He revisado el historial de mediciones. Se observa una tendencia descendente en el percentil de peso en los últimos 3 meses. Programada evaluación nutricional para el 25/03/2023.",
  },
  {
    id: "C002",
    user: "Dra. Gómez",
    date: "22/03/2023 14:20",
    text: "Recomiendo evaluar también posibles factores socioeconómicos que puedan estar afectando la alimentación del niño.",
  },
  {
    id: "C003",
    user: "Dr. Martínez",
    date: "25/03/2023 11:20",
    text: "Evaluación nutricional realizada. Se ha elaborado un plan alimentario personalizado y se ha proporcionado educación nutricional a la familia. Se requiere seguimiento en 2 semanas para evaluar progreso.",
  },
]

interface AlertDetailsDialogProps {
  alert: {
    id: string
    childName: string
    childId: string
    age: string
    gender: string
    alertType: string
    severity: string
    status: string
    createdAt: string
    assignedTo: string
    description: string
    actions: string[]
    resolvedAt?: string
    resolution?: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AlertDetailsDialog({ alert, open, onOpenChange }: AlertDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Detalles de Alerta</span>
            <Badge 
              variant={
                alert.severity === "Alta" 
                  ? "destructive" 
                  : alert.severity === "Media" 
                    ? "secondary" 
                    : "outline"
              }
            >
              {alert.severity}
            </Badge>
            <Badge 
              variant={
                alert.status === "Pendiente" 
                  ? "outline" 
                  : alert.status === "En revisión" 
                    ? "secondary" 
                    : "default"
              }
              className={
                alert.status === "Resuelta" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""
              }
            >
              {alert.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {alert.alertType} • ID: {alert.id}
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

        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarFallback
              className={
                alert.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
              }
            >
              {alert.childName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{alert.childName}</h3>
            <p className="text-sm text-muted-foreground">
              {alert.age} • {alert.gender} • ID: {alert.childId}
            </p>
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Detalles</TabsTrigger>
            <TabsTrigger value="actions">Acciones</TabsTrigger>
            <TabsTrigger value="history">Historial</TabsTrigger>
            <TabsTrigger value="comments">Comentarios</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Información de la Alerta</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Tipo de Alerta:</span>
                  <span>{alert.alertType}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Fecha de Creación:</span>
                  <span>{alert.createdAt}</span>
                </div>
                {alert.resolvedAt && (
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Fecha de Resolución:</span>
                    <span>{alert.resolvedAt}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Asignado a:</span>
                  <span>{alert.assignedTo}</span>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="font-medium text-sm">Descripción:</div>
                  <p className="text-sm text-muted-foreground">{alert.description}</p>
                </div>
                {alert.resolution && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="font-medium text-sm">Resolución:</div>
                      <p className="text-sm text-muted-foreground">{alert.resolution}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Estado Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Estado:</span>
                    <Badge 
                      variant={
                        alert.status === "Pendiente" 
                          ? "outline" 
                          : alert.status === "En revisión" 
                            ? "secondary" 
                            : "default"
                      }
                      className={
                        alert.status === "Resuelta" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" : ""
                      }
                    >
                      {alert.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Severidad:</span>
                    <Badge 
                      variant={
                        alert.severity === "Alta" 
                          ? "destructive" 
                          : alert.severity === "Media" 
                            ? "secondary" 
                            : "outline"
                      }
                    >
                      {alert.severity}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Tiempo activa:</span>
                    <span className="text-sm">
                      {alert.status === "Resuelta" 
                        ? "Resuelta" 
                        : "5 días"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Prioridad de atención:</span>
                    <Badge 
                      variant={
                        alert.severity === "Alta" 
                          ? "destructive" 
                          : "outline"
                      }
                    >
                      {alert.severity === "Alta" ? "Inmediata" : "Normal"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="actions" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Acciones Recomendadas</CardTitle>
                <CardDescription>
                  Acciones sugeridas para abordar esta alerta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {alert.actions.map((action, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Actualizar Estado</CardTitle>
                <CardDescription>
                  Cambiar el estado de la alerta o asignarla a otro profesional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alertStatus">Estado de la Alerta</Label>
                  <Select defaultValue={alert.status}>
                    <SelectTrigger id="alertStatus">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="En revisión">En revisión</SelectItem>
                      <SelectItem value="Resuelta">Resuelta</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignTo">Asignar a</Label>
                  <Select defaultValue={alert.assignedTo !== "Sin asignar" ? alert.assignedTo : undefined}>
                    <SelectTrigger id="assignTo">
                      <SelectValue placeholder="Seleccionar responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dr. Martínez">Dr. Martínez</SelectItem>
                      <SelectItem value="Dra. Gómez">Dra. Gómez</SelectItem>
                      <SelectItem value="Dra. Rodríguez">Dra. Rodríguez</SelectItem>
                      <SelectItem value="Dr. Sánchez">Dr. Sánchez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {alert.status !== "Resuelta" && (
                  <div className="space-y-2">
                    <Label htmlFor="resolution">Resolución (si se marca como resuelta)</Label>
                    <Textarea 
                      id="resolution" 
                      placeholder="Describa cómo se resolvió la alerta..."
                      className="min-h-[100px]"
                    />
                  </div>
                )}
                <Button className="w-full">
                  Guardar Cambios
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Historial de la Alerta</CardTitle>
                <CardDescription>
                  Registro cronológico de acciones y cambios
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {alertHistoryData.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 relative">
                      <div className="w-[2px] bg-muted absolute top-6 bottom-0 left-[14px] z-0"></div>
                      <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center z-10">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="font-medium text-sm">{item.action}</div>
                          <div className="text-xs text-muted-foreground">{item.date}</div>
                        </div>
                        <div className="text-xs text-muted-foreground mb-1">Por: {item.user}</div>
                        <div className="text-sm">{item.details}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="comments" className="space-y-4 mt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Comentarios</CardTitle>
                <CardDescription>
                  Discusión y notas sobre la alerta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  {commentsData.map((comment) => (
                    <div key={comment.id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium text-sm">{comment.user}</div>
                        <div className="text-xs text-muted-foreground">{comment.date}</div>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newComment">Añadir comentario</Label>
                  <Textarea 
                    id="newComment" 
                    placeholder="Escriba su comentario aquí..."
                    className="min-h-[100px]"
                  />
                  <Button className="w-full">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Enviar Comentario
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
