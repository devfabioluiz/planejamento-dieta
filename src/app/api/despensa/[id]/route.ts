import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 })
  }

  const { id } = await params
  const { nome, quantidade, categoria, quantidade_max, validade } = await req.json()

  if (!nome) {
    return NextResponse.json(
      { erro: "Nome do ingrediente é obrigatório" },
      { status: 400 }
    )
  }

  const { data, error } = await supabaseAdmin
    .from("despensa")
    .update({ nome, quantidade, categoria, quantidade_max, validade })
    .eq("id", id)
    .eq("usuario_id", session.user.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 })
  }

  const { id } = await params

  const { error } = await supabaseAdmin
    .from("despensa")
    .delete()
    .eq("id", id)
    .eq("usuario_id", session.user.id)

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 })
  }

  return NextResponse.json({ mensagem: "Ingrediente excluído" })
}
