import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(req: Request) {
  try {
    const { nome, email, senha } = await req.json()

    if (!nome || !email || !senha) {
      return NextResponse.json(
        { erro: "Nome, email e senha são obrigatórios" },
        { status: 400 }
      )
    }

    const { data: existente } = await supabaseAdmin
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .single()

    if (existente) {
      return NextResponse.json(
        { erro: "Email já cadastrado" },
        { status: 409 }
      )
    }

    const senhaHash = await bcrypt.hash(senha, 10)

    const { data: usuario, error } = await supabaseAdmin
      .from("usuarios")
      .insert({
        nome,
        email,
        senha_hash: senhaHash,
      })
      .select("id, nome, email")
      .single()

    if (error) {
      return NextResponse.json(
        { erro: "Erro ao criar usuário" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { mensagem: "Usuário criado com sucesso", usuario },
      { status: 201 }
    )
  } catch {
    return NextResponse.json(
      { erro: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}
