"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FileText, Filter, Eye } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { DetalleConsentimientoDialog } from "./detalle-consentimiento-dialog"
import type { DateRange } from "react-day-picker"

export function HistorialConsentimientos() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showDetalleConsentimiento, setShowDetalleConsentimiento] = useState(false)
  const [selectedConsentimiento, setSelectedConsentimiento] = useState<any>(null)
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)

  // Datos de ejemplo para el historial de consentimientos
  const historialConsentimientos = [
    {
      id: "CON-2023-089",
      nombre: "Ana María Rodríguez",
      representante: "Carlos Rodríguez",
      fechaFirma: "2023-11-15",
      fechaExpiracion: "2024-11-15",
      estado: "activo",
      tipo: "Participación en Estudio",
      eventos: [
        { fecha: "2023-11-15", accion: "Firmado", usuario: "Carlos Rodríguez" },
        { fecha: "2023-11-10", accion: "Enviado", usuario: "Sistema" },
        { fecha: "2023-11-08", accion: "Creado", usuario: "María López (Nutricionista)" },
      ],
    },
    {
      id: "CON-2023-090",
      nombre: "Carlos Mendoza",
      representante: "María Mendoza",
      fechaFirma: null,
      fechaExpiracion: null,
      estado: "pendiente",
      tipo: "Tratamiento de Datos",
      eventos: [
        { fecha: "2023-11-14", accion: "Recordatorio enviado", usuario: "Sistema" },
        { fecha: "2023-11-10", accion: "Enviado", usuario: "Sistema" },
        { fecha: "2023-11-09", accion: "Creado", usuario: "Juan Pérez (Administrador)" },
      ],
    },
    {
      id: "CON-2023-091",
      nombre: "Lucía Fernández",
      representante: "Jorge Fernández",
      fechaFirma: "2023-11-14",
      fechaExpiracion: "2024-11-14",
      estado: "activo",
      tipo: "Participación en Estudio",
      eventos: [
        { fecha: "2023-11-14", accion: "Firmado", usuario: "Jorge Fernández" },
        { fecha: "2023-11-09", accion: "Enviado", usuario: "Sistema" },
        { fecha: "2023-11-07", accion: "Creado", usuario: "María López (Nutricionista)" },
      ],
    },
    {
      id: "CON-2023-092",
      nombre: "Miguel Ángel Torres",
      representante: "Laura Torres",
      fechaFirma: null,
      fechaExpiracion: null,
      estado: "rechazado",
      tipo: "Recolección de Datos",
      eventos: [
        {
          fecha: "2023-11-13",
          accion: "Rechazado",
          usuario: "Laura Torres",
          comentario: "No estoy de acuerdo con la cláusula 3.2",
        },
        { fecha: "2023-11-08", accion: "Enviado", usuario: "Sistema" },
        { fecha: "2023-11-06", accion: "Creado", usuario: "Juan Pérez (Administrador)" },
      ],
    },
    {
      id: "CON-2022-045",
      nombre: "Valentina Gómez",
      representante: "Roberto Gómez",
      fechaFirma: "2022-11-20",
      fechaExpiracion: "2023-11-20",
      estado: "por_renovar",
      tipo: "Participación en Estudio",
      eventos: [
        { fecha: "2023-11-10", accion: "Recordatorio de renovación", usuario: "Sistema" },
        { fecha: "2022-11-20", accion: "Firmado", usuario: "Roberto Gómez" },
        { fecha: "2022-11-15", accion: "Enviado", usuario: "Sistema" },
        { fecha: "2022-11-12", accion: "Creado", usuario: "María López (Nutricionista)" },
      ],
    },
  ]

  const filteredHistorial = historialConsentimientos.filter(
    (consentimiento) =>
      consentimiento.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consentimiento.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      consentimiento.representante.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleViewDetails = (consentimiento: any) => {
    setSelectedConsentimiento(consentimiento)
    setShowDetalleConsentimiento(true)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Consentimientos</CardTitle>
        <CardDescription>Registro histórico de todos los consentimientos y sus eventos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Buscar en historial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <DateRangePicker date={dateRange} setDate={setDateRange} />
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Niño/a</TableHead>
                <TableHead>Representante</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha Firma</TableHead>
                <TableHead>Expiración</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHistorial.map((consentimiento) => (
                <TableRow key={consentimiento.id}>
                  <TableCell className="font-medium">{consentimiento.id}</TableCell>
                  <TableCell>{consentimiento.nombre}</TableCell>
                  <TableCell>{consentimiento.representante}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{consentimiento.tipo}</span>
                    </div>
                  </TableCell>
                  <TableCell>{consentimiento.fechaFirma || "—"}</TableCell>
                  <TableCell>{consentimiento.fechaExpiracion || "—"}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        consentimiento.estado === "activo"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : consentimiento.estado === "pendiente"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : consentimiento.estado === "rechazado"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100"
                      }
                    >
                      {consentimiento.estado === "activo"
                        ? "Activo"
                        : consentimiento.estado === "pendiente"
                          ? "Pendiente"
                          : consentimiento.estado === "rechazado"
                            ? "Rechazado"
                            : "Por renovar"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(consentimiento)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Línea de Tiempo de Eventos</h3>
          <div className="space-y-4">
            {historialConsentimientos.slice(0, 3).flatMap((consentimiento) =>
              consentimiento.eventos.map((evento, index) => (
                <div key={`${consentimiento.id}-${index}`} className="flex items-start">
                  <div className="mr-4 flex flex-col items-center">
                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                    {index < consentimiento.eventos.length - 1 && <div className="h-10 w-px bg-border"></div>}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{evento.accion}</p>
                      <p className="text-xs text-muted-foreground">{evento.fecha}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {consentimiento.id} - {consentimiento.nombre} | {evento.usuario}
                    </p>
                    {"comentario" in evento && evento.comentario && (
                      <p className="text-sm italic border-l-2 pl-2 mt-1 border-muted">"{evento.comentario}"</p>
                    )}
                  </div>
                </div>
              )),
            )}
          </div>
        </div>
      </CardContent>
      {selectedConsentimiento && (
        <DetalleConsentimientoDialog
          open={showDetalleConsentimiento}
          onOpenChange={setShowDetalleConsentimiento}
          consentimiento={selectedConsentimiento}
        />
      )}
    </Card>
  )
}

