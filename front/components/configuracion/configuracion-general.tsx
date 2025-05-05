"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useCustomToast } from "@/components/ui/custom-toast"

const formSchema = z.object({
  organizationName: z.string().min(2, {
    message: "El nombre de la organización debe tener al menos 2 caracteres.",
  }),
  language: z.string({
    required_error: "Por favor selecciona un idioma.",
  }),
  timezone: z.string({
    required_error: "Por favor selecciona una zona horaria.",
  }),
  dateFormat: z.string({
    required_error: "Por favor selecciona un formato de fecha.",
  }),
  enableAnalytics: z.boolean().default(true),
  enableNotifications: z.boolean().default(true),
})

export function ConfiguracionGeneral() {
  const { toast } = useCustomToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationName: "Centro Nutricional Infantil",
      language: "es",
      timezone: "America/Mexico_City",
      dateFormat: "DD/MM/YYYY",
      enableAnalytics: true,
      enableNotifications: true,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulación de guardado
    setTimeout(() => {
      console.log(values)
      toast({
        title: "Configuración guardada",
        description: "La configuración general ha sido actualizada correctamente.",
        variant: "success",
      })
    }, 500)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración General</CardTitle>
        <CardDescription>Configura los ajustes básicos de tu organización y preferencias del sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="organizationName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Organización</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de tu organización" {...field} />
                  </FormControl>
                  <FormDescription>Este nombre aparecerá en reportes y documentos oficiales.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Idioma</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un idioma" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">Inglés</SelectItem>
                        <SelectItem value="pt">Portugués</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Zona Horaria</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una zona horaria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                        <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                        <SelectItem value="America/Santiago">Santiago (GMT-4)</SelectItem>
                        <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="dateFormat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formato de Fecha</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un formato de fecha" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                      <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                      <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="enableAnalytics"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Análisis y Estadísticas</FormLabel>
                      <FormDescription>Habilitar recopilación de datos para análisis y mejoras.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="enableNotifications"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Notificaciones del Sistema</FormLabel>
                      <FormDescription>Recibir alertas y notificaciones importantes.</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Guardar Cambios</Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t bg-muted/50 p-6 text-sm text-muted-foreground">
        Los cambios en la configuración general se aplicarán a todos los usuarios del sistema.
      </CardFooter>
    </Card>
  )
}
