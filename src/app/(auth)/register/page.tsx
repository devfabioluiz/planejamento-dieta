"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function RegisterPage() {
  const router = useRouter()
  const [nome, setNome] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro("")

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, email, senha }),
    })

    const data = await res.json()

    if (!res.ok) {
      setErro(data.erro || "Erro ao cadastrar")
      setCarregando(false)
      return
    }

    router.push("/login")
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Criar Conta
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Cadastre-se para planejar sua dieta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="nome"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Nome
          </label>
          <input
            id="nome"
            type="text"
            required
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            placeholder="Seu nome"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            placeholder="seu@email.com"
          />
        </div>

        <div>
          <label
            htmlFor="senha"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Senha
          </label>
          <input
            id="senha"
            type="password"
            required
            minLength={6}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-4 py-2 text-zinc-900 focus:border-emerald-500 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            placeholder="••••••••"
          />
        </div>

        {erro && (
          <p className="text-sm text-red-500">{erro}</p>
        )}

        <button
          type="submit"
          disabled={carregando}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-white transition hover:bg-emerald-700 disabled:opacity-50"
        >
          {carregando ? "Cadastrando..." : "Cadastrar"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-medium text-emerald-600 hover:text-emerald-500"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}
