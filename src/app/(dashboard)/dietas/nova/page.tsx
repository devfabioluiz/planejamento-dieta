"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function NovaDietaPage() {
  const router = useRouter()
  const [titulo, setTitulo] = useState("")
  const [texto, setTexto] = useState("")
  const [objetivos, setObjetivos] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro("")

    const res = await fetch("/api/dietas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        texto_original: texto,
        objetivos,
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      setErro(data.erro || "Erro ao salvar")
      setCarregando(false)
      return
    }

    const dieta = await res.json()
    router.push(`/dietas/${dieta.id}`)
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Nova Dieta
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Título
          </label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            placeholder="Ex: Dieta Low Carb"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Texto da Dieta
          </label>
          <textarea
            required
            rows={12}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-4 py-2 font-mono text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            placeholder="Cole aqui o texto completo da sua dieta (alimentos permitidos, horários, regras, etc.)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Objetivos (opcional)
          </label>
          <textarea
            rows={3}
            value={objetivos}
            onChange={(e) => setObjetivos(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-4 py-2 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            placeholder="Ex: Emagrecer 5kg, ganhar massa muscular..."
          />
        </div>

        {erro && <p className="text-sm text-red-500">{erro}</p>}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {carregando ? "Salvando..." : "Salvar Dieta"}
        </button>
      </form>
    </div>
  )
}
