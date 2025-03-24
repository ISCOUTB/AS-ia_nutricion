"use client"

import { Button } from "@/components/ui/button"
import { Calendar, Clock, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para reportes recientes
const recentReportsData = [
  {
    id: "1",
    title: "Reporte Mensual de Junio 2023",
    description: "Resumen de indicadores nutricionales del mes",
    date: "30/06/2023",
    time: "14:30",
    type: "Periódico",
  },
  {
    id: "2",
    title: "Análisis de Tendencias Q2 2023",
    description: "Evolución de indicadores en el segundo trimestre",
    date: "15/06/2023",
    time: "10:15",
    type: "Analítico",
  },
  {
    id: "3",
    title: "Reporte de Alertas Nutricionales",
    description: "Casos que requieren atención prioritaria",
    date: "10/06/2023",
    time: "09:45",
    type: "Alerta",
  },
  {
    id: "4",
    title: "Comparativa Centro 1 vs Centro 2",
    description: "Análisis comparativo de indicadores por centro",
    date: "05/06/2023",
    time: "16:20",
    type: "Comparativo",
  },
]

export function RecentReports() {
  return (
    <div className="space-y-4">
      {recentReportsData.map((report) => (
        <div key={report.id} className="flex items-start gap-3 p-3 border rounded-md hover:bg-muted/50 cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">{report.title}</h4>
            <p className="text-xs text-muted-foreground">{report.description}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="text-[10px]">
                {report.type}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" /> {report.date}
              </span>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" /> {report.time}
              </span>
            </div>
          </div>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-full">
        Ver todos los reportes
      </Button>
    </div>
  )
}

