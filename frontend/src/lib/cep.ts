export interface CepResult {
  address: string
  city: string
  state: string
  country: string
  zip_code: string
  neighborhood: string
}

export async function buscarCep(cep: string): Promise<CepResult> {
  const cleaned = cep.replace(/\D/g, '')
  if (cleaned.length !== 8) {
    throw new Error('CEP deve ter 8 dígitos')
  }

  const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`)
  if (!res.ok) throw new Error('Erro ao consultar CEP')

  const data = await res.json()

  if (data.erro) {
    throw new Error('CEP não encontrado')
  }

  const parts = [data.logradouro, data.bairro].filter(Boolean)
  const logradouro = data.logradouro || ''

  return {
    address: parts.join(', ') || logradouro,
    city: data.localidade,
    state: data.uf,
    country: 'Brasil',
    zip_code: cleaned.replace(/^(\d{5})(\d{3})$/, '$1-$2'),
    neighborhood: data.bairro || '',
  }
}

export function formatCep(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length <= 5) return digits
  return digits.replace(/^(\d{5})(\d{0,3})$/, '$1-$2')
}
