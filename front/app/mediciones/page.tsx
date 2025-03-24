import { MeasurementsModule } from "@/components/measurements/measurements-module"
import { DashboardLayout } from "@/components/dashboard-layout"

export default function MeasurementsPage() {
  return (
    <DashboardLayout>
      <MeasurementsModule />
    </DashboardLayout>
  )
}

