import Link from 'next/link'
import { Search } from 'lucide-react'

export default function ImovelNotFound() {
  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="w-20 h-20 rounded-2xl bg-primary-light flex items-center justify-center text-primary mx-auto mb-6">
          <Search size={36} />
        </div>
        <h1 className="text-xl font-semibold text-text-primary mb-2">Imóvel não encontrado</h1>
        <p className="text-sm text-text-secondary mb-6">
          O imóvel que você está procurando não existe ou foi removido.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Ver todos os imóveis
        </Link>
      </div>
    </div>
  )
}
