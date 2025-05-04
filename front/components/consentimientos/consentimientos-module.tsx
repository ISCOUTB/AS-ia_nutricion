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
    <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-5 mb-8">
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="lista">Lista de Consentimientos</TabsTrigger>
        <TabsTrigger value="documentos">Documentos</TabsTrigger>
        <TabsTrigger value="historial">Historial</TabsTrigger>
        <TabsTrigger value="configuracion">Configuración</TabsTrigger>
      </TabsList>
      <TabsContent value="dashboard">
        <ConsentimientosDashboard />
      </TabsContent>
      <TabsContent value="lista">
        <ConsentimientosList />
      </TabsContent>
      <TabsContent value="documentos">
        <DocumentosConsentimiento />
      </TabsContent>
      <TabsContent value="historial">
        <HistorialConsentimientos />
      </TabsContent>
      <TabsContent value="configuracion">
        <ConfiguracionConsentimientos />
      </TabsContent>
    </Tabs>
  )
}
