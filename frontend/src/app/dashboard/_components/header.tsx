'use client'

import { Menu, Search } from 'lucide-react'
import NotificationDropdown from './NotificationDropdown'
import UserMenu from './UserMenu'

interface HeaderProps {
  onMenuClick: () => void
}

export default function Header({ onMenuClick }: HeaderProps) {

  return (
  <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 sticky top-0 z-20">
    <div className="flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-primary-light text-text-secondary hover:text-primary transition-colors duration-150"
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>
      <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
    </div>

    <div className="flex items-center gap-2">
      <div className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border text-text-secondary text-sm">
        <Search size={16} />
        <input
          type="text"
          placeholder="Buscar..."
          className="bg-transparent border-none outline-none w-40 text-text-primary placeholder:text-text-secondary"
        />
      </div>

      <NotificationDropdown />

      <UserMenu />
    </div>
  </header>
  )
}

