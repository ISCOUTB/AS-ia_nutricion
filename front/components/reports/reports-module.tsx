"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"
import { IndividualReports } from "@/components/reports/individual-reports"
import { GroupReports } from "@/components/reports/group-reports"
import { TrendReports } from "@/components/reports/trend-reports"
import { ComparativeReports } from "@/components/reports/comparative-reports"
import { ReportGenerator } from "@/components/reports/report-generator"
import { FileDown, FilePlus, Share2 } from "lucide-react"

export function ReportsModule() {
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId)
    setActiveTab("individual")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Reportes</h1>
        <p className="text-muted-foreground">Análisis, visualización y generación de informes nutricionales</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" size="sm" className="h-9">
            <Share2 className="mr-2 h-4 w-4" />
            Compartir
          </Button>
        </div>
        <Button size="sm" className="h-9" onClick={() => setIsGeneratorOpen(true)}>
          <FilePlus className="mr-2 h-4 w-4" />
          Nuevo Reporte
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="individual" disabled={!selectedChildId}>
            Individual {selectedChildId ? `(ID: ${selectedChildId})` : ""}
          </TabsTrigger>
          <TabsTrigger value="group">Grupales</TabsTrigger>
          <TabsTrigger value="trends">Tendencias</TabsTrigger>
          <TabsTrigger value="comparative">Comparativos</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <ReportsDashboard onSelectChild={handleSelectChild} />
        </TabsContent>

        <TabsContent value="individual" className="space-y-6">
          {selectedChildId && <IndividualReports childId={selectedChildId} />}
        </TabsContent>

        <TabsContent value="group" className="space-y-6">
          <GroupReports />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <TrendReports />
        </TabsContent>

        <TabsContent value="comparative" className="space-y-6">
          <ComparativeReports />
        </TabsContent>
      </Tabs>

      <ReportGenerator open={isGeneratorOpen} onOpenChange={setIsGeneratorOpen} />
    </div>
  )
}

