"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChildrenList } from "@/components/children/children-list"
import { ChildrenGrid } from "@/components/children/children-grid"
import { ChildrenFilters } from "@/components/children/children-filters"
import { ChildMeasurements } from "@/components/children/child-measurements"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileDown, FileUp } from "lucide-react"
import { AddChildDialog } from "@/components/children/add-child-dialog"
import { AddMeasurementDialog } from "@/components/children/add-measurement-dialog"

export function ChildrenIntegratedModule() {
  const [isAddChildDialogOpen, setIsAddChildDialogOpen] = useState(false)
  const [isAddMeasurementDialogOpen, setIsAddMeasurementDialogOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"children" | "measurements">("children")

  // Función para manejar la selección de un niño para ver sus mediciones
  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId)
    setActiveTab("measurements")
  }

  // Función para volver a la lista de niños
  const handleBackToList = () => {
    setActiveTab("children")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Niños y Mediciones</h1>
        <p className="text-muted-foreground">
          Gestión integrada de registros de niños y sus mediciones antropométricas
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "children" | "measurements")}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="children">Niños</TabsTrigger>
            <TabsTrigger value="measurements" disabled={!selectedChildId}>
              Mediciones {selectedChildId ? `(ID: ${selectedChildId})` : ""}
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {activeTab === "children" ? (
              <>
                <Button variant="outline" size="sm" className="h-9">
                  <FileDown className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
                <Button variant="outline" size="sm" className="h-9">
                  <FileUp className="mr-2 h-4 w-4" />
                  Importar
                </Button>
                <Button size="sm" className="h-9" onClick={() => setIsAddChildDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo Niño
                </Button>
                <div className="flex gap-2 ml-4">
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
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" className="h-9" onClick={handleBackToList}>
                  Volver a la lista
                </Button>
                <Button size="sm" className="h-9" onClick={() => setIsAddMeasurementDialogOpen(true)}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nueva Medición
                </Button>
              </>
            )}
          </div>
        </div>

        <TabsContent value="children" className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
            <ChildrenFilters />
          </div>

          {viewMode === "list" ? (
            <ChildrenList onSelectChild={handleSelectChild} />
          ) : (
            <ChildrenGrid onSelectChild={handleSelectChild} />
          )}
        </TabsContent>

        <TabsContent value="measurements" className="space-y-4">
          {selectedChildId && <ChildMeasurements childId={selectedChildId} />}
        </TabsContent>
      </Tabs>

      <AddChildDialog open={isAddChildDialogOpen} onOpenChange={setIsAddChildDialogOpen} />
      {selectedChildId && (
        <AddMeasurementDialog
          open={isAddMeasurementDialogOpen}
          onOpenChange={setIsAddMeasurementDialogOpen}
          childId={selectedChildId}
        />
      )}
    </div>
  )
}

