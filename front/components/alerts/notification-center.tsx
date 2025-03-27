"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Bell, CheckCircle, Clock, Mail, MessageSquare, RefreshCw, Settings, Smartphone, User } from 'lucide-react'

// Datos de ejemplo para notificaciones
const notificationsData = [
  {
    id: "N001",
    type: "alert",
    title: "Nueva alerta nutricional",
    description: "Se ha generado una alerta de alta severidad para Sofia Martínez (Desnutrición aguda).",
    time: "Hace 2 horas",
    isRead: false,
    relatedId: "A002",
  },
  {
    id: "N002",
    type: "assignment",
    title: "Alerta asignada",
    description: "Se le ha asignado la alerta #A001 (María Rodríguez - Bajo peso para la edad).",
    time: "Hace 5 horas",
    isRead: false,
    relatedId: "A001",
  },
  {
    id: "N003",
    type: "reminder",
    title: "Recordatorio de seguimiento",
    description: "Seguimiento programado para Luis Gómez (Estancamiento en crecimiento) para mañana.",
    time: "Hace 1 día",
    isRead: true,
    relatedId: "A003",
  },
  {
    id: "N004",
    type: "resolution",
    title: "Alerta resuelta",
    description: "La alerta #A007 (Ana García - Estancamiento temporal) ha sido marcada como resuelta.",
    time: "Hace 2 días",
    isRead: true,
    relatedId: "A007",
  },
  {
    id: "N005",
    type: "comment",
    title: "Nuevo comentario",
    description: "Dr. Martínez ha añadido un comentario a la alerta #A001 (María Rodríguez).",
    time: "Hace 3 días",
    isRead: true,
    relatedId: "A001",
  },
]

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(notificationsData)
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    push: true,
    alerts: true,
    assignments: true,
    reminders: true,
    comments: false,
    resolutions: true,
  })

  const unreadCount = notifications.filter(n => !n.isRead).length

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })))
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Centro de Notificaciones</CardTitle>
              <CardDescription>
                Gestione sus notificaciones y alertas
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{unreadCount} sin leer</Badge>
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Marcar todas como leídas
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-2 h-4 w-4" />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="unread">Sin leer ({unreadCount})</TabsTrigger>
              <TabsTrigger value="alerts">Alertas</TabsTrigger>
              <TabsTrigger value="assignments">Asignaciones</TabsTrigger>
              <TabsTrigger value="reminders">Recordatorios</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-md ${!notification.isRead ? 'bg-muted/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        notification.type === 'alert' 
                          ? 'bg-red-100 text-red-600' 
                          : notification.type === 'assignment'
                            ? 'bg-blue-100 text-blue-600'
                            : notification.type === 'reminder'
                              ? 'bg-amber-100 text-amber-600'
                              : notification.type === 'resolution'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-purple-100 text-purple-600'
                      }`}>
                        {notification.type === 'alert' && <AlertTriangle className="h-5 w-5" />}
                        {notification.type === 'assignment' && <User className="h-5 w-5" />}
                        {notification.type === 'reminder' && <Clock className="h-5 w-5" />}
                        {notification.type === 'resolution' && <CheckCircle className="h-5 w-5" />}
                        {notification.type === 'comment' && <MessageSquare className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <div className="text-xs text-muted-foreground">{notification.time}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                          {!notification.isRead && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              No leído
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No hay notificaciones disponibles
                </div>
              )}
            </TabsContent>

            <TabsContent value="unread" className="space-y-4">
              {notifications.filter(n => !n.isRead).length > 0 ? (
                notifications.filter(n => !n.isRead).map((notification) => (
                  <div 
                    key={notification.id} 
                    className="p-4 border rounded-md bg-muted/50"
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        notification.type === 'alert' 
                          ? 'bg-red-100 text-red-600' 
                          : notification.type === 'assignment'
                            ? 'bg-blue-100 text-blue-600'
                            : notification.type === 'reminder'
                              ? 'bg-amber-100 text-amber-600'
                              : notification.type === 'resolution'
                                ? 'bg-green-100 text-green-600'
                                : 'bg-purple-100 text-purple-600'
                      }`}>
                        {notification.type === 'alert' && <AlertTriangle className="h-5 w-5" />}
                        {notification.type === 'assignment' && <User className="h-5 w-5" />}
                        {notification.type === 'reminder' && <Clock className="h-5 w-5" />}
                        {notification.type === 'resolution' && <CheckCircle className="h-5 w-5" />}
                        {notification.type === 'comment' && <MessageSquare className="h-5 w-5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <div className="text-xs text-muted-foreground">{notification.time}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            No leído
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No hay notificaciones sin leer
                </div>
              )}
            </TabsContent>

            <TabsContent value="alerts" className="space-y-4">
              {notifications.filter(n => n.type === 'alert').length > 0 ? (
                notifications.filter(n => n.type === 'alert').map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-md ${!notification.isRead ? 'bg-muted/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <div className="text-xs text-muted-foreground">{notification.time}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                          {!notification.isRead && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              No leído
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No hay alertas disponibles
                </div>
              )}
            </TabsContent>

            <TabsContent value="assignments" className="space-y-4">
              {notifications.filter(n => n.type === 'assignment').length > 0 ? (
                notifications.filter(n => n.type === 'assignment').map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-md ${!notification.isRead ? 'bg-muted/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <User className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <div className="text-xs text-muted-foreground">{notification.time}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                          {!notification.isRead && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              No leído
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No hay asignaciones disponibles
                </div>
              )}
            </TabsContent>

            <TabsContent value="reminders" className="space-y-4">
              {notifications.filter(n => n.type === 'reminder').length > 0 ? (
                notifications.filter(n => n.type === 'reminder').map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 border rounded-md ${!notification.isRead ? 'bg-muted/50' : ''}`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium">{notification.title}</h3>
                          <div className="text-xs text-muted-foreground">{notification.time}</div>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{notification.description}</p>
                        <div className="flex justify-between items-center">
                          <Button variant="outline" size="sm">
                            Ver detalles
                          </Button>
                          {!notification.isRead && (
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              No leído
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  No hay recordatorios disponibles
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Ver todas las notificaciones
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Notificaciones</CardTitle>
          <CardDescription>
            Personalice cómo y cuándo recibir notificaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-3">Canales de Notificación</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="email-notifications">Notificaciones por correo electrónico</Label>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={notificationSettings.email}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, email: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="push-notifications">Notificaciones push</Label>
                  </div>
                  <Switch 
                    id="push-notifications" 
                    checked={notificationSettings.push}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, push: checked})
                    }
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium mb-3">Tipos de Notificaciones</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="alert-notifications">Nuevas alertas</Label>
                  </div>
                  <Switch 
                    id="alert-notifications" 
                    checked={notificationSettings.alerts}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, alerts: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="assignment-notifications">Asignaciones</Label>
                  </div>
                  <Switch 
                    id="assignment-notifications" 
                    checked={notificationSettings.assignments}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, assignments: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="reminder-notifications">Recordatorios</Label>
                  </div>
                  <Switch 
                    id="reminder-notifications" 
                    checked={notificationSettings.reminders}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, reminders: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="comment-notifications">Comentarios</Label>
                  </div>
                  <Switch 
                    id="comment-notifications" 
                    checked={notificationSettings.comments}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, comments: checked})
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                    <Label htmlFor="resolution-notifications">Resoluciones</Label>
                  </div>
                  <Switch 
                    id="resolution-notifications" 
                    checked={notificationSettings.resolutions}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({...notificationSettings, resolutions: checked})
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline">
            Restablecer valores predeterminados
          </Button>
          <Button>
            <Settings className="mr-2 h-4 w-4" />
            Guardar configuración
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
