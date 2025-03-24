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
import { MoreHorizontal, Eye, Edit, Trash, FileText, BarChart, AlertTriangle } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ChildDetailsDialog } from "@/components/children/child-details-dialog"
import { Checkbox } from "@/components/ui/checkbox"

// Datos de ejemplo
const childrenData = [
  {
    id: "1",
    name: "Ana García",
    age: "3 años",
    gender: "Femenino",
    weight: "15.2 kg",
    height: "95 cm",
    birthdate: "15/05/2020",
    guardian: "María García",
    status: "Normal",
    lastCheckup: "12/03/2023",
  },
  {
    id: "2",
    name: "Carlos López",
    age: "4 años",
    gender: "Masculino",
    weight: "16.8 kg",
    height: "102 cm",
    birthdate: "22/02/2019",
    guardian: "Pedro López",
    status: "Normal",
    lastCheckup: "15/03/2023",
  },
  {
    id: "3",
    name: "María Rodríguez",
    age: "2 años",
    gender: "Femenino",
    weight: "10.5 kg",
    height: "82 cm",
    birthdate: "10/08/2021",
    guardian: "José Rodríguez",
    status: "Riesgo",
    lastCheckup: "18/03/2023",
  },
  {
    id: "4",
    name: "Juan Pérez",
    age: "5 años",
    gender: "Masculino",
    weight: "18.1 kg",
    height: "108 cm",
    birthdate: "05/01/2018",
    guardian: "Laura Pérez",
    status: "Normal",
    lastCheckup: "20/03/2023",
  },
  {
    id: "5",
    name: "Sofia Martínez",
    age: "1 año",
    gender: "Femenino",
    weight: "8.2 kg",
    height: "72 cm",
    birthdate: "30/11/2022",
    guardian: "Carlos Martínez",
    status: "Desnutrición",
    lastCheckup: "22/03/2023",
  },
  {
    id: "6",
    name: "Luis Gómez",
    age: "3 años",
    gender: "Masculino",
    weight: "12.1 kg",
    height: "90 cm",
    birthdate: "18/07/2020",
    guardian: "Ana Gómez",
    status: "Riesgo",
    lastCheckup: "25/03/2023",
  },
  {
    id: "7",
    name: "Pedro Sánchez",
    age: "4 años",
    gender: "Masculino",
    weight: "14.3 kg",
    height: "95 cm",
    birthdate: "12/03/2019",
    guardian: "Marta Sánchez",
    status: "Desnutrición",
    lastCheckup: "27/03/2023",
  },
  {
    id: "8",
    name: "Ana Torres",
    age: "2 años",
    gender: "Femenino",
    weight: "9.8 kg",
    height: "80 cm",
    birthdate: "25/09/2021",
    guardian: "Juan Torres",
    status: "Riesgo",
    lastCheckup: "30/03/2023",
  },
]

// Actualizar la interfaz ChildrenListProps para incluir onSelectChild
interface ChildrenListProps {
  filterStatus?: string
  onSelectChild?: (childId: string) => void
}

export function ChildrenList({ filterStatus, onSelectChild }: ChildrenListProps) {
  const [selectedChild, setSelectedChild] = useState<(typeof childrenData)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const filteredData = filterStatus ? childrenData.filter((child) => child.status === filterStatus) : childrenData

  const handleSelectAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredData.map((child) => child.id))
    }
  }

  const handleSelectRow = (id: string) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id))
    } else {
      setSelectedRows([...selectedRows, id])
    }
  }

  // En la función openDetails, añadir la llamada a onSelectChild si existe
  const openDetails = (child: (typeof childrenData)[0]) => {
    setSelectedChild(child)
    setIsDetailsOpen(true)
    // Si existe onSelectChild, llamarlo con el ID del niño
    if (onSelectChild) {
      onSelectChild(child.id)
    }
  }

  // También podemos añadir un manejador para cuando se hace clic en una fila
  const handleRowClick = (child: (typeof childrenData)[0]) => {
    if (onSelectChild) {
      onSelectChild(child.id)
    }
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
              <TableHead>Nombre</TableHead>
              <TableHead>Edad</TableHead>
              <TableHead>Género</TableHead>
              <TableHead>Peso</TableHead>
              <TableHead>Talla</TableHead>
              <TableHead>Tutor</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Última Revisión</TableHead>
              <TableHead className="w-[80px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((child) => (
              <TableRow
                key={child.id}
                className={child.status === "Desnutrición" ? "bg-red-50 dark:bg-red-950/20" : ""}
                onClick={() => handleRowClick(child)}
                style={{ cursor: onSelectChild ? "pointer" : "default" }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(child.id)}
                    onCheckedChange={() => handleSelectRow(child.id)}
                    aria-label={`Seleccionar ${child.name}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback
                        className={
                          child.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                        }
                      >
                        {child.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span>{child.name}</span>
                    {child.status === "Desnutrición" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </div>
                </TableCell>
                <TableCell>{child.age}</TableCell>
                <TableCell>{child.gender}</TableCell>
                <TableCell>{child.weight}</TableCell>
                <TableCell>{child.height}</TableCell>
                <TableCell>{child.guardian}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      child.status === "Normal" ? "outline" : child.status === "Riesgo" ? "secondary" : "destructive"
                    }
                  >
                    {child.status}
                  </Badge>
                </TableCell>
                <TableCell>{child.lastCheckup}</TableCell>
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
                      <DropdownMenuItem onClick={() => openDetails(child)}>
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
                        <span>Registrar medición</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <BarChart className="mr-2 h-4 w-4" />
                        <span>Ver historial</span>
                      </DropdownMenuItem>
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

      {selectedChild && (
        <ChildDetailsDialog child={selectedChild} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}
    </>
  )
}

