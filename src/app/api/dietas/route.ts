import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from("dietas")
    .select("*")
    .eq("usuario_id", session.user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 })
  }

  const { titulo, texto_original, objetivos } = await req.json()

  if (!titulo || !texto_original) {
    return NextResponse.json(
      { erro: "Título e texto da dieta são obrigatórios" },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from("dietas")
    .insert({
      usuario_id: session.user.id,
      titulo,
      texto_original,
      objetivos,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
