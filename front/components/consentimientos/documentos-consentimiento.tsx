import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Upload, Download, Edit, Trash2, Plus, Search, Eye } from "lucide-react"

export function DocumentosConsentimiento() {
  return (
    <Tabs defaultValue="plantillas">
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="plantillas">Plantillas</TabsTrigger>
        <TabsTrigger value="documentos">Documentos Firmados</TabsTrigger>
      </TabsList>

      <TabsContent value="plantillas">
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Plantillas de Consentimiento</CardTitle>
                <CardDescription>Gestione las plantillas disponibles para los consentimientos</CardDescription>
              </div>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span>Nueva Plantilla</span>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {plantillasData.map((plantilla) => (
                  <PlantillaCard key={plantilla.id} {...plantilla} />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subir Nueva Plantilla</CardTitle>
              <CardDescription>Suba un nuevo documento para usar como plantilla</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-plantilla">Nombre de la plantilla</Label>
                    <Input id="nombre-plantilla" placeholder="Ej: Consentimiento para evaluación nutricional" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo-plantilla">Tipo de consentimiento</Label>
                    <Input id="tipo-plantilla" placeholder="Ej: Evaluación Nutricional" />
                  </div>
                </div>

                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="font-medium">Arrastre y suelte su archivo aquí</h3>
                  <p className="text-sm text-muted-foreground mb-4">Soporta PDF, DOCX, ODT (máx. 10MB)</p>
                  <Button variant="outline">Seleccionar archivo</Button>
                </div>

                <div className="flex justify-end">
                  <Button>Subir Plantilla</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="documentos">
        <Card>
          <CardHeader>
            <CardTitle>Documentos Firmados</CardTitle>
            <CardDescription>Acceda a todos los documentos de consentimiento firmados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input type="search" placeholder="Buscar documentos..." className="pl-8" />
                </div>
                <Button variant="outline">Filtrar</Button>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {documentosData.map((documento) => (
                  <DocumentoCard key={documento.id} {...documento} />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

interface PlantillaCardProps {
  id: number
  nombre: string
  tipo: string
  fechaCreacion: string
  ultimaActualizacion: string
}

function PlantillaCard({ nombre, tipo, fechaCreacion, ultimaActualizacion }: PlantillaCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{nombre}</CardTitle>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>{tipo}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          <p>Creado: {fechaCreacion}</p>
          <p>Actualizado: {ultimaActualizacion}</p>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>Ver</span>
          </Button>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Edit className="h-4 w-4" />
              <span className="sr-only">Editar</span>
            </Button>
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
              <span className="sr-only">Descargar</span>
            </Button>
            <Button variant="ghost" size="icon" className="text-red-500">
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

interface DocumentoCardProps {
  id: number
  codigo: string
  paciente: string
  tipo: string
  fechaFirma: string
  estado: "firmado" | "pendiente" | "rechazado"
}

function DocumentoCard({ codigo, paciente, tipo, fechaFirma, estado }: DocumentoCardProps) {
  const getEstadoBadge = () => {
    switch (estado) {
      case "firmado":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
            Firmado
          </span>
        )
      case "pendiente":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100">
            Pendiente
          </span>
        )
      case "rechazado":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
            Rechazado
          </span>
        )
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">{codigo}</CardTitle>
          <FileText className="h-5 w-5 text-muted-foreground" />
        </div>
        <CardDescription>{paciente}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm">{tipo}</span>
          {getEstadoBadge()}
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          <p>Firmado: {fechaFirma}</p>
        </div>
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>Ver</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Download className="h-3.5 w-3.5" />
            <span>Descargar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Datos de ejemplo
const plantillasData = [
  {
    id: 1,
    nombre: "Consentimiento para Evaluación Nutricional",
    tipo: "Evaluación Nutricional",
    fechaCreacion: "01/10/2023",
    ultimaActualizacion: "15/10/2023",
  },
  {
    id: 2,
    nombre: "Consentimiento para Seguimiento Nutricional",
    tipo: "Seguimiento Nutricional",
    fechaCreacion: "05/10/2023",
    ultimaActualizacion: "20/10/2023",
  },
  {
    id: 3,
    nombre: "Consentimiento para Intervención Nutricional",
    tipo: "Intervención Nutricional",
    fechaCreacion: "10/10/2023",
    ultimaActualizacion: "25/10/2023",
  },
]

const documentosData = [
  {
    id: 1,
    codigo: "CON-2023-089",
    paciente: "Ana María Rodríguez",
    tipo: "Evaluación Nutricional",
    fechaFirma: "15/11/2023",
    estado: "firmado" as const,
  },
  {
    id: 2,
    codigo: "CON-2023-090",
    paciente: "Carlos Mendoza",
    tipo: "Seguimiento Nutricional",
    fechaFirma: "14/11/2023",
    estado: "pendiente" as const,
  },
  {
    id: 3,
    codigo: "CON-2023-091",
    paciente: "Lucía Fernández",
    tipo: "Evaluación Nutricional",
    fechaFirma: "14/11/2023",
    estado: "firmado" as const,
  },
  {
    id: 4,
    codigo: "CON-2023-092",
    paciente: "Miguel Ángel Torres",
    tipo: "Intervención Nutricional",
    fechaFirma: "13/11/2023",
    estado: "rechazado" as const,
  },
]
