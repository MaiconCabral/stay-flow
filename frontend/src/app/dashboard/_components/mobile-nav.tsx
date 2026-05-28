'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  MessageSquare,
  DollarSign,
  MapPin,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

function getMobileNavItems(isHost: boolean) {
  const items = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ]

  if (isHost) {
    items.push({ href: '/dashboard/imoveis', label: 'Imóveis', icon: Building2 })
  }

  items.push(
    { href: '/dashboard/reservas', label: isHost ? 'Reservas' : 'Viagens', icon: CalendarCheck },
    { href: '/dashboard/mensagens', label: 'Msgs', icon: MessageSquare },
  )

  if (isHost) {
    items.push({ href: '/dashboard/ganhos', label: 'Ganhos', icon: DollarSign })
  }

  return items
}

export default function MobileNav() {
  const pathname = usePathname()
  const { user } = useAuth()
  const isHost = user?.is_host ?? false
  const navItems = getMobileNavItems(isHost)

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border z-30 px-2">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-0.5 px-3 py-1 min-w-[56px] min-h-[44px] rounded-lg transition-colors duration-150 ${
                isActive ? 'text-primary' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
