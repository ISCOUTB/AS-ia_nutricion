"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChildrenList } from "@/components/children/children-list"
import { ChildrenGrid } from "@/components/children/children-grid"
import { ChildrenFilters } from "@/components/children/children-filters"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileDown, FileUp } from "lucide-react"
import { AddChildDialog } from "@/components/children/add-child-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ChildrenModule() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Niños</h1>
        <p className="text-muted-foreground">Gestión de registros de niños en el sistema de monitoreo nutricional</p>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <ChildrenFilters />

          <div className="flex gap-2">
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
              Nuevo Niño
            </Button>
          </div>
        </div>

        <Tabs defaultValue="todos" className="space-y-4">
          <div className="flex justify-between items-center">
            <TabsList>
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="normal">Estado Normal</TabsTrigger>
              <TabsTrigger value="riesgo">En Riesgo</TabsTrigger>
              <TabsTrigger value="desnutricion">Desnutrición</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setViewMode("list")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="sm"
                className="h-9 w-9 p-0"
                onClick={() => setViewMode("grid")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                </svg>
              </Button>
            </div>
          </div>

          <TabsContent value="todos" className="space-y-4">
            {viewMode === "list" ? <ChildrenList /> : <ChildrenGrid />}
          </TabsContent>

          <TabsContent value="normal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Estado Nutricional Normal</CardTitle>
                <CardDescription>Niños con parámetros nutricionales dentro de los rangos normales</CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === "list" ? <ChildrenList filterStatus="Normal" /> : <ChildrenGrid filterStatus="Normal" />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="riesgo" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>En Riesgo Nutricional</CardTitle>
                <CardDescription>Niños con parámetros que indican riesgo de desnutrición</CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === "list" ? <ChildrenList filterStatus="Riesgo" /> : <ChildrenGrid filterStatus="Riesgo" />}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="desnutricion" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Desnutrición</CardTitle>
                <CardDescription>Niños con desnutrición que requieren atención prioritaria</CardDescription>
              </CardHeader>
              <CardContent>
                {viewMode === "list" ? (
                  <ChildrenList filterStatus="Desnutrición" />
                ) : (
                  <ChildrenGrid filterStatus="Desnutrición" />
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <AddChildDialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen} />
    </div>
  )
}

