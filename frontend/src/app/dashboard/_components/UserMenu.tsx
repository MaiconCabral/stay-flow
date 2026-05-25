'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User, Settings, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function UserMenu() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!user) return null

  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '??'

  return (
    <div ref={ref} className="relative ml-2">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-lg hover:bg-primary-light p-1.5 transition-colors duration-150"
        aria-label="Menu do usuário"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt=""
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {initials}
          </div>
        )}
        <ChevronDown
          size={14}
          className={`text-text-secondary transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-56 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                  {initials}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                <p className="text-xs text-text-secondary truncate">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="py-1">
            <button
              onClick={() => {
                setOpen(false)
                router.push('/dashboard/configuracoes')
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface hover:text-text-primary transition-colors"
            >
              <Settings size={16} />
              Configurações
            </button>
            <button
              onClick={() => {
                setOpen(false)
                logout()
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-error/10 hover:text-error transition-colors"
            >
              <LogOut size={16} />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
