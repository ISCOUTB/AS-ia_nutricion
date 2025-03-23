import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Eye } from "lucide-react"

const data = [
  {
    id: "1",
    name: "María Rodríguez",
    age: "2 años",
    weight: "10.5 kg",
    height: "82 cm",
    issue: "Bajo peso para la edad",
    severity: "Media",
    date: "18/03/2023",
  },
  {
    id: "2",
    name: "Sofia Martínez",
    age: "1 año",
    weight: "8.2 kg",
    height: "72 cm",
    issue: "Desnutrición aguda",
    severity: "Alta",
    date: "22/03/2023",
  },
  {
    id: "3",
    name: "Luis Gómez",
    age: "3 años",
    weight: "12.1 kg",
    height: "90 cm",
    issue: "Estancamiento en crecimiento",
    severity: "Media",
    date: "25/03/2023",
  },
  {
    id: "4",
    name: "Pedro Sánchez",
    age: "4 años",
    weight: "14.3 kg",
    height: "95 cm",
    issue: "Bajo peso para la talla",
    severity: "Alta",
    date: "27/03/2023",
  },
  {
    id: "5",
    name: "Ana Torres",
    age: "2 años",
    weight: "9.8 kg",
    height: "80 cm",
    issue: "Riesgo de desnutrición",
    severity: "Media",
    date: "30/03/2023",
  },
]

export function AlertsOverview() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Edad</TableHead>
          <TableHead>Problema</TableHead>
          <TableHead>Severidad</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Acción</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((alert) => (
          <TableRow key={alert.id}>
            <TableCell className="font-medium">{alert.name}</TableCell>
            <TableCell>{alert.age}</TableCell>
            <TableCell>{alert.issue}</TableCell>
            <TableCell>
              <Badge
                variant={alert.severity === "Alta" ? "destructive" : "secondary"}
                className="flex items-center gap-1"
              >
                {alert.severity === "Alta" && <AlertTriangle className="h-3 w-3" />}
                {alert.severity}
              </Badge>
            </TableCell>
            <TableCell>{alert.date}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Ver
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

