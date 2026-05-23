'use client'

import { useState, useMemo } from 'react'
import { DollarSign, TrendingUp, Percent, Clock, Building2, Search, Download } from 'lucide-react'
import {
  earningsStats,
  earningsByMonth,
  transactions,
  properties,
  paymentStatusStyles,
  paymentStatusLabel,
  type Transaction,
} from '@/lib/dashboard-data'

const CHART_HEIGHT = 220
const BAR_WIDTH = 28
const BAR_GAP = 10
const GROUP_GAP = 36
const GROUP_WIDTH = BAR_WIDTH * 2 + BAR_GAP

const statCards = [
  {
    label: 'Receita Total',
    value: `R$ ${earningsStats.totalRevenue.toLocaleString('pt-BR')}`,
    change: 12.5,
    trend: 'up' as const,
    icon: DollarSign,
  },
  {
    label: 'Receita Líquida',
    value: `R$ ${earningsStats.netRevenue.toLocaleString('pt-BR')}`,
    change: 11.2,
    trend: 'up' as const,
    icon: TrendingUp,
  },
  {
    label: 'Ticket Médio',
    value: `R$ ${earningsStats.averageTicket.toLocaleString('pt-BR')}`,
    change: 3.8,
    trend: 'up' as const,
    icon: Percent,
  },
  {
    label: 'Recebimentos Pendentes',
    value: `R$ ${earningsStats.pendingPayouts.toLocaleString('pt-BR')}`,
    change: 0,
    trend: 'up' as const,
    icon: Clock,
  },
]

const statusLabel: Record<string, string> = {
  paid: 'Pago',
  pending: 'Pendente',
  scheduled: 'Agendado',
}

