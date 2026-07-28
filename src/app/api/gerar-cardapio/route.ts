import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"

const RENDER_API = process.env.RENDER_API_URL || "https://planejamento-dieta.onrender.com"
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || "dev-key"

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ erro: "Não autenticado" }, { status: 401 })
  }

  const { dieta_id } = await req.json()

  if (!dieta_id) {
    return NextResponse.json({ erro: "dieta_id é obrigatório" }, { status: 400 })
  }

  const res = await fetch(`${RENDER_API}/api/gerar-cardapio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": INTERNAL_API_KEY,
    },
    body: JSON.stringify({
      dieta_id,
      usuario_id: session.user.id,
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    return NextResponse.json(
      { erro: "Erro ao gerar cardápio", detalhe: err },
      { status: 502 }
    )
  }

  const data = await res.json()
  return NextResponse.json(data)
}
