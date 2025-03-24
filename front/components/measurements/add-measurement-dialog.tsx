"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search } from "lucide-react"

interface AddMeasurementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Datos de ejemplo para la búsqueda de niños
const childrenOptions = [
  { id: "C001", name: "Ana García", age: "3 años", gender: "Femenino" },
  { id: "C002", name: "Carlos López", age: "4 años", gender: "Masculino" },
  { id: "C003", name: "María Rodríguez", age: "2 años", gender: "Femenino" },
  { id: "C004", name: "Juan Pérez", age: "5 años", gender: "Masculino" },
  { id: "C005", name: "Sofia Martínez", age: "1 año", gender: "Femenino" },
]

export function AddMeasurementDialog({ open, onOpenChange }: AddMeasurementDialogProps) {
  const [selectedChild, setSelectedChild] = useState<(typeof childrenOptions)[0] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [headCircumference, setHeadCircumference] = useState("")
  const [notes, setNotes] = useState("")

  const filteredChildren = childrenOptions.filter(
    (child) =>
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectChild = (child: (typeof childrenOptions)[0]) => {
    setSelectedChild(child)
    setSearchTerm("")
  }

  const calculateBMI = () => {
    if (weight && height) {
      const weightKg = Number.parseFloat(weight)
      const heightM = Number.parseFloat(height) / 100
      if (weightKg > 0 && heightM > 0) {
        return (weightKg / (heightM * heightM)).toFixed(1)
      }
    }
    return "-"
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Nueva Medición</DialogTitle>
          <DialogDescription>Ingrese los datos antropométricos para registrar una nueva medición.</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedChild ? (
            <div className="space-y-4">
              <Label htmlFor="childSearch">Buscar Niño</Label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="childSearch"
                  placeholder="Buscar por nombre o ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="border rounded-md max-h-[200px] overflow-y-auto">
                {filteredChildren.length > 0 ? (
                  <ul className="divide-y">
                    {filteredChildren.map((child) => (
                      <li
                        key={child.id}
                        className="p-2 hover:bg-muted cursor-pointer"
                        onClick={() => handleSelectChild(child)}
                      >
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
                          <div>
                            <div className="font-medium">{child.name}</div>
                            <div className="text-xs text-muted-foreground">
                              ID: {child.id} • {child.age}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="p-4 text-center text-muted-foreground">No se encontraron resultados</div>
                )}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback
                      className={
                        selectedChild.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                      }
                    >
                      {selectedChild.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{selectedChild.name}</div>
                    <div className="text-xs text-muted-foreground">
                      ID: {selectedChild.id} • {selectedChild.age}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedChild(null)}>
                  Cambiar
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="Ej: 15.2"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Talla (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    step="0.1"
                    placeholder="Ej: 95.5"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="headCircumference">Perímetro Cefálico (cm)</Label>
                  <Input
                    id="headCircumference"
                    type="number"
                    step="0.1"
                    placeholder="Opcional"
                    value={headCircumference}
                    onChange={(e) => setHeadCircumference(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="measurementDate">Fecha de Medición</Label>
                  <Input id="measurementDate" type="date" defaultValue={new Date().toISOString().split("T")[0]} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bmi">IMC (Calculado)</Label>
                <Input id="bmi" value={calculateBMI()} readOnly className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observaciones</Label>
                <Textarea
                  id="notes"
                  placeholder="Observaciones adicionales"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="measuredBy">Responsable de la Medición</Label>
                <Select>
                  <SelectTrigger id="measuredBy">
                    <SelectValue placeholder="Seleccionar responsable" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="martinez">Dr. Martínez</SelectItem>
                    <SelectItem value="rodriguez">Dra. Rodríguez</SelectItem>
                    <SelectItem value="gomez">Dra. Gómez</SelectItem>
                    <SelectItem value="sanchez">Dr. Sánchez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">{selectedChild ? "2 de 2" : "1 de 2"}</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {selectedChild ? (
              <Button disabled={!weight || !height}>Guardar Medición</Button>
            ) : (
              <Button disabled={!selectedChild}>Siguiente</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

