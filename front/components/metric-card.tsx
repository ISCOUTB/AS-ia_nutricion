import { Card, CardContent } from "@/components/ui/card"
import type { ReactNode } from "react"

interface MetricCardProps {
  title: string
  value: string
  trend: string
  icon: ReactNode
}

export default function MetricCard({ title, value, trend, icon }: MetricCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">{icon}</div>
          <div className="text-xs text-muted-foreground">{trend}</div>
        </div>
        <div className="mt-3">
          <div className="text-sm text-muted-foreground">{title}</div>
          <div className="text-2xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  )
}

