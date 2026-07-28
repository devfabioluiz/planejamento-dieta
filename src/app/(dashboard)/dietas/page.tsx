import Link from "next/link"
import { auth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { redirect } from "next/navigation"

export default async function DietasPage() {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { data: dietas } = await supabaseAdmin
    .from("dietas")
    .select("id, titulo, created_at")
    .eq("usuario_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Minhas Dietas
        </h1>
        <Link
          href="/dietas/nova"
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          + Nova Dieta
        </Link>
      </div>

      {!dietas || dietas.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-12 text-center dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            Nenhuma dieta cadastrada ainda.
          </p>
          <Link
            href="/dietas/nova"
            className="mt-2 inline-block text-emerald-600 hover:underline"
          >
            Criar primeira dieta
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {dietas.map((dieta) => (
            <Link
              key={dieta.id}
              href={`/dietas/${dieta.id}`}
              className="rounded-xl border bg-white p-6 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">
                {dieta.titulo}
              </h2>
              <p className="mt-1 text-sm text-zinc-500">
                {new Date(dieta.created_at).toLocaleDateString("pt-BR")}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
