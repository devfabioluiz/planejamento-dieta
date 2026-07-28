"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [erro, setErro] = useState("")
  const [carregando, setCarregando] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCarregando(true)
    setErro("")

    const result = await signIn("credentials", {
      email,
      password: senha,
      redirect: false,
    })

    if (result?.error) {
      setErro("Email ou senha inválidos")
      setCarregando(false)
      return
    }

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-lg dark:bg-zinc-900">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Entrar
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Acesse seu planejador de dieta
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          {carregando ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400">
        Não tem conta?{" "}
        <Link
          href="/register"
          className="font-medium text-emerald-600 hover:text-emerald-500"
        >
          Cadastre-se
        </Link>
      </p>
    </div>
  )
}
