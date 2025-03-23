import Link from "next/link"

export function MainNav() {
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/" className="text-sm font-medium transition-colors hover:text-primary">
        Inicio
      </Link>
      <Link href="/ninos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Niños
      </Link>
      <Link
        href="/mediciones"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Mediciones
      </Link>
      <Link href="/reportes" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Reportes
      </Link>
    </nav>
  )
}

