"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, FileText, CheckCircle, Clock, AlertTriangle, MessageSquare } from "lucide-react"
import { useState } from "react"

export function HistorialConsentimientos() {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Filtre el historial de consentimientos según sus necesidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Buscar..." className="pl-8" />
            </div>

            <Select defaultValue="todos">
              <SelectTrigger>
                <SelectValue placeholder="Tipo de evento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los eventos</SelectItem>
                <SelectItem value="creacion">Creación</SelectItem>
                <SelectItem value="envio">Envío</SelectItem>
                <SelectItem value="firma">Firma</SelectItem>
                <SelectItem value="rechazo">Rechazo</SelectItem>
                <SelectItem value="comentario">Comentario</SelectItem>
              </SelectContent>
            </Select>

            <DateRangePicker date={dateRange} setDate={setDateRange} placeholder="Rango de fechas" />

            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Más filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historial de Eventos</CardTitle>
          <CardDescription>Registro cronológico de eventos relacionados con los consentimientos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {/* Día 1 */}
            <div>
              <h3 className="font-medium text-lg mb-4">15 de Noviembre, 2023</h3>
              <div className="space-y-4">
                <EventoHistorial
                  tipo="firma"
                  codigo="CON-2023-089"
                  paciente="Ana María Rodríguez"
                  hora="14:35"
                  descripcion="Consentimiento firmado por el paciente"
                  comentario="Firmado electrónicamente sin observaciones"
                />

                <EventoHistorial
                  tipo="envio"
                  codigo="CON-2023-093"
                  paciente="Javier López"
                  hora="11:20"
                  descripcion="Consentimiento enviado al paciente para firma"
                />

                <EventoHistorial
                  tipo="creacion"
                  codigo="CON-2023-093"
                  paciente="Javier López"
                  hora="10:45"
                  descripcion="Nuevo consentimiento creado"
                  comentario="Consentimiento para evaluación nutricional inicial"
                />
              </div>
            </div>

            {/* Día 2 */}
            <div>
              <h3 className="font-medium text-lg mb-4">14 de Noviembre, 2023</h3>
              <div className="space-y-4">
                <EventoHistorial
                  tipo="firma"
                  codigo="CON-2023-091"
                  paciente="Lucía Fernández"
                  hora="16:50"
                  descripcion="Consentimiento firmado por el paciente"
                />

                <EventoHistorial
                  tipo="comentario"
                  codigo="CON-2023-090"
                  paciente="Carlos Mendoza"
                  hora="15:30"
                  descripcion="Comentario añadido al consentimiento"
                  comentario="El paciente solicita más información antes de firmar"
                />

                <EventoHistorial
                  tipo="envio"
                  codigo="CON-2023-091"
                  paciente="Lucía Fernández"
                  hora="14:15"
                  descripcion="Consentimiento enviado al paciente para firma"
                />

                <EventoHistorial
                  tipo="envio"
                  codigo="CON-2023-090"
                  paciente="Carlos Mendoza"
                  hora="14:10"
                  descripcion="Consentimiento enviado al paciente para firma"
                />

                <EventoHistorial
                  tipo="creacion"
                  codigo="CON-2023-091"
                  paciente="Lucía Fernández"
                  hora="13:45"
                  descripcion="Nuevo consentimiento creado"
                />

                <EventoHistorial
                  tipo="creacion"
                  codigo="CON-2023-090"
                  paciente="Carlos Mendoza"
                  hora="13:30"
                  descripcion="Nuevo consentimiento creado"
                />
              </div>
            </div>

            {/* Día 3 */}
            <div>
              <h3 className="font-medium text-lg mb-4">13 de Noviembre, 2023</h3>
              <div className="space-y-4">
                <EventoHistorial
                  tipo="rechazo"
                  codigo="CON-2023-092"
                  paciente="Miguel Ángel Torres"
                  hora="17:20"
                  descripcion="Consentimiento rechazado por el paciente"
                  comentario="El paciente no está de acuerdo con los términos del consentimiento"
                />

                <EventoHistorial
                  tipo="envio"
                  codigo="CON-2023-092"
                  paciente="Miguel Ángel Torres"
                  hora="15:40"
                  descripcion="Consentimiento enviado al paciente para firma"
                />

                <EventoHistorial
                  tipo="creacion"
                  codigo="CON-2023-092"
                  paciente="Miguel Ángel Torres"
                  hora="15:15"
                  descripcion="Nuevo consentimiento creado"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface EventoHistorialProps {
  tipo: "creacion" | "envio" | "firma" | "rechazo" | "comentario"
  codigo: string
  paciente: string
  hora: string
  descripcion: string
  comentario?: string
}

function EventoHistorial({ tipo, codigo, paciente, hora, descripcion, comentario }: EventoHistorialProps) {
  const getIcono = () => {
    switch (tipo) {
      case "creacion":
        return <FileText className="h-5 w-5 text-blue-500" />
      case "envio":
        return <Clock className="h-5 w-5 text-amber-500" />
      case "firma":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "rechazo":
        return <AlertTriangle className="h-5 w-5 text-red-500" />
      case "comentario":
        return <MessageSquare className="h-5 w-5 text-purple-500" />
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0 mt-1">{getIcono()}</div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-medium">{codigo}</span>
            <span className="mx-2">•</span>
            <span>{paciente}</span>
          </div>
          <span className="text-sm text-muted-foreground">{hora}</span>
        </div>
        <p className="text-sm mt-1">{descripcion}</p>
        {comentario && <div className="mt-2 p-3 bg-muted rounded-md text-sm">{comentario}</div>}
      </div>
    </div>
  )
}
