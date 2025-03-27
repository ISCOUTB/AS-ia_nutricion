"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Save, RefreshCw } from "lucide-react"
import { useForm } from "react-hook-form"

export function ConfiguracionConsentimientos() {
  const form = useForm({
    defaultValues: {
      duracionConsentimiento: 12,
      recordatorioRenovacion: 30,
      notificacionesEmail: true,
      notificacionesSistema: true,
      recordatoriosPendientes: true,
      almacenamientoDatos: "cifrado",
      firmaDigital: true,
      permitirRevocacion: true,
      plantillaPersonalizada: false,
    },
  })

  const onSubmit = (data: any) => {
    console.log(data)
    // Aquí iría la lógica para guardar la configuración
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Consentimientos</CardTitle>
          <CardDescription>
            Personalice las opciones de gestión de consentimientos según sus necesidades
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-2">Configuración General</h3>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="duracionConsentimiento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Duración del consentimiento (meses)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Slider
                              min={1}
                              max={24}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-[60%]"
                            />
                            <span className="w-12 text-center">{field.value}</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Establece el período de validez de los consentimientos antes de requerir renovación
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recordatorioRenovacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recordatorio de renovación (días antes)</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <Slider
                              min={1}
                              max={60}
                              step={1}
                              defaultValue={[field.value]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-[60%]"
                            />
                            <span className="w-12 text-center">{field.value}</span>
                          </div>
                        </FormControl>
                        <FormDescription>
                          Días antes de la expiración para enviar recordatorios de renovación
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Notificaciones</h3>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="notificacionesEmail"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Notificaciones por correo electrónico</FormLabel>
                          <FormDescription>
                            Enviar notificaciones por correo cuando se requiera firma o renovación
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="notificacionesSistema"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Notificaciones en el sistema</FormLabel>
                          <FormDescription>
                            Mostrar notificaciones en el panel de control para los usuarios
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="recordatoriosPendientes"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Recordatorios automáticos</FormLabel>
                          <FormDescription>
                            Enviar recordatorios periódicos para consentimientos pendientes
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Seguridad y Privacidad</h3>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="almacenamientoDatos"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de almacenamiento de datos</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cifrado" />
                              </FormControl>
                              <FormLabel className="font-normal">Cifrado de extremo a extremo (recomendado)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="estandar" />
                              </FormControl>
                              <FormLabel className="font-normal">Almacenamiento estándar</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormDescription>
                          Define cómo se almacenarán los datos de consentimiento en el sistema
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="firmaDigital"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Habilitar firma digital</FormLabel>
                          <FormDescription>Permitir la firma digital de documentos de consentimiento</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="permitirRevocacion"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Permitir revocación de consentimiento</FormLabel>
                          <FormDescription>
                            Los representantes pueden revocar el consentimiento en cualquier momento
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-2">Personalización</h3>
                <Separator className="mb-4" />
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="plantillaPersonalizada"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel>Usar plantillas personalizadas</FormLabel>
                          <FormDescription>Personalizar las plantillas de documentos de consentimiento</FormDescription>
                        </div>
                        <FormControl>
                          <Switch checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" type="button">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Restaurar valores predeterminados
                </Button>
                <Button type="submit">
                  <Save className="mr-2 h-4 w-4" />
                  Guardar configuración
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Información Legal</CardTitle>
          <CardDescription>Información sobre el marco legal y normativo aplicable</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Marco Normativo</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Este sistema opera bajo los principios establecidos en la Ley 1581 de 2012 y el Decreto 1377 de 2013,
                  que regulan la protección de datos personales en Colombia, con especial énfasis en la protección de
                  información sensible de menores.
                </p>
                <p className="text-sm text-muted-foreground">
                  Todos los consentimientos gestionados a través de esta plataforma cumplen con los requisitos legales
                  establecidos para el tratamiento de datos personales de menores de edad.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Responsabilidades y Acceso</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Solo el equipo de investigación autorizado tendrá acceso a los datos personales, bajo estrictos
                  controles de acceso.
                </p>
                <p className="text-sm text-muted-foreground">
                  El equipo investigador se compromete a cumplir con esta política y a informar a los participantes
                  sobre cualquier eventualidad relacionada con la seguridad de sus datos.
                </p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Conservación y Eliminación de Datos</AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground mb-2">
                  Los datos personales se conservarán únicamente por el tiempo necesario para alcanzar los objetivos del
                  estudio. Una vez finalizado el estudio, los datos sensibles que no sean necesarios para
                  investigaciones futuras se eliminarán de forma segura.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}

