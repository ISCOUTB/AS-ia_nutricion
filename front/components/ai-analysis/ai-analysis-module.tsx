"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PredictionDashboard } from "@/components/ai-analysis/prediction-dashboard"
import { RiskDetection } from "@/components/ai-analysis/risk-detection"
import { PatternAnalysis } from "@/components/ai-analysis/pattern-analysis"
import { RecommendationEngine } from "@/components/ai-analysis/recommendation-engine"
import { AIExplainer } from "@/components/ai-analysis/ai-explainer"
import { Brain, Lightbulb, AlertTriangle, TrendingUp, Info } from "lucide-react"

export function AIAnalysisModule() {
  const [showExplainer, setShowExplainer] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Análisis con IA</h1>
          <Button variant="outline" size="sm" onClick={() => setShowExplainer(!showExplainer)}>
            <Info className="mr-2 h-4 w-4" />
            {showExplainer ? "Ocultar información" : "¿Cómo funciona?"}
          </Button>
        </div>
        <p className="text-muted-foreground">
          Herramientas de análisis avanzado con inteligencia artificial para el monitoreo nutricional
        </p>
      </div>

      {showExplainer && <AIExplainer />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-100 dark:border-blue-900">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <TrendingUp className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Predicciones</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              Proyecciones de crecimiento y desarrollo basadas en datos históricos y patrones identificados
            </p>
          </CardContent>
          <CardFooter>
            <Badge
              variant="outline"
              className="bg-blue-100/50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-800"
            >
              Precisión 92%
            </Badge>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-amber-100 dark:border-amber-900">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Detección de Riesgos</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              Identificación temprana de posibles riesgos nutricionales antes de que se manifiesten completamente
            </p>
          </CardContent>
          <CardFooter>
            <Badge
              variant="outline"
              className="bg-amber-100/50 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200 dark:border-amber-800"
            >
              Detección temprana
            </Badge>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50 border-purple-100 dark:border-purple-900">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 dark:text-purple-400">
                <Brain className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Análisis de Patrones</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              Descubrimiento de patrones y correlaciones en los datos nutricionales de grupos de niños
            </p>
          </CardContent>
          <CardFooter>
            <Badge
              variant="outline"
              className="bg-purple-100/50 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300 border-purple-200 dark:border-purple-800"
            >
              Aprendizaje continuo
            </Badge>
          </CardFooter>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-100 dark:border-green-900">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                <Lightbulb className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Recomendaciones</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <p className="text-sm text-muted-foreground">
              Sugerencias personalizadas para mejorar el estado nutricional basadas en el análisis de datos
            </p>
          </CardContent>
          <CardFooter>
            <Badge
              variant="outline"
              className="bg-green-100/50 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-800"
            >
              Personalizado
            </Badge>
          </CardFooter>
        </Card>
      </div>

      <Tabs defaultValue="predictions" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
          <TabsTrigger value="predictions">Predicciones</TabsTrigger>
          <TabsTrigger value="risk-detection">Detección de Riesgos</TabsTrigger>
          <TabsTrigger value="pattern-analysis">Análisis de Patrones</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="predictions" className="space-y-6">
          <PredictionDashboard />
        </TabsContent>

        <TabsContent value="risk-detection" className="space-y-6">
          <RiskDetection />
        </TabsContent>

        <TabsContent value="pattern-analysis" className="space-y-6">
          <PatternAnalysis />
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <RecommendationEngine />
        </TabsContent>
      </Tabs>
    </div>
  )
}

