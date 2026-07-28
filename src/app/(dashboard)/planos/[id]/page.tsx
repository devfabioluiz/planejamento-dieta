import { auth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { redirect } from "next/navigation"
import Link from "next/link"

const DIAS_SEMANA: Record<string, string> = {
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
  domingo: "Domingo",
}

const CORES_REFEICOES: Record<number, string> = {
  1: "border-l-amber-400",
  2: "border-l-orange-400",
  3: "border-l-emerald-400",
  4: "border-l-blue-400",
  5: "border-l-violet-400",
  6: "border-l-rose-400",
}

export default async function PlanoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  const { data: plano } = await supabaseAdmin
    .from("planos_alimentares")
    .select("*")
    .eq("id", id)
    .eq("usuario_id", session.user.id)
    .single()

  if (!plano) {
    redirect("/planos")
  }

  const { data: refeicoes } = await supabaseAdmin
    .from("refeicoes")
    .select("*")
    .eq("plano_id", id)
    .order("ordem")

  const refeicoesPorDia: Record<string, typeof refeicoes> = {}
  if (refeicoes) {
    for (const ref of refeicoes) {
      if (!refeicoesPorDia[ref.dia_semana]) {
        refeicoesPorDia[ref.dia_semana] = []
      }
      refeicoesPorDia[ref.dia_semana].push(ref)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/planos"
          className="text-sm text-emerald-600 hover:underline"
        >
          ← Todos os planos
        </Link>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Cardápio Semanal
        </h1>
        <p className="text-sm text-zinc-500">
          {new Date(plano.semana_inicio).toLocaleDateString("pt-BR")} -{" "}
          {new Date(plano.semana_fim).toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {Object.entries(DIAS_SEMANA).map(([key, label]) => {
          const refs = refeicoesPorDia[key] || []
          return (
            <div
              key={key}
              className="rounded-xl border bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="border-b p-4 dark:border-zinc-800">
                <h2 className="font-bold text-zinc-900 dark:text-zinc-50">
                  {label}
                </h2>
                <p className="text-xs text-zinc-500">
                  {refs.length}/6 refeições
                </p>
              </div>
              <div className="divide-y dark:divide-zinc-800">
                {refs.map((ref) => (
                  <div
                    key={ref.id}
                    className={`border-l-4 p-4 ${CORES_REFEICOES[ref.ordem] || "border-l-zinc-300"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-zinc-900 dark:text-zinc-50">
                        {ref.nome}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {ref.horario?.slice(0, 5)}
                      </span>
                    </div>
                    {ref.itens && ref.itens.length > 0 && (
                      <ul className="mt-2 list-inside list-disc text-sm text-zinc-600 dark:text-zinc-400">
                        {(ref.itens as string[]).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {ref.observacao && (
                      <p className="mt-2 text-xs italic text-zinc-500">
                        {ref.observacao}
                      </p>
                    )}
                  </div>
                ))}
                {refs.length === 0 && (
                  <p className="p-4 text-sm text-zinc-400">
                    Nenhuma refeição cadastrada
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
