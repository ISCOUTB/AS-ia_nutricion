"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useCustomToast } from "@/components/ui/custom-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Download, Upload, Database, Save, AlertTriangle, FileText, RefreshCw } from "lucide-react"

export function ConfiguracionDatos() {
  const { toast } = useCustomToast()

  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: "daily",
    backupLocation: "cloud",
    retentionPeriod: "30",
    compressionLevel: "medium",
    encryptBackups: true,
    lastBackup: "2023-04-20T14:30:00",
    dataFormat: "json",
  })

  const [importProgress, setImportProgress] = useState(0)
  const [exportProgress, setExportProgress] = useState(0)
  const [isImporting, setIsImporting] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "La configuración de datos ha sido actualizada.",
      variant: "success",
    })
  }

  const handleImport = () => {
    setIsImporting(true)
    setImportProgress(0)

    // Simulación de progreso
    const interval = setInterval(() => {
      setImportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsImporting(false)
          toast({
            title: "Importación completada",
            description: "Los datos han sido importados correctamente.",
            variant: "success",
          })
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleExport = () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulación de progreso
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          toast({
            title: "Exportación completada",
            description: "Los datos han sido exportados correctamente.",
            variant: "success",
          })
          return 100
        }
        return prev + 20
      })
    }, 300)
  }

  const handleBackupNow = () => {
    toast({
      title: "Respaldo iniciado",
      description: "El respaldo manual ha sido iniciado. Esto puede tomar unos minutos.",
    })

    // Simulación de respaldo
    setTimeout(() => {
      toast({
        title: "Respaldo completado",
        description: "El respaldo manual ha sido completado exitosamente.",
        variant: "success",
      })

      setSettings((prev) => ({
        ...prev,
        lastBackup: new Date().toISOString(),
      }))
    }, 3000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Importación y exportación</h3>
        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Importar datos</Label>
              <p className="text-sm text-muted-foreground">Importa datos desde un archivo externo</p>
              <div className="flex items-center gap-2">
                <Input type="file" className="flex-1" />
                <Button onClick={handleImport} disabled={isImporting} className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Importar
                </Button>
              </div>
              {isImporting && (
                <div className="space-y-1">
                  <Progress value={importProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{importProgress}%</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Exportar datos</Label>
              <p className="text-sm text-muted-foreground">Exporta tus datos a un archivo</p>
              <div className="space-y-2">
                <Select value={settings.dataFormat} onValueChange={(value) => handleChange("dataFormat", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Formato de datos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">JSON</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                    <SelectItem value="pdf">PDF</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExport} disabled={isExporting} className="w-full flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Exportar datos
                </Button>
              </div>
              {isExporting && (
                <div className="space-y-1">
                  <Progress value={exportProgress} className="h-2" />
                  <p className="text-xs text-muted-foreground text-right">{exportProgress}%</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Respaldos automáticos</h3>
        <Separator />

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Importante</AlertTitle>
          <AlertDescription>
            Los respaldos regulares son esenciales para prevenir la pérdida de datos. Recomendamos habilitar los
            respaldos automáticos.
          </AlertDescription>
        </Alert>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="autoBackup">Respaldos automáticos</Label>
            <p className="text-sm text-muted-foreground">Realiza respaldos automáticos de tus datos</p>
          </div>
          <Switch
            id="autoBackup"
            checked={settings.autoBackup}
            onCheckedChange={(checked) => handleChange("autoBackup", checked)}
          />
        </div>

        {settings.autoBackup && (
          <>
            <div className="space-y-2">
              <Label htmlFor="backupFrequency">Frecuencia de respaldo</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => handleChange("backupFrequency", value)}
              >
                <SelectTrigger id="backupFrequency">
                  <SelectValue placeholder="Seleccionar frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Cada hora</SelectItem>
                  <SelectItem value="daily">Diario</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="monthly">Mensual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backupLocation">Ubicación de respaldo</Label>
              <Select value={settings.backupLocation} onValueChange={(value) => handleChange("backupLocation", value)}>
                <SelectTrigger id="backupLocation">
                  <SelectValue placeholder="Seleccionar ubicación" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="local">Almacenamiento local</SelectItem>
                  <SelectItem value="cloud">Nube (recomendado)</SelectItem>
                  <SelectItem value="both">Local y nube</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="retentionPeriod">Período de retención (días)</Label>
                <Input
                  id="retentionPeriod"
                  type="number"
                  value={settings.retentionPeriod}
                  onChange={(e) => handleChange("retentionPeriod", e.target.value)}
                  min="1"
                  max="365"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="compressionLevel">Nivel de compresión</Label>
                <Select
                  value={settings.compressionLevel}
                  onValueChange={(value) => handleChange("compressionLevel", value)}
                >
                  <SelectTrigger id="compressionLevel">
                    <SelectValue placeholder="Seleccionar nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin compresión</SelectItem>
                    <SelectItem value="low">Baja</SelectItem>
                    <SelectItem value="medium">Media</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="encryptBackups">Cifrar respaldos</Label>
                <p className="text-sm text-muted-foreground">Protege tus respaldos con cifrado</p>
              </div>
              <Switch
                id="encryptBackups"
                checked={settings.encryptBackups}
                onCheckedChange={(checked) => handleChange("encryptBackups", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm">Último respaldo: {new Date(settings.lastBackup).toLocaleString()}</p>
              </div>
              <Button variant="outline" onClick={handleBackupNow} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Respaldar ahora
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mantenimiento de datos</h3>
        <Separator />

        <div className="grid gap-4 md:grid-cols-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Optimizar base de datos
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Verificar integridad de datos
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Sincronizar datos
          </Button>

          <Button variant="destructive" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Limpiar datos temporales
          </Button>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Guardar configuración</Button>
      </div>
    </div>
  )
}
