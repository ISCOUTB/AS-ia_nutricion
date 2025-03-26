"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { FileDown, Lightbulb, CheckCircle, ArrowRight, Calendar, Apple, Utensils, Dumbbell } from "lucide-react"

// Datos de ejemplo para niños
const childrenData = [
  {
    id: "C001",
    name: "Ana García",
    age: "3 años",
    gender: "Femenino",
    status: "Normal",
    lastCheckup: "12/03/2023",
    recommendationScore: 85,
  },
  {
    id: "C003",
    name: "María Rodríguez",
    age: "2 años",
    gender: "Femenino",
    status: "Riesgo",
    lastCheckup: "18/03/2023",
    recommendationScore: 95,
  },
  {
    id: "C004",
    name: "Juan Pérez",
    age: "5 años",
    gender: "Masculino",
    status: "Normal",
    lastCheckup: "20/03/2023",
    recommendationScore: 80,
  },
  {
    id: "C005",
    name: "Sofia Martínez",
    age: "1 año",
    gender: "Femenino",
    status: "Desnutrición",
    lastCheckup: "22/03/2023",
    recommendationScore: 98,
  },
  {
    id: "C006",
    name: "Luis Gómez",
    age: "3 años",
    gender: "Masculino",
    status: "Riesgo",
    lastCheckup: "25/03/2023",
    recommendationScore: 92,
  },
]

// Datos de ejemplo para recomendaciones nutricionales
const nutritionalRecommendations = [
  {
    id: "R001",
    title: "Incrementar consumo de proteínas",
    description: "Aumentar la ingesta de proteínas de alto valor biológico como huevos, pollo, pescado y legumbres.",
    priority: "Alta",
    category: "Alimentación",
    icon: <Utensils className="h-4 w-4" />,
  },
  {
    id: "R002",
    title: "Asegurar 5 porciones de frutas y verduras",
    description:
      "Incluir al menos 5 porciones de frutas y verduras variadas al día para asegurar el aporte de vitaminas y minerales.",
    priority: "Alta",
    category: "Alimentación",
    icon: <Apple className="h-4 w-4" />,
  },
  {
    id: "R003",
    title: "Actividad física regular",
    description: "Realizar al menos 60 minutos diarios de actividad física moderada a intensa, adaptada a la edad.",
    priority: "Media",
    category: "Actividad Física",
    icon: <Dumbbell className="h-4 w-4" />,
  },
  {
    id: "R004",
    title: "Suplementación con micronutrientes",
    description: "Considerar suplementación con hierro, zinc y vitamina A según evaluación específica.",
    priority: "Media",
    category: "Suplementación",
    icon: <Lightbulb className="h-4 w-4" />,
  },
  {
    id: "R005",
    title: "Seguimiento nutricional frecuente",
    description: "Programar evaluaciones antropométricas cada 2 semanas para monitorear el progreso.",
    priority: "Alta",
    category: "Seguimiento",
    icon: <Calendar className="h-4 w-4" />,
  },
]

// Datos de ejemplo para plan alimentario
const mealPlanData = [
  {
    meal: "Desayuno",
    options: [
      "1 huevo revuelto con espinacas + 1 rebanada de pan integral + 1 vaso pequeño de leche",
      "Avena con leche, plátano y nueces picadas",
      "Yogur natural con frutas picadas y cereal integral",
    ],
  },
  {
    meal: "Media mañana",
    options: ["1 fruta mediana (manzana, pera, plátano)", "Yogur natural con frutas", "Puñado pequeño de frutos secos"],
  },
  {
    meal: "Almuerzo",
    options: [
      "Pollo a la plancha con arroz y verduras salteadas",
      "Pescado al horno con puré de papa y ensalada",
      "Lentejas guisadas con verduras y una pequeña porción de arroz",
    ],
  },
  {
    meal: "Merienda",
    options: [
      "Batido de frutas con leche",
      "Galletas integrales con queso fresco",
      "Palitos de zanahoria y pepino con hummus",
    ],
  },
  {
    meal: "Cena",
    options: [
      "Tortilla de verduras con ensalada",
      "Sopa de verduras con pollo desmenuzado",
      "Pescado a la plancha con verduras al vapor",
    ],
  },
]

