import { auth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"
import { redirect } from "next/navigation"
import ClientDietaPage from "./client"

export default async function DietaPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect("/login")

  const { id } = await params

  const { data: dieta } = await supabaseAdmin
    .from("dietas")
    .select("*")
    .eq("id", id)
    .eq("usuario_id", session.user.id)
    .single()

  if (!dieta) {
    redirect("/dietas")
  }

  const { data: planos } = await supabaseAdmin
    .from("planos_alimentares")
    .select("id, semana_inicio, semana_fim, status, created_at")
    .eq("dieta_id", id)
    .eq("usuario_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <ClientDietaPage
      dieta={dieta}
      planos={planos || []}
      usuarioId={session.user.id}
    />
  )
}
