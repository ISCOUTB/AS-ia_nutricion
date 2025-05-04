"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfiguracionGeneral } from "./configuracion-general"
import { ConfiguracionCuenta } from "./configuracion-cuenta"
import { ConfiguracionNotificaciones } from "./configuracion-notificaciones"
import { ConfiguracionAplicacion } from "./configuracion-aplicacion"
import { ConfiguracionDatos } from "./configuracion-datos"
import { ConfiguracionIntegracion } from "./configuracion-integracion"
import { DashboardLayout } from "../dashboard-layout"
import { Settings, User, Bell, Palette, Database, Link } from "lucide-react"

export function ConfiguracionModule() {
  return (
    <DashboardLayout>
      <div className="flex flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Configuración</h2>
          </div>
          <Tabs defaultValue="general" className="space-y-4">
            <TabsList className="grid grid-cols-6 w-full md:w-fit">
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">General</span>
              </TabsTrigger>
              <TabsTrigger value="cuenta" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Cuenta</span>
              </TabsTrigger>
              <TabsTrigger value="notificaciones" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notificaciones</span>
              </TabsTrigger>
              <TabsTrigger value="aplicacion" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Aplicación</span>
              </TabsTrigger>
              <TabsTrigger value="datos" className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="hidden sm:inline">Datos</span>
              </TabsTrigger>
              <TabsTrigger value="integracion" className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <span className="hidden sm:inline">Integración</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración General</CardTitle>
                  <CardDescription>Configura los ajustes generales de la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConfiguracionGeneral />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="cuenta" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Cuenta</CardTitle>
                  <CardDescription>Gestiona tu perfil y preferencias de cuenta</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConfiguracionCuenta />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notificaciones" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Notificaciones</CardTitle>
                  <CardDescription>Personaliza cómo y cuándo recibes notificaciones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConfiguracionNotificaciones />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="aplicacion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Aplicación</CardTitle>
                  <CardDescription>Personaliza la apariencia y comportamiento de la aplicación</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConfiguracionAplicacion />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="datos" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Datos</CardTitle>
                  <CardDescription>Gestiona la importación, exportación y respaldo de datos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConfiguracionDatos />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="integracion" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración de Integración</CardTitle>
                  <CardDescription>Configura integraciones con servicios externos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ConfiguracionIntegracion />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </DashboardLayout>
  )
}
