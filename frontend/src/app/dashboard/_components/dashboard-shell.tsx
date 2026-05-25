'use client'

import { useState, useCallback, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Building2,
  CalendarCheck,
  MessageSquare,
  DollarSign,
  Settings,
  LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Sidebar from './sidebar'
import Header from './header'
import MobileNav from './mobile-nav'

const drawerLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/imoveis', label: 'Imóveis', icon: Building2 },
  { href: '/dashboard/reservas', label: 'Reservas', icon: CalendarCheck },
  { href: '/dashboard/mensagens', label: 'Mensagens', icon: MessageSquare },
  { href: '/dashboard/ganhos', label: 'Ganhos', icon: DollarSign },
  { href: '/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

function DrawerNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <nav className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-border flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white text-sm font-bold">
          S
        </div>
        <span className="font-semibold text-lg text-text-primary">StayFlow</span>
      </div>
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {drawerLinks.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          const activeClass = isActive ? 'bg-primary-light text-primary' : 'text-text-secondary hover:bg-primary-light/50 hover:text-text-primary'
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 ' + activeClass}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
      <div className="p-3 border-t border-border flex-shrink-0">
        <button
          onClick={() => { logout(); onClose() }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-text-secondary hover:bg-error/10 hover:text-error transition-colors duration-150"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  )
}

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [loading, user, router])

  const toggleSidebar = useCallback(() => setSidebarOpen((prev) => !prev), [])
  const closeSidebar = useCallback(() => setSidebarOpen(false), [])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white text-lg font-bold">
            S
          </div>
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />

      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={'lg:hidden fixed top-0 left-0 h-full w-64 bg-card z-50 shadow-xl transform transition-transform duration-200 ease-out ' + (sidebarOpen ? 'translate-x-0' : '-translate-x-full')}
      >
        <DrawerNav onClose={closeSidebar} />
      </aside>

      <div className="lg:ml-60 pb-20 lg:pb-0">
        <Header onMenuClick={toggleSidebar} />
        <main className="p-4 lg:p-6 max-w-7xl mx-auto">{children}</main>
      </div>

      <MobileNav />
    </div>
  )
}
