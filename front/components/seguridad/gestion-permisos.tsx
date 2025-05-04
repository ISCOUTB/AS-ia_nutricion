"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Save, Plus, Edit, Trash2, Filter, RefreshCw } from "lucide-react"

// Datos de ejemplo
const modulos = [
  {
    id: 1,
    nombre: "Dashboard",
    descripcion: "Panel principal del sistema",
    permisos: [{ id: 1, nombre: "Ver dashboard", clave: "dashboard.view" }],
  },
  {
    id: 2,
    nombre: "Niños",
    descripcion: "Gestión de niños y datos personales",
    permisos: [
      { id: 2, nombre: "Ver niños", clave: "ninos.view" },
      { id: 3, nombre: "Crear niños", clave: "ninos.create" },
      { id: 4, nombre: "Editar niños", clave: "ninos.edit" },
      { id: 5, nombre: "Eliminar niños", clave: "ninos.delete" },
      { id: 6, nombre: "Exportar datos", clave: "ninos.export" },
    ],
  },
  {
    id: 3,
    nombre: "Mediciones",
    descripcion: "Gestión de mediciones y datos antropométricos",
    permisos: [
      { id: 7, nombre: "Ver mediciones", clave: "mediciones.view" },
      { id: 8, nombre: "Crear mediciones", clave: "mediciones.create" },
      { id: 9, nombre: "Editar mediciones", clave: "mediciones.edit" },
      { id: 10, nombre: "Eliminar mediciones", clave: "mediciones.delete" },
      { id: 11, nombre: "Exportar mediciones", clave: "mediciones.export" },
    ],
  },
  {
    id: 4,
    nombre: "Reportes",
    descripcion: "Generación y visualización de reportes",
    permisos: [
      { id: 12, nombre: "Ver reportes", clave: "reportes.view" },
      { id: 13, nombre: "Crear reportes", clave: "reportes.create" },
      { id: 14, nombre: "Exportar reportes", clave: "reportes.export" },
    ],
  },
  {
    id: 5,
    nombre: "Consentimientos",
    descripcion: "Gestión de consentimientos informados",
    permisos: [
      { id: 15, nombre: "Ver consentimientos", clave: "consentimientos.view" },
      { id: 16, nombre: "Crear consentimientos", clave: "consentimientos.create" },
      { id: 17, nombre: "Editar consentimientos", clave: "consentimientos.edit" },
      { id: 18, nombre: "Eliminar consentimientos", clave: "consentimientos.delete" },
    ],
  },
  {
    id: 6,
    nombre: "Seguridad",
    descripcion: "Configuración de seguridad y usuarios",
    permisos: [
      { id: 19, nombre: "Ver configuración", clave: "seguridad.view" },
      { id: 20, nombre: "Gestionar usuarios", clave: "seguridad.users" },
      { id: 21, nombre: "Gestionar roles", clave: "seguridad.roles" },
      { id: 22, nombre: "Ver auditoría", clave: "seguridad.audit" },
      { id: 23, nombre: "Configurar sistema", clave: "seguridad.config" },
      { id: 24, nombre: "Gestionar permisos", clave: "seguridad.permissions" },
    ],
  },
]

const roles = [
  { id: 1, nombre: "Administrador" },
  { id: 2, nombre: "Nutricionista" },
  { id: 3, nombre: "Médico" },
  { id: 4, nombre: "Asistente" },
  { id: 5, nombre: "Invitado" },
]

