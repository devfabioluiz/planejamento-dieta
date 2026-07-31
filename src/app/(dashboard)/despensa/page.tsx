"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { DespensaItem, DespensaFormData } from "@/types/despensa"

const emptyForm: DespensaFormData = {
  nome: "",
  quantidade: "",
  categoria: "",
  quantidade_max: "",
  validade: "",
}

const categorias = [
  "Grãos", "Legumes", "Frutas", "Laticínios",
  "Carnes", "Temperos", "Enlatados", "Bebidas",
  "Massas", "Congelados", "Outros",
]

export default function DespensaPage() {
  const router = useRouter()
  const [items, setItems] = useState<DespensaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<DespensaFormData>(emptyForm)
  const [saving, setSaving] = useState(false)

  const fetchItems = async () => {
    const res = await fetch("/api/despensa")
    if (res.status === 401) {
      router.push("/login")
      return
    }
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const openNew = () => {
    setEditingId(null)
    setForm(emptyForm)
    setShowModal(true)
  }

  const openEdit = (item: DespensaItem) => {
    setEditingId(item.id)
    setForm({
      nome: item.nome,
      quantidade: item.quantidade || "",
      categoria: item.categoria || "",
      quantidade_max: item.quantidade_max || "",
      validade: item.validade || "",
    })
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.nome.trim()) return
    setSaving(true)
    const url = editingId ? `/api/despensa/${editingId}` : "/api/despensa"
    const method = editingId ? "PUT" : "POST"
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    setSaving(false)
    if (res.ok) {
      setShowModal(false)
      fetchItems()
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Excluir este ingrediente?")) return
    const res = await fetch(`/api/despensa/${id}`, { method: "DELETE" })
    if (res.ok) fetchItems()
  }

  const today = new Date().toISOString().split("T")[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Despensa
        </h1>
        <button
          onClick={openNew}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700"
        >
          + Novo Ingrediente
        </button>
      </div>

      {loading ? (
        <p className="text-zinc-500">Carregando...</p>
      ) : items.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed p-12 text-center dark:border-zinc-700">
          <p className="text-zinc-500 dark:text-zinc-400">
            Nenhum ingrediente cadastrado.
          </p>
          <button
            onClick={openNew}
            className="mt-2 text-emerald-600 hover:underline"
          >
            Adicionar ingrediente
          </button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const venceu = item.validade && item.validade < today
            return (
              <div
                key={item.id}
                className="group relative rounded-xl border bg-white p-5 shadow-sm transition hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
                  <button
                    onClick={() => openEdit(item)}
                    className="rounded-md bg-zinc-100 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="rounded-md bg-red-100 px-2 py-1 text-xs text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
                  >
                    Excluir
                  </button>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                  {item.nome}
                </h3>
                <div className="mt-2 space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {item.quantidade && <p>Qtd: {item.quantidade}</p>}
                  {item.categoria && <p>Categoria: {item.categoria}</p>}
                  {item.validade && (
                    <p className={venceu ? "font-medium text-red-500" : ""}>
                      Validade: {new Date(item.validade).toLocaleDateString("pt-BR")}
                      {venceu && " (vencido)"}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">
              {editingId ? "Editar Ingrediente" : "Novo Ingrediente"}
            </h2>
            <div className="mt-4 space-y-3">
              <input
                placeholder="Nome *"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
                className="w-full rounded-lg border bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
              <div className="flex gap-2">
                <input
                  placeholder="Quantidade (ex: 500g)"
                  value={form.quantidade}
                  onChange={(e) => setForm({ ...form, quantidade: e.target.value })}
                  className="flex-1 rounded-lg border bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
                <input
                  placeholder="Qtd máx"
                  value={form.quantidade_max}
                  onChange={(e) => setForm({ ...form, quantidade_max: e.target.value })}
                  className="w-28 rounded-lg border bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>
              <select
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
                className="w-full rounded-lg border bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="">Sem categoria</option>
                {categorias.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="date"
                value={form.validade}
                onChange={(e) => setForm({ ...form, validade: e.target.value })}
                className="w-full rounded-lg border bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg bg-zinc-100 px-4 py-2 text-sm text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.nome.trim()}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:opacity-50"
              >
                {saving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
