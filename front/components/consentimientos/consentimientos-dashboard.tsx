"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { NuevoConsentimientoDialog } from "./nuevo-consentimiento-dialog"
import { useState } from "react"

export function ConsentimientosDashboard() {
  const [showNuevoConsentimiento, setShowNuevoConsentimiento] = useState(false)

  // Datos de ejemplo para el dashboard
  const estadisticas = {
    total: 120,
    firmados: 98,
    pendientes: 15,
    rechazados: 7,
    porcentajeCompletado: 82,
    recientes: [
      { id: "CON-2023-089", nombre: "Ana María Rodríguez", fecha: "2023-11-15", estado: "firmado" },
      { id: "CON-2023-090", nombre: "Carlos Mendoza", fecha: "2023-11-14", estado: "pendiente" },
      { id: "CON-2023-091", nombre: "Lucía Fernández", fecha: "2023-11-14", estado: "firmado" },
      { id: "CON-2023-092", nombre: "Miguel Ángel Torres", fecha: "2023-11-13", estado: "rechazado" },
    ],
    porVencer: [
      { id: "CON-2023-045", nombre: "Valentina Gómez", fecha: "2023-11-30" },
      { id: "CON-2023-052", nombre: "Santiago Pérez", fecha: "2023-12-01" },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Consentimientos</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.total}</div>
          <p className="text-xs text-muted-foreground">Consentimientos registrados en el sistema</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consentimientos Firmados</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.firmados}</div>
          <p className="text-xs text-muted-foreground">{estadisticas.porcentajeCompletado}% del total completado</p>
          <Progress value={estadisticas.porcentajeCompletado} className="mt-2" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendientes de Firma</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.pendientes}</div>
          <p className="text-xs text-muted-foreground">Consentimientos en espera de firma</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Consentimientos Rechazados</CardTitle>
          <AlertTriangle className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{estadisticas.rechazados}</div>
          <p className="text-xs text-muted-foreground">Requieren seguimiento</p>
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Consentimientos Recientes</CardTitle>
          <CardDescription>Últimos consentimientos registrados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {estadisticas.recientes.map((consentimiento) => (
              <div key={consentimiento.id} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <p className="font-medium">{consentimiento.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {consentimiento.id} • {consentimiento.fecha}
                  </p>
                </div>
                <Badge
                  className={
                    consentimiento.estado === "firmado"
                      ? "bg-green-100 text-green-800 hover:bg-green-100"
                      : consentimiento.estado === "pendiente"
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-100"
                        : "bg-red-100 text-red-800 hover:bg-red-100"
                  }
                >
                  {consentimiento.estado === "firmado"
                    ? "Firmado"
                    : consentimiento.estado === "pendiente"
                      ? "Pendiente"
                      : "Rechazado"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-full md:col-span-2">
        <CardHeader>
          <CardTitle>Consentimientos por Vencer</CardTitle>
          <CardDescription>Consentimientos que requieren renovación próximamente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {estadisticas.porVencer.map((consentimiento) => (
              <div key={consentimiento.id} className="flex items-center justify-between p-2 border rounded-md">
                <div>
                  <p className="font-medium">{consentimiento.nombre}</p>
                  <p className="text-sm text-muted-foreground">{consentimiento.id}</p>
                </div>
                <div className="text-sm text-amber-600">Vence: {consentimiento.fecha}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="col-span-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Acciones Rápidas</CardTitle>
            <Button onClick={() => setShowNuevoConsentimiento(true)} size="sm">
              <PlusCircle className="mr-2 h-4 w-4" />
              Nuevo Consentimiento
            </Button>
          </div>
          <CardDescription>Gestione rápidamente los consentimientos del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <FileText className="h-8 w-8 mb-2" />
              Ver Documentos
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Clock className="h-8 w-8 mb-2" />
              Pendientes de Firma
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <AlertTriangle className="h-8 w-8 mb-2" />
              Gestionar Rechazos
            </Button>
          </div>
        </CardContent>
      </Card>
      <NuevoConsentimientoDialog open={showNuevoConsentimiento} onOpenChange={setShowNuevoConsentimiento} />
    </div>
  )
}

