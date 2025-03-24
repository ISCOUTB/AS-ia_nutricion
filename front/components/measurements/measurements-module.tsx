"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MeasurementsList } from "@/components/measurements/measurements-list"
import { MeasurementsFilters } from "@/components/measurements/measurements-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileDown, FileUp, BarChart2 } from "lucide-react"
import { AddMeasurementDialog } from "@/components/measurements/add-measurement-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MeasurementsTrends } from "@/components/measurements/measurements-trends"

export function MeasurementsModule() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [showTrends, setShowTrends] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Mediciones</h1>
        <p className="text-muted-foreground">Registro y seguimiento de mediciones antropométricas</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <MeasurementsFilters />

          <div className="flex gap-2">
            <Button
              variant={showTrends ? "default" : "outline"}
              size="sm"
              className="h-9"
              onClick={() => setShowTrends(!showTrends)}
            >
              <BarChart2 className="mr-2 h-4 w-4" />
              {showTrends ? "Ocultar Tendencias" : "Ver Tendencias"}
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <FileDown className="mr-2 h-4 w-4" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <FileUp className="mr-2 h-4 w-4" />
              Importar
            </Button>
            <Button size="sm" className="h-9" onClick={() => setIsAddDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nueva Medición
            </Button>
          </div>
        </div>

        {showTrends && <MeasurementsTrends />}

        <Tabs defaultValue="todas" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="todas">Todas</TabsTrigger>
              <TabsTrigger value="recientes">Recientes</TabsTrigger>
              <TabsTrigger value="alertas">Con Alertas</TabsTrigger>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="todas" className="space-y-4">
            <MeasurementsList />
          </TabsContent>

          <TabsContent value="recientes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mediciones Recientes</CardTitle>
                <CardDescription>Mediciones registradas en los últimos 30 días</CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementsList filterDays={30} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alertas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mediciones con Alertas</CardTitle>
                <CardDescription>Mediciones que han generado alertas nutricionales</CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementsList filterAlerts={true} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pendientes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mediciones Pendientes</CardTitle>
                <CardDescription>Niños que requieren actualización de mediciones</CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementsList filterPending={true} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddMeasurementDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}

