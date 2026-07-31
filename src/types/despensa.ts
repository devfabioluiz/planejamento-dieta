export interface DespensaItem {
  id: string
  usuario_id: string
  nome: string
  quantidade: string | null
  categoria: string | null
  quantidade_max: string | null
  validade: string | null
}

export interface DespensaFormData {
  nome: string
  quantidade: string
  categoria: string
  quantidade_max: string
  validade: string
}
