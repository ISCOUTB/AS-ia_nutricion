"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {    
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { AlertTriangle, Search, Filter, MoreHorizontal, Eye, Edit, CheckCircle, Clock, Calendar, User } from 'lucide-react'
import { AlertDetailsDialog } from "@/components/alerts/alert-details-dialog"

// Datos de ejemplo para la lista de alertas
const alertsData = [
  {
    id: "A001",
    childName: "María Rodríguez",
    childId: "C003",
    age: "2 años",
    gender: "Femenino",
    alertType: "Bajo peso para la edad",
    severity: "Alta",
    status: "Pendiente",
    createdAt: "18/03/2023 10:15",
    assignedTo: "Dr. Martínez",
    description: "El peso está por debajo del percentil 25 para la edad y género.",
    actions: ["Evaluación nutricional", "Plan alimentario"],
  },
  {
    id: "A002",
    childName: "Sofia Martínez",
    childId: "C005",
    age: "1 año",
    gender: "Femenino",
    alertType: "Desnutrición aguda",
    severity: "Alta",
    status: "En revisión",
    createdAt: "22/03/2023 09:30",
    assignedTo: "Dra. Gómez",
    description: "Relación peso/talla por debajo del percentil 10.",
    actions: ["Evaluación médica", "Intervención nutricional", "Seguimiento semanal"],
  },
  {
    id: "A003",
    childName: "Luis Gómez",
    childId: "C006",
    age: "3 años",
    gender: "Masculino",
    alertType: "Estancamiento en crecimiento",
    severity: "Media",
    status: "Pendiente",
    createdAt: "25/03/2023 14:45",
    assignedTo: "Sin asignar",
    description: "No se observa ganancia de peso significativa en los últimos 3 meses.",
    actions: ["Evaluación de causas", "Seguimiento mensual"],
  },
  {
    id: "A004",
    childName: "Pedro Sánchez",
    childId: "C007",
    age: "4 años",
    gender: "Masculino",
    alertType: "Bajo peso para la talla",
    severity: "Alta",
    status: "En revisión",
    createdAt: "27/03/2023 11:20",
    assignedTo: "Dr. Martínez",
    description: "El peso está por debajo de lo esperado para la talla actual.",
    actions: ["Plan de recuperación", "Evaluación médica"],
  },
  {
    id: "A005",
    childName: "Ana Torres",
    childId: "C008",
    age: "2 años",
    gender: "Femenino",
    alertType: "Riesgo de desnutrición",
    severity: "Media",
    status: "Pendiente",
    createdAt: "30/03/2023 16:10",
    assignedTo: "Sin asignar",
    description: "Indicadores que sugieren riesgo de desarrollar desnutrición.",
    actions: ["Evaluación nutricional", "Educación familiar"],
  },
  {
    id: "A006",
    childName: "Carlos López",
    childId: "C002",
    age: "4 años",
    gender: "Masculino",
    alertType: "Riesgo de bajo peso",
    severity: "Media",
    status: "Resuelta",
    createdAt: "15/03/2023 08:45",
    resolvedAt: "05/04/2023 14:30",
    assignedTo: "Dra. Rodríguez",
    description: "Tendencia descendente en percentil de peso.",
    actions: ["Plan nutricional implementado", "Seguimiento regular"],
    resolution: "Recuperó trayectoria de crecimiento normal tras intervención nutricional."
  },
  {
    id: "A007",
    childName: "Ana García",
    childId: "C001",
    age: "3 años",
    gender: "Femenino",
    alertType: "Estancamiento temporal",
    severity: "Baja",
    status: "Resuelta",
    createdAt: "12/03/2023 11:30",
    resolvedAt: "02/04/2023 09:15",
    assignedTo: "Dr. Sánchez",
    description: "Leve estancamiento en ganancia de peso.",
    actions: ["Ajuste alimentario", "Seguimiento"],
    resolution: "Retomó curva de crecimiento normal tras ajustes en alimentación."
  },
]

export function AlertsList() {
  const [selectedAlert, setSelectedAlert] = useState<typeof alertsData[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterSeverity, setFilterSeverity] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const handleSelectAll = () => {
    if (selectedRows.length === filteredAlerts.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredAlerts.map((alert) => alert.id))
    }
  }

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const openDetails = (alert: typeof alertsData[0]) => {
    setSelectedAlert(alert)
    setIsDetailsOpen(true)
  }

  // Filtrar alertas según los criterios seleccionados
  const filteredAlerts = alertsData.filter((alert) => {
    const matchesStatus = filterStatus === "all" || alert.status === filterStatus
    const matchesSeverity = filterSeverity === "all" || alert.severity === filterSeverity
    const matchesSearch = 
      alert.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.alertType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.id.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesStatus && matchesSeverity && matchesSearch
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Lista de Alertas</CardTitle>
          <CardDescription>
            Gestión y seguimiento de todas las alertas nutricionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Buscar por nombre, ID o tipo..." 
                className="pl-8" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="w-[180px]">
                <Select defaultValue={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En revisión">En revisión</SelectItem>
                    <SelectItem value="Resuelta">Resuelta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="w-[180px]">
                <Select defaultValue={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las severidades</SelectItem>
                    <SelectItem value="Alta">Alta</SelectItem>
                    <SelectItem value="Media">Media</SelectItem>
                    <SelectItem value="Baja">Baja</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={selectedRows.length === filteredAlerts.length && filteredAlerts.length > 0}
                      onCheckedChange={handleSelectAll}
                      aria-label="Seleccionar todas"
                    />
                  </TableHead>
                  <TableHead>Alerta</TableHead>
                  <TableHead>Niño</TableHead>
                  <TableHead>Severidad</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Asignado a</TableHead>
                  <TableHead className="w-[80px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlerts.length > 0 ? (
                  filteredAlerts.map((alert) => (
                    <TableRow key={alert.id} className={alert.severity === "Alta" ? "bg-red-50/50 dark:bg-red-950/20" : ""}>
                      <TableCell>
                        <Checkbox
                          checked={selectedRows.includes(alert.id)}
                          onCheckedChange={() => handleSelectRow(alert.id)}
                          aria-label={`Seleccionar alerta ${alert.id}`}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{alert.alertType}</div>
                        <div className="text-xs text-muted-foreground">ID: {alert.id}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
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
                            <div className="font-medium">{alert.childName}</div>
                            <div className="text-xs text-muted-foreground">{alert.age} • ID: {alert.childId}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
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
                      </TableCell>
                      <TableCell>
                        <div className="text-xs flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {alert.createdAt}
                        </div>
                        {alert.resolvedAt && (
                          <div className="text-xs flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            {alert.resolvedAt}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs flex items-center gap-1">
                          <User className="h-3 w-3 text-muted-foreground" />
                          {alert.assignedTo}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menú</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => openDetails(alert)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>Ver detalles</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Editar</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {alert.status !== "Resuelta" ? (
                              <DropdownMenuItem>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                <span>Marcar como resuelta</span>
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <AlertTriangle className="mr-2 h-4 w-4" />
                                <span>Reabrir alerta</span>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <User className="mr-2 h-4 w-4" />
                              <span>Asignar</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center">
                      No se encontraron alertas que coincidan con los filtros.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              Mostrando {filteredAlerts.length} de {alertsData.length} alertas
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Anterior
              </Button>
              <Button variant="outline" size="sm" disabled>
                Siguiente
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedAlert && (
        <AlertDetailsDialog
          alert={selectedAlert}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  )
}
