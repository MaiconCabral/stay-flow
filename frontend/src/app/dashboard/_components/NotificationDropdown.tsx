'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import {
  Bell,
  CalendarCheck,
  XCircle,
  MessageSquare,
  Star,
  Clock,
  TrendingUp,
  CheckCheck,
  Loader2,
} from 'lucide-react'
import { fetchNotifications, markAsRead, markAllAsRead, fetchUnreadCount } from '@/lib/notifications'
import type { Notification } from '@/lib/notifications'

const TYPE_ICONS: Record<string, React.ElementType> = {
  new_booking: CalendarCheck,
  cancellation: XCircle,
  message: MessageSquare,
  review: Star,
  reminder: Clock,
  weekly_report: TrendingUp,
}

function getIcon(type: string) {
  return TYPE_ICONS[type] ?? Bell
}

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const date = new Date(dateStr).getTime()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'agora'
  if (minutes < 60) return `${minutes}min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const loadUnreadCount = useCallback(async () => {
    try {
      const count = await fetchUnreadCount()
      setUnreadCount(count)
    } catch {
      // silent
    }
  }, [])

  const loadNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetchNotifications({ per_page: 5 })
      setNotifications(res.data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUnreadCount()
    const interval = setInterval(loadUnreadCount, 30000)
    return () => clearInterval(interval)
  }, [loadUnreadCount])

  useEffect(() => {
    if (open) {
      loadNotifications()
    }
  }, [open, loadNotifications])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleMarkAsRead = useCallback(async (id: number) => {
    try {
      await markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true, read_at: new Date().toISOString() } : n)),
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    } catch {
      // silent
    }
  }, [])

  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await markAllAsRead()
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, read_at: n.read_at ?? new Date().toISOString() })),
      )
      setUnreadCount(0)
    } catch {
      // silent
    }
  }, [])

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative p-2 rounded-lg hover:bg-primary-light text-text-secondary hover:text-primary transition-colors duration-150"
        aria-label="Notificações"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] flex items-center justify-center px-1 text-[10px] font-bold text-white bg-error rounded-full leading-none">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="text-sm font-semibold text-text-primary">Notificações</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <CheckCheck size={14} />
                Marcar tudo como lido
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 size={20} className="animate-spin text-text-secondary" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                <Bell size={24} className="mb-2 opacity-50" />
                <p className="text-sm">Nenhuma notificação</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.map((n) => {
                  const Icon = getIcon(n.type)
                  return (
                    <li key={n.id}>
                      <button
                        onClick={() => !n.read && handleMarkAsRead(n.id)}
                        className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface/50 ${
                          !n.read ? 'bg-primary-light/10' : ''
                        }`}
                      >
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                            !n.read
                              ? 'bg-primary/10 text-primary'
                              : 'bg-surface text-text-secondary'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <p
                              className={`text-sm ${
                                !n.read ? 'font-semibold text-text-primary' : 'text-text-secondary'
                              }`}
                            >
                              {n.title}
                            </p>
                            <span className="text-[10px] text-text-secondary whitespace-nowrap flex-shrink-0 mt-0.5">
                              {timeAgo(n.created_at)}
                            </span>
                          </div>
                          {n.message && (
                            <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                              {n.message}
                            </p>
                          )}
                        </div>
                        {!n.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                        )}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