export function GestionPermisos() {
  const [moduloSeleccionado, setModuloSeleccionado] = useState(null)
  const [showEditarPermisos, setShowEditarPermisos] = useState(false)
  const [showNuevoPermiso, setShowNuevoPermiso] = useState(false)
  const [rolSeleccionado, setRolSeleccionado] = useState("1")

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Gestión de Permisos</h2>
          <p className="text-muted-foreground">Administración de permisos por rol y módulo</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Matriz de Permisos</CardTitle>
            <div className="flex items-center gap-2">
              <Select value={rolSeleccionado} onValueChange={setRolSeleccionado}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((rol) => (
                    <SelectItem key={rol.id} value={rol.id.toString()}>
                      {rol.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={() => setShowEditarPermisos(true)}>Editar Permisos</Button>
            </div>
          </div>
          <CardDescription>
            Permisos asignados al rol: {roles.find((r) => r.id.toString() === rolSeleccionado)?.nombre}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar permisos..." className="pl-8" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Permisos Asignados</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modulos.map((modulo) => (
                  <TableRow key={modulo.id}>
                    <TableCell className="font-medium">{modulo.nombre}</TableCell>
                    <TableCell>{modulo.descripcion}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {modulo.permisos.slice(0, 3).map((permiso, index) => (
                          <span
                            key={permiso.id}
                            className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold"
                          >
                            {permiso.nombre}
                          </span>
                        ))}
                        {modulo.permisos.length > 3 && (
                          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                            +{modulo.permisos.length - 3} más
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setModuloSeleccionado(modulo)
                          setShowEditarPermisos(true)
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Permisos del Sistema</CardTitle>
            <Button onClick={() => setShowNuevoPermiso(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Permiso
            </Button>
          </div>
          <CardDescription>Listado de todos los permisos disponibles en el sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar permisos..." className="pl-8" />
            </div>
            <Select defaultValue="todos">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por módulo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los módulos</SelectItem>
                {modulos.map((modulo) => (
                  <SelectItem key={modulo.id} value={modulo.id.toString()}>
                    {modulo.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Clave</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead className="w-[100px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modulos.flatMap((modulo) =>
                  modulo.permisos.map((permiso) => (
                    <TableRow key={permiso.id}>
                      <TableCell className="font-medium">{permiso.nombre}</TableCell>
                      <TableCell className="font-mono text-xs">{permiso.clave}</TableCell>
                      <TableCell>{modulo.nombre}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )),
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo para editar permisos */}
      <Dialog open={showEditarPermisos} onOpenChange={setShowEditarPermisos}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              Editar Permisos - {moduloSeleccionado ? moduloSeleccionado.nombre : "Todos los módulos"}
            </DialogTitle>
            <DialogDescription>
              Asignar permisos al rol: {roles.find((r) => r.id.toString() === rolSeleccionado)?.nombre}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {(moduloSeleccionado ? [moduloSeleccionado] : modulos).map((modulo) => (
              <div key={modulo.id} className="space-y-4">
                <div className="font-medium text-lg">{modulo.nombre}</div>
                <div className="space-y-2 ml-2">
                  {modulo.permisos.map((permiso) => (
                    <div key={permiso.id} className="flex items-center space-x-2">
                      <Checkbox id={`perm-${permiso.id}`} defaultChecked={permiso.id % 2 === 0} />
                      <label
                        htmlFor={`perm-${permiso.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {permiso.nombre}
                        <span className="text-xs text-muted-foreground ml-2 font-mono">{permiso.clave}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditarPermisos(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              Guardar Cambios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para nuevo permiso */}
      <Dialog open={showNuevoPermiso} onOpenChange={setShowNuevoPermiso}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Permiso</DialogTitle>
            <DialogDescription>Añadir un nuevo permiso al sistema</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nombrePermiso" className="text-right">
                Nombre
              </label>
              <Input id="nombrePermiso" className="col-span-3" placeholder="Ver estadísticas" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="clavePermiso" className="text-right">
                Clave
              </label>
              <Input id="clavePermiso" className="col-span-3" placeholder="estadisticas.view" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="moduloPermiso" className="text-right">
                Módulo
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar módulo" />
                </SelectTrigger>
                <SelectContent>
                  {modulos.map((modulo) => (
                    <SelectItem key={modulo.id} value={modulo.id.toString()}>
                      {modulo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="descripcionPermiso" className="text-right">
                Descripción
              </label>
              <Input
                id="descripcionPermiso"
                className="col-span-3"
                placeholder="Permite ver las estadísticas del sistema"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNuevoPermiso(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Permiso</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
