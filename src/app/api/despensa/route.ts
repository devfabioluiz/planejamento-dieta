import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from("despensa")
    .select("*")
    .eq("usuario_id", session.user.id)
    .order("nome", { ascending: true })

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

  const { nome, quantidade, categoria, quantidade_max, validade } = await req.json()

  if (!nome) {
    return NextResponse.json(
      { erro: "Nome do ingrediente é obrigatório" },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from("despensa")
    .insert({
      usuario_id: session.user.id,
      nome,
      quantidade: quantidade || null,
      categoria: categoria || null,
      quantidade_max: quantidade_max || null,
      validade: validade || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}
