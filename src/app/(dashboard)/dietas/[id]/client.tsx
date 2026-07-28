"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

type Dieta = {
  id: string
  titulo: string
  texto_original: string
  objetivos: string | null
  created_at: string
}

type Plano = {
  id: string
  semana_inicio: string
  semana_fim: string
  status: string
  created_at: string
}

export default function ClientDietaPage({
  dieta,
  planos,
  usuarioId,
}: {
  dieta: Dieta
  planos: Plano[]
  usuarioId: string
}) {
  const router = useRouter()
  const [gerando, setGerando] = useState(false)
  const [erro, setErro] = useState("")

  async function gerarCardapio() {
    setGerando(true)
    setErro("")

    const res = await fetch("/api/gerar-cardapio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dieta_id: dieta.id }),
    })

    if (!res.ok) {
      const data = await res.json()
      setErro(data.erro || "Erro ao gerar cardápio")
      setGerando(false)
      return
    }

    router.refresh()
    setGerando(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/dietas"
            className="text-sm text-emerald-600 hover:underline"
          >
            ← Voltar
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            {dieta.titulo}
          </h1>
        </div>
        <button
          onClick={gerarCardapio}
          disabled={gerando}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {gerando ? "Gerando..." : "🤖 Gerar Cardápio"}
        </button>
      </div>

      {erro && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950 dark:text-red-400">
          {erro}
        </div>
      )}

      <div className="rounded-xl border bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">
          Texto da Dieta
        </h2>
        <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-600 dark:text-zinc-400">
          {dieta.texto_original}
        </pre>
        {dieta.objetivos && (
          <>
            <h2 className="mb-2 mt-4 font-semibold text-zinc-900 dark:text-zinc-50">
              Objetivos
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              {dieta.objetivos}
            </p>
          </>
        )}
      </div>

      {planos.length > 0 && (
        <div>
          <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
            Cardápios Gerados
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {planos.map((plano) => (
              <Link
                key={plano.id}
                href={`/planos/${plano.id}`}
                className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="font-medium text-zinc-900 dark:text-zinc-50">
                  {new Date(plano.semana_inicio).toLocaleDateString("pt-BR")} -{" "}
                  {new Date(plano.semana_fim).toLocaleDateString("pt-BR")}
                </p>
                <p className="text-sm text-zinc-500">
                  Status: {plano.status}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