export function RecommendationEngine() {
  const [selectedChild, setSelectedChild] = useState("maria-rodriguez")
  const [recommendationType, setRecommendationType] = useState("all")
  const [selectedChildData, setSelectedChildData] = useState(childrenData[1])

  const handleSelectChild = (childId: string) => {
    const child = childrenData.find((c) => c.id === childId) || childrenData[1]
    setSelectedChildData(child)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recomendaciones Personalizadas</CardTitle>
          <CardDescription>Sugerencias adaptadas a las necesidades específicas de cada niño</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-2">
              <Label htmlFor="childSelect">Seleccionar Niño</Label>
              <Select
                defaultValue={selectedChild}
                onValueChange={(value) => {
                  setSelectedChild(value)
                  handleSelectChild(value.split("-")[0])
                }}
              >
                <SelectTrigger id="childSelect">
                  <SelectValue placeholder="Seleccionar niño" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="C001-ana">Ana García (3 años)</SelectItem>
                  <SelectItem value="C003-maria">María Rodríguez (2 años)</SelectItem>
                  <SelectItem value="C004-juan">Juan Pérez (5 años)</SelectItem>
                  <SelectItem value="C005-sofia">Sofia Martínez (1 año)</SelectItem>
                  <SelectItem value="C006-luis">Luis Gómez (3 años)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="recommendationType">Tipo de Recomendación</Label>
              <Select defaultValue={recommendationType} onValueChange={setRecommendationType}>
                <SelectTrigger id="recommendationType">
                  <SelectValue placeholder="Seleccionar tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las recomendaciones</SelectItem>
                  <SelectItem value="nutrition">Alimentación</SelectItem>
                  <SelectItem value="activity">Actividad Física</SelectItem>
                  <SelectItem value="supplements">Suplementación</SelectItem>
                  <SelectItem value="monitoring">Seguimiento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-12 w-12">
              <AvatarFallback
                className={
                  selectedChildData.gender === "Masculino" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800"
                }
              >
                {selectedChildData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{selectedChildData.name}</h3>
              <p className="text-sm text-muted-foreground">
                {selectedChildData.age} • {selectedChildData.gender} • ID: {selectedChildData.id}
              </p>
            </div>
            <Badge
              variant={
                selectedChildData.status === "Normal"
                  ? "outline"
                  : selectedChildData.status === "Riesgo"
                    ? "secondary"
                    : "destructive"
              }
              className="ml-auto"
            >
              {selectedChildData.status}
            </Badge>
          </div>

          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Lightbulb className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Prioridad de recomendaciones</div>
                <div className="text-xs text-muted-foreground">
                  {selectedChildData.status === "Normal"
                    ? "Preventivas y de mantenimiento"
                    : selectedChildData.status === "Riesgo"
                      ? "Intervención temprana"
                      : "Intervención intensiva"}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-400">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Relevancia de recomendaciones</div>
                <div className="flex items-center gap-2">
                  <Progress value={selectedChildData.recommendationScore} className="h-2 w-24" />
                  <span className="text-xs text-muted-foreground">{selectedChildData.recommendationScore}%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Calendar className="h-4 w-4" />
              </div>
              <div>
                <div className="text-sm font-medium">Última actualización</div>
                <div className="text-xs text-muted-foreground">{selectedChildData.lastCheckup}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="recommendations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          <TabsTrigger value="meal-plan">Plan Alimentario</TabsTrigger>
          <TabsTrigger value="activity-plan">Plan de Actividad</TabsTrigger>
          <TabsTrigger value="monitoring">Plan de Seguimiento</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones Personalizadas</CardTitle>
              <CardDescription>Recomendaciones adaptadas al perfil de {selectedChildData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nutritionalRecommendations
                  .filter(
                    (rec) =>
                      recommendationType === "all" ||
                      (recommendationType === "nutrition" && rec.category === "Alimentación") ||
                      (recommendationType === "activity" && rec.category === "Actividad Física") ||
                      (recommendationType === "supplements" && rec.category === "Suplementación") ||
                      (recommendationType === "monitoring" && rec.category === "Seguimiento"),
                  )
                  .map((recommendation) => (
                    <div key={recommendation.id} className="p-4 border rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                          {recommendation.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium">{recommendation.title}</h3>
                            <Badge
                              variant={
                                recommendation.priority === "Alta"
                                  ? "destructive"
                                  : recommendation.priority === "Media"
                                    ? "secondary"
                                    : "outline"
                              }
                            >
                              Prioridad {recommendation.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{recommendation.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {recommendation.category}
                            </Badge>
                            <span className="text-xs text-muted-foreground">ID: {recommendation.id}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Descargar Plan Completo
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="meal-plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan Alimentario Personalizado</CardTitle>
              <CardDescription>Plan alimentario adaptado a las necesidades de {selectedChildData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600" />
                    Consideraciones Generales
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>
                        {selectedChildData.status === "Normal"
                          ? "Mantener una alimentación balanceada con variedad de alimentos."
                          : selectedChildData.status === "Riesgo"
                            ? "Incrementar el aporte calórico y proteico manteniendo una alimentación balanceada."
                            : "Implementar un plan de recuperación nutricional con alto aporte calórico y proteico."}
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>Asegurar una hidratación adecuada con aproximadamente 1-1.5 litros de agua al día.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>
                        Limitar el consumo de alimentos ultraprocesados, bebidas azucaradas y snacks con alto contenido
                        de sal y grasas saturadas.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-4">
                  {mealPlanData.map((meal, index) => (
                    <div key={index} className="p-4 border rounded-md">
                      <h3 className="text-sm font-medium mb-2">{meal.meal}</h3>
                      <ul className="space-y-2">
                        {meal.options.map((option, optIndex) => (
                          <li key={optIndex} className="flex items-start gap-2 text-sm">
                            <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                              <CheckCircle className="h-3 w-3" />
                            </div>
                            <span>{option}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Recomendaciones Adicionales</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>
                        Establecer horarios regulares para las comidas en un ambiente tranquilo y sin distracciones.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>
                        Involucrar al niño en la preparación de alimentos para fomentar hábitos alimentarios saludables.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>
                        Ofrecer variedad de alimentos y presentaciones para estimular el interés por la comida.
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Descargar Plan Alimentario
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="activity-plan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan de Actividad Física</CardTitle>
              <CardDescription>
                Recomendaciones de actividad física adaptadas a la edad y condición de {selectedChildData.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Dumbbell className="h-4 w-4 text-purple-600" />
                    Recomendaciones Generales
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>Realizar al menos 60 minutos diarios de actividad física moderada a intensa.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>
                        Combinar actividades aeróbicas, de fortalecimiento muscular y óseo al menos 3 veces por semana.
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <span>Limitar el tiempo de pantalla a un máximo de 1-2 horas diarias.</span>
                    </li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium mb-2">Actividades Recomendadas</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span>Juegos al aire libre: correr, saltar, trepar, jugar a la pelota</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span>Natación o actividades acuáticas (supervisadas)</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span>Baile o actividades rítmicas</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                          <CheckCircle className="h-3 w-3" />
                        </div>
                        <span>Juegos de equilibrio y coordinación</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 border rounded-md">
                    <h3 className="text-sm font-medium mb-2">Planificación Semanal</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Lunes, Miércoles, Viernes:</span>
                        <span className="font-medium">Actividades aeróbicas</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span>Martes, Jueves:</span>
                        <span className="font-medium">Juegos de coordinación</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span>Sábado:</span>
                        <span className="font-medium">Actividades recreativas familiares</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-sm">
                        <span>Domingo:</span>
                        <span className="font-medium">Descanso activo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Consideraciones Especiales</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {selectedChildData.status === "Normal"
                      ? "No se requieren consideraciones especiales. Mantener el nivel de actividad física recomendado."
                      : selectedChildData.status === "Riesgo"
                        ? "Iniciar con actividades de baja intensidad e ir aumentando gradualmente. Supervisar la tolerancia a la actividad física."
                        : "Comenzar con actividades muy suaves y de corta duración. Aumentar gradualmente bajo supervisión profesional. Priorizar actividades que no generen fatiga excesiva."}
                  </p>
                  <div className="flex items-center gap-2 mt-4">
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Adaptado a la edad
                    </Badge>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                      Supervisión recomendada
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Descargar Plan de Actividad
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Plan de Seguimiento</CardTitle>
              <CardDescription>Cronograma de seguimiento y evaluación para {selectedChildData.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    Cronograma de Seguimiento
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">Próxima evaluación antropométrica:</span>
                        <p className="text-xs text-muted-foreground">
                          {selectedChildData.status === "Normal"
                            ? "15/06/2023 (en 3 meses)"
                            : selectedChildData.status === "Riesgo"
                              ? "15/04/2023 (en 1 mes)"
                              : "01/04/2023 (en 2 semanas)"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">Evaluación nutricional completa:</span>
                        <p className="text-xs text-muted-foreground">
                          {selectedChildData.status === "Normal"
                            ? "15/09/2023 (en 6 meses)"
                            : selectedChildData.status === "Riesgo"
                              ? "15/05/2023 (en 2 meses)"
                              : "15/04/2023 (en 1 mes)"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3" />
                      </div>
                      <div>
                        <span className="font-medium">Revisión y ajuste del plan:</span>
                        <p className="text-xs text-muted-foreground">
                          {selectedChildData.status === "Normal"
                            ? "15/06/2023 (en 3 meses)"
                            : selectedChildData.status === "Riesgo"
                              ? "15/04/2023 (en 1 mes)"
                              : "15/04/2023 (en 1 mes)"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Parámetros a Evaluar</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Peso:</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Prioritario
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Talla:</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Prioritario
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>IMC:</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Prioritario
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Perímetro cefálico:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Secundario
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Pliegues cutáneos:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Secundario
                        </Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Perímetro braquial:</span>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          Secundario
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-md">
                  <h3 className="text-sm font-medium mb-2">Objetivos del Seguimiento</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                      <span>
                        {selectedChildData.status === "Normal"
                          ? "Mantener el estado nutricional normal y la trayectoria de crecimiento adecuada."
                          : selectedChildData.status === "Riesgo"
                            ? "Mejorar el estado nutricional y prevenir la progresión a desnutrición."
                            : "Recuperar el estado nutricional normal y establecer una trayectoria de crecimiento adecuada."}
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                      <span>Evaluar la efectividad de las intervenciones nutricionales y de actividad física.</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 flex-shrink-0 mt-0.5">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                      <span>Ajustar las recomendaciones según la respuesta y evolución del niño.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                <FileDown className="mr-2 h-4 w-4" />
                Descargar Plan de Seguimiento
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

