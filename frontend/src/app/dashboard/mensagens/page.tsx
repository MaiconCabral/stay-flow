'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import { Search, ArrowLeft, Send, Clock, Building2, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import {
  fetchConversations,
  fetchMessages,
  sendMessage,
  markConversationAsRead,
  type ConversationResource,
  type MessageResource,
} from '@/lib/message'

interface Message {
  id: string
  senderId: 'guest' | 'host'
  content: string
  createdAt: string
  read: boolean
}

interface Conversation {
  id: string
  guestName: string
  guestAvatar: string | null
  propertyName: string
  propertyId: string
  lastMessage: string
  lastMessageAt: string
  unread: number
  messages: Message[]
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function isImageUrl(val: string): boolean {
  return /^https?:\/\//i.test(val) || /^\/storage\//i.test(val)
}

function mapMessage(msg: MessageResource, currentUserId: number): Message {
  return {
    id: String(msg.id),
    senderId: msg.is_mine ? 'host' : 'guest',
    content: msg.content,
    createdAt: msg.created_at,
    read: msg.read_at !== null,
  }
}

function mapConversation(conv: ConversationResource, currentUserId: number): Conversation {
  const guestName = conv.guest?.name ?? 'Hóspede'
  const rawAvatar = conv.guest?.avatar
  return {
    id: String(conv.id),
    guestName,
    guestAvatar: rawAvatar && isImageUrl(rawAvatar) ? rawAvatar : (rawAvatar ?? getInitials(guestName)),
    propertyName: conv.property?.title ?? '',
    propertyId: String(conv.property?.id ?? conv.property_id),
    lastMessage: conv.last_message_preview ?? '',
    lastMessageAt: conv.last_message_at ?? conv.created_at,
    unread: conv.unread_count,
    messages: [],
  }
}

function formatRelativeTime(iso: string): string {
  const now = Date.now()
  const diff = now - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'agora'
  if (mins < 60) return `${mins}min`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
}

function formatMessageTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
}

function formatMessageDate(iso: string): string {
  const date = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === today.toDateString()) return 'Hoje'
  if (date.toDateString() === yesterday.toDateString()) return 'Ontem'
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long' })
}

interface ConversationListProps {
  conversations: Conversation[]
  selectedId: string | null
  onSelect: (c: Conversation) => void
  search: string
  onSearchChange: (v: string) => void
  loading: boolean
}