export default function GanhosPage() {
  const [search, setSearch] = useState('')
  const [period, setPeriod] = useState<'month' | 'year'>('year')

  const chartWidth = earningsByMonth.length * (GROUP_WIDTH + GROUP_GAP) + 60
  const maxGross = Math.max(...earningsByMonth.map((d) => d.gross))

  const filteredTx = useMemo(() => {
    if (!search.trim()) return transactions
    const q = search.toLowerCase()
    return transactions.filter(
      (t) =>
        t.guest.toLowerCase().includes(q) ||
        t.property.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q)
    )
  }, [search])

  const propertyEarnings = useMemo(
    () =>
      properties
        .filter((p) => p.status === 'active')
        .map((p) => {
          const txList = transactions.filter((t) => t.property === p.name)
          const gross = txList.reduce((sum, t) => sum + t.grossAmount, 0)
          const fees = txList.reduce((sum, t) => sum + t.fee, 0)
          const net = txList.reduce((sum, t) => sum + t.netAmount, 0)
          return { ...p, gross, fees, net, txCount: txList.length }
        })
        .sort((a, b) => b.gross - a.gross),
    []
  )

  const maxPropertyGross = Math.max(...propertyEarnings.map((p) => p.gross), 1)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Ganhos</h1>
          <p className="text-sm text-text-secondary">
            R$ {(earningsStats.totalRevenue / 1000).toFixed(1)}k no total
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-card border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setPeriod('month')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
                period === 'month' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setPeriod('year')}
              className={`px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
                period === 'year' ? 'bg-primary text-white' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              Ano
            </button>
          </div>
          <button
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-border bg-card text-text-secondary hover:text-text-primary hover:bg-surface transition-colors text-sm font-medium"
            aria-label="Exportar relatório"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Exportar</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {statCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.label} className="bg-card rounded-xl border border-border p-5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center text-primary">
                  <Icon size={20} />
                </div>
                {card.change > 0 && (
                  <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-success/10 text-success">
                    <span>↑</span>
                    {card.change}%
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-text-primary">{card.value}</p>
                <p className="text-sm text-text-secondary mt-0.5">{card.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Revenue Chart */}
      <div className="bg-card rounded-xl border border-border p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-semibold text-text-primary">Receita Mensal</h2>
            <p className="text-xs text-text-secondary mt-0.5">Bruta vs Líquida</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary" />
              <span className="text-xs text-text-secondary">Bruta</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-primary/40" />
              <span className="text-xs text-text-secondary">Líquida</span>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto scrollbar-none">
          <svg
            width={chartWidth}
            height={CHART_HEIGHT}
            viewBox={`0 0 ${chartWidth} ${CHART_HEIGHT}`}
            role="img"
            aria-label="Gráfico de receita mensal"
            className="min-w-full"
          >
            {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
              const y = 20 + (CHART_HEIGHT - 40) * (1 - ratio)
              return (
                <g key={ratio}>
                  <line
                    x1={40}
                    y1={y}
                    x2={chartWidth - 10}
                    y2={y}
                    stroke="var(--color-border)"
                    strokeWidth={1}
                  />
                  <text x={38} y={y + 4} textAnchor="end" className="text-[10px] fill-text-secondary">
                    R${(maxGross * ratio / 1000).toFixed(0)}k
                  </text>
                </g>
              )
            })}

            {earningsByMonth.map((d, i) => {
              const x = 50 + i * (GROUP_WIDTH + GROUP_GAP)
              const grossH = (d.gross / maxGross) * (CHART_HEIGHT - 40)
              const netH = (d.net / maxGross) * (CHART_HEIGHT - 40)
              return (
                <g key={d.month}>
                  <rect
                    x={x}
                    y={CHART_HEIGHT - 20 - grossH}
                    width={BAR_WIDTH}
                    height={grossH}
                    rx={3}
                    className="fill-primary transition-all duration-300"
                  />
                  <rect
                    x={x + BAR_WIDTH + BAR_GAP}
                    y={CHART_HEIGHT - 20 - netH}
                    width={BAR_WIDTH}
                    height={netH}
                    rx={3}
                    className="fill-primary/40 transition-all duration-300"
                  />
                  <text
                    x={x + BAR_WIDTH + BAR_GAP / 2}
                    y={CHART_HEIGHT - 6}
                    textAnchor="middle"
                    className="text-[10px] fill-text-secondary"
                  >
                    {d.month}
                  </text>
                  <title>{`${d.month}: Bruta R$ ${(d.gross / 1000).toFixed(1)}k, Líquida R$ ${(d.net / 1000).toFixed(1)}k`}</title>
                </g>
              )
            })}
          </svg>
        </div>
      </div>

      {/* Revenue by Property + Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by Property */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4">Receita por Imóvel</h2>
          <div className="space-y-0">
            <div className="hidden sm:grid grid-cols-[1fr_60px_80px_80px] gap-3 px-1 py-2 text-[11px] font-medium text-text-secondary uppercase tracking-wider border-b border-border">
              <span>Imóvel</span>
              <span className="text-right">Reservas</span>
              <span className="text-right">Bruta</span>
              <span className="text-right">Líquida</span>
            </div>
            {propertyEarnings.map((p, idx) => (
              <div
                key={p.id}
                className="grid grid-cols-[1fr_60px_80px_80px] sm:grid-cols-[1fr_60px_80px_80px] gap-3 py-3 px-1 border-b border-border last:border-0 items-center"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{p.name}</p>
                  <p className="text-[11px] text-text-secondary truncate sm:hidden">
                    {p.txCount} reservas · R$ {p.gross.toLocaleString('pt-BR')}
                  </p>
                </div>
                <span className="text-sm text-text-secondary text-right hidden sm:block">{p.txCount}</span>
                <span className="text-sm text-text-primary text-right font-medium hidden sm:block">
                  R$ {p.gross.toLocaleString('pt-BR')}
                </span>
                <span className="text-sm text-text-primary text-right font-medium hidden sm:block">
                  R$ {p.net.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-text-primary">Transações Recentes</h2>
            <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-surface border border-border text-text-secondary text-sm">
              <Search size={14} />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border-none outline-none w-20 sm:w-28 text-text-primary placeholder:text-text-secondary text-xs"
              />
            </div>
          </div>

          <div className="divide-y divide-border">
            {filteredTx.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10">
                <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-3">
                  <Search size={22} />
                </div>
                <p className="text-sm font-medium text-text-primary mb-1">Nenhuma transação encontrada</p>
                <p className="text-xs text-text-secondary">Tente alterar o termo da busca</p>
              </div>
            ) : (
              filteredTx.slice(0, 7).map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                    {tx.guestAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{tx.guest}</p>
                    <p className="text-[11px] text-text-secondary truncate">
                      {tx.property} · {tx.date}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-semibold text-text-primary">
                      R$ {tx.netAmount.toLocaleString('pt-BR')}
                    </p>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium ${paymentStatusStyles[tx.status]}`}
                    >
                      {paymentStatusLabel[tx.status]}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full Transactions Table (Desktop) */}
      <div className="bg-card rounded-xl border border-border overflow-hidden hidden md:block">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-text-primary">Todas as Transações</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface/50">
                <th className="text-left py-3.5 px-5 text-xs font-medium text-text-secondary uppercase tracking-wider">ID</th>
                <th className="text-left py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Hóspede</th>
                <th className="text-left py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Imóvel</th>
                <th className="text-left py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Data</th>
                <th className="text-right py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Bruto</th>
                <th className="text-right py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Taxa</th>
                <th className="text-right py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Líquido</th>
                <th className="text-left py-3.5 px-4 text-xs font-medium text-text-secondary uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="border-b border-border last:border-0 hover:bg-surface/30 transition-colors">
                  <td className="py-3.5 px-5 text-text-secondary text-xs font-mono">{tx.bookingId}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-semibold">
                        {tx.guestAvatar}
                      </div>
                      <span className="font-medium text-text-primary">{tx.guest}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-text-secondary">{tx.property}</td>
                  <td className="py-3.5 px-4 text-text-secondary">{tx.date}</td>
                  <td className="py-3.5 px-4 text-right font-medium text-text-primary">
                    R$ {tx.grossAmount.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4 text-right text-text-secondary">
                    -R$ {tx.fee.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-semibold text-text-primary">
                    R$ {tx.netAmount.toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium ${paymentStatusStyles[tx.status]}`}>
                      {statusLabel[tx.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredTx.length > 0 && (
          <div className="px-5 py-3 border-t border-border text-xs text-text-secondary text-center">
            Exibindo {filteredTx.length} de {transactions.length} transações
          </div>
        )}
      </div>

      {/* Full Transactions (Mobile) */}
      <div className="md:hidden bg-card rounded-xl border border-border divide-y divide-border">
        {filteredTx.slice(0, 5).map((tx) => (
          <div key={tx.id} className="p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-semibold flex-shrink-0">
                  {tx.guestAvatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{tx.guest}</p>
                  <p className="text-[11px] text-text-secondary">{tx.property}</p>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium flex-shrink-0 ${paymentStatusStyles[tx.status]}`}>
                {statusLabel[tx.status]}
              </span>
            </div>
            <div className="ml-10.5 flex items-center justify-between text-xs">
              <span className="text-text-secondary">{tx.date} · {tx.bookingId}</span>
              <span className="font-semibold text-text-primary">
                R$ {tx.netAmount.toLocaleString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
        {filteredTx.length > 0 && (
          <div className="p-3 text-xs text-text-secondary text-center border-t border-border">
            Exibindo {Math.min(filteredTx.length, 5)} de {transactions.length} transações
          </div>
        )}
      </div>
    </div>
  )
}
