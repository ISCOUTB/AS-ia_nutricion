import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export default function GrowthTable() {
  // Datos de ejemplo
  const growthData = [
    {
      id: 1,
      name: "Ana García",
      age: "3 años",
      weight: "15.2 kg",
      height: "95 cm",
      date: "12/03/2023",
      status: "Normal",
    },
    {
      id: 2,
      name: "Carlos López",
      age: "4 años",
      weight: "16.8 kg",
      height: "102 cm",
      date: "15/03/2023",
      status: "Normal",
    },
    {
      id: 3,
      name: "María Rodríguez",
      age: "2 años",
      weight: "10.5 kg",
      height: "82 cm",
      date: "18/03/2023",
      status: "Riesgo",
    },
    {
      id: 4,
      name: "Juan Pérez",
      age: "5 años",
      weight: "18.1 kg",
      height: "108 cm",
      date: "20/03/2023",
      status: "Normal",
    },
    {
      id: 5,
      name: "Sofia Martínez",
      age: "1 año",
      weight: "8.2 kg",
      height: "72 cm",
      date: "22/03/2023",
      status: "Desnutrición",
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Buscar por nombre..." className="pl-8" />
        </div>
        <Button variant="outline">Filtrar</Button>
      </div>

      <div className="rounded-md border">
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
            {growthData.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>{row.age}</TableCell>
                <TableCell>{row.weight}</TableCell>
                <TableCell>{row.height}</TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      row.status === "Normal"
                        ? "bg-green-100 text-green-800"
                        : row.status === "Riesgo"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {row.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

