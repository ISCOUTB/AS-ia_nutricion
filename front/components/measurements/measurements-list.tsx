"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash, FileText, BarChart, AlertTriangle, PlusCircle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MeasurementDetailsDialog } from "@/components/measurements/measurement-details-dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo
const measurementsData = [
  {
    id: "1",
    childName: "Ana García",
    childId: "C001",
    age: "3 años",
    gender: "Femenino",
    weight: "15.2 kg",
    height: "95 cm",
    bmi: "16.8",
    date: "12/03/2023",
    status: "Normal",
    hasAlert: false,
    measuredBy: "Dr. Martínez",
  },
  {
    id: "2",
    childName: "Carlos López",
    childId: "C002",
    age: "4 años",
    gender: "Masculino",
    weight: "16.8 kg",
    height: "102 cm",
    bmi: "16.1",
    date: "15/03/2023",
    status: "Normal",
    hasAlert: false,
    measuredBy: "Dra. Rodríguez",
  },
  {
    id: "3",
    childName: "María Rodríguez",
    childId: "C003",
    age: "2 años",
    gender: "Femenino",
    weight: "10.5 kg",
    height: "82 cm",
    bmi: "15.6",
    date: "18/03/2023",
    status: "Riesgo",
    hasAlert: true,
    measuredBy: "Dr. Martínez",
  },
  {
    id: "4",
    childName: "Juan Pérez",
    childId: "C004",
    age: "5 años",
    gender: "Masculino",
    weight: "18.1 kg",
    height: "108 cm",
    bmi: "15.5",
    date: "20/03/2023",
    status: "Normal",
    hasAlert: false,
    measuredBy: "Dra. Gómez",
  },
  {
    id: "5",
    childName: "Sofia Martínez",
    childId: "C005",
    age: "1 año",
    gender: "Femenino",
    weight: "8.2 kg",
    height: "72 cm",
    bmi: "15.8",
    date: "22/03/2023",
    status: "Desnutrición",
    hasAlert: true,
    measuredBy: "Dr. Sánchez",
  },
  {
    id: "6",
    childName: "Luis Gómez",
    childId: "C006",
    age: "3 años",
    gender: "Masculino",
    weight: "12.1 kg",
    height: "90 cm",
    bmi: "14.9",
    date: "25/03/2023",
    status: "Riesgo",
    hasAlert: true,
    measuredBy: "Dra. Rodríguez",
  },
  {
    id: "7",
    childName: "Pedro Sánchez",
    childId: "C007",
    age: "4 años",
    gender: "Masculino",
    weight: "14.3 kg",
    height: "95 cm",
    bmi: "15.8",
    date: "27/03/2023",
    status: "Desnutrición",
    hasAlert: true,
    measuredBy: "Dr. Martínez",
  },
  {
    id: "8",
    childName: "Ana Torres",
    childId: "C008",
    age: "2 años",
    gender: "Femenino",
    weight: "9.8 kg",
    height: "80 cm",
    bmi: "15.3",
    date: "30/03/2023",
    status: "Riesgo",
    hasAlert: true,
    measuredBy: "Dra. Gómez",
  },
]

interface MeasurementsListProps {
  filterDays?: number
  filterAlerts?: boolean
  filterPending?: boolean
}

export function MeasurementsList({ filterDays, filterAlerts, filterPending }: MeasurementsListProps) {
  const [selectedMeasurement, setSelectedMeasurement] = useState<(typeof measurementsData)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Aplicar filtros (simplificado para el prototipo)
  let filteredData = [...measurementsData]

  if (filterAlerts) {
    filteredData = filteredData.filter((m) => m.hasAlert)
  }

  if (filterPending) {
    // Simulación de mediciones pendientes (en un caso real, esto vendría de la base de datos)
    filteredData = [
      {
        id: "pending-1",
        childName: "Roberto Díaz",
        childId: "C010",
        age: "3 años",
        gender: "Masculino",
        weight: "Pendiente",
        height: "Pendiente",
        bmi: "-",
        date: "Pendiente",
        status: "Pendiente",
        hasAlert: false,
        measuredBy: "-",
      },
      {
        id: "pending-2",
        childName: "Laura Jiménez",
        childId: "C011",
        age: "4 años",
        gender: "Femenino",
        weight: "Pendiente",
        height: "Pendiente",
        bmi: "-",
        date: "Pendiente",
        status: "Pendiente",
        hasAlert: false,
        measuredBy: "-",
      },
    ]
  }

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredData.map((measurement) => measurement.id))
    }
  }

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  const openDetails = (measurement: (typeof measurementsData)[0]) => {
    setSelectedMeasurement(measurement)
    setIsDetailsOpen(true)
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedRows.length === filteredData.length && filteredData.length > 0}
                  onCheckedChange={handleSelectAll}
                  aria-label="Seleccionar todos"
                />
              </TableHead>
              <TableHead>Niño</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Talla</TableHead>
              <TableHead>IMC</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Responsable</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((measurement) => (
              <TableRow
                key={measurement.id}
                className={measurement.status === "Desnutrición" ? "bg-red-50 dark:bg-red-950/20" : ""}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(measurement.id)}
                    onCheckedChange={() => handleSelectRow(measurement.id)}
                    aria-label={`Seleccionar medición de ${measurement.childName}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={
                          measurement.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                        }
                      >
                        {measurement.childName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{measurement.childName}</div>
                      <div className="text-xs text-muted-foreground">ID: {measurement.childId}</div>
                    </div>
                    {measurement.hasAlert && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                </TableCell>
                <TableCell>{measurement.age}</TableCell>
                <TableCell>{measurement.weight}</TableCell>
                <TableCell>{measurement.height}</TableCell>
                <TableCell>{measurement.bmi}</TableCell>
                <TableCell>{measurement.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      measurement.status === "Normal"
                        ? "outline"
                        : measurement.status === "Riesgo"
                          ? "secondary"
                          : measurement.status === "Pendiente"
                            ? "outline"
                            : "destructive"
                    }
                  >
                    {measurement.status}
                  </Badge>
                </TableCell>
                <TableCell>{measurement.measuredBy}</TableCell>
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
                      {measurement.status !== "Pendiente" ? (
                        <>
                          <DropdownMenuItem onClick={() => openDetails(measurement)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Ver detalles</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Editar</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            <span>Generar informe</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <BarChart className="mr-2 h-4 w-4" />
                            <span>Ver historial</span>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
                          <PlusCircle className="mr-2 h-4 w-4" />
                          <span>Registrar medición</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">
                        <Trash className="mr-2 h-4 w-4" />
                        <span>Eliminar</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {selectedMeasurement && (
        <MeasurementDetailsDialog
          measurement={selectedMeasurement}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </>
  )
}

