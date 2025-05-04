"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardLayout } from "@/components/dashboard-layout"
import { UsuariosRoles } from "@/components/seguridad/usuarios-roles"
import { RegistroActividad } from "@/components/seguridad/registro-actividad"
import { ConfiguracionSeguridad } from "@/components/seguridad/configuracion-seguridad"
import { GestionPermisos } from "@/components/seguridad/gestion-permisos"
import { SeguridadDashboard } from "@/components/seguridad/seguridad-dashboard"

export function SeguridadModule() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Seguridad</h1>
            <p className="text-muted-foreground">Gestión de seguridad y control de acceso del sistema</p>
          </div>
        </div>

        <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="grid grid-cols-5 w-full max-w-4xl">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="usuarios">Usuarios y Roles</TabsTrigger>
            <TabsTrigger value="permisos">Permisos</TabsTrigger>
            <TabsTrigger value="actividad">Registro de Actividad</TabsTrigger>
            <TabsTrigger value="configuracion">Configuración</TabsTrigger>
          </TabsList>

          <div className="flex-1 mt-6">
            <TabsContent value="dashboard" className="h-full">
              <SeguridadDashboard />
            </TabsContent>

            <TabsContent value="usuarios" className="h-full">
              <UsuariosRoles />
            </TabsContent>

            <TabsContent value="permisos" className="h-full">
              <GestionPermisos />
            </TabsContent>

            <TabsContent value="actividad" className="h-full">
              <RegistroActividad />
            </TabsContent>

            <TabsContent value="configuracion" className="h-full">
              <ConfiguracionSeguridad />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
