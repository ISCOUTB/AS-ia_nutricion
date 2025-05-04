import type { Metadata } from "next"
import { SeguridadModule } from "@/components/seguridad/seguridad-module"

export const metadata: Metadata = {
  title: "Seguridad | Sistema de Nutrición",
  description: "Gestión de seguridad y control de acceso del sistema",
}

export default function SeguridadPage() {
  return <SeguridadModule />
}
