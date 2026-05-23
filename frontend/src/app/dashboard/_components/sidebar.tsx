'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  MessageSquare,
  DollarSign,
  Settings,
  LogOut,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/imoveis', label: 'Imóveis', icon: Building2 },
  { href: '/dashboard/reservas', label: 'Reservas', icon: CalendarCheck },
  { href: '/dashboard/mensagens', label: 'Mensagens', icon: MessageSquare },
  { href: '/dashboard/ganhos', label: 'Ganhos', icon: DollarSign },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen bg-card border-r border-border fixed left-0 top-0 z-30">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
          S
        </div>
        <span className="font-semibold text-lg text-text-primary">StayFlow</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'bg-primary-light text-primary'
                  : 'text-text-secondary hover:bg-primary-light/50 hover:text-text-primary'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-error/10 hover:text-error transition-colors duration-150"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </Link>
      </div>
    </aside>
  )
}
