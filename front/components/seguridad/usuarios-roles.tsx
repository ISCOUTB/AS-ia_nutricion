"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, Search, UserPlus, Download, Upload, Filter, RefreshCw } from "lucide-react"

// Datos de ejemplo
const usuarios = [
  {
    id: 1,
    nombre: "Ana García",
    email: "ana.garcia@nutricion.org",
    rol: "Administrador",
    estado: "Activo",
    ultimoAcceso: "2023-04-15 09:23:45",
  },
  {
    id: 2,
    nombre: "Carlos Rodríguez",
    email: "carlos.rodriguez@nutricion.org",
    rol: "Nutricionista",
    estado: "Activo",
    ultimoAcceso: "2023-04-14 14:12:30",
  },
  {
    id: 3,
    nombre: "María López",
    email: "maria.lopez@nutricion.org",
    rol: "Médico",
    estado: "Activo",
    ultimoAcceso: "2023-04-13 11:45:22",
  },
  {
    id: 4,
    nombre: "Juan Pérez",
    email: "juan.perez@nutricion.org",
    rol: "Asistente",
    estado: "Inactivo",
    ultimoAcceso: "2023-03-28 16:30:10",
  },
  {
    id: 5,
    nombre: "Laura Martínez",
    email: "laura.martinez@nutricion.org",
    rol: "Invitado",
    estado: "Activo",
    ultimoAcceso: "2023-04-10 08:15:33",
  },
]

const roles = [
  {
    id: 1,
    nombre: "Administrador",
    descripcion: "Acceso completo al sistema",
    usuarios: 3,
    permisos: 24,
  },
  {
    id: 2,
    nombre: "Nutricionista",
    descripcion: "Gestión de pacientes y mediciones",
    usuarios: 8,
    permisos: 18,
  },
  {
    id: 3,
    nombre: "Médico",
    descripcion: "Consulta de datos y reportes",
    usuarios: 6,
    permisos: 15,
  },
  {
    id: 4,
    nombre: "Asistente",
    descripcion: "Registro de datos básicos",
    usuarios: 5,
    permisos: 10,
  },
  {
    id: 5,
    nombre: "Invitado",
    descripcion: "Solo visualización limitada",
    usuarios: 2,
    permisos: 5,
  },
]

export function UsuariosRoles() {
  const [activeTab, setActiveTab] = useState("usuarios")
  const [showNuevoUsuario, setShowNuevoUsuario] = useState(false)
  const [showNuevoRol, setShowNuevoRol] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuarios y Roles</h2>
          <p className="text-muted-foreground">Gestión de usuarios, roles y permisos del sistema</p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="roles">Roles</TabsTrigger>
        </TabsList>

        <TabsContent value="usuarios" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Gestión de Usuarios</CardTitle>
                <Button onClick={() => setShowNuevoUsuario(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </Button>
              </div>
              <CardDescription>Administra los usuarios del sistema y sus roles asignados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar usuarios..." className="pl-8" />
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
                      <TableHead>Nombre</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Último Acceso</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usuarios.map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell className="font-medium">{usuario.nombre}</TableCell>
                        <TableCell>{usuario.email}</TableCell>
                        <TableCell>{usuario.rol}</TableCell>
                        <TableCell>
                          <Badge variant={usuario.estado === "Activo" ? "default" : "secondary"}>
                            {usuario.estado}
                          </Badge>
                        </TableCell>
                        <TableCell>{usuario.ultimoAcceso}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                              <DropdownMenuItem>Editar usuario</DropdownMenuItem>
                              <DropdownMenuItem>Cambiar rol</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>Restablecer contraseña</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                {usuario.estado === "Activo" ? "Desactivar" : "Activar"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles" className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Gestión de Roles</CardTitle>
                <Button onClick={() => setShowNuevoRol(true)}>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Nuevo Rol
                </Button>
              </div>
              <CardDescription>Administra los roles del sistema y sus permisos asociados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="relative w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Buscar roles..." className="pl-8" />
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Descripción</TableHead>
                      <TableHead>Usuarios</TableHead>
                      <TableHead>Permisos</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {roles.map((rol) => (
                      <TableRow key={rol.id}>
                        <TableCell className="font-medium">{rol.nombre}</TableCell>
                        <TableCell>{rol.descripcion}</TableCell>
                        <TableCell>{rol.usuarios}</TableCell>
                        <TableCell>{rol.permisos}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menú</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                              <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                              <DropdownMenuItem>Editar rol</DropdownMenuItem>
                              <DropdownMenuItem>Gestionar permisos</DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">Eliminar</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para nuevo usuario */}
      <Dialog open={showNuevoUsuario} onOpenChange={setShowNuevoUsuario}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Usuario</DialogTitle>
            <DialogDescription>Ingresa la información del nuevo usuario del sistema</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nombre" className="text-right">
                Nombre
              </label>
              <Input id="nombre" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input id="email" type="email" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="rol" className="text-right">
                Rol
              </label>
              <Select>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrador">Administrador</SelectItem>
                  <SelectItem value="nutricionista">Nutricionista</SelectItem>
                  <SelectItem value="medico">Médico</SelectItem>
                  <SelectItem value="asistente">Asistente</SelectItem>
                  <SelectItem value="invitado">Invitado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="password" className="text-right">
                Contraseña
              </label>
              <Input id="password" type="password" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="confirmPassword" className="text-right">
                Confirmar
              </label>
              <Input id="confirmPassword" type="password" className="col-span-3" />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNuevoUsuario(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Usuario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para nuevo rol */}
      <Dialog open={showNuevoRol} onOpenChange={setShowNuevoRol}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Rol</DialogTitle>
            <DialogDescription>Define un nuevo rol y sus permisos asociados</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="nombreRol" className="text-right">
                Nombre
              </label>
              <Input id="nombreRol" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="descripcionRol" className="text-right">
                Descripción
              </label>
              <Input id="descripcionRol" className="col-span-3" />
            </div>

            <div className="grid grid-cols-4 items-start gap-4">
              <label className="text-right pt-2">Permisos</label>
              <div className="col-span-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm1" className="rounded border-gray-300" />
                  <label htmlFor="perm1">Ver dashboard</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm2" className="rounded border-gray-300" />
                  <label htmlFor="perm2">Gestionar niños</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm3" className="rounded border-gray-300" />
                  <label htmlFor="perm3">Gestionar mediciones</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm4" className="rounded border-gray-300" />
                  <label htmlFor="perm4">Ver reportes</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="perm5" className="rounded border-gray-300" />
                  <label htmlFor="perm5">Administrar usuarios</label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNuevoRol(false)}>
              Cancelar
            </Button>
            <Button type="submit">Crear Rol</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
