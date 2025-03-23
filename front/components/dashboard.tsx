"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Calendar, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight } from "lucide-react"
import { RecentMeasurements } from "@/components/recent-measurements"
import { NutritionStatusChart } from "@/components/nutrition-status-chart"
import { GrowthTrendChart } from "@/components/growth-trend-chart"
import { AgeGroupsChart } from "@/components/age-groups-chart"
import { AlertsOverview } from "@/components/alerts-overview"

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Monitoreo nutricional infantil - Visión general del sistema</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="individual">Individual</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
          <TabsTrigger value="predicciones">Predicciones</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          {/* Métricas principales */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Niños Registrados</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">156</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+12%</span> desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Edad Promedio</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2 años</div>
                <p className="text-xs text-muted-foreground">Rango: 1-6 años</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Peso Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">18.5 kg</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                  <span className="text-green-500">+0.8kg</span> desde la última medición
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Alertas Nutricionales</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground flex items-center">
                  <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                  <span className="text-red-500">Requiere atención</span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráficos y tablas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Tendencia de Crecimiento</CardTitle>
                <CardDescription>Evolución del peso promedio en los últimos 12 meses</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <GrowthTrendChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Estado Nutricional</CardTitle>
                <CardDescription>Distribución por categorías</CardDescription>
              </CardHeader>
              <CardContent>
                <NutritionStatusChart />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Grupos por Edad</CardTitle>
                <CardDescription>Comparativa de peso promedio por grupo etario</CardDescription>
              </CardHeader>
              <CardContent>
                <AgeGroupsChart />
              </CardContent>
            </Card>
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Mediciones Recientes</CardTitle>
                <CardDescription>Últimas mediciones registradas en el sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentMeasurements />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Historial Individual</CardTitle>
              <CardDescription>Seleccione un niño para ver su historial de crecimiento</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Funcionalidad en desarrollo. Aquí se mostrará el historial individual de cada niño, incluyendo gráficos
                de crecimiento, mediciones históricas y recomendaciones personalizadas.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alertas Nutricionales</CardTitle>
              <CardDescription>Niños que requieren atención prioritaria</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertsOverview />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predicciones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predicciones de IA</CardTitle>
              <CardDescription>Análisis predictivo basado en modelos de inteligencia artificial</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Módulo en desarrollo. Aquí se mostrarán predicciones sobre el desarrollo nutricional de los niños
                basadas en modelos de IA, identificando patrones y tendencias para intervención temprana.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

