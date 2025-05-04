import { DashboardLayout } from "@/components/dashboard-layout"
import { ConsentimientosModule } from "@/components/consentimientos/consentimientos-module"

export default function ConsentimientosPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Consentimientos</h1>
        </div>
        <ConsentimientosModule />
      </div>
    </DashboardLayout>
  )
}
