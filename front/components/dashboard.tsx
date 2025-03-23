"use client"

import { useState } from "react"
import { Home, BarChart3, Users, FileText, Settings, Calendar, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import NutritionChart from "@/components/nutrition-chart"
import MetricCard from "@/components/metric-card"
import GrowthTable from "@/components/growth-table"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="hidden md:flex w-16 flex-col bg-primary justify-between fixed h-full">
        <div className="flex flex-col items-center pt-6 space-y-6">
          <Button variant="ghost" size="icon" className="text-primary-foreground">
            <Home className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground">
            <BarChart3 className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground">
            <Users className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground">
            <FileText className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="text-primary-foreground">
            <Calendar className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex flex-col items-center pb-6">
          <Button variant="ghost" size="icon" className="text-primary-foreground">
            <Settings className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-16 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold tracking-tight">INFORME DE NUTRICIÓN</h1>
            <div className="h-1 w-32 bg-primary mt-2"></div>
          </div>

          <Tabs defaultValue="general" className="space-y-6" onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 w-full max-w-md">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="individual">Individual</TabsTrigger>
              <TabsTrigger value="comparativo">Comparativo</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              {/* Top row metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard title="Niños Registrados" value="156" trend="+12%" icon={<Users className="h-5 w-5" />} />
                <MetricCard
                  title="Edad Promedio"
                  value="4.2 años"
                  trend="estable"
                  icon={<Calendar className="h-5 w-5" />}
                />
                <MetricCard
                  title="Peso Promedio"
                  value="18.5 kg"
                  trend="+0.8kg"
                  icon={<TrendingUp className="h-5 w-5" />}
                />
                <MetricCard
                  title="Talla Promedio"
                  value="102 cm"
                  trend="+2.3cm"
                  icon={<TrendingUp className="h-5 w-5" />}
                />
              </div>

              {/* Middle row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-1 bg-gradient-to-br from-primary to-primary/70">
                  <CardContent className="p-6 text-primary-foreground">
                    <div className="text-3xl font-bold">24%</div>
                    <div className="text-sm mt-1">Niños con riesgo de desnutrición</div>
                    <div className="text-xs mt-4">Requiere atención inmediata</div>
                  </CardContent>
                </Card>
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Distribución por Estado Nutricional</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <NutritionChart type="distribution" />
                  </CardContent>
                </Card>
              </div>

              {/* Bottom row */}
              <div className="grid grid-cols-1 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Tendencia de Crecimiento (Últimos 12 meses)</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <NutritionChart type="growth" />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="individual" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Historial de Crecimiento Individual</CardTitle>
                </CardHeader>
                <CardContent>
                  <GrowthTable />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comparativo" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Comparativa por Grupos de Edad</CardTitle>
                </CardHeader>
                <CardContent>
                  <NutritionChart type="comparison" />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

