"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertsDashboard } from "@/components/alerts/alerts-dashboard"
import { AlertsList } from "@/components/alerts/alerts-list"
import { AlertsSettings } from "@/components/alerts/alerts-settings"
import { NotificationCenter } from "@/components/alerts/notification-center"
import { AlertTriangle, Bell, Settings, Filter, RefreshCw } from 'lucide-react'
import { AlertsStats } from "@/components/alerts/alerts-stats"
import { CreateAlertDialog } from "@/components/alerts/create-alert-dialog"

export function AlertsModule() {
  const [showCreateAlert, setShowCreateAlert] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState(new Date())

  const handleRefresh = () => {
    setLastRefreshed(new Date())
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Alertas Nutricionales</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Actualizar
            </Button>
            <Button size="sm" onClick={() => setShowCreateAlert(true)}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Nueva Alerta
            </Button>
          </div>
        </div>
        <p className="text-muted-foreground">
          Gestión y seguimiento de alertas nutricionales para intervención temprana
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 border-red-100 dark:border-red-900">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center text-red-600 dark:text-red-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Alertas Activas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">24</div>
              <Badge variant="outline" className="bg-red-100/50 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-800">
                5 críticas
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/50 dark:to-yellow-950/50 border-amber-100 dark:border-amber-900">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Bell className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Pendientes de Revisión</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">12</div>
              <Badge variant="outline" className="bg-amber-100/50 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                3 nuevas hoy
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-100 dark:border-green-900">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <CardTitle className="text-base">Resueltas este Mes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">18</div>
              <Badge variant="outline" className="bg-green-100/50 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800">
                +4 vs mes anterior
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M12 20v-6M6 20V10M18 20V4" />
                </svg>
              </div>
              <CardTitle className="text-base">Tiempo de Respuesta</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">2.4 días</div>
              <Badge variant="outline" className="bg-blue-100/50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                -0.8 vs mes anterior
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-xs text-muted-foreground">
        Última actualización: {lastRefreshed.toLocaleString()}
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="list">Lista de Alertas</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="notifications">Centro de Notificaciones</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <AlertsDashboard />
        </TabsContent>

        <TabsContent value="list" className="space-y-6">
          <AlertsList />
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <AlertsStats />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationCenter />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <AlertsSettings />
        </TabsContent>
      </Tabs>

      <CreateAlertDialog open={showCreateAlert} onOpenChange={setShowCreateAlert} />
    </div>
  )
}
