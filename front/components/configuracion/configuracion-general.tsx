"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export function ConfiguracionGeneral() {
  const [settings, setSettings] = useState({
    language: "es",
    timezone: "America/Bogota",
    dateFormat: "DD/MM/YYYY",
    timeFormat: "24h",
    enableAnalytics: true,
    enableTelemetry: false,
    autoSave: true,
    autoSaveInterval: "5",
  })

  const { toast } = useToast()

  const handleChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    // Aquí iría la lógica para guardar la configuración
    toast({
      title: "Configuración guardada",
      description: "Los cambios han sido guardados correctamente.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Preferencias regionales</h3>
        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="language">Idioma</Label>
            <Select value={settings.language} onValueChange={(value) => handleChange("language", value)}>
              <SelectTrigger id="language">
                <SelectValue placeholder="Seleccionar idioma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timezone">Zona horaria</Label>
            <Select value={settings.timezone} onValueChange={(value) => handleChange("timezone", value)}>
              <SelectTrigger id="timezone">
                <SelectValue placeholder="Seleccionar zona horaria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="America/Bogota">Bogotá (GMT-5)</SelectItem>
                <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                <SelectItem value="America/Santiago">Santiago (GMT-4)</SelectItem>
                <SelectItem value="America/Buenos_Aires">Buenos Aires (GMT-3)</SelectItem>
                <SelectItem value="Europe/Madrid">Madrid (GMT+1)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="dateFormat">Formato de fecha</Label>
            <Select value={settings.dateFormat} onValueChange={(value) => handleChange("dateFormat", value)}>
              <SelectTrigger id="dateFormat">
                <SelectValue placeholder="Seleccionar formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeFormat">Formato de hora</Label>
            <Select value={settings.timeFormat} onValueChange={(value) => handleChange("timeFormat", value)}>
              <SelectTrigger id="timeFormat">
                <SelectValue placeholder="Seleccionar formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">24 horas</SelectItem>
                <SelectItem value="12h">12 horas (AM/PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Privacidad y datos</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="analytics">Análisis de uso</Label>
            <p className="text-sm text-muted-foreground">
              Permitir recopilar datos anónimos para mejorar la aplicación
            </p>
          </div>
          <Switch
            id="analytics"
            checked={settings.enableAnalytics}
            onCheckedChange={(checked) => handleChange("enableAnalytics", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="telemetry">Telemetría</Label>
            <p className="text-sm text-muted-foreground">Enviar informes de errores y diagnóstico</p>
          </div>
          <Switch
            id="telemetry"
            checked={settings.enableTelemetry}
            onCheckedChange={(checked) => handleChange("enableTelemetry", checked)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Guardado automático</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoSave">Guardar automáticamente</Label>
            <p className="text-sm text-muted-foreground">Guardar cambios automáticamente mientras trabajas</p>
          </div>
          <Switch
            id="autoSave"
            checked={settings.autoSave}
            onCheckedChange={(checked) => handleChange("autoSave", checked)}
          />
        </div>

        {settings.autoSave && (
          <div className="space-y-2">
            <Label htmlFor="autoSaveInterval">Intervalo de guardado (minutos)</Label>
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                id="autoSaveInterval"
                type="number"
                value={settings.autoSaveInterval}
                onChange={(e) => handleChange("autoSaveInterval", e.target.value)}
                min="1"
                max="60"
              />
              <span className="text-sm text-muted-foreground">minutos</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Guardar cambios</Button>
      </div>
    </div>
  )
}
