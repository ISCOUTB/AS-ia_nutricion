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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Search, AlertTriangle } from "lucide-react"

// Datos de ejemplo para niños
const childrenData = [
  {
    id: "C001",
    name: "Ana García",
    age: "3 años",
    gender: "Femenino",
    status: "Normal",
  },
  {
    id: "C003",
    name: "María Rodríguez",
    age: "2 años",
    gender: "Femenino",
    status: "Riesgo",
  },
  {
    id: "C004",
    name: "Juan Pérez",
    age: "5 años",
    gender: "Masculino",
    status: "Normal",
  },
  {
    id: "C005",
    name: "Sofia Martínez",
    age: "1 año",
    gender: "Femenino",
    status: "Desnutrición",
  },
  {
    id: "C006",
    name: "Luis Gómez",
    age: "3 años",
    gender: "Masculino",
    status: "Riesgo",
  },
]

// Datos de ejemplo para profesionales
const professionalsData = [
  { id: "P001", name: "Dr. Martínez", role: "Médico" },
  { id: "P002", name: "Dra. Gómez", role: "Médico" },
  { id: "P003", name: "Dra. Rodríguez", role: "Nutricionista" },
  { id: "P004", name: "Dr. Sánchez", role: "Médico" },
]

interface CreateAlertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateAlertDialog({ open, onOpenChange }: CreateAlertDialogProps) {
  const [step, setStep] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChild, setSelectedChild] = useState<(typeof childrenData)[0] | null>(null)
  const [alertType, setAlertType] = useState("")
  const [alertSeverity, setAlertSeverity] = useState("")
  const [assignTo, setAssignTo] = useState("")
  const [description, setDescription] = useState("")

  const filteredChildren = childrenData.filter(
    (child) =>
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSelectChild = (child: (typeof childrenData)[0]) => {
    setSelectedChild(child)
    setStep(2)
  }

  const handleNext = () => {
    if (step === 2) {
      setStep(3)
    }
  }

  const handleBack = () => {
    if (step === 2) {
      setSelectedChild(null)
      setStep(1)
    } else if (step === 3) {
      setStep(2)
    }
  }

  const handleCreate = () => {
    // Aquí iría la lógica para crear la alerta
    onOpenChange(false)
    // Resetear el estado
    setStep(1)
    setSearchTerm("")
    setSelectedChild(null)
    setAlertType("")
    setAlertSeverity("")
    setAssignTo("")
    setDescription("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nueva Alerta</DialogTitle>
          <DialogDescription>
            {step === 1 && "Seleccione el niño para el que desea crear una alerta"}
            {step === 2 && "Defina el tipo y severidad de la alerta"}
            {step === 3 && "Asigne la alerta y añada detalles adicionales"}
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar por nombre o ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="border rounded-md max-h-[300px] overflow-y-auto">
              {filteredChildren.length > 0 ? (
                <div className="divide-y">
                  {filteredChildren.map((child) => (
                    <div
                      key={child.id}
                      className="p-3 hover:bg-muted cursor-pointer"
                      onClick={() => handleSelectChild(child)}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
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
                            {child.age} • {child.gender} • ID: {child.id}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-muted-foreground">No se encontraron resultados</div>
              )}
            </div>
          </div>
        )}

        {step === 2 && selectedChild && (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3 p-3 border rounded-md bg-muted/50">
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
                  {selectedChild.age} • {selectedChild.gender} • ID: {selectedChild.id}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alertType">Tipo de Alerta</Label>
                <Select value={alertType} onValueChange={setAlertType}>
                  <SelectTrigger id="alertType">
                    <SelectValue placeholder="Seleccionar tipo de alerta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight">Bajo peso para la edad</SelectItem>
                    <SelectItem value="height">Baja talla para la edad</SelectItem>
                    <SelectItem value="stagnation">Estancamiento en crecimiento</SelectItem>
                    <SelectItem value="malnutrition">Desnutrición</SelectItem>
                    <SelectItem value="weightLoss">Pérdida de peso</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Severidad</Label>
                <RadioGroup value={alertSeverity} onValueChange={setAlertSeverity}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      Alta
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="medium" />
                    <Label htmlFor="medium" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      Media
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="low" />
                    <Label htmlFor="low" className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-500" />
                      Baja
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {step === 3 && selectedChild && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="assignTo">Asignar a</Label>
              <Select value={assignTo} onValueChange={setAssignTo}>
                <SelectTrigger id="assignTo">
                  <SelectValue placeholder="Seleccionar responsable" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin asignar</SelectItem>
                  {professionalsData.map((professional) => (
                    <SelectItem key={professional.id} value={professional.id}>
                      {professional.name} ({professional.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                placeholder="Describa los detalles de la alerta..."
                className="min-h-[100px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Acciones Recomendadas</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="action1" className="rounded border-gray-300" />
                  <Label htmlFor="action1">Evaluación nutricional</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="action2" className="rounded border-gray-300" />
                  <Label htmlFor="action2">Plan alimentario</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="action3" className="rounded border-gray-300" />
                  <Label htmlFor="action3">Evaluación médica</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="action4" className="rounded border-gray-300" />
                  <Label htmlFor="action4">Seguimiento semanal</Label>
                </div>
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Paso {step} de 3</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {step > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Atrás
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNext} disabled={step === 1 || (step === 2 && (!alertType || !alertSeverity))}>
                Siguiente
              </Button>
            ) : (
              <Button onClick={handleCreate}>Crear Alerta</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

