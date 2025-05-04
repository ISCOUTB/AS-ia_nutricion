"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCustomToast } from "@/components/ui/custom-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function ConfiguracionNotificaciones() {
  const { toast } = useCustomToast()

  const [notifications, setNotifications] = useState({
    email: {
      enabled: true,
      frequency: "immediate",
      types: {
        alerts: true,
        reports: true,
        updates: false,
        reminders: true,
      },
    },
    push: {
      enabled: true,
      types: {
        alerts: true,
        reports: false,
        updates: true,
        reminders: true,
      },
    },
    sms: {
      enabled: false,
      types: {
        alerts: true,
        reports: false,
        updates: false,
        reminders: false,
      },
    },
    digest: "daily",
  })

  const handleToggle = (category: string, type: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        types: {
          ...prev[category as keyof typeof prev].types,
          [type]: value,
        },
      },
    }))
  }

  const handleCategoryToggle = (category: string, value: boolean) => {
    setNotifications((prev) => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        enabled: value,
      },
    }))
  }

  const handleDigestChange = (value: string) => {
    setNotifications((prev) => ({
      ...prev,
      digest: value,
    }))
  }

  const handleFrequencyChange = (value: string) => {
    setNotifications((prev) => ({
      ...prev,
      email: {
        ...prev.email,
        frequency: value,
      },
    }))
  }

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Tus preferencias de notificaciones han sido actualizadas.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notificaciones por correo electrónico</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNotifications">Activar notificaciones por correo</Label>
            <p className="text-sm text-muted-foreground">Recibe actualizaciones importantes en tu correo electrónico</p>
          </div>
          <Switch
            id="emailNotifications"
            checked={notifications.email.enabled}
            onCheckedChange={(checked) => handleCategoryToggle("email", checked)}
          />
        </div>

        {notifications.email.enabled && (
          <>
            <div className="space-y-2">
              <Label htmlFor="emailFrequency">Frecuencia de correos</Label>
              <RadioGroup
                id="emailFrequency"
                value={notifications.email.frequency}
                onValueChange={handleFrequencyChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate">Inmediata</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hourly" id="hourly" />
                  <Label htmlFor="hourly">Resumen por hora</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="daily" id="daily" />
                  <Label htmlFor="daily">Resumen diario</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Tipos de notificaciones por correo</Label>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAlerts" className="flex-1">
                    Alertas nutricionales
                  </Label>
                  <Switch
                    id="emailAlerts"
                    checked={notifications.email.types.alerts}
                    onCheckedChange={(checked) => handleToggle("email", "alerts", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailReports" className="flex-1">
                    Informes y reportes
                  </Label>
                  <Switch
                    id="emailReports"
                    checked={notifications.email.types.reports}
                    onCheckedChange={(checked) => handleToggle("email", "reports", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailUpdates" className="flex-1">
                    Actualizaciones del sistema
                  </Label>
                  <Switch
                    id="emailUpdates"
                    checked={notifications.email.types.updates}
                    onCheckedChange={(checked) => handleToggle("email", "updates", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailReminders" className="flex-1">
                    Recordatorios
                  </Label>
                  <Switch
                    id="emailReminders"
                    checked={notifications.email.types.reminders}
                    onCheckedChange={(checked) => handleToggle("email", "reminders", checked)}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notificaciones push</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="pushNotifications">Activar notificaciones push</Label>
            <p className="text-sm text-muted-foreground">Recibe alertas en tiempo real en tu navegador</p>
          </div>
          <Switch
            id="pushNotifications"
            checked={notifications.push.enabled}
            onCheckedChange={(checked) => handleCategoryToggle("push", checked)}
          />
        </div>

        {notifications.push.enabled && (
          <div className="space-y-2">
            <Label>Tipos de notificaciones push</Label>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="pushAlerts" className="flex-1">
                  Alertas nutricionales
                </Label>
                <Switch
                  id="pushAlerts"
                  checked={notifications.push.types.alerts}
                  onCheckedChange={(checked) => handleToggle("push", "alerts", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushReports" className="flex-1">
                  Informes y reportes
                </Label>
                <Switch
                  id="pushReports"
                  checked={notifications.push.types.reports}
                  onCheckedChange={(checked) => handleToggle("push", "reports", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushUpdates" className="flex-1">
                  Actualizaciones del sistema
                </Label>
                <Switch
                  id="pushUpdates"
                  checked={notifications.push.types.updates}
                  onCheckedChange={(checked) => handleToggle("push", "updates", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="pushReminders" className="flex-1">
                  Recordatorios
                </Label>
                <Switch
                  id="pushReminders"
                  checked={notifications.push.types.reminders}
                  onCheckedChange={(checked) => handleToggle("push", "reminders", checked)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Notificaciones SMS</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="smsNotifications">Activar notificaciones SMS</Label>
            <p className="text-sm text-muted-foreground">Recibe alertas críticas por mensaje de texto</p>
          </div>
          <Switch
            id="smsNotifications"
            checked={notifications.sms.enabled}
            onCheckedChange={(checked) => handleCategoryToggle("sms", checked)}
          />
        </div>

        {notifications.sms.enabled && (
          <div className="space-y-2">
            <Label>Tipos de notificaciones SMS</Label>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="smsAlerts" className="flex-1">
                  Alertas nutricionales
                </Label>
                <Switch
                  id="smsAlerts"
                  checked={notifications.sms.types.alerts}
                  onCheckedChange={(checked) => handleToggle("sms", "alerts", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsReports" className="flex-1">
                  Informes y reportes
                </Label>
                <Switch
                  id="smsReports"
                  checked={notifications.sms.types.reports}
                  onCheckedChange={(checked) => handleToggle("sms", "reports", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="smsReminders" className="flex-1">
                  Recordatorios
                </Label>
                <Switch
                  id="smsReminders"
                  checked={notifications.sms.types.reminders}
                  onCheckedChange={(checked) => handleToggle("sms", "reminders", checked)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Resumen de actividad</h3>
        <Separator />

        <div className="space-y-2">
          <Label htmlFor="digestFrequency">Frecuencia del resumen de actividad</Label>
          <Select value={notifications.digest} onValueChange={handleDigestChange}>
            <SelectTrigger id="digestFrequency">
              <SelectValue placeholder="Seleccionar frecuencia" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="never">Nunca</SelectItem>
              <SelectItem value="daily">Diario</SelectItem>
              <SelectItem value="weekly">Semanal</SelectItem>
              <SelectItem value="monthly">Mensual</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground">
            Recibe un resumen de toda la actividad relevante según la frecuencia seleccionada
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Guardar preferencias</Button>
      </div>
    </div>
  )
}
