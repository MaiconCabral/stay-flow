export const categories = [
  { key: 'all', label: 'Todos' },
  { key: 'Praia', label: 'Praia' },
  { key: 'Montanha', label: 'Montanha' },
  { key: 'Centro', label: 'Centro' },
  { key: 'Cobertura', label: 'Cobertura' },
  { key: 'Sítio', label: 'Sítio' },
  { key: 'Chalé', label: 'Chalé' },
  { key: 'Studio', label: 'Studio' },
]

export const categoryKeywords: Record<string, string[]> = {
  Praia: ['Praia', 'praia', 'Ubatuba', 'praia', 'beach'],
  Montanha: ['Montanha', 'montanha', 'Serra', 'serra', 'Campos do Jordão', 'montanha'],
  Centro: ['Centro', 'centro', 'Centro Histórico'],
  Cobertura: ['Cobertura', 'cobertura'],
  Sítio: ['Sítio', 'sítio', 'Sitio', 'sitio', 'Atibaia'],
  Chalé: ['Chalé', 'chalé', 'Chale', 'chale'],
  Studio: ['Studio', 'studio', 'Vila Olímpia'],
}

export const propertyTypeOptions = [
  { value: 'house', label: 'Casa' },
  { value: 'apartment', label: 'Apartamento' },
  { value: 'villa', label: 'Vila' },
  { value: 'cabin', label: 'Cabana' },
  { value: 'cottage', label: 'Chalé' },
  { value: 'loft', label: 'Loft' },
  { value: 'studio', label: 'Studio' },
  { value: 'other', label: 'Outro' },
]
