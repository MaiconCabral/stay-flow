import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function ImovelNotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4">
        <Home size={32} />
      </div>
      <h1 className="text-xl font-semibold text-text-primary mb-2">Imóvel não encontrado</h1>
      <p className="text-sm text-text-secondary mb-6 text-center max-w-sm">
        O imóvel que você está procurando não existe ou foi removido.
      </p>
      <Link
        href="/dashboard/imoveis"
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <ArrowLeft size={16} />
        Voltar para Imóveis
      </Link>
    </div>
  )
}
