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

interface AddMeasurementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  childId: string
}

// Datos de ejemplo para el niño seleccionado
const childData = {
  id: "C001",
  name: "Ana García",
  age: "3 años",
  gender: "Femenino",
}

export function AddMeasurementDialog({ open, onOpenChange, childId }: AddMeasurementDialogProps) {
  const [weight, setWeight] = useState("")
  const [height, setHeight] = useState("")
  const [headCircumference, setHeadCircumference] = useState("")
  const [notes, setNotes] = useState("")

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
          <DialogDescription>
            Ingrese los datos antropométricos para {childData.name} (ID: {childId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button disabled={!weight || !height}>Guardar Medición</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

