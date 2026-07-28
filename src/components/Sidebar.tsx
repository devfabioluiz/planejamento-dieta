"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/dietas", label: "Minhas Dietas", icon: "📋" },
  { href: "/planos", label: "Plano Alimentar", icon: "🍽️" },
  { href: "/receitas", label: "Receitas", icon: "📖" },
  { href: "/despensa", label: "Despensa", icon: "🥫" },
  { href: "/compras", label: "Lista de Compras", icon: "🛒" },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-emerald-600 p-2 text-white lg:hidden"
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-40 flex h-full w-64 flex-col bg-white shadow-lg transition-transform dark:bg-zinc-900 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 border-b p-6 dark:border-zinc-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600 text-lg text-white">
            🥗
          </div>
          <div>
            <h2 className="font-bold text-zinc-900 dark:text-zinc-50">
              Dieta AI
            </h2>
            <p className="text-xs text-zinc-500">
              {session?.user?.name || "Planejador"}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                    : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
                }`}
              >
                <span>{link.icon}</span>
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t p-4 dark:border-zinc-800">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800"
          >
            <span>🚪</span>
            Sair
          </button>
        </div>
      </aside>
    </>
  )
}
