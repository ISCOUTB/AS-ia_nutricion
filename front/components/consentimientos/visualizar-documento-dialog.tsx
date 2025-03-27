"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Printer, Share2, Copy } from "lucide-react"

interface VisualizarDocumentoDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  documentId: string | null
  documentos: any[]
}

export function VisualizarDocumentoDialog({
  open,
  onOpenChange,
  documentId,
  documentos,
}: VisualizarDocumentoDialogProps) {
  const documento = documentos.find((doc) => doc.id === documentId) || null

  if (!documento) return null

  const renderDocumentoContent = () => {
    if (documento.id === "doc-1") {
      return (
        <>
          <div className="text-center mb-4">
            <h3 className="font-bold">
              Consentimiento Informado para la Participación en el Estudio de Evaluación de Nutrición en Niños
            </h3>
          </div>
          <p className="font-semibold">Título del Estudio:</p>
          <p className="mb-2">Evaluación Nutricional Infantil mediante Sistema Digital de Monitoreo</p>

          <p className="font-semibold">Investigador Principal:</p>
          <p className="mb-2">Edwin Alexander Puertas Del Castillo</p>
          <p className="mb-2">Profesor(a) de Tiempo Completo</p>
          <p className="mb-2">epuerta@utb.edu.co</p>

          <p className="font-semibold">Co-investigadores:</p>
          <p className="mb-2">Fabián Camilo Quintero Pareja</p>
          <p className="mb-2">Estudiante de Ingeniería de Sistemas y Computación</p>
          <p className="mb-2">parejaf@utb.edu.co</p>

          <p className="mb-2">Santiago Quintero Pareja</p>
          <p className="mb-2">Estudiante de Ingeniería de Sistemas y Computación</p>
          <p className="mb-2">squintero@utb.edu.co</p>

          <p className="font-semibold">Institución:</p>
          <p className="mb-2">Universidad Tecnológica de Bolívar</p>

          <p className="font-semibold">Introducción y Objetivo</p>
          <p className="mb-2">
            El presente estudio tiene como finalidad desarrollar y evaluar un sistema digital para el monitoreo y
            análisis del estado nutricional en niños. La recolección automatizada de datos antropométricos (peso, talla,
            estatura, entre otros) permitirá identificar tempranamente condiciones de desnutrición y apoyar la toma de
            decisiones en salud.
          </p>

          <p className="font-semibold">Procedimientos de Participación</p>
          <p className="mb-2">1. Recolección de Datos:</p>
          <p className="mb-2">
            Se tomarán mediciones antropométricas de manera periódica a través de dispositivos digitales y formularios
            electrónicos. Adicionalmente, se podrán registrar observaciones complementarias relacionadas con el
            comportamiento y otros indicadores de crecimiento.
          </p>
          <p className="mb-2">2. Almacenamiento y Anonimización:</p>
          <p className="mb-2">
            Todos los datos se almacenarán en bases de datos seguras, se anonimizarán y cifrarán para garantizar la
            confidencialidad del menor.
          </p>

          <p className="font-semibold">Protección de Datos y Marco Legal</p>
          <p className="mb-2">
            Este estudio se ejecuta conforme a los principios y disposiciones de la Ley 1581 de 2012 y el Decreto 1377
            de 2013, que regulan la protección de datos personales en Colombia, con especial énfasis en la protección de
            información sensible de menores. Solo el equipo de investigación autorizado tendrá acceso a la información,
            que se utilizará exclusivamente para fines científicos.
          </p>

          <p className="font-semibold">Riesgos y Beneficios</p>
          <p className="mb-2">• Riesgos e Incomodidades:</p>
          <p className="mb-2">
            La participación puede generar molestias mínimas durante la toma de mediciones físicas. Se han implementado
            medidas para minimizar cualquier incomodidad.
          </p>
          <p className="mb-2">• Beneficios:</p>
          <p className="mb-2">
            Aunque la participación no proporciona beneficios directos inmediatos, los resultados podrán contribuir a
            desarrollar mejores estrategias de intervención nutricional y seguimiento del crecimiento infantil.
          </p>

          <p className="font-semibold">Voluntariedad y Derecho a Retirar el Consentimiento</p>
          <p className="mb-2">
            La participación es totalmente voluntaria. Los padres o tutores legales pueden negar o retirar su
            consentimiento en cualquier momento, sin que ello afecte la atención del menor o su relación con la
            institución.
          </p>

          <p className="font-semibold">Declaración de Consentimiento</p>
          <p className="mb-2">
            Al firmar este documento, en mi calidad de representante legal del menor, confirmo que he sido informado(a)
            de manera clara sobre el estudio, sus procedimientos, riesgos y beneficios. Acepto voluntariamente la
            participación del menor en este estudio y autorizo el tratamiento de sus datos personales conforme a lo
            descrito.
          </p>

          <p className="mb-2">Nombre del Padre/Madre o Tutor: ___________________________</p>
          <p className="mb-2">Cédula de Ciudadanía: ___________________________</p>
          <p className="mb-2">Firma: ___________________________</p>
          <p className="mb-2">Fecha: _____________________</p>
        </>
      )
    } else if (documento.id === "doc-2") {
      return (
        <>
          <div className="text-center mb-4">
            <h3 className="font-bold">
              Autorización para la Recolección, Almacenamiento, Conservación, Publicación y Transferencia de Datos
              Personales
            </h3>
          </div>
          <p className="font-semibold">Título:</p>
          <p className="mb-2">
            Autorización para la Recolección, Almacenamiento, Conservación, Publicación y Transferencia de Datos
            Personales en el Estudio de Evaluación Nutricional Infantil
          </p>

          <p className="font-semibold">Autorización</p>
          <p className="mb-2">
            Yo, __________________________, identificado(a) con cédula de ciudadanía No. ___________________, en calidad
            de representante legal del menor __________________________, autorizo de manera voluntaria, previa,
            explícita e informada a Universidad Tecnológica de Bolívar y a su equipo de investigación, para:
          </p>

          <p className="mb-2">1. Recolectar:</p>
          <p className="mb-2">
            Capturar datos personales y antropométricos del menor, mediante mediciones digitales y formularios
            electrónicos.
          </p>
          <p className="mb-2">2. Almacenar y Conservar:</p>
          <p className="mb-2">
            Guardar y conservar dichos datos en bases de datos seguras, aplicando técnicas de cifrado y anonimización,
            en cumplimiento de las medidas de seguridad establecidas.
          </p>
          <p className="mb-2">3. Publicar y Transferir:</p>
          <p className="mb-2">
            Utilizar los datos de manera anónima para fines de investigación científica y divulgación académica, en
            publicaciones, conferencias y presentaciones, garantizando que la identidad del menor nunca sea revelada.
          </p>

          <p className="font-semibold">Compromiso de Protección</p>
          <p className="mb-2">
            El tratamiento de los datos se realizará en estricto apego a la Ley 1581 de 2012 y el Decreto 1377 de 2013,
            asegurando que la información se maneje con la máxima confidencialidad y se utilice exclusivamente para los
            fines del estudio.
          </p>

          <p className="font-semibold">Derecho a Retirar el Consentimiento</p>
          <p className="mb-2">
            Entiendo que mi participación y la del menor en este estudio es totalmente voluntaria. Puedo retirar mi
            consentimiento en cualquier momento sin que ello repercuta negativamente en la atención o servicios que
            reciba el menor.
          </p>

          <p className="font-semibold">Confirmación</p>
          <p className="mb-2">
            Al firmar el presente documento, confirmo haber sido debidamente informado sobre el propósito, procedimiento
            y riesgos del estudio, y acepto de manera consciente el tratamiento de los datos personales conforme a lo
            anterior expuesto.
          </p>

          <p className="mb-2">Nombre del Padre/Madre o Tutor: ___________________________</p>
          <p className="mb-2">Cédula de Ciudadanía: ___________________________</p>
          <p className="mb-2">Firma: ___________________________</p>
          <p className="mb-2">Fecha: _____________________</p>
        </>
      )
    } else if (documento.id === "doc-3") {
      return (
        <>
          <div className="text-center mb-4">
            <h3 className="font-bold">Política de Tratamiento de Datos</h3>
          </div>
          <p className="font-semibold">Título</p>
          <p className="mb-2">Política de Tratamiento de Datos para el Estudio de Evaluación Nutricional Infantil</p>

          <p className="font-semibold">Objetivo</p>
          <p className="mb-2">
            Esta política tiene como finalidad establecer los lineamientos para la recolección, almacenamiento,
            tratamiento y protección de los datos personales obtenidos en el estudio, garantizando el respeto a la
            privacidad y la confidencialidad de la información de los participantes, en especial de los menores.
          </p>

          <p className="font-semibold">Alcance y Principios</p>
          <p className="mb-2">1. Recopilación de Datos:</p>
          <p className="mb-2">
            Los datos se recopilarán única y exclusivamente con el consentimiento informado de los representantes
            legales, informando claramente el propósito del estudio.
          </p>
          <p className="mb-2">2. Uso de Datos:</p>
          <p className="mb-2">
            La información será utilizada únicamente para fines de investigación científica, análisis estadístico y
            elaboración de reportes, sin que se identifique a los participantes en publicaciones o presentaciones.
          </p>
          <p className="mb-2">3. Anonimización y Seguridad:</p>
          <p className="mb-2">
            Antes del análisis, toda la información será anonimizadas para evitar la identificación directa o indirecta
            de los menores. Se implementarán medidas de seguridad técnicas y organizativas para proteger los datos
            contra acceso no autorizado, alteración, pérdida o divulgación.
          </p>
          <p className="mb-2">4. Conservación y Eliminación:</p>
          <p className="mb-2">
            Los datos personales se conservarán únicamente por el tiempo necesario para alcanzar los objetivos del
            estudio. Una vez finalizado el estudio, los datos sensibles que no sean necesarios para investigaciones
            futuras se eliminarán de forma segura.
          </p>

          <p className="font-semibold">Marco Normativo</p>
          <p className="mb-2">
            Esta política se rige por los principios establecidos en la Ley 1581 de 2012 y el Decreto 1377 de 2013,
            garantizando la protección de datos personales en el contexto colombiano, con especial consideración a la
            información de menores.
          </p>

          <p className="font-semibold">Responsabilidades y Acceso</p>
          <p className="mb-2">• Acceso:</p>
          <p className="mb-2">
            Solo el equipo de investigación autorizado tendrá acceso a los datos personales, bajo estrictos controles de
            acceso.
          </p>
          <p className="mb-2">• Responsabilidades:</p>
          <p className="mb-2">
            El equipo investigador se compromete a cumplir con esta política y a informar a los participantes sobre
            cualquier eventualidad relacionada con la seguridad de sus datos.
          </p>
        </>
      )
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{documento.titulo}</DialogTitle>
          <DialogDescription>
            Versión {documento.version} • Actualizado el {documento.fechaActualizacion}
          </DialogDescription>
        </DialogHeader>
        <div className="border rounded-md p-6 max-h-[500px] overflow-y-auto bg-white">{renderDocumentoContent()}</div>
        <DialogFooter className="flex justify-between">
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Copy className="mr-2 h-4 w-4" />
              Copiar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Compartir
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Descargar
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