function ConversationList({ conversations: list, selectedId, onSelect, search, onSearchChange, loading }: ConversationListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <h2 className="text-sm font-semibold text-text-primary mb-3">Mensagens</h2>
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface border border-border text-text-secondary text-sm">
          <Search size={16} />
          <input
            type="text"
            placeholder="Buscar conversas..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-text-primary placeholder:text-text-secondary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-text-secondary" />
          </div>
        ) : list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-3">
              <Search size={22} />
            </div>
            <p className="text-sm font-medium text-text-primary mb-1">
              {search ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa'}
            </p>
            <p className="text-xs text-text-secondary">
              {search ? 'Tente alterar o termo da busca' : 'As conversas com seus hóspedes aparecerão aqui'}
            </p>
          </div>
        ) : (
          list.map((conv) => {
            const isSelected = conv.id === selectedId
            return (
              <button
                key={conv.id}
                onClick={() => onSelect(conv)}
                className={`w-full flex items-start gap-3 p-4 text-left transition-colors duration-150 border-b border-border last:border-0 ${
                  isSelected ? 'bg-primary-light' : 'hover:bg-surface/50'
                }`}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-semibold overflow-hidden">
                    {conv.guestAvatar && isImageUrl(conv.guestAvatar) ? (
                      <img src={conv.guestAvatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      conv.guestAvatar
                    )}
                  </div>
                  {conv.unread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                      {conv.unread > 9 ? '9+' : conv.unread}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-sm truncate ${conv.unread > 0 ? 'font-semibold text-text-primary' : 'font-medium text-text-primary'}`}>
                      {conv.guestName}
                    </span>
                    <span className="text-[11px] text-text-secondary whitespace-nowrap flex-shrink-0">
                      {formatRelativeTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 truncate">{conv.propertyName}</p>
                  <p className={`text-xs mt-0.5 truncate ${conv.unread > 0 ? 'font-medium text-text-primary' : 'text-text-secondary'}`}>
                    {conv.lastMessage}
                  </p>
                </div>
              </button>
            )
          })
        )}
      </div>
    </div>
  )
}

function groupMessagesByDate(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = []
  let currentDate = ''
  for (const msg of messages) {
    const msgDate = new Date(msg.createdAt).toDateString()
    if (msgDate !== currentDate) {
      currentDate = msgDate
      groups.push({ date: msg.createdAt, messages: [msg] })
    } else {
      groups[groups.length - 1].messages.push(msg)
    }
  }
  return groups
}

interface ChatViewProps {
  conversation: Conversation
  onBack: () => void
  onSendMessage: (content: string) => void
  replyText: string
  onReplyChange: (v: string) => void
  loadingMessages: boolean
}

function ChatView({ conversation, onBack, onSendMessage, replyText, onReplyChange, loadingMessages }: ChatViewProps) {
  const messageGroups = useMemo(() => groupMessagesByDate(conversation.messages), [conversation.messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (replyText.trim()) {
      onSendMessage(replyText.trim())
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card flex-shrink-0">
        <button
          onClick={onBack}
          className="lg:hidden p-1.5 rounded-lg hover:bg-primary-light text-text-secondary hover:text-primary transition-colors"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="w-9 h-9 rounded-full bg-primary-light text-primary flex items-center justify-center text-sm font-semibold flex-shrink-0 overflow-hidden">
          {conversation.guestAvatar && isImageUrl(conversation.guestAvatar) ? (
            <img src={conversation.guestAvatar} alt="" className="w-full h-full object-cover" />
          ) : (
            conversation.guestAvatar
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-text-primary truncate">{conversation.guestName}</h3>
          <Link
            href={`/dashboard/imoveis/${conversation.propertyId}`}
            className="text-xs text-text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <Building2 size={12} />
            <span className="truncate">{conversation.propertyName}</span>
          </Link>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loadingMessages ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={24} className="animate-spin text-text-secondary" />
          </div>
        ) : conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-sm text-text-secondary">Nenhuma mensagem ainda</p>
            <p className="text-xs text-text-secondary mt-1">Envie uma mensagem para iniciar a conversa</p>
          </div>
        ) : (
          messageGroups.map((group) => (
            <div key={group.date}>
              <div className="flex items-center justify-center mb-4">
                <span className="text-[11px] font-medium text-text-secondary bg-surface px-3 py-1 rounded-full">
                  {formatMessageDate(group.date)}
                </span>
              </div>
              <div className="space-y-3">
                {group.messages.map((msg) => {
                  const isHost = msg.senderId === 'host'
                  return (
                    <div key={msg.id} className={`flex gap-2.5 ${isHost ? 'flex-row-reverse' : ''}`}>
                      {!isHost && (
                        <div className="w-7 h-7 rounded-full bg-primary-light text-primary flex items-center justify-center text-[10px] font-semibold flex-shrink-0 mt-1 overflow-hidden">
                          {conversation.guestAvatar && isImageUrl(conversation.guestAvatar) ? (
                            <img src={conversation.guestAvatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            conversation.guestAvatar
                          )}
                        </div>
                      )}
                      <div className={`max-w-[75%] min-w-0 ${isHost ? 'items-end' : ''}`}>
                        <div
                          className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                            isHost
                              ? 'bg-primary text-white rounded-br-md'
                              : 'bg-surface text-text-primary rounded-bl-md border border-border'
                          }`}
                        >
                          {msg.content}
                        </div>
                        <div className={`flex items-center gap-1 mt-0.5 ${isHost ? 'justify-end' : ''}`}>
                          <span className="text-[10px] text-text-secondary">{formatMessageTime(msg.createdAt)}</span>
                          {isHost && (
                            <span className={`text-[10px] ${msg.read ? 'text-success' : 'text-text-secondary'}`}>
                              {msg.read ? '✓✓' : '✓'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-border bg-card flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={replyText}
            onChange={(e) => onReplyChange(e.target.value)}
            className="flex-1 px-4 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
          />
          <button
            type="submit"
            disabled={!replyText.trim()}
            className="p-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Enviar mensagem"
          >
            <Send size={18} />
          </button>
        </div>
      </form>
    </div>
  )
}

export default function MensagensPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [convList, setConvList] = useState<Conversation[]>([])
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({})

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchConversations({ per_page: 50 })
      .then((res) => {
        if (!cancelled) {
          setConvList(res.data.map((c) => mapConversation(c, user?.id ?? 0)))
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.response?.data?.message || 'Erro ao carregar conversas')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [user?.id])

  const loadMessages = useCallback(async (convId: string) => {
    setLoadingMessages(true)
    try {
      const res = await fetchMessages(Number(convId), { per_page: 100 })
      const msgs = res.data.map((m) => mapMessage(m, user?.id ?? 0))
      setMessagesMap((prev) => ({ ...prev, [convId]: msgs }))
      setConvList((prev) =>
        prev.map((c) =>
          c.id === convId ? { ...c, messages: msgs, unread: 0 } : c
        )
      )
    } catch {
      // silent
    } finally {
      setLoadingMessages(false)
    }
  }, [user?.id])

  useEffect(() => {
    if (!selectedId) return
    markConversationAsRead(Number(selectedId)).catch(() => {})
  }, [selectedId])

  const selectedConv = useMemo(
    () => convList.find((c) => c.id === selectedId) ?? null,
    [convList, selectedId]
  )

  const filteredConversations = useMemo(() => {
    if (!search.trim()) return convList
    const q = search.toLowerCase()
    return convList.filter(
      (c) =>
        c.guestName.toLowerCase().includes(q) ||
        c.propertyName.toLowerCase().includes(q) ||
        c.lastMessage.toLowerCase().includes(q)
    )
  }, [convList, search])

  const handleSelect = (conv: Conversation) => {
    setSelectedId(conv.id)
    setReplyText('')
    if (!messagesMap[conv.id]) {
      loadMessages(conv.id)
    } else {
      setConvList((prev) =>
        prev.map((c) =>
          c.id === conv.id ? { ...c, messages: messagesMap[conv.id] ?? [], unread: 0 } : c
        )
      )
    }
  }

  const handleBack = () => {
    setSelectedId(null)
    setReplyText('')
  }

  const handleSendMessage = async (content: string) => {
    if (!selectedId) return
    const convId = Number(selectedId)
    try {
      const sent = await sendMessage(convId, content)
      const newMsg = mapMessage(sent, user?.id ?? 0)
      setMessagesMap((prev) => ({
        ...prev,
        [selectedId]: [...(prev[selectedId] ?? []), newMsg],
      }))
      setConvList((prev) =>
        prev.map((conv) => {
          if (conv.id !== selectedId) return conv
          return {
            ...conv,
            lastMessage: content,
            lastMessageAt: newMsg.createdAt,
            messages: [...conv.messages, newMsg],
          }
        })
      )
      setReplyText('')
    } catch {
      // silent
    }
  }

  if (error && convList.length === 0) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-center px-6">
          <div className="w-12 h-12 rounded-2xl bg-error/10 flex items-center justify-center text-error mb-3 mx-auto">
            <Clock size={22} />
          </div>
          <p className="text-sm font-medium text-text-primary mb-1">Erro ao carregar mensagens</p>
          <p className="text-xs text-text-secondary mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  const selectedConvForChat = selectedConv

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="lg:hidden h-full">
        {selectedConvForChat ? (
          <ChatView
            conversation={selectedConvForChat}
            onBack={handleBack}
            onSendMessage={handleSendMessage}
            replyText={replyText}
            onReplyChange={setReplyText}
            loadingMessages={loadingMessages}
          />
        ) : (
          <div className="bg-card rounded-xl border border-border h-full overflow-hidden">
            <ConversationList
              conversations={filteredConversations}
              selectedId={selectedId}
              onSelect={handleSelect}
              search={search}
              onSearchChange={setSearch}
              loading={loading}
            />
          </div>
        )}
      </div>

      <div className="hidden lg:flex h-full rounded-xl overflow-hidden border border-border">
        <div className="w-[340px] xl:w-[380px] bg-card border-r border-border flex-shrink-0 overflow-hidden">
          <ConversationList
            conversations={filteredConversations}
            selectedId={selectedId}
            onSelect={handleSelect}
            search={search}
            onSearchChange={setSearch}
            loading={loading}
          />
        </div>
        <div className="flex-1 bg-card overflow-hidden flex flex-col">
          {selectedConvForChat ? (
            <ChatView
              conversation={selectedConvForChat}
              onBack={handleBack}
              onSendMessage={handleSendMessage}
              replyText={replyText}
              onReplyChange={setReplyText}
              loadingMessages={loadingMessages}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <div className="w-16 h-16 rounded-2xl bg-primary-light flex items-center justify-center text-primary mb-4">
                <Clock size={32} />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-1">Suas mensagens</h3>
              <p className="text-xs text-text-secondary max-w-[240px]">
                Selecione uma conversa para visualizar as mensagens
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
