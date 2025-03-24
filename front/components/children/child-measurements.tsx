"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash, FileText, BarChart2, Calendar } from "lucide-react"
import { MeasurementDetailsDialog } from "@/components/children/measurement-details-dialog"

// Datos de ejemplo para un niño específico
const childData = {
  id: "C001",
  name: "Ana García",
  age: "3 años",
  gender: "Femenino",
  birthdate: "15/05/2020",
  guardian: "María García",
  status: "Normal",
  lastCheckup: "12/03/2023",
}

// Datos de ejemplo para las mediciones de un niño
const measurementsData = [
  {
    id: "1",
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
    weight: "14.8 kg",
    height: "94 cm",
    bmi: "16.7",
    date: "12/02/2023",
    status: "Normal",
    hasAlert: false,
    measuredBy: "Dra. Rodríguez",
  },
  {
    id: "3",
    weight: "14.5 kg",
    height: "93 cm",
    bmi: "16.8",
    date: "12/01/2023",
    status: "Normal",
    hasAlert: false,
    measuredBy: "Dr. Martínez",
  },
  {
    id: "4",
    weight: "14.0 kg",
    height: "92 cm",
    bmi: "16.5",
    date: "12/12/2022",
    status: "Normal",
    hasAlert: false,
    measuredBy: "Dra. Gómez",
  },
]

// Datos para el gráfico de crecimiento
const growthData = [
  { date: "12/12/2022", weight: 14.0, height: 92.0 },
  { date: "12/01/2023", weight: 14.5, height: 93.0 },
  { date: "12/02/2023", weight: 14.8, height: 94.0 },
  { date: "12/03/2023", weight: 15.2, height: 95.0 },
]

interface ChildMeasurementsProps {
  childId: string
}

export function ChildMeasurements({ childId }: ChildMeasurementsProps) {
  const [selectedMeasurement, setSelectedMeasurement] = useState<(typeof measurementsData)[0] | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  const openDetails = (measurement: (typeof measurementsData)[0]) => {
    setSelectedMeasurement(measurement)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback
                  className={
                    childData.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                  }
                >
                  {childData.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{childData.name}</CardTitle>
                <CardDescription>
                  {childData.age} • {childData.gender} • ID: {childData.id}
                </CardDescription>
              </div>
            </div>
            <Badge
              variant={
                childData.status === "Normal" ? "outline" : childData.status === "Riesgo" ? "secondary" : "destructive"
              }
            >
              {childData.status}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Lista de Mediciones</TabsTrigger>
          <TabsTrigger value="growth">Curva de Crecimiento</TabsTrigger>
          <TabsTrigger value="analysis">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Mediciones</CardTitle>
              <CardDescription>Registro histórico de mediciones antropométricas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Peso</TableHead>
                      <TableHead>Talla</TableHead>
                      <TableHead>IMC</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Responsable</TableHead>
                      <TableHead className="w-[80px]">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {measurementsData.map((measurement) => (
                      <TableRow
                        key={measurement.id}
                        className={measurement.status === "Desnutrición" ? "bg-red-50 dark:bg-red-950/20" : ""}
                      >
                        <TableCell>{measurement.date}</TableCell>
                        <TableCell>{measurement.weight}</TableCell>
                        <TableCell>{measurement.height}</TableCell>
                        <TableCell>{measurement.bmi}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              measurement.status === "Normal"
                                ? "outline"
                                : measurement.status === "Riesgo"
                                  ? "secondary"
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Curva de Crecimiento</CardTitle>
              <CardDescription>Evolución de peso y talla a lo largo del tiempo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={growthData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#4338ca" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="weight"
                      stroke="#4338ca"
                      name="Peso (kg)"
                      activeDot={{ r: 8 }}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="height" stroke="#10b981" name="Talla (cm)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Análisis Nutricional</CardTitle>
              <CardDescription>Evaluación del estado nutricional y recomendaciones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Estado Actual
                  </h4>
                  <p className="text-sm mb-2">Basado en la última medición ({measurementsData[0].date}):</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      Peso: <span className="font-medium">{measurementsData[0].weight}</span>
                    </li>
                    <li>
                      Talla: <span className="font-medium">{measurementsData[0].height}</span>
                    </li>
                    <li>
                      IMC: <span className="font-medium">{measurementsData[0].bmi}</span>
                    </li>
                    <li>
                      Estado nutricional: <span className="font-medium">{measurementsData[0].status}</span>
                    </li>
                  </ul>
                </div>

                <div className="p-4 border rounded-md">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    Tendencia
                  </h4>
                  <p className="text-sm mb-2">En los últimos 3 meses:</p>
                  <ul className="list-disc pl-5 text-sm space-y-1">
                    <li>
                      Ganancia de peso: <span className="font-medium text-green-600">+1.2 kg</span>
                    </li>
                    <li>
                      Crecimiento en talla: <span className="font-medium text-green-600">+3 cm</span>
                    </li>
                    <li>
                      Tendencia del IMC: <span className="font-medium">Estable</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border rounded-md">
                <h4 className="font-medium mb-2">Recomendaciones</h4>
                <p className="text-sm">
                  El niño presenta un desarrollo normal para su edad. Se recomienda mantener la alimentación actual y
                  continuar con el seguimiento periódico. Próxima evaluación recomendada en 3 meses.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedMeasurement && (
        <MeasurementDetailsDialog
          measurement={{
            ...selectedMeasurement,
            childName: childData.name,
            childId: childData.id,
            age: childData.age,
            gender: childData.gender,
          }}
          open={isDetailsOpen}
          onOpenChange={setIsDetailsOpen}
        />
      )}
    </div>
  )
}

