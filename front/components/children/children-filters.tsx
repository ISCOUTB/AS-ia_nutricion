"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Search, Filter, X } from "lucide-react"

export function ChildrenFilters() {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState(0)

  return (
    <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Buscar por nombre, tutor..." className="pl-8 w-full" />
      </div>

      <Popover open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="h-9 flex gap-1">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            {activeFilters > 0 && (
              <span className="ml-1 rounded-full bg-primary text-primary-foreground text-xs px-1.5">
                {activeFilters}
              </span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-4" align="start">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Edad</h4>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Rango de edad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="0-1">0-1 años</SelectItem>
                    <SelectItem value="1-2">1-2 años</SelectItem>
                    <SelectItem value="2-3">2-3 años</SelectItem>
                    <SelectItem value="3-4">3-4 años</SelectItem>
                    <SelectItem value="4-5">4-5 años</SelectItem>
                    <SelectItem value="5-6">5-6 años</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium leading-none">Género</h4>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Seleccionar género" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="male">Masculino</SelectItem>
                    <SelectItem value="female">Femenino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium leading-none">Estado Nutricional</h4>
              <div className="flex items-center gap-2">
                <Select>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Estado nutricional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="risk">En Riesgo</SelectItem>
                    <SelectItem value="malnutrition">Desnutrición</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => {
                  setActiveFilters(0)
                  setIsFiltersOpen(false)
                }}
              >
                <X className="mr-1 h-3 w-3" />
                Limpiar
              </Button>
              <Button
                size="sm"
                className="text-xs"
                onClick={() => {
                  setActiveFilters(2)
                  setIsFiltersOpen(false)
                }}
              >
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

