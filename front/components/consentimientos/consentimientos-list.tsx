"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DateRangePicker } from "@/components/date-range-picker"
import { Search, Filter, FileText, Eye, Download, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function ConsentimientosList() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre la lista de consentimientos según sus necesidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar..." className="pl-8" />
            </div>

            <Select defaultValue="todos">
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="firmado">Firmados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="rechazado">Rechazados</SelectItem>
                <SelectItem value="vencido">Vencidos</SelectItem>
              </SelectContent>
            </Select>

            <DateRangePicker date={dateRange} setDate={setDateRange} placeholder="Rango de fechas" />

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Más filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Lista de Consentimientos</CardTitle>
            <CardDescription>Gestione todos los consentimientos del sistema</CardDescription>
          </div>
          <Button>Nuevo Consentimiento</Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {consentimientosData.map((consentimiento) => (
                <TableRow key={consentimiento.id}>
                  <TableCell className="font-medium">{consentimiento.codigo}</TableCell>
                  <TableCell>{consentimiento.paciente}</TableCell>
                  <TableCell>{consentimiento.tipo}</TableCell>
                  <TableCell>{consentimiento.fecha}</TableCell>
                  <TableCell>
                    <ConsentimientoEstado estado={consentimiento.estado} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver detalles</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <FileText className="h-4 w-4" />
                        <span className="sr-only">Ver documento</span>
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                        <span className="sr-only">Descargar</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Más opciones</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Enviar recordatorio</DropdownMenuItem>
                          <DropdownMenuItem>Marcar como firmado</DropdownMenuItem>
                          <DropdownMenuItem>Renovar consentimiento</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Anular consentimiento</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

interface ConsentimientoEstadoProps {
  estado: "firmado" | "pendiente" | "rechazado" | "vencido"
}

function ConsentimientoEstado({ estado }: ConsentimientoEstadoProps) {
  switch (estado) {
    case "firmado":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
          Firmado
        </span>
      )
    case "pendiente":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
          Pendiente
        </span>
      )
    case "rechazado":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
          Rechazado
        </span>
      )
    case "vencido":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100">
          Vencido
        </span>
      )
  }
}

// Datos de ejemplo
const consentimientosData = [
  {
    id: 1,
    codigo: "CON-2023-089",
    paciente: "Ana María Rodríguez",
    tipo: "Evaluación Nutricional",
    fecha: "15/11/2023",
    estado: "firmado" as const,
  },
  {
    id: 2,
    codigo: "CON-2023-090",
    paciente: "Carlos Mendoza",
    tipo: "Seguimiento Nutricional",
    fecha: "14/11/2023",
    estado: "pendiente" as const,
  },
  {
    id: 3,
    codigo: "CON-2023-091",
    paciente: "Lucía Fernández",
    tipo: "Evaluación Nutricional",
    fecha: "14/11/2023",
    estado: "firmado" as const,
  },
  {
    id: 4,
    codigo: "CON-2023-092",
    paciente: "Miguel Ángel Torres",
    tipo: "Intervención Nutricional",
    fecha: "13/11/2023",
    estado: "rechazado" as const,
  },
  {
    id: 5,
    codigo: "CON-2023-085",
    paciente: "Valentina Gómez",
    tipo: "Evaluación Nutricional",
    fecha: "10/11/2023",
    estado: "vencido" as const,
  },
  {
    id: 6,
    codigo: "CON-2023-080",
    paciente: "Santiago Pérez",
    tipo: "Seguimiento Nutricional",
    fecha: "05/11/2023",
    estado: "firmado" as const,
  },
  {
    id: 7,
    codigo: "CON-2023-078",
    paciente: "Isabella Martínez",
    tipo: "Intervención Nutricional",
    fecha: "03/11/2023",
    estado: "firmado" as const,
  },
]
