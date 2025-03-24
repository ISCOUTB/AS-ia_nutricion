"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash,
  FileText,
  BarChart,
  AlertTriangle,
  Weight,
  Ruler,
  Calendar,
} from "lucide-react"
import { ChildDetailsDialog } from "@/components/children/child-details-dialog"

// Datos de ejemplo - los mismos que en children-list.tsx
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

// Actualizar la interfaz ChildrenGridProps para incluir onSelectChild
interface ChildrenGridProps {
  filterStatus?: string
  onSelectChild?: (childId: string) => void
}

export function ChildrenGrid({ filterStatus, onSelectChild }: ChildrenGridProps) {
  const [selectedChild, setSelectedChild] = useState<(typeof childrenData)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const filteredData = filterStatus ? childrenData.filter((child) => child.status === filterStatus) : childrenData

  // En la función openDetails, añadir la llamada a onSelectChild si existe
  const openDetails = (child: (typeof childrenData)[0]) => {
    setSelectedChild(child)
    setIsDetailsOpen(true)
    // Si existe onSelectChild, llamarlo con el ID del niño
    if (onSelectChild) {
      onSelectChild(child.id)
    }
  }

  // También podemos añadir un manejador para cuando se hace clic en una tarjeta
  const handleCardClick = (child: (typeof childrenData)[0]) => {
    if (onSelectChild) {
      onSelectChild(child.id)
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredData.map((child) => (
          <Card
            key={child.id}
            className={child.status === "Desnutrición" ? "border-red-300 dark:border-red-800" : ""}
            onClick={() => handleCardClick(child)}
            style={{ cursor: onSelectChild ? "pointer" : "default" }}
          >
            <CardHeader className="pb-2 flex flex-row justify-between items-start">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarFallback
                    className={child.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"}
                  >
                    {child.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-sm flex items-center gap-1">
                    {child.name}
                    {child.status === "Desnutrición" && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {child.age} • {child.gender}
                  </p>
                </div>
              </div>
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
            </CardHeader>
            <CardContent className="pb-2">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1 text-xs">
                  <Weight className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{child.weight}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Ruler className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{child.height}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Última: {child.lastCheckup}</span>
                </div>
                <div className="flex items-center gap-1 text-xs">
                  <Badge
                    variant={
                      child.status === "Normal" ? "outline" : child.status === "Riesgo" ? "secondary" : "destructive"
                    }
                    className="h-5 text-[10px]"
                  >
                    {child.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-2">
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={() => openDetails(child)}>
                Ver detalles
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedChild && (
        <ChildDetailsDialog child={selectedChild} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}
    </>
  )
}

