"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Printer, Share2, Edit, Eye } from "lucide-react"
import { VisualizarDocumentoDialog } from "./visualizar-documento-dialog"

export function DocumentosConsentimiento() {
  const [activeDocument, setActiveDocument] = useState<string | null>(null)
  const [showDocumentViewer, setShowDocumentViewer] = useState(false)

  // Datos de ejemplo para los documentos
  const documentos = [
    {
      id: "doc-1",
      titulo: "Consentimiento Informado para la Participación en el Estudio",
      descripcion: "Documento que explica el propósito, procedimientos, riesgos y beneficios del estudio.",
      version: "1.2",
      fechaActualizacion: "2023-10-15",
      tipo: "consentimiento",
    },
    {
      id: "doc-2",
      titulo:
        "Autorización para la Recolección, Almacenamiento, Conservación, Publicación y Transferencia de Datos Personales",
      descripcion: "Documento que autoriza el tratamiento de datos personales del menor.",
      version: "1.1",
      fechaActualizacion: "2023-10-15",
      tipo: "autorizacion",
    },
    {
      id: "doc-3",
      titulo: "Política de Tratamiento de Datos",
      descripcion: "Documento que establece los lineamientos para el tratamiento de datos personales.",
      version: "1.0",
      fechaActualizacion: "2023-10-15",
      tipo: "politica",
    },
  ]

  const handleViewDocument = (documentId: string) => {
    setActiveDocument(documentId)
    setShowDocumentViewer(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Documentos de Consentimiento</CardTitle>
          <CardDescription>Gestione los documentos de consentimiento utilizados en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="consentimiento">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="consentimiento">Consentimiento Informado</TabsTrigger>
              <TabsTrigger value="autorizacion">Autorización de Datos</TabsTrigger>
              <TabsTrigger value="politica">Política de Tratamiento</TabsTrigger>
            </TabsList>
            <TabsContent value="consentimiento" className="space-y-4 mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Consentimiento Informado para la Participación en el Estudio
                  </h3>
                  <p className="text-sm text-muted-foreground">Versión 1.2 • Actualizado el 15/10/2023</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDocument("doc-1")}>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Contenido del documento:</h4>
                <div className="rounded-md border p-4 bg-muted/50">
                  <p className="font-semibold">Título del Estudio:</p>
                  <p className="mb-2">Evaluación Nutricional Infantil mediante Sistema Digital de Monitoreo</p>

                  <p className="font-semibold">Investigador Principal:</p>
                  <p className="mb-2">Edwin Alexander Puertas Del Castillo</p>

                  <p className="font-semibold">Introducción y Objetivo:</p>
                  <p className="mb-2">
                    El presente estudio tiene como finalidad desarrollar y evaluar un sistema digital para el monitoreo
                    y análisis del estado nutricional en niños...
                  </p>

                  <p className="text-sm text-muted-foreground italic">
                    (Documento resumido. Haga clic en "Visualizar" para ver el documento completo)
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="autorizacion" className="space-y-4 mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    Autorización para la Recolección, Almacenamiento, Conservación, Publicación y Transferencia de Datos
                    Personales
                  </h3>
                  <p className="text-sm text-muted-foreground">Versión 1.1 • Actualizado el 15/10/2023</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDocument("doc-2")}>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Contenido del documento:</h4>
                <div className="rounded-md border p-4 bg-muted/50">
                  <p className="font-semibold">Autorización:</p>
                  <p className="mb-2">
                    Yo, [nombre], identificado(a) con cédula de ciudadanía No. [número], en calidad de representante
                    legal del menor [nombre del menor], autorizo de manera voluntaria, previa, explícita e informada a
                    Universidad Tecnológica de Bolívar y a su equipo de investigación, para...
                  </p>

                  <p className="font-semibold">Compromiso de Protección:</p>
                  <p className="mb-2">
                    El tratamiento de los datos se realizará en estricto apego a la Ley 1581 de 2012 y el Decreto 1377
                    de 2013...
                  </p>

                  <p className="text-sm text-muted-foreground italic">
                    (Documento resumido. Haga clic en "Visualizar" para ver el documento completo)
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="politica" className="space-y-4 mt-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Política de Tratamiento de Datos</h3>
                  <p className="text-sm text-muted-foreground">Versión 1.0 • Actualizado el 15/10/2023</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDocument("doc-3")}>
                    <Eye className="mr-2 h-4 w-4" />
                    Visualizar
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </div>
              </div>
              <Separator />
              <div className="space-y-2">
                <h4 className="font-medium">Contenido del documento:</h4>
                <div className="rounded-md border p-4 bg-muted/50">
                  <p className="font-semibold">Objetivo:</p>
                  <p className="mb-2">
                    Esta política tiene como finalidad establecer los lineamientos para la recolección, almacenamiento,
                    tratamiento y protección de los datos personales obtenidos en el estudio...
                  </p>

                  <p className="font-semibold">Alcance y Principios:</p>
                  <p className="mb-2">
                    Los datos se recopilarán única y exclusivamente con el consentimiento informado de los
                    representantes legales, informando claramente el propósito del estudio...
                  </p>

                  <p className="text-sm text-muted-foreground italic">
                    (Documento resumido. Haga clic en "Visualizar" para ver el documento completo)
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir documentos
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Editar plantillas
            </Button>
            <Button variant="outline">
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
          </div>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Historial de Versiones</CardTitle>
          <CardDescription>Registro de cambios en los documentos de consentimiento</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Consentimiento Informado v1.2</p>
                  <p className="text-sm text-muted-foreground">Actualizado el 15/10/2023</p>
                </div>
              </div>
              <p className="text-sm">Se actualizaron los datos de contacto del investigador principal</p>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Autorización de Datos v1.1</p>
                  <p className="text-sm text-muted-foreground">Actualizado el 15/10/2023</p>
                </div>
              </div>
              <p className="text-sm">Se añadieron cláusulas de protección adicionales</p>
            </div>
            <div className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="font-medium">Consentimiento Informado v1.1</p>
                  <p className="text-sm text-muted-foreground">Actualizado el 01/09/2023</p>
                </div>
              </div>
              <p className="text-sm">Se clarificaron los procedimientos de participación</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <VisualizarDocumentoDialog
        open={showDocumentViewer}
        onOpenChange={setShowDocumentViewer}
        documentId={activeDocument}
        documentos={documentos}
      />
    </div>
  )
}

