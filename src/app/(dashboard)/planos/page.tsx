import { auth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function PlanosPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { data: planos } = await supabaseAdmin
    .from("planos_alimentares")
    .select("id, semana_inicio, semana_fim, status, created_at")
    .eq("usuario_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Planos Alimentares
      </h1>

      {!planos || planos.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-12 text-center dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            Nenhum cardápio gerado ainda.
          </p>
          <Link
            href="/dietas"
            className="mt-2 inline-block text-emerald-600 hover:underline"
          >
            Criar uma dieta e gerar cardápio
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {planos.map((plano) => (
            <Link
              key={plano.id}
              href={`/planos/${plano.id}`}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <p className="font-semibold text-zinc-900 dark:text-zinc-50">
                {new Date(plano.semana_inicio).toLocaleDateString("pt-BR")} -{" "}
                {new Date(plano.semana_fim).toLocaleDateString("pt-BR")}
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Status: {plano.status}
              </p>
              <p className="text-xs text-zinc-400">
                Criado em {new Date(plano.created_at).toLocaleDateString("pt-BR")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
