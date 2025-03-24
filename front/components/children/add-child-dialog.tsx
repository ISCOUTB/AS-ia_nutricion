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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"

interface AddChildDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddChildDialog({ open, onOpenChange }: AddChildDialogProps) {
  const [activeTab, setActiveTab] = useState("info")
  const [consentChecked, setConsentChecked] = useState(false)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Registrar Nuevo Niño</DialogTitle>
          <DialogDescription>
            Ingrese la información del niño para crear un nuevo registro en el sistema.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Información Básica</TabsTrigger>
            <TabsTrigger value="measurements">Mediciones</TabsTrigger>
            <TabsTrigger value="consent">Consentimiento</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombres</Label>
                <Input id="firstName" placeholder="Nombres del niño" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos</Label>
                <Input id="lastName" placeholder="Apellidos del niño" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthdate">Fecha de Nacimiento</Label>
                <Input id="birthdate" type="date" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Género</Label>
                <Select>
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="guardian">Nombre del Tutor</Label>
              <Input id="guardian" placeholder="Nombre completo del tutor" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="relationship">Parentesco</Label>
                <Select>
                  <SelectTrigger id="relationship">
                    <SelectValue placeholder="Seleccionar parentesco" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mother">Madre</SelectItem>
                    <SelectItem value="father">Padre</SelectItem>
                    <SelectItem value="grandparent">Abuelo/a</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact">Teléfono de Contacto</Label>
                <Input id="contact" placeholder="Número de teléfono" />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="measurements" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input id="weight" type="number" step="0.1" placeholder="Ej: 15.2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Talla (cm)</Label>
                <Input id="height" type="number" step="0.1" placeholder="Ej: 95.5" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="headCircumference">Perímetro Cefálico (cm)</Label>
                <Input id="headCircumference" type="number" step="0.1" placeholder="Opcional" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="measurementDate">Fecha de Medición</Label>
                <Input id="measurementDate" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observaciones</Label>
              <Input id="notes" placeholder="Observaciones adicionales" />
            </div>
          </TabsContent>

          <TabsContent value="consent" className="space-y-4 mt-4">
            <div className="space-y-4">
              <div className="rounded-md border p-4 text-sm">
                <h4 className="font-medium mb-2">Consentimiento Informado para el Uso de Datos</h4>
                <p className="mb-2">
                  Por medio del presente documento, autorizo al Sistema de Monitoreo Nutricional Infantil a recolectar,
                  almacenar y procesar los datos antropométricos y personales del menor a mi cargo, con el fin de
                  evaluar su estado nutricional y generar recomendaciones para su adecuado desarrollo.
                </p>
                <p className="mb-2">
                  Entiendo que estos datos serán tratados con confidencialidad y seguridad, de acuerdo con la Ley 1581
                  de 2012 y el Decreto 1377 de 2013 sobre protección de datos personales en Colombia.
                </p>
                <p>
                  Reconozco que puedo solicitar en cualquier momento el acceso, rectificación, actualización o supresión
                  de los datos personales del menor.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="consent"
                  checked={consentChecked}
                  onCheckedChange={(checked) => {
                    if (typeof checked === "boolean") {
                      setConsentChecked(checked)
                    }
                  }}
                />
                <label
                  htmlFor="consent"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Acepto los términos del consentimiento informado
                </label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guardianSignature">Firma del Tutor</Label>
                <Input id="guardianSignature" placeholder="Nombre completo del tutor" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signatureDate">Fecha</Label>
                <Input id="signatureDate" type="date" />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            {activeTab === "info" ? "1 de 3" : activeTab === "measurements" ? "2 de 3" : "3 de 3"}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {activeTab !== "consent" ? (
              <Button
                onClick={() => {
                  if (activeTab === "info") setActiveTab("measurements")
                  if (activeTab === "measurements") setActiveTab("consent")
                }}
              >
                Siguiente
              </Button>
            ) : (
              <Button disabled={!consentChecked}>Guardar Registro</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

