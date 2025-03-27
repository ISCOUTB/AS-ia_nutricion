"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ConsentimientosDashboard } from "./consentimientos-dashboard"
import { ConsentimientosList } from "./consentimientos-list"
import { DocumentosConsentimiento } from "./documentos-consentimiento"
import { HistorialConsentimientos } from "./historial-consentimientos"
import { ConfiguracionConsentimientos } from "./configuracion-consentimientos"

export function ConsentimientosModule() {
  const [activeTab, setActiveTab] = useState("dashboard")

  return (
    <Tabs defaultValue="dashboard" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList className="grid grid-cols-2 md:grid-cols-5 h-auto">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="lista">Lista de Consentimientos</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
        <TabsTrigger value="historial">Historial</TabsTrigger>
        <TabsTrigger value="configuracion">Configuración</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard" className="space-y-4">
        <ConsentimientosDashboard />
      </TabsContent>
      <TabsContent value="lista" className="space-y-4">
        <ConsentimientosList />
      </TabsContent>
      <TabsContent value="documentos" className="space-y-4">
        <DocumentosConsentimiento />
      </TabsContent>
      <TabsContent value="historial" className="space-y-4">
        <HistorialConsentimientos />
      </TabsContent>
      <TabsContent value="configuracion" className="space-y-4">
        <ConfiguracionConsentimientos />
      </TabsContent>
    </Tabs>
  )
}

