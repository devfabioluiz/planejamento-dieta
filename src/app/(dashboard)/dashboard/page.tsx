import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Olá, {session.user.name}!
      </h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍽️</span>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Plano Ativo
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                Nenhum
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💧</span>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Água Hoje
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                0 / 3500 ml
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Refeições Hoje
              </p>
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                0 / 6
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
