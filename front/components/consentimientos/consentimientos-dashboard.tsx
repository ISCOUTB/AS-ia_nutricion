import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle, AlertTriangle, Plus } from "lucide-react"

export function ConsentimientosDashboard() {
  return (
    <div className="grid gap-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total de Consentimientos"
          value="120"
          description="Consentimientos registrados en el sistema"
          icon={<FileText className="h-5 w-5 text-muted-foreground" />}
        />

        <MetricCard
          title="Consentimientos Firmados"
          value="98"
          description="82% del total completado"
          icon={<CheckCircle className="h-5 w-5 text-green-500" />}
          progress={82}
        />

        <MetricCard
          title="Pendientes de Firma"
          value="15"
          description="Consentimientos en espera de firma"
          icon={<Clock className="h-5 w-5 text-amber-500" />}
        />

        <MetricCard
          title="Consentimientos Rechazados"
          value="7"
          description="Requieren seguimiento"
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
        />
      </div>

      {/* Consentimientos recientes y por vencer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Consentimientos Recientes</CardTitle>
            <CardDescription>Últimos consentimientos registrados en el sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ConsentimientoItem
                nombre="Ana María Rodríguez"
                codigo="CON-2023-089"
                fecha="2023-11-15"
                estado="firmado"
              />
              <ConsentimientoItem nombre="Carlos Mendoza" codigo="CON-2023-090" fecha="2023-11-14" estado="pendiente" />
              <ConsentimientoItem nombre="Lucía Fernández" codigo="CON-2023-091" fecha="2023-11-14" estado="firmado" />
              <ConsentimientoItem
                nombre="Miguel Ángel Torres"
                codigo="CON-2023-092"
                fecha="2023-11-13"
                estado="rechazado"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Consentimientos por Vencer</CardTitle>
            <CardDescription>Consentimientos que requieren renovación próximamente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ConsentimientoVencimiento nombre="Valentina Gómez" codigo="CON-2023-045" vencimiento="2023-11-30" />
              <ConsentimientoVencimiento nombre="Santiago Pérez" codigo="CON-2023-052" vencimiento="2023-12-01" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
          <CardDescription>Gestione rápidamente los consentimientos del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Button variant="outline" className="h-24 flex flex-col gap-2 justify-center items-center">
              <FileText className="h-6 w-6" />
              <span>Ver Documentos</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 justify-center items-center">
              <Clock className="h-6 w-6" />
              <span>Pendientes de Firma</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col gap-2 justify-center items-center">
              <AlertTriangle className="h-6 w-6" />
              <span>Gestionar Rechazos</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Botón flotante para nuevo consentimiento */}
      <div className="fixed bottom-6 right-6">
        <Button size="lg" className="rounded-full h-14 w-14 shadow-lg">
          <Plus className="h-6 w-6" />
          <span className="sr-only">Nuevo Consentimiento</span>
        </Button>
      </div>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  progress?: number
}

function MetricCard({ title, value, description, icon, progress }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {progress && <Progress value={progress} className="h-2 mt-2" />}
      </CardContent>
    </Card>
  )
}

interface ConsentimientoItemProps {
  nombre: string
  codigo: string
  fecha: string
  estado: "firmado" | "pendiente" | "rechazado"
}

function ConsentimientoItem({ nombre, codigo, fecha, estado }: ConsentimientoItemProps) {
  const getEstadoBadge = () => {
    switch (estado) {
      case "firmado":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Firmado
          </span>
        )
      case "pendiente":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
            Pendiente
          </span>
        )
      case "rechazado":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Rechazado
          </span>
        )
    }
  }

  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{nombre}</p>
        <p className="text-sm text-muted-foreground">
          {codigo} • {fecha}
        </p>
      </div>
      {getEstadoBadge()}
    </div>
  )
}

interface ConsentimientoVencimientoProps {
  nombre: string
  codigo: string
  vencimiento: string
}

function ConsentimientoVencimiento({ nombre, codigo, vencimiento }: ConsentimientoVencimientoProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium">{nombre}</p>
        <p className="text-sm text-muted-foreground">{codigo}</p>
      </div>
      <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
        Vence: {vencimiento}
      </span>
    </div>
  )
}
