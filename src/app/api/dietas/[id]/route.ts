import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { supabaseAdmin } from "@/lib/supabase"

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 })
  }

  const { id } = await params

  const { data, error } = await supabaseAdmin
    .from("dietas")
    .select("*")
    .eq("id", id)
    .eq("usuario_id", session.user.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ erro: "Dieta não encontrada" }, { status: 404 })
  }

  return NextResponse.json(data)
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 })
  }

  const { id } = await params
  const { titulo, texto_original, objetivos } = await req.json()

  const { data, error } = await supabaseAdmin
    .from("dietas")
    .update({ titulo, texto_original, objetivos, updated_at: new Date().toISOString() })
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
    .from("dietas")
    .delete()
    .eq("id", id)
    .eq("usuario_id", session.user.id)

  if (error) {
    return NextResponse.json({ erro: error.message }, { status: 500 })
  }

  return NextResponse.json({ mensagem: "Dieta excluída" })
}
