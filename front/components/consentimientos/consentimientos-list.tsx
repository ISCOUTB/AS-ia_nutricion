"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoreHorizontal, Search, FileText, Download, Send, Eye, Trash, Filter } from "lucide-react"
import { DetalleConsentimientoDialog } from "./detalle-consentimiento-dialog"
import { NuevoConsentimientoDialog } from "./nuevo-consentimiento-dialog"

export function ConsentimientosList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showDetalleConsentimiento, setShowDetalleConsentimiento] = useState(false)
  const [showNuevoConsentimiento, setShowNuevoConsentimiento] = useState(false)
  const [selectedConsentimiento, setSelectedConsentimiento] = useState<any>(null)

  // Datos de ejemplo para la lista de consentimientos
  const consentimientos = [
    {
      id: "CON-2023-089",
      nombre: "Ana María Rodríguez",
      representante: "Carlos Rodríguez",
      fecha: "2023-11-15",
      estado: "firmado",
      tipo: "Participación en Estudio",
    },
    {
      id: "CON-2023-090",
      nombre: "Carlos Mendoza",
      representante: "María Mendoza",
      fecha: "2023-11-14",
      estado: "pendiente",
      tipo: "Tratamiento de Datos",
    },
    {
      id: "CON-2023-091",
      nombre: "Lucía Fernández",
      representante: "Jorge Fernández",
      fecha: "2023-11-14",
      estado: "firmado",
      tipo: "Participación en Estudio",
    },
    {
      id: "CON-2023-092",
      nombre: "Miguel Ángel Torres",
      representante: "Laura Torres",
      fecha: "2023-11-13",
      estado: "rechazado",
      tipo: "Recolección de Datos",
    },
    {
      id: "CON-2023-093",
      nombre: "Valentina Gómez",
      representante: "Roberto Gómez",
      fecha: "2023-11-12",
      estado: "firmado",
      tipo: "Participación en Estudio",
    },
    {
      id: "CON-2023-094",
      nombre: "Santiago Pérez",
      representante: "Claudia Pérez",
      fecha: "2023-11-11",
      estado: "pendiente",
      tipo: "Tratamiento de Datos",
    },
    {
      id: "CON-2023-095",
      nombre: "Isabella Martínez",
      representante: "Fernando Martínez",
      fecha: "2023-11-10",
      estado: "firmado",
      tipo: "Recolección de Datos",
    },
  ]

  const filteredConsentimientos = consentimientos.filter(
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Lista de Consentimientos</CardTitle>
            <CardDescription>Gestione todos los consentimientos registrados en el sistema</CardDescription>
          </div>
          <Button onClick={() => setShowNuevoConsentimiento(true)}>Nuevo Consentimiento</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              placeholder="Buscar consentimiento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[300px]"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Search className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Niño/a</TableHead>
                <TableHead>Representante</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredConsentimientos.map((consentimiento) => (
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
                  <TableCell>{consentimiento.fecha}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        consentimiento.estado === "firmado"
                          ? "bg-green-100 text-green-800 hover:bg-green-100"
                          : consentimiento.estado === "pendiente"
                            ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                      }
                    >
                      {consentimiento.estado === "firmado"
                        ? "Firmado"
                        : consentimiento.estado === "pendiente"
                          ? "Pendiente"
                          : "Rechazado"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menú</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewDetails(consentimiento)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Descargar PDF
                        </DropdownMenuItem>
                        {consentimiento.estado === "pendiente" && (
                          <DropdownMenuItem>
                            <Send className="mr-2 h-4 w-4" />
                            Enviar recordatorio
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash className="mr-2 h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      {selectedConsentimiento && (
        <DetalleConsentimientoDialog
          open={showDetalleConsentimiento}
          onOpenChange={setShowDetalleConsentimiento}
          consentimiento={selectedConsentimiento}
        />
      )}
      <NuevoConsentimientoDialog open={showNuevoConsentimiento} onOpenChange={setShowNuevoConsentimiento} />
    </Card>
  )
}

