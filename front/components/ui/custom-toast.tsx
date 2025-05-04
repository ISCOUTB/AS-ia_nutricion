"use client"

import type React from "react"

import { createContext, useContext, useState } from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

type ToastVariant = "default" | "destructive" | "success"

type ToastProps = {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type ToastContextType = {
  toasts: ToastProps[]
  toast: (props: Omit<ToastProps, "id">) => void
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = ({ title, description, variant = "default", duration = 5000 }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast = { id, title, description, variant, duration }

    setToasts((prevToasts) => [...prevToasts, newToast])

    if (duration > 0) {
      setTimeout(() => {
        dismiss(id)
      }, duration)
    }

    return id
  }

  const dismiss = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

export function useCustomToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error("useCustomToast debe ser usado dentro de un ToastProvider")
  }

  return context
}

function ToastContainer() {
  const { toasts, dismiss } = useCustomToast()

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-0 right-0 z-50 flex flex-col gap-2 p-4 max-h-screen overflow-hidden">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={() => dismiss(toast.id)} />
      ))}
    </div>
  )
}

function Toast({ id, title, description, variant = "default", onDismiss }: ToastProps & { onDismiss: () => void }) {
  return (
    <div
      className={cn(
        "flex w-full max-w-md overflow-hidden rounded-lg shadow-lg transition-all animate-in slide-in-from-right-full",
        "border p-4",
        variant === "destructive" && "bg-destructive text-destructive-foreground border-destructive",
        variant === "success" && "bg-green-50 border-green-200 text-green-800",
        variant === "default" && "bg-background border-border",
      )}
    >
      <div className="flex-1 mr-2">
        {title && <h3 className="font-medium">{title}</h3>}
        {description && <p className={cn("text-sm", !title && "mt-0")}>{description}</p>}
      </div>
      <button
        onClick={onDismiss}
        className={cn(
          "inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md",
          "transition-colors hover:bg-secondary",
          variant === "destructive" && "hover:bg-destructive/90",
          variant === "success" && "hover:bg-green-100",
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Cerrar</span>
      </button>
    </div>
  )
}
