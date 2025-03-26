import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Brain, Lock, Shield, Database } from "lucide-react"

export function AIExplainer() {
  return (
    <Card className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Cómo funciona el Análisis con IA
        </CardTitle>
        <CardDescription>Entendiendo las herramientas de inteligencia artificial del sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>¿Qué es el análisis con IA?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                El análisis con inteligencia artificial utiliza algoritmos avanzados para procesar grandes cantidades de
                datos nutricionales y antropométricos, identificando patrones, tendencias y anomalías que podrían no ser
                evidentes mediante análisis tradicionales.
              </p>
              <p className="text-sm text-muted-foreground">
                Nuestro sistema utiliza modelos de aprendizaje automático entrenados con datos nutricionales de
                referencia de la OMS y datos históricos anonimizados para proporcionar análisis precisos y
                personalizados.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-2">
            <AccordionTrigger>¿Cómo se generan las predicciones?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                Las predicciones de crecimiento y desarrollo se generan mediante modelos de series temporales y redes
                neuronales que analizan:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-2">
                <li>Historial de mediciones del niño</li>
                <li>Patrones de crecimiento estándar</li>
                <li>Factores contextuales (cuando están disponibles)</li>
                <li>Datos de niños con características similares</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                El sistema calcula múltiples trayectorias posibles y presenta la más probable, junto con intervalos de
                confianza.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-3">
            <AccordionTrigger>¿Cómo se detectan los riesgos?</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm text-muted-foreground mb-2">
                La detección de riesgos utiliza algoritmos de clasificación y detección de anomalías que:
              </p>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mb-2">
                <li>Comparan las mediciones con estándares de referencia</li>
                <li>Analizan la velocidad de cambio en los indicadores</li>
                <li>Identifican desviaciones sutiles de las trayectorias esperadas</li>
                <li>Evalúan combinaciones de factores de riesgo</li>
              </ul>
              <p className="text-sm text-muted-foreground">
                El sistema puede detectar signos tempranos de problemas nutricionales antes de que sean clínicamente
                evidentes.
              </p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-4">
            <AccordionTrigger>¿Qué datos utiliza el sistema?</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Datos antropométricos:</span> Peso, talla, IMC, perímetro cefálico y
                  otras mediciones físicas.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Datos demográficos:</span> Edad, género y otros factores relevantes.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Historial de mediciones:</span> Secuencia temporal de datos para
                  análisis de tendencias.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Database className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Estándares de referencia:</span> Curvas de crecimiento de la OMS y otros
                  estándares nutricionales.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="item-5">
            <AccordionTrigger>Privacidad y seguridad de los datos</AccordionTrigger>
            <AccordionContent className="space-y-2">
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Anonimización:</span> Todos los datos utilizados para el entrenamiento y
                  análisis están completamente anonimizados.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Procesamiento local:</span> El análisis se realiza en servidores seguros
                  sin compartir datos con terceros.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Cumplimiento normativo:</span> El sistema cumple con las regulaciones de
                  protección de datos personales y de salud.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <Lock className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">Acceso controlado:</span> Solo personal autorizado puede acceder a los
                  resultados de análisis detallados.
                </p>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

