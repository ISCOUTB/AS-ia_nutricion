"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { useCustomToast } from "@/components/ui/custom-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ModeToggle } from "../mode-toggle"

export function ConfiguracionAplicacion() {
  const { toast } = useCustomToast()

  const [settings, setSettings] = useState({
    theme: "system",
    fontSize: 16,
    highContrast: false,
    reducedMotion: false,
    compactMode: false,
    sidebarCollapsed: false,
    showTips: true,
    confirmActions: true,
    autoRefresh: true,
    refreshInterval: 5,
    colorScheme: "default",
  })

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "Los cambios de apariencia han sido aplicados.",
      variant: "success",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Tema y apariencia</h3>
        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Modo de color</Label>
              <p className="text-sm text-muted-foreground">
                Cambia entre modo claro, oscuro o usa la configuración del sistema
              </p>
            </div>
            <ModeToggle />
          </div>

          <div className="space-y-2">
            <Label htmlFor="colorScheme">Esquema de color</Label>
            <Select value={settings.colorScheme} onValueChange={(value) => handleChange("colorScheme", value)}>
              <SelectTrigger id="colorScheme" className="w-full">
                <SelectValue placeholder="Seleccionar esquema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Morado (Predeterminado)</SelectItem>
                <SelectItem value="blue">Azul</SelectItem>
                <SelectItem value="green">Verde</SelectItem>
                <SelectItem value="orange">Naranja</SelectItem>
                <SelectItem value="red">Rojo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="fontSize">Tamaño de fuente</Label>
              <span className="text-sm">{settings.fontSize}px</span>
            </div>
            <Slider
              id="fontSize"
              min={12}
              max={20}
              step={1}
              value={[settings.fontSize]}
              onValueChange={(value) => handleChange("fontSize", value[0])}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="highContrast">Alto contraste</Label>
              <p className="text-sm text-muted-foreground">Aumenta el contraste para mejorar la legibilidad</p>
            </div>
            <Switch
              id="highContrast"
              checked={settings.highContrast}
              onCheckedChange={(checked) => handleChange("highContrast", checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reducedMotion">Movimiento reducido</Label>
              <p className="text-sm text-muted-foreground">Reduce o elimina las animaciones en la interfaz</p>
            </div>
            <Switch
              id="reducedMotion"
              checked={settings.reducedMotion}
              onCheckedChange={(checked) => handleChange("reducedMotion", checked)}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Diseño de la interfaz</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="compactMode">Modo compacto</Label>
            <p className="text-sm text-muted-foreground">Reduce el espaciado para mostrar más contenido</p>
          </div>
          <Switch
            id="compactMode"
            checked={settings.compactMode}
            onCheckedChange={(checked) => handleChange("compactMode", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="sidebarCollapsed">Barra lateral colapsada por defecto</Label>
            <p className="text-sm text-muted-foreground">Inicia con la barra lateral minimizada</p>
          </div>
          <Switch
            id="sidebarCollapsed"
            checked={settings.sidebarCollapsed}
            onCheckedChange={(checked) => handleChange("sidebarCollapsed", checked)}
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Comportamiento</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="showTips">Mostrar consejos y ayudas</Label>
            <p className="text-sm text-muted-foreground">
              Muestra consejos y ayudas contextuales mientras usas la aplicación
            </p>
          </div>
          <Switch
            id="showTips"
            checked={settings.showTips}
            onCheckedChange={(checked) => handleChange("showTips", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="confirmActions">Confirmar acciones importantes</Label>
            <p className="text-sm text-muted-foreground">Solicita confirmación antes de realizar acciones críticas</p>
          </div>
          <Switch
            id="confirmActions"
            checked={settings.confirmActions}
            onCheckedChange={(checked) => handleChange("confirmActions", checked)}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoRefresh">Actualización automática</Label>
            <p className="text-sm text-muted-foreground">Actualiza automáticamente los datos en tiempo real</p>
          </div>
          <Switch
            id="autoRefresh"
            checked={settings.autoRefresh}
            onCheckedChange={(checked) => handleChange("autoRefresh", checked)}
          />
        </div>

        {settings.autoRefresh && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="refreshInterval">Intervalo de actualización</Label>
              <span className="text-sm">{settings.refreshInterval} minutos</span>
            </div>
            <Slider
              id="refreshInterval"
              min={1}
              max={30}
              step={1}
              value={[settings.refreshInterval]}
              onValueChange={(value) => handleChange("refreshInterval", value[0])}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Guardar cambios</Button>
      </div>
    </div>
  )
}
