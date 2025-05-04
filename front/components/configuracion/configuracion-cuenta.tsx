"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { AlertCircle, Camera, Mail, Phone, User } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function ConfiguracionCuenta() {
  const { toast } = useToast()
  const [profile, setProfile] = useState({
    name: "Juan Pérez",
    email: "juan.perez@ejemplo.com",
    phone: "+57 300 123 4567",
    role: "Nutricionista",
    organization: "Centro de Nutrición Infantil",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: "",
  })

  const handleProfileChange = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }))
  }

  const handlePasswordChange = (key: string, value: string) => {
    setPassword((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveProfile = () => {
    toast({
      title: "Perfil actualizado",
      description: "Tu información de perfil ha sido actualizada correctamente.",
    })
  }

  const handleChangePassword = () => {
    if (password.new !== password.confirm) {
      toast({
        title: "Error",
        description: "Las contraseñas nuevas no coinciden.",
        variant: "destructive",
      })
      return
    }

    if (password.new.length < 8) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 8 caracteres.",
        variant: "destructive",
      })
      return
    }

    // Aquí iría la lógica para cambiar la contraseña
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada correctamente.",
    })

    setPassword({
      current: "",
      new: "",
      confirm: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Información de perfil</h3>
        <Separator />

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="flex flex-col items-center space-y-2">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback>
                <User className="h-12 w-12" />
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Camera className="h-4 w-4" />
              Cambiar foto
            </Button>
          </div>

          <div className="grid gap-4 flex-1">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    className="pl-8"
                    value={profile.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    className="pl-8"
                    value={profile.email}
                    onChange={(e) => handleProfileChange("email", e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    className="pl-8"
                    value={profile.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input id="role" value={profile.role} onChange={(e) => handleProfileChange("role", e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Organización</Label>
              <Input
                id="organization"
                value={profile.organization}
                onChange={(e) => handleProfileChange("organization", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSaveProfile}>Guardar perfil</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Cambiar contraseña</h3>
        <Separator />

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Seguridad de la cuenta</AlertTitle>
          <AlertDescription>
            Utiliza una contraseña segura que no uses en otros sitios. Recomendamos usar una combinación de letras,
            números y símbolos.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input
              id="currentPassword"
              type="password"
              value={password.current}
              onChange={(e) => handlePasswordChange("current", e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input
                id="newPassword"
                type="password"
                value={password.new}
                onChange={(e) => handlePasswordChange("new", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={password.confirm}
                onChange={(e) => handlePasswordChange("confirm", e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleChangePassword}>Cambiar contraseña</Button>
        </div>
      </div>
    </div>
  )
}
