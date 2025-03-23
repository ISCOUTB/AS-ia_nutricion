"use client"

import type React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  Users,
  ClipboardList,
  FileText,
  Settings,
  Shield,
  Brain,
  AlertTriangle,
} from "lucide-react"

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r bg-[#4338ca] transition-all duration-300 dark:bg-[#1e1b4b]",
        isCollapsed ? "w-[80px]" : "w-[240px]",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 py-4">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-white">NutriKids</span>
          </Link>
        )}
        <Button variant="ghost" size="icon" className="ml-auto h-8 w-8 text-white" onClick={onToggle}>
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <ScrollArea className="flex-1 overflow-auto">
        <nav className="flex flex-col gap-2 p-2">
          <NavItem icon={<Home />} label="Inicio" isCollapsed={isCollapsed} href="/" />
          <NavItem icon={<Users />} label="Niños" isCollapsed={isCollapsed} href="/ninos" />
          <NavItem icon={<ClipboardList />} label="Mediciones" isCollapsed={isCollapsed} href="/mediciones" />
          <NavItem icon={<BarChart3 />} label="Reportes" isCollapsed={isCollapsed} href="/reportes" />
          <NavItem icon={<Brain />} label="Análisis IA" isCollapsed={isCollapsed} href="/analisis" />
          <NavItem icon={<AlertTriangle />} label="Alertas" isCollapsed={isCollapsed} href="/alertas" />
          <NavItem icon={<FileText />} label="Consentimientos" isCollapsed={isCollapsed} href="/consentimientos" />
          <NavItem icon={<Shield />} label="Seguridad" isCollapsed={isCollapsed} href="/seguridad" />
          <NavItem icon={<Settings />} label="Configuración" isCollapsed={isCollapsed} href="/configuracion" />
        </nav>
      </ScrollArea>
    </div>
  )
}

interface NavItemProps {
  icon: React.ReactNode
  label: string
  isCollapsed: boolean
  href: string
}

function NavItem({ icon, label, isCollapsed, href }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2 rounded-lg px-3 py-2 text-white hover:bg-white/10 transition-colors",
        isCollapsed ? "justify-center" : "justify-start",
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center">{icon}</div>
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}

