"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Link, Globe, Mail, MessageSquare, FileText, Database, Cloud, AlertCircle, Check, X } from "lucide-react"

export function ConfiguracionIntegracion() {
  const [integrations, setIntegrations] = useState({
    email: {
      enabled: true,
      connected: true,
      provider: "smtp",
      apiKey: "••••••••••••••••",
      server: "smtp.example.com",
      port: "587",
    },
    sms: {
      enabled: false,
      connected: false,
      provider: "",
      apiKey: "",
    },
    storage: {
      enabled: true,
      connected: true,
      provider: "aws",
      apiKey: "••••••••••••••••",
      bucket: "nutrition-data",
    },
    analytics: {
      enabled: true,
      connected: true,
      provider: "google",
      trackingId: "UA-12345678-9",
    },
    maps: {
      enabled: false,
      connected: false,
      provider: "",
      apiKey: "",
    },
    calendar: {
      enabled: false,
      connected: false,
      provider: "",
      apiKey: "",
    },
  })

  const { toast } = useToast()

  const handleToggle = (integration: string, enabled: boolean) => {
    setIntegrations((prev) => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        enabled,
      },
    }))
  }

  const handleInputChange = (integration: string, field: string, value: string) => {
    setIntegrations((prev) => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        [field]: value,
      },
    }))
  }

  const handleConnect = (integration: string) => {
    // Simulación de conexión
    toast({
      title: "Conectando...",
      description: `Estableciendo conexión con el servicio de ${integration}`,
    })

    setTimeout(() => {
      setIntegrations((prev) => ({
        ...prev,
        [integration]: {
          ...prev[integration as keyof typeof prev],
          connected: true,
        },
      }))

      toast({
        title: "Conexión establecida",
        description: `La integración con ${integration} se ha configurado correctamente.`,
      })
    }, 1500)
  }

  const handleDisconnect = (integration: string) => {
    setIntegrations((prev) => ({
      ...prev,
      [integration]: {
        ...prev[integration as keyof typeof prev],
        connected: false,
      },
    }))

    toast({
      title: "Desconectado",
      description: `La integración con ${integration} ha sido desconectada.`,
    })
  }

  const handleSave = () => {
    toast({
      title: "Configuración guardada",
      description: "La configuración de integraciones ha sido actualizada.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Integración de correo electrónico</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Label htmlFor="emailIntegration">Servicio de correo electrónico</Label>
              {integrations.email.connected ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" /> Conectado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                  Desconectado
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Configura la integración para enviar correos desde la aplicación
            </p>
          </div>
          <Switch
            id="emailIntegration"
            checked={integrations.email.enabled}
            onCheckedChange={(checked) => handleToggle("email", checked)}
          />
        </div>

        {integrations.email.enabled && (
          <div className="space-y-4 border rounded-md p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emailProvider">Proveedor</Label>
                <Input
                  id="emailProvider"
                  value={integrations.email.provider}
                  onChange={(e) => handleInputChange("email", "provider", e.target.value)}
                  placeholder="SMTP, SendGrid, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailApiKey">API Key / Contraseña</Label>
                <Input
                  id="emailApiKey"
                  type="password"
                  value={integrations.email.apiKey}
                  onChange={(e) => handleInputChange("email", "apiKey", e.target.value)}
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emailServer">Servidor SMTP</Label>
                <Input
                  id="emailServer"
                  value={integrations.email.server}
                  onChange={(e) => handleInputChange("email", "server", e.target.value)}
                  placeholder="smtp.ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailPort">Puerto</Label>
                <Input
                  id="emailPort"
                  value={integrations.email.port}
                  onChange={(e) => handleInputChange("email", "port", e.target.value)}
                  placeholder="587"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {integrations.email.connected ? (
                <Button variant="outline" onClick={() => handleDisconnect("email")} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Desconectar
                </Button>
              ) : (
                <Button onClick={() => handleConnect("email")} className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Conectar
                </Button>
              )}

              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Probar conexión
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Integración de SMS</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Label htmlFor="smsIntegration">Servicio de SMS</Label>
              {integrations.sms.connected ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" /> Conectado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                  Desconectado
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">Configura la integración para enviar mensajes de texto</p>
          </div>
          <Switch
            id="smsIntegration"
            checked={integrations.sms.enabled}
            onCheckedChange={(checked) => handleToggle("sms", checked)}
          />
        </div>

        {integrations.sms.enabled && (
          <div className="space-y-4 border rounded-md p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="smsProvider">Proveedor</Label>
                <Input
                  id="smsProvider"
                  value={integrations.sms.provider}
                  onChange={(e) => handleInputChange("sms", "provider", e.target.value)}
                  placeholder="Twilio, MessageBird, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smsApiKey">API Key</Label>
                <Input
                  id="smsApiKey"
                  type="password"
                  value={integrations.sms.apiKey}
                  onChange={(e) => handleInputChange("sms", "apiKey", e.target.value)}
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              {integrations.sms.connected ? (
                <Button variant="outline" onClick={() => handleDisconnect("sms")} className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Desconectar
                </Button>
              ) : (
                <Button onClick={() => handleConnect("sms")} className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Conectar
                </Button>
              )}

              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Probar conexión
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Almacenamiento en la nube</h3>
        <Separator />

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Label htmlFor="storageIntegration">Servicio de almacenamiento</Label>
              {integrations.storage.connected ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  <Check className="h-3 w-3 mr-1" /> Conectado
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-gray-50 text-gray-500 border-gray-200">
                  Desconectado
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Configura el almacenamiento en la nube para documentos y archivos
            </p>
          </div>
          <Switch
            id="storageIntegration"
            checked={integrations.storage.enabled}
            onCheckedChange={(checked) => handleToggle("storage", checked)}
          />
        </div>

        {integrations.storage.enabled && (
          <div className="space-y-4 border rounded-md p-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storageProvider">Proveedor</Label>
                <Input
                  id="storageProvider"
                  value={integrations.storage.provider}
                  onChange={(e) => handleInputChange("storage", "provider", e.target.value)}
                  placeholder="AWS S3, Google Cloud Storage, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="storageApiKey">API Key / Credenciales</Label>
                <Input
                  id="storageApiKey"
                  type="password"
                  value={integrations.storage.apiKey}
                  onChange={(e) => handleInputChange("storage", "apiKey", e.target.value)}
                  placeholder="••••••••••••••••"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="storageBucket">Bucket / Contenedor</Label>
              <Input
                id="storageBucket"
                value={integrations.storage.bucket}
                onChange={(e) => handleInputChange("storage", "bucket", e.target.value)}
                placeholder="nombre-del-bucket"
              />
            </div>

            <div className="flex justify-end gap-2">
              {integrations.storage.connected ? (
                <Button
                  variant="outline"
                  onClick={() => handleDisconnect("storage")}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  Desconectar
                </Button>
              ) : (
                <Button onClick={() => handleConnect("storage")} className="flex items-center gap-2">
                  <Cloud className="h-4 w-4" />
                  Conectar
                </Button>
              )}

              <Button variant="outline" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Probar conexión
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Otras integraciones</h3>
        <Separator />

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Información</AlertTitle>
          <AlertDescription>
            Puedes conectar servicios adicionales para ampliar las funcionalidades de la aplicación.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>Google Analytics</Label>
                  <p className="text-xs text-muted-foreground">Análisis de uso</p>
                </div>
              </div>
              <Switch
                checked={integrations.analytics.enabled}
                onCheckedChange={(checked) => handleToggle("analytics", checked)}
              />
            </div>
            {integrations.analytics.enabled && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() =>
                  integrations.analytics.connected ? handleDisconnect("analytics") : handleConnect("analytics")
                }
              >
                {integrations.analytics.connected ? "Configurado" : "Configurar"}
              </Button>
            )}
          </div>

          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>Google Maps</Label>
                  <p className="text-xs text-muted-foreground">Mapas y ubicaciones</p>
                </div>
              </div>
              <Switch
                checked={integrations.maps.enabled}
                onCheckedChange={(checked) => handleToggle("maps", checked)}
              />
            </div>
            {integrations.maps.enabled && (
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => (integrations.maps.connected ? handleDisconnect("maps") : handleConnect("maps"))}
              >
                {integrations.maps.connected ? "Configurado" : "Configurar"}
              </Button>
            )}
          </div>

          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>API Externa</Label>
                  <p className="text-xs text-muted-foreground">Conexión a API de terceros</p>
                </div>
              </div>
              <Switch checked={false} />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Configurar
            </Button>
          </div>

          <div className="border rounded-md p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label>Webhook</Label>
                  <p className="text-xs text-muted-foreground">Notificaciones a sistemas externos</p>
                </div>
              </div>
              <Switch checked={false} />
            </div>
            <Button variant="outline" size="sm" className="w-full">
              Configurar
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave}>Guardar configuración</Button>
      </div>
    </div>
  )
}
