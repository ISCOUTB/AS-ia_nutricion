"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart2, PieChart, LineChart, Table2 } from "lucide-react"

interface ReportGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportGenerator({ open, onOpenChange }: ReportGeneratorProps) {
  const [reportType, setReportType] = useState("standard")
  const [activeStep, setActiveStep] = useState(1)

  const handleNext = () => {
    setActiveStep(activeStep + 1)
  }

  const handleBack = () => {
    setActiveStep(activeStep - 1)
  }

  const handleGenerate = () => {
    // Aquí iría la lógica para generar el reporte
    onOpenChange(false)
    setActiveStep(1)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Generador de Reportes</DialogTitle>
          <DialogDescription>Cree reportes personalizados con los datos nutricionales del sistema</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportTitle">Título del Reporte</Label>
                <Input id="reportTitle" placeholder="Ej: Reporte Nutricional Junio 2023" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reportType">Tipo de Reporte</Label>
                <Select defaultValue="standard" onValueChange={setReportType}>
                  <SelectTrigger id="reportType">
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Estándar</SelectItem>
                    <SelectItem value="comparative">Comparativo</SelectItem>
                    <SelectItem value="trend">Tendencias</SelectItem>
                    <SelectItem value="alert">Alertas</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateFrom">Desde</Label>
                  <Input id="dateFrom" type="date" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateTo">Hasta</Label>
                  <Input id="dateTo" type="date" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" placeholder="Breve descripción del propósito y contenido del reporte" />
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Seleccionar Datos</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="data-weight" defaultChecked />
                    <label
                      htmlFor="data-weight"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Peso
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="data-height" defaultChecked />
                    <label
                      htmlFor="data-height"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Talla
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="data-bmi" defaultChecked />
                    <label
                      htmlFor="data-bmi"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      IMC
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="data-status" defaultChecked />
                    <label
                      htmlFor="data-status"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Estado Nutricional
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="data-percentiles" />
                    <label
                      htmlFor="data-percentiles"
                      className="text-sm font-medium leading-none peer-disabled:cursor
-not-allowed peer-disabled:opacity-70"
                    >
                      Percentiles
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="data-zscores" />
                    <label
                      htmlFor="data-zscores"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Z-scores
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Filtros</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="center">Centro</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="center">
                        <SelectValue placeholder="Seleccionar centro" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los centros</SelectItem>
                        <SelectItem value="center1">Centro 1</SelectItem>
                        <SelectItem value="center2">Centro 2</SelectItem>
                        <SelectItem value="center3">Centro 3</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ageGroup">Grupo de Edad</Label>
                    <Select defaultValue="all">
                      <SelectTrigger id="ageGroup">
                        <SelectValue placeholder="Seleccionar grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        <SelectItem value="0-1">0-1 años</SelectItem>
                        <SelectItem value="1-2">1-2 años</SelectItem>
                        <SelectItem value="2-3">2-3 años</SelectItem>
                        <SelectItem value="3-4">3-4 años</SelectItem>
                        <SelectItem value="4-5">4-5 años</SelectItem>
                        <SelectItem value="5-6">5-6 años</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {reportType === "comparative" && (
                <div className="space-y-2">
                  <Label>Comparar Con</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="compareType">Tipo de Comparación</Label>
                      <Select defaultValue="period">
                        <SelectTrigger id="compareType">
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="period">Período Anterior</SelectItem>
                          <SelectItem value="center">Otro Centro</SelectItem>
                          <SelectItem value="standard">Estándar de Referencia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="comparePeriod">Período de Comparación</Label>
                      <Input id="comparePeriod" type="month" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Visualizaciones</Label>
                <Tabs defaultValue="charts" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="charts">Gráficos</TabsTrigger>
                    <TabsTrigger value="tables">Tablas</TabsTrigger>
                    <TabsTrigger value="summary">Resumen</TabsTrigger>
                    <TabsTrigger value="layout">Diseño</TabsTrigger>
                  </TabsList>
                  <TabsContent value="charts" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="chart-bar" defaultChecked />
                        <label htmlFor="chart-bar" className="text-sm font-medium leading-none flex items-center gap-2">
                          <BarChart2 className="h-4 w-4" /> Gráfico de Barras
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="chart-pie" defaultChecked />
                        <label htmlFor="chart-pie" className="text-sm font-medium leading-none flex items-center gap-2">
                          <PieChart className="h-4 w-4" /> Gráfico Circular
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="chart-line" />
                        <label
                          htmlFor="chart-line"
                          className="text-sm font-medium leading-none flex items-center gap-2"
                        >
                          <LineChart className="h-4 w-4" /> Gráfico de Líneas
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="chart-radar" />
                        <label
                          htmlFor="chart-radar"
                          className="text-sm font-medium leading-none flex items-center gap-2"
                        >
                          <svg
                            className="h-4 w-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="2" x2="12" y2="22" />
                            <line x1="2" y1="12" x2="22" y2="12" />
                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                            <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
                          </svg>{" "}
                          Gráfico Radar
                        </label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="tables" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="table-summary" defaultChecked />
                        <label
                          htmlFor="table-summary"
                          className="text-sm font-medium leading-none flex items-center gap-2"
                        >
                          <Table2 className="h-4 w-4" /> Tabla de Resumen
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="table-detailed" />
                        <label
                          htmlFor="table-detailed"
                          className="text-sm font-medium leading-none flex items-center gap-2"
                        >
                          <Table2 className="h-4 w-4" /> Tabla Detallada
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="table-comparative" />
                        <label
                          htmlFor="table-comparative"
                          className="text-sm font-medium leading-none flex items-center gap-2"
                        >
                          <Table2 className="h-4 w-4" /> Tabla Comparativa
                        </label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="summary" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="summary-key-findings" defaultChecked />
                        <label htmlFor="summary-key-findings" className="text-sm font-medium leading-none">
                          Hallazgos Principales
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="summary-recommendations" defaultChecked />
                        <label htmlFor="summary-recommendations" className="text-sm font-medium leading-none">
                          Recomendaciones
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="summary-trends" />
                        <label htmlFor="summary-trends" className="text-sm font-medium leading-none">
                          Análisis de Tendencias
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="summary-alerts" />
                        <label htmlFor="summary-alerts" className="text-sm font-medium leading-none">
                          Alertas Nutricionales
                        </label>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="layout" className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="layout-style">Estilo de Diseño</Label>
                        <Select defaultValue="standard">
                          <SelectTrigger id="layout-style">
                            <SelectValue placeholder="Seleccionar estilo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">Estándar</SelectItem>
                            <SelectItem value="compact">Compacto</SelectItem>
                            <SelectItem value="detailed">Detallado</SelectItem>
                            <SelectItem value="presentation">Presentación</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="layout-orientation">Orientación</Label>
                        <Select defaultValue="portrait">
                          <SelectTrigger id="layout-orientation">
                            <SelectValue placeholder="Seleccionar orientación" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="portrait">Vertical</SelectItem>
                            <SelectItem value="landscape">Horizontal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-2">
                <Label>Opciones de Exportación</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-pdf" defaultChecked />
                    <label
                      htmlFor="export-pdf"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      PDF
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-excel" />
                    <label
                      htmlFor="export-excel"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Excel
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="export-web" />
                    <label
                      htmlFor="export-web"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Versión Web
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="schedule">Programar Generación</Label>
                <Select defaultValue="now">
                  <SelectTrigger id="schedule">
                    <SelectValue placeholder="Seleccionar programación" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="now">Generar ahora</SelectItem>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">Paso {activeStep} de 3</div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            {activeStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                Atrás
              </Button>
            )}
            {activeStep < 3 ? (
              <Button onClick={handleNext}>Siguiente</Button>
            ) : (
              <Button onClick={handleGenerate}>Generar Reporte</Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

