"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { AlertTriangle, Bell, Mail, MessageSquare, Save, Settings, Smartphone, User, Weight, Ruler } from "lucide-react"

export function AlertsSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    autoAssign: true,
    notifyAdmin: true,
    enableReminders: true,
    reminderFrequency: "daily",
    autoResolve: false,
  })

  const [thresholdSettings, setThresholdSettings] = useState({
    weightPercentile: 25,
    heightPercentile: 25,
    weightLoss: 5,
    stagnation: 3,
  })

  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    newAlerts: true,
    statusChanges: true,
    assignments: true,
    reminders: true,
    comments: false,
    resolutions: true,
  })

  const [accessSettings, setAccessSettings] = useState({
    adminAccess: true,
    doctorAccess: true,
    nurseAccess: true,
    nutritionistAccess: true,
    readOnlyAccess: false,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración de Alertas</CardTitle>
          <CardDescription>Personalice el comportamiento del sistema de alertas</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="thresholds">Umbrales</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              <TabsTrigger value="access">Acceso</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Configuración General</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-assign">Asignación automática de alertas</Label>
                      <p className="text-xs text-muted-foreground">
                        Asignar automáticamente alertas a profesionales disponibles
                      </p>
                    </div>
                    <Switch
                      id="auto-assign"
                      checked={generalSettings.autoAssign}
                      onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, autoAssign: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="notify-admin">Notificar a administradores</Label>
                      <p className="text-xs text-muted-foreground">
                        Enviar notificaciones a administradores para alertas de alta severidad
                      </p>
                    </div>
                    <Switch
                      id="notify-admin"
                      checked={generalSettings.notifyAdmin}
                      onCheckedChange={(checked) => setGeneralSettings({ ...generalSettings, notifyAdmin: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-reminders">Habilitar recordatorios</Label>
                      <p className="text-xs text-muted-foreground">Enviar recordatorios para alertas pendientes</p>
                    </div>
                    <Switch
                      id="enable-reminders"
                      checked={generalSettings.enableReminders}
                      onCheckedChange={(checked) =>
                        setGeneralSettings({ ...generalSettings, enableReminders: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reminder-frequency">Frecuencia de recordatorios</Label>
                    <Select
                      defaultValue={generalSettings.reminderFrequency}
                      onValueChange={(value) => setGeneralSettings({ ...generalSettings, reminderFrequency: value })}
                    >
                      <SelectTrigger id="reminder-frequency">
                        <SelectValue placeholder="Seleccionar frecuencia" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Diaria</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="custom">Personalizada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="auto-resolve-days">Días para resolución automática</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="auto-resolve-days"
                        type="number"
                        placeholder="Nunca"
                        disabled={!generalSettings.autoResolve}
                        defaultValue="30"
                      />
                      <div className="flex items-center gap-2">
                        <Switch
                          id="auto-resolve"
                          checked={generalSettings.autoResolve}
                          onCheckedChange={(checked) =>
                            setGeneralSettings({ ...generalSettings, autoResolve: checked })
                          }
                        />
                        <Label htmlFor="auto-resolve" className="text-xs">
                          Activar
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="thresholds" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Umbrales de Alerta</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Configure los umbrales para la generación automática de alertas
                </p>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weight-percentile" className="flex items-center gap-2">
                          <Weight className="h-4 w-4 text-muted-foreground" />
                          Percentil de peso para alerta
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Generar alerta si el percentil de peso está por debajo de este valor
                        </p>
                      </div>
                      <div className="w-[120px] text-right">
                        <span className="text-sm font-medium">P{thresholdSettings.weightPercentile}</span>
                      </div>
                    </div>
                    <Slider
                      id="weight-percentile"
                      defaultValue={[thresholdSettings.weightPercentile]}
                      max={50}
                      step={1}
                      onValueChange={(value) =>
                        setThresholdSettings({ ...thresholdSettings, weightPercentile: value[0] })
                      }
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="height-percentile" className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-muted-foreground" />
                          Percentil de talla para alerta
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Generar alerta si el percentil de talla está por debajo de este valor
                        </p>
                      </div>
                      <div className="w-[120px] text-right">
                        <span className="text-sm font-medium">P{thresholdSettings.heightPercentile}</span>
                      </div>
                    </div>
                    <Slider
                      id="height-percentile"
                      defaultValue={[thresholdSettings.heightPercentile]}
                      max={50}
                      step={1}
                      onValueChange={(value) =>
                        setThresholdSettings({ ...thresholdSettings, heightPercentile: value[0] })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="weight-loss" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        Pérdida de peso (%)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Generar alerta si hay una pérdida de peso mayor a este porcentaje
                      </p>
                    </div>
                    <div className="w-[120px] text-right">
                      <span className="text-sm font-medium">{thresholdSettings.weightLoss}%</span>
                    </div>
                  </div>
                  <Slider
                    id="weight-loss"
                    defaultValue={[thresholdSettings.weightLoss]}
                    max={10}
                    step={0.5}
                    onValueChange={(value) => setThresholdSettings({ ...thresholdSettings, weightLoss: value[0] })}
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="stagnation" className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                        Estancamiento (meses)
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Generar alerta si no hay ganancia de peso durante este número de meses
                      </p>
                    </div>
                    <div className="w-[120px] text-right">
                      <span className="text-sm font-medium">{thresholdSettings.stagnation} meses</span>
                    </div>
                  </div>
                  <Slider
                    id="stagnation"
                    defaultValue={[thresholdSettings.stagnation]}
                    max={6}
                    step={1}
                    onValueChange={(value) => setThresholdSettings({ ...thresholdSettings, stagnation: value[0] })}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Canales de Notificación</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications">Notificaciones por correo electrónico</Label>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={notificationSettings.email}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, email: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="push-notifications">Notificaciones push</Label>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={notificationSettings.push}
                      onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, push: checked })}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-3">Tipos de Notificaciones</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="new-alerts">Nuevas alertas</Label>
                    </div>
                    <Switch
                      id="new-alerts"
                      checked={notificationSettings.newAlerts}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, newAlerts: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="status-changes">Cambios de estado</Label>
                    </div>
                    <Switch
                      id="status-changes"
                      checked={notificationSettings.statusChanges}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, statusChanges: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="assignments">Asignaciones</Label>
                    </div>
                    <Switch
                      id="assignments"
                      checked={notificationSettings.assignments}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, assignments: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="reminders">Recordatorios</Label>
                    </div>
                    <Switch
                      id="reminders"
                      checked={notificationSettings.reminders}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, reminders: checked })
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="comments">Comentarios</Label>
                    </div>
                    <Switch
                      id="comments"
                      checked={notificationSettings.comments}
                      onCheckedChange={(checked) =>
                        setNotificationSettings({ ...notificationSettings, comments: checked })
                      }
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="access" className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Permisos de Acceso</h3>
                <p className="text-xs text-muted-foreground mb-4">Configure qué roles pueden ver y gestionar alertas</p>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="admin-access">Acceso de administradores</Label>
                    </div>
                    <Switch
                      id="admin-access"
                      checked={accessSettings.adminAccess}
                      onCheckedChange={(checked) => setAccessSettings({ ...accessSettings, adminAccess: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="doctor-access">Acceso de médicos</Label>
                    </div>
                    <Switch
                      id="doctor-access"
                      checked={accessSettings.doctorAccess}
                      onCheckedChange={(checked) => setAccessSettings({ ...accessSettings, doctorAccess: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="nurse-access">Acceso de enfermeros</Label>
                    </div>
                    <Switch
                      id="nurse-access"
                      checked={accessSettings.nurseAccess}
                      onCheckedChange={(checked) => setAccessSettings({ ...accessSettings, nurseAccess: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="nutritionist-access">Acceso de nutricionistas</Label>
                    </div>
                    <Switch
                      id="nutritionist-access"
                      checked={accessSettings.nutritionistAccess}
                      onCheckedChange={(checked) =>
                        setAccessSettings({ ...accessSettings, nutritionistAccess: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-medium mb-3">Opciones de Acceso</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="read-only">Modo de solo lectura para roles no administrativos</Label>
                      <p className="text-xs text-muted-foreground">
                        Los usuarios no administrativos solo podrán ver alertas, no modificarlas
                      </p>
                    </div>
                    <Switch
                      id="read-only"
                      checked={accessSettings.readOnlyAccess}
                      onCheckedChange={(checked) => setAccessSettings({ ...accessSettings, readOnlyAccess: checked })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="default-assignee">Asignación predeterminada</Label>
                    <Select defaultValue="auto">
                      <SelectTrigger id="default-assignee">
                        <SelectValue placeholder="Seleccionar asignación predeterminada" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="auto">Automática (basada en carga)</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="doctor">Médico de turno</SelectItem>
                        <SelectItem value="nutritionist">Nutricionista</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">Restablecer valores predeterminados</Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Guardar configuración
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

