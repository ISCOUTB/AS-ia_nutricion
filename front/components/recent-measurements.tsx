import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const data = [
  {
    id: "1",
    name: "Ana García",
    age: "3 años",
    weight: "15.2 kg",
    height: "95 cm",
    date: "12/03/2023",
    status: "Normal",
  },
  {
    id: "2",
    name: "Carlos López",
    age: "4 años",
    weight: "16.8 kg",
    height: "102 cm",
    date: "15/03/2023",
    status: "Normal",
  },
  {
    id: "3",
    name: "María Rodríguez",
    age: "2 años",
    weight: "10.5 kg",
    height: "82 cm",
    date: "18/03/2023",
    status: "Riesgo",
  },
  {
    id: "4",
    name: "Juan Pérez",
    age: "5 años",
    weight: "18.1 kg",
    height: "108 cm",
    date: "20/03/2023",
    status: "Normal",
  },
  {
    id: "5",
    name: "Sofia Martínez",
    age: "1 año",
    weight: "8.2 kg",
    height: "72 cm",
    date: "22/03/2023",
    status: "Desnutrición",
  },
]

export function RecentMeasurements() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nombre</TableHead>
          <TableHead>Edad</TableHead>
          <TableHead>Peso</TableHead>
          <TableHead>Talla</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((measurement) => (
          <TableRow key={measurement.id}>
            <TableCell className="font-medium">{measurement.name}</TableCell>
            <TableCell>{measurement.age}</TableCell>
            <TableCell>{measurement.weight}</TableCell>
            <TableCell>{measurement.height}</TableCell>
            <TableCell>{measurement.date}</TableCell>
            <TableCell>
              <Badge
                variant={
                  measurement.status === "Normal"
                    ? "outline"
                    : measurement.status === "Riesgo"
                      ? "secondary"
                      : "destructive"
                }
              >
                {measurement.status}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

