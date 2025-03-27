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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { ChevronRight, ChevronLeft, Check } from "lucide-react"

interface NuevoConsentimientoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NuevoConsentimientoDialog({ open, onOpenChange }: NuevoConsentimientoDialogProps) {
  const [step, setStep] = useState(1)
  const form = useForm({
    defaultValues: {
      nombreNino: "",
      representante: "",
      tipoDocumento: "",
      numeroDocumento: "",
      correoElectronico: "",
      telefono: "",
      tipoConsentimiento: "participacion",
      observaciones: "",
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
    // Aquí iría la lógica para crear el consentimiento
    onOpenChange(false)
    setStep(1)
  }

  const nextStep = () => {
    setStep(step + 1)
  }

  const prevStep = () => {
    setStep(step - 1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo Consentimiento</DialogTitle>
          <DialogDescription>
            Complete la información para generar un nuevo documento de consentimiento
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    1
                  </div>
                  <span>Información del Niño/a</span>
                  <div className="h-px flex-1 bg-border"></div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground">
                    2
                  </div>
                  <span>Información del Representante</span>
                  <div className="h-px flex-1 bg-border"></div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground">
                    3
                  </div>
                  <span>Tipo de Consentimiento</span>
                </div>
                <FormField
                  control={form.control}
                  name="nombreNino"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo del niño/a</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipoDocumento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de documento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="registro_civil">Registro Civil</SelectItem>
                            <SelectItem value="tarjeta_identidad">Tarjeta de Identidad</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="numeroDocumento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de documento</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de documento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Información del Niño/a</span>
                  <div className="h-px flex-1 bg-border"></div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    2
                  </div>
                  <span>Información del Representante</span>
                  <div className="h-px flex-1 bg-border"></div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-muted-foreground">
                    3
                  </div>
                  <span>Tipo de Consentimiento</span>
                </div>
                <FormField
                  control={form.control}
                  name="representante"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo del representante legal</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="correoElectronico"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <Input placeholder="correo@ejemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono de contacto</FormLabel>
                        <FormControl>
                          <Input placeholder="Teléfono" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Información del Niño/a</span>
                  <div className="h-px flex-1 bg-border"></div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                  <span>Información del Representante</span>
                  <div className="h-px flex-1 bg-border"></div>
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground">
                    3
                  </div>
                  <span>Tipo de Consentimiento</span>
                </div>
                <FormField
                  control={form.control}
                  name="tipoConsentimiento"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel>Tipo de consentimiento</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="participacion" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Consentimiento Informado para la Participación en el Estudio
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="recoleccion" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Autorización para la Recolección, Almacenamiento y Transferencia de Datos
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="completo" />
                            </FormControl>
                            <FormLabel className="font-normal">Paquete completo (ambos documentos)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones adicionales</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ingrese cualquier información adicional relevante"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Esta información se incluirá como notas en el registro del consentimiento
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <DialogFooter>
              {step > 1 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
              )}
              {step < 3 ? (
                <Button type="button" onClick={nextStep}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit">Generar Consentimiento</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

