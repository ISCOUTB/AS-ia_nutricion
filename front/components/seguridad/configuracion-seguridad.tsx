"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, Save, RefreshCw, Shield, Key, UserCheck, Clock, FileText } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ConfiguracionSeguridad() {
  const [activeTab, setActiveTab] = useState("general")
  const [passwordLength, setPasswordLength] = useState(12)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Configuración de Seguridad</h2>
          <p className="text-muted-foreground">Ajustes de seguridad y políticas del sistema</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 w-full max-w-4xl">
          <TabsTrigger value="general">
            <Shield className="h-4 w-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="autenticacion">
            <UserCheck className="h-4 w-4 mr-2" />
            Autenticación
          </TabsTrigger>
          <TabsTrigger value="contrasenas">
            <Key className="h-4 w-4 mr-2" />
            Contraseñas
          </TabsTrigger>
          <TabsTrigger value="sesiones">
            <Clock className="h-4 w-4 mr-2" />
            Sesiones
          </TabsTrigger>
          <TabsTrigger value="auditoria">
            <FileText className="h-4 w-4 mr-2" />
            Auditoría
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración General de Seguridad</CardTitle>
              <CardDescription>Ajustes generales de seguridad del sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Modo de seguridad estricto</label>
                  <p className="text-sm text-muted-foreground">
                    Activa medidas de seguridad adicionales en todo el sistema
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Notificaciones de seguridad</label>
                  <p className="text-sm text-muted-foreground">
                    Enviar alertas por email ante eventos de seguridad importantes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Bloqueo automático por inactividad</label>
                  <p className="text-sm text-muted-foreground">Bloquear sesión después de un período de inactividad</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tiempo de inactividad (minutos)</label>
                <Select defaultValue="15">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tiempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 minutos</SelectItem>
                    <SelectItem value="10">10 minutos</SelectItem>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">60 minutos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Registro de direcciones IP</label>
                  <p className="text-sm text-muted-foreground">Registrar la dirección IP de todas las sesiones</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Certificados SSL</CardTitle>
              <CardDescription>Gestión de certificados SSL para conexiones seguras</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Certificado SSL</AlertTitle>
                <AlertDescription>
                  El certificado SSL actual vence en 45 días. Considere renovarlo pronto.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Estado:</span>
                  <span className="text-sm text-green-600">Activo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Emitido por:</span>
                  <span className="text-sm">Let's Encrypt Authority X3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Válido desde:</span>
                  <span className="text-sm">2023-01-15</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Válido hasta:</span>
                  <span className="text-sm">2023-06-15</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto">
                <RefreshCw className="h-4 w-4 mr-2" />
                Renovar Certificado
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="autenticacion" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Autenticación</CardTitle>
              <CardDescription>Ajustes relacionados con el proceso de inicio de sesión</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Autenticación de dos factores (2FA)</label>
                  <p className="text-sm text-muted-foreground">Requerir verificación adicional al iniciar sesión</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Método 2FA predeterminado</label>
                <Select defaultValue="app">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="app">Aplicación de autenticación</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="email">Correo electrónico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">2FA obligatorio para administradores</label>
                  <p className="text-sm text-muted-foreground">
                    Requerir 2FA para todos los usuarios con rol de administrador
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Bloqueo por intentos fallidos</label>
                  <p className="text-sm text-muted-foreground">
                    Bloquear cuenta después de varios intentos fallidos de inicio de sesión
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Número de intentos antes del bloqueo</label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar número" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 intentos</SelectItem>
                    <SelectItem value="5">5 intentos</SelectItem>
                    <SelectItem value="10">10 intentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Duración del bloqueo</label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar duración" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="1440">24 horas</SelectItem>
                    <SelectItem value="manual">Desbloqueo manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="contrasenas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Política de Contraseñas</CardTitle>
              <CardDescription>Configuración de requisitos para contraseñas seguras</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Longitud mínima de contraseña: {passwordLength} caracteres
                </label>
                <Slider
                  defaultValue={[12]}
                  min={8}
                  max={20}
                  step={1}
                  onValueChange={(value) => setPasswordLength(value[0])}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Requerir letras mayúsculas</label>
                  <p className="text-sm text-muted-foreground">Al menos una letra mayúscula (A-Z)</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Requerir letras minúsculas</label>
                  <p className="text-sm text-muted-foreground">Al menos una letra minúscula (a-z)</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Requerir números</label>
                  <p className="text-sm text-muted-foreground">Al menos un número (0-9)</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Requerir caracteres especiales</label>
                  <p className="text-sm text-muted-foreground">Al menos un carácter especial (!@#$%^&*)</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Evitar contraseñas comunes</label>
                  <p className="text-sm text-muted-foreground">
                    Rechazar contraseñas que aparecen en listas de contraseñas comunes
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Caducidad de contraseñas</label>
                  <p className="text-sm text-muted-foreground">Requerir cambio de contraseña periódicamente</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Período de caducidad</label>
                <Select defaultValue="90">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30">30 días</SelectItem>
                    <SelectItem value="60">60 días</SelectItem>
                    <SelectItem value="90">90 días</SelectItem>
                    <SelectItem value="180">180 días</SelectItem>
                    <SelectItem value="365">365 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Historial de contraseñas</label>
                  <p className="text-sm text-muted-foreground">Evitar reutilización de contraseñas anteriores</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Número de contraseñas a recordar</label>
                <Select defaultValue="5">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar número" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 contraseñas</SelectItem>
                    <SelectItem value="5">5 contraseñas</SelectItem>
                    <SelectItem value="10">10 contraseñas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sesiones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Sesiones</CardTitle>
              <CardDescription>Configuración de sesiones de usuario</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Duración máxima de sesión</label>
                <Select defaultValue="8">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar duración" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hora</SelectItem>
                    <SelectItem value="4">4 horas</SelectItem>
                    <SelectItem value="8">8 horas</SelectItem>
                    <SelectItem value="24">24 horas</SelectItem>
                    <SelectItem value="168">7 días</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Sesiones concurrentes</label>
                  <p className="text-sm text-muted-foreground">
                    Permitir múltiples sesiones activas para un mismo usuario
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Número máximo de sesiones concurrentes</label>
                <Select defaultValue="3">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar número" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 sesión</SelectItem>
                    <SelectItem value="2">2 sesiones</SelectItem>
                    <SelectItem value="3">3 sesiones</SelectItem>
                    <SelectItem value="5">5 sesiones</SelectItem>
                    <SelectItem value="10">10 sesiones</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Cerrar sesiones inactivas</label>
                  <p className="text-sm text-muted-foreground">Cerrar automáticamente sesiones sin actividad</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tiempo de inactividad para cierre</label>
                <Select defaultValue="30">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tiempo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutos</SelectItem>
                    <SelectItem value="30">30 minutos</SelectItem>
                    <SelectItem value="60">1 hora</SelectItem>
                    <SelectItem value="120">2 horas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Regeneración de token</label>
                  <p className="text-sm text-muted-foreground">Regenerar token de sesión periódicamente</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sesiones Activas</CardTitle>
              <CardDescription>Gestión de sesiones actualmente abiertas en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Dispositivo</TableHead>
                        <TableHead>IP</TableHead>
                        <TableHead>Inicio</TableHead>
                        <TableHead>Última actividad</TableHead>
                        <TableHead className="w-[80px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Ana García</TableCell>
                        <TableCell>Chrome / Windows</TableCell>
                        <TableCell>192.168.1.45</TableCell>
                        <TableCell>Hoy, 09:23</TableCell>
                        <TableCell>Hace 5 minutos</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Cerrar
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Carlos Rodríguez</TableCell>
                        <TableCell>Safari / macOS</TableCell>
                        <TableCell>192.168.1.50</TableCell>
                        <TableCell>Hoy, 10:12</TableCell>
                        <TableCell>Hace 15 minutos</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Cerrar
                          </Button>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>María López</TableCell>
                        <TableCell>Firefox / Ubuntu</TableCell>
                        <TableCell>192.168.1.60</TableCell>
                        <TableCell>Hoy, 11:45</TableCell>
                        <TableCell>Hace 2 minutos</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            Cerrar
                          </Button>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="destructive" className="ml-auto">
                Cerrar Todas las Sesiones
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="auditoria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Auditoría</CardTitle>
              <CardDescription>Ajustes para el registro de actividades y eventos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auditoría completa</label>
                  <p className="text-sm text-muted-foreground">Registrar todas las acciones realizadas en el sistema</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auditoría de acceso a datos sensibles</label>
                  <p className="text-sm text-muted-foreground">
                    Registrar todos los accesos a información confidencial
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auditoría de cambios de configuración</label>
                  <p className="text-sm text-muted-foreground">
                    Registrar modificaciones en la configuración del sistema
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Auditoría de autenticación</label>
                  <p className="text-sm text-muted-foreground">
                    Registrar intentos de inicio de sesión exitosos y fallidos
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Período de retención de registros</label>
                <Select defaultValue="365">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="90">90 días</SelectItem>
                    <SelectItem value="180">180 días</SelectItem>
                    <SelectItem value="365">1 año</SelectItem>
                    <SelectItem value="730">2 años</SelectItem>
                    <SelectItem value="1825">5 años</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Exportación automática de registros</label>
                  <p className="text-sm text-muted-foreground">Exportar registros de auditoría periódicamente</p>
                </div>
                <Switch />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Frecuencia de exportación</label>
                <Select defaultValue="monthly">
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar frecuencia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Diaria</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="quarterly">Trimestral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
