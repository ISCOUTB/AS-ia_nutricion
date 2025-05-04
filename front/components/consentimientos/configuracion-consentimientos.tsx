import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConfiguracionConsentimientos() {
  return (
    <Tabs defaultValue="general">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="notificaciones">Notificaciones</TabsTrigger>
        <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General</CardTitle>
              <CardDescription>Configure los ajustes generales del módulo de consentimientos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="prefijo-codigo">Prefijo para códigos de consentimiento</Label>
                  <Input id="prefijo-codigo" defaultValue="CON-" />
                  <p className="text-sm text-muted-foreground">
                    Este prefijo se utilizará para generar los códigos de consentimiento (ej. CON-2023-001)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dias-vencimiento">Días para vencimiento de consentimientos</Label>
                  <Input id="dias-vencimiento" type="number" defaultValue="365" />
                  <p className="text-sm text-muted-foreground">
                    Número de días después de los cuales un consentimiento se considera vencido
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="switch-recordatorios">Recordatorios automáticos</Label>
                    <p className="text-sm text-muted-foreground">
                      Enviar recordatorios automáticos para consentimientos pendientes
                    </p>
                  </div>
                  <Switch id="switch-recordatorios" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="switch-vencimiento">Alertas de vencimiento</Label>
                    <p className="text-sm text-muted-foreground">
                      Mostrar alertas para consentimientos próximos a vencer
                    </p>
                  </div>
                  <Switch id="switch-vencimiento" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="switch-firma-electronica">Firma electrónica</Label>
                    <p className="text-sm text-muted-foreground">Permitir firma electrónica de consentimientos</p>
                  </div>
                  <Switch id="switch-firma-electronica" defaultChecked />
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tipos de Consentimiento</CardTitle>
              <CardDescription>Gestione los tipos de consentimiento disponibles en el sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {tiposConsentimiento.map((tipo) => (
                  <div key={tipo.id} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <p className="font-medium">{tipo.nombre}</p>
                      <p className="text-sm text-muted-foreground">{tipo.descripcion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      {!tipo.predeterminado && (
                        <Button variant="outline" size="sm" className="text-red-500">
                          Eliminar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Añadir nuevo tipo</h3>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-tipo">Nombre del tipo</Label>
                    <Input id="nombre-tipo" placeholder="Ej: Consentimiento para evaluación antropométrica" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="codigo-tipo">Código del tipo</Label>
                    <Input id="codigo-tipo" placeholder="Ej: ANTRO" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descripcion-tipo">Descripción</Label>
                  <Textarea id="descripcion-tipo" placeholder="Describa brevemente este tipo de consentimiento" />
                </div>
                <div className="flex justify-end">
                  <Button>Añadir Tipo</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="notificaciones">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Notificaciones</CardTitle>
            <CardDescription>
              Configure cómo y cuándo se envían las notificaciones relacionadas con consentimientos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Canales de notificación</h3>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="switch-email">Correo electrónico</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificaciones por correo electrónico</p>
                </div>
                <Switch id="switch-email" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="switch-sms">SMS</Label>
                  <p className="text-sm text-muted-foreground">Enviar notificaciones por SMS</p>
                </div>
                <Switch id="switch-sms" />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="switch-app">Notificaciones en la aplicación</Label>
                  <p className="text-sm text-muted-foreground">Mostrar notificaciones dentro de la aplicación</p>
                </div>
                <Switch id="switch-app" defaultChecked />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Eventos de notificación</h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-nuevo">Nuevo consentimiento creado</Label>
                  <Switch id="switch-nuevo" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-enviado">Consentimiento enviado para firma</Label>
                  <Switch id="switch-enviado" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-firmado">Consentimiento firmado</Label>
                  <Switch id="switch-firmado" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-rechazado">Consentimiento rechazado</Label>
                  <Switch id="switch-rechazado" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-vencimiento-proximo">Vencimiento próximo</Label>
                  <Switch id="switch-vencimiento-proximo" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="switch-vencido">Consentimiento vencido</Label>
                  <Switch id="switch-vencido" defaultChecked />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Recordatorios</h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="dias-recordatorio">Días antes del vencimiento para enviar recordatorio</Label>
                  <Input id="dias-recordatorio" type="number" defaultValue="30" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frecuencia-recordatorio">Frecuencia de recordatorios para pendientes (días)</Label>
                  <Input id="frecuencia-recordatorio" type="number" defaultValue="3" />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button>Guardar Cambios</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="plantillas">
        <Card>
          <CardHeader>
            <CardTitle>Configuración de Plantillas</CardTitle>
            <CardDescription>
              Configure las plantillas de correo electrónico y mensajes para notificaciones
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="select-plantilla">Seleccionar plantilla</Label>
                <Select defaultValue="nuevo">
                  <SelectTrigger id="select-plantilla">
                    <SelectValue placeholder="Seleccione una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nuevo">Nuevo consentimiento</SelectItem>
                    <SelectItem value="recordatorio">Recordatorio de firma</SelectItem>
                    <SelectItem value="confirmacion">Confirmación de firma</SelectItem>
                    <SelectItem value="vencimiento">Aviso de vencimiento</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asunto-plantilla">Asunto</Label>
                <Input id="asunto-plantilla" defaultValue="Nuevo consentimiento para su firma - [Código]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contenido-plantilla">Contenido</Label>
                <Textarea
                  id="contenido-plantilla"
                  className="min-h-[200px]"
                  defaultValue={`Estimado/a [Nombre],

Se ha creado un nuevo consentimiento [Código] que requiere su firma.

Por favor, acceda al siguiente enlace para revisar y firmar el documento:
[Enlace]

Si tiene alguna pregunta, no dude en contactarnos.

Atentamente,
El equipo de NutriKids`}
                />
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Variables disponibles:</h4>
                <p className="text-sm text-muted-foreground">
                  [Nombre], [Código], [Tipo], [Fecha], [Enlace], [DiasRestantes]
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Vista previa</Button>
              <Button>Guardar Plantilla</Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

// Datos de ejemplo
const tiposConsentimiento = [
  {
    id: 1,
    nombre: "Evaluación Nutricional",
    codigo: "EVAL",
    descripcion: "Consentimiento para realizar evaluación nutricional inicial",
    predeterminado: true,
  },
  {
    id: 2,
    nombre: "Seguimiento Nutricional",
    codigo: "SEG",
    descripcion: "Consentimiento para realizar seguimiento nutricional periódico",
    predeterminado: true,
  },
  {
    id: 3,
    nombre: "Intervención Nutricional",
    codigo: "INT",
    descripcion: "Consentimiento para realizar intervención nutricional específica",
    predeterminado: true,
  },
  {
    id: 4,
    nombre: "Uso de Datos para Investigación",
    codigo: "INV",
    descripcion: "Consentimiento para utilizar datos anonimizados en investigaciones",
    predeterminado: false,
  },
]
