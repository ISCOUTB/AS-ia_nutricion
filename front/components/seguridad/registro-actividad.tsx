"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Download, Filter, RefreshCw, Eye } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"

// Datos de ejemplo
const registros = [
  {
    id: 1,
    fecha: "2023-04-15 09:23:45",
    usuario: "Ana García",
    accion: "Inicio de sesión",
    modulo: "Autenticación",
    ip: "192.168.1.45",
    detalles: "Inicio de sesión exitoso",
    nivel: "Info",
  },
  {
    id: 2,
    fecha: "2023-04-15 09:25:12",
    usuario: "Ana García",
    accion: "Consulta",
    modulo: "Niños",
    ip: "192.168.1.45",
    detalles: "Visualización de lista de niños",
    nivel: "Info",
  },
  {
    id: 3,
    fecha: "2023-04-15 10:12:33",
    usuario: "Carlos Rodríguez",
    accion: "Creación",
    modulo: "Mediciones",
    ip: "192.168.1.50",
    detalles: "Nueva medición registrada para paciente ID 1234",
    nivel: "Info",
  },
  {
    id: 4,
    fecha: "2023-04-15 11:45:22",
    usuario: "María López",
    accion: "Actualización",
    modulo: "Consentimientos",
    ip: "192.168.1.60",
    detalles: "Actualización de estado de consentimiento",
    nivel: "Info",
  },
  {
    id: 5,
    fecha: "2023-04-15 14:30:10",
    usuario: "Sistema",
    accion: "Error",
    modulo: "Reportes",
    ip: "192.168.1.1",
    detalles: "Error al generar reporte mensual",
    nivel: "Error",
  },
]

export function RegistroActividad() {
  const [showDetalles, setShowDetalles] = useState(false)
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null)

  const verDetalles = (registro) => {
    setRegistroSeleccionado(registro)
    setShowDetalles(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Registro de Actividad</h2>
          <p className="text-muted-foreground">Historial de acciones realizadas en el sistema</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Auditoría del Sistema</CardTitle>
          <CardDescription>Registro cronológico de todas las actividades realizadas en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar en registros..." className="pl-8" />
              </div>

              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los niveles</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="todos">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Módulo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los módulos</SelectItem>
                  <SelectItem value="autenticacion">Autenticación</SelectItem>
                  <SelectItem value="ninos">Niños</SelectItem>
                  <SelectItem value="mediciones">Mediciones</SelectItem>
                  <SelectItem value="reportes">Reportes</SelectItem>
                  <SelectItem value="consentimientos">Consentimientos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <DateRangePicker />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha y Hora</TableHead>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Acción</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>IP</TableHead>
                  <TableHead>Nivel</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell>{registro.fecha}</TableCell>
                    <TableCell>{registro.usuario}</TableCell>
                    <TableCell>{registro.accion}</TableCell>
                    <TableCell>{registro.modulo}</TableCell>
                    <TableCell>{registro.ip}</TableCell>
                    <TableCell>
                      <Badge variant={registro.nivel === "Error" ? "destructive" : "default"}>{registro.nivel}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => verDetalles(registro)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <Button variant="outline" size="sm">
              Anterior
            </Button>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para ver detalles */}
      <Dialog open={showDetalles} onOpenChange={setShowDetalles}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalles del Registro</DialogTitle>
            <DialogDescription>Información completa del evento seleccionado</DialogDescription>
          </DialogHeader>

          {registroSeleccionado && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">ID:</div>
                <div className="col-span-2">{registroSeleccionado.id}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Fecha y Hora:</div>
                <div className="col-span-2">{registroSeleccionado.fecha}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Usuario:</div>
                <div className="col-span-2">{registroSeleccionado.usuario}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Acción:</div>
                <div className="col-span-2">{registroSeleccionado.accion}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Módulo:</div>
                <div className="col-span-2">{registroSeleccionado.modulo}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Dirección IP:</div>
                <div className="col-span-2">{registroSeleccionado.ip}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Nivel:</div>
                <div className="col-span-2">
                  <Badge variant={registroSeleccionado.nivel === "Error" ? "destructive" : "default"}>
                    {registroSeleccionado.nivel}
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Detalles:</div>
                <div className="col-span-2">{registroSeleccionado.detalles}</div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="font-medium">Datos adicionales:</div>
                <div className="col-span-2 text-xs font-mono bg-muted p-2 rounded">
                  {JSON.stringify(
                    {
                      sessionId: "sess_" + Math.random().toString(36).substring(2, 10),
                      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
                      referrer: "/dashboard",
                      requestId: "req_" + Math.random().toString(36).substring(2, 10),
                    },
                    null,
                    2,
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
