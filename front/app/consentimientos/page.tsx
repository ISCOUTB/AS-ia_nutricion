import type { Metadata } from "next"
import { ConsentimientosModule } from "@/components/consentimientos/consentimientos-module"

export const metadata: Metadata = {
  title: "Consentimientos | Sistema de Monitoreo Nutricional",
  description: "Gestión de consentimientos informados para el estudio de evaluación nutricional infantil",
}

export default function ConsentimientosPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Consentimientos</h2>
      </div>
      <div className="space-y-4">
        <ConsentimientosModule />
      </div>
    </div>
  )
}

