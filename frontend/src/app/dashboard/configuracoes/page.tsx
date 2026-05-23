'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  User,
  Bell,
  CreditCard,
  Shield,
  Save,
  Trash2,
  Globe,
  ChevronRight,
  Eye,
  EyeOff,
  Check,
  AlertTriangle,
} from 'lucide-react'

type TabKey = 'profile' | 'notifications' | 'payments' | 'account'

const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'profile', label: 'Perfil', icon: User },
  { key: 'notifications', label: 'Notificações', icon: Bell },
  { key: 'payments', label: 'Pagamentos', icon: CreditCard },
  { key: 'account', label: 'Conta', icon: Shield },
]

function Toggle({ checked, onChange, label, description }: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  description?: string
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && <p className="text-xs text-text-secondary mt-0.5">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          checked ? 'bg-primary' : 'bg-border'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm transform ring-0 transition-transform duration-200 ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function InputField({ label, value, onChange, type = 'text', placeholder, error }: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  error?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-3 py-2.5 rounded-lg bg-surface border text-sm text-text-primary placeholder:text-text-secondary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors ${
            error ? 'border-error' : 'border-border'
          }`}
        />
      )}
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}

function SelectField({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 rounded-lg bg-surface border border-border text-sm text-text-primary outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors appearance-none cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  )
}

function RadioGroup({ label, value, onChange, options }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string; description: string }[]
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-text-primary">{label}</label>
      <div className="space-y-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors ${
              value === opt.value
                ? 'border-primary bg-primary-light'
                : 'border-border bg-surface hover:border-primary/30'
            }`}
          >
            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
              value === opt.value ? 'border-primary' : 'border-text-secondary'
            }`}>
              {value === opt.value && <div className="w-2 h-2 rounded-full bg-primary" />}
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">{opt.label}</p>
              <p className="text-xs text-text-secondary">{opt.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function ProfileTab() {
  const [name, setName] = useState('Maria Admin')
  const [email, setEmail] = useState('maria@stayflow.com')
  const [phone, setPhone] = useState('+55 11 99999-8888')
  const [bio, setBio] = useState('Anfitriã dedicada com 8 imóveis em todo o Brasil. Apaixonada por proporcionar experiências incríveis para meus hóspedes.')
  const [language, setLanguage] = useState('pt')
  const [saved, setSaved] = useState(false)

  const handleSave = useCallback(() => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
          MA
        </div>
        <div>
          <p className="text-sm font-semibold text-text-primary">{name}</p>
          <p className="text-xs text-text-secondary">{email}</p>
          <button className="mt-1 text-xs font-medium text-primary hover:text-primary-dark transition-colors">
            Alterar foto
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField label="Nome completo" value={name} onChange={setName} />
        <InputField label="E-mail" value={email} onChange={setEmail} type="email" />
        <InputField label="Telefone" value={phone} onChange={setPhone} placeholder="+55 (11) 99999-0000" />
        <SelectField
          label="Idioma"
          value={language}
          onChange={setLanguage}
          options={[
            { value: 'pt', label: 'Português (Brasil)' },
            { value: 'en', label: 'English' },
            { value: 'es', label: 'Español' },
          ]}
        />
      </div>

      <InputField label="Biografia" value={bio} onChange={setBio} type="textarea" />

      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Salvo!' : 'Salvar alterações'}
        </button>
        <button className="px-5 py-2.5 rounded-lg border border-border bg-card text-text-secondary text-sm font-medium hover:bg-surface transition-colors">
          Cancelar
        </button>
      </div>
    </div>
  )
}

function NotificationsTab() {
  const [newBooking, setNewBooking] = useState(true)
  const [cancellations, setCancellations] = useState(true)
  const [messages, setMessages] = useState(true)
  const [reviews, setReviews] = useState(true)
  const [reminders, setReminders] = useState(false)
  const [weeklyReport, setWeeklyReport] = useState(true)
  const [saved, setSaved] = useState(false)

  const handleSave = useCallback(() => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [])

  return (
    <div className="space-y-6">
      <div className="divide-y divide-border">
        <Toggle
          checked={newBooking}
          onChange={setNewBooking}
          label="Novas reservas"
          description="Notificar quando um hóspede fizer uma reserva"
        />
        <Toggle
          checked={cancellations}
          onChange={setCancellations}
          label="Cancelamentos"
          description="Notificar quando uma reserva for cancelada"
        />
        <Toggle
          checked={messages}
          onChange={setMessages}
          label="Mensagens de hóspedes"
          description="Notificar quando receber uma nova mensagem"
        />
        <Toggle
          checked={reviews}
          onChange={setReviews}
          label="Avaliações recebidas"
          description="Notificar quando um hóspede deixar uma avaliação"
        />
        <Toggle
          checked={reminders}
          onChange={setReminders}
          label="Lembretes de check-in/out"
          description="Lembrar sobre check-ins e check-outs do dia"
        />
        <Toggle
          checked={weeklyReport}
          onChange={setWeeklyReport}
          label="Relatório semanal de ganhos"
          description="Receber um resumo dos ganhos toda segunda-feira"
        />
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saved ? 'Salvo!' : 'Salvar preferências'}
      </button>
    </div>
  )
}

function PaymentsTab() {
  const [method, setMethod] = useState('pix')
  const [pixKey, setPixKey] = useState('maria@stayflow.com')
  const [bank, setBank] = useState('Nubank')
  const [agency, setAgency] = useState('0001')
  const [account, setAccount] = useState('12345-6')
  const [paypalEmail, setPaypalEmail] = useState('')
  const [threshold, setThreshold] = useState('100')
  const [schedule, setSchedule] = useState('weekly')
  const [saved, setSaved] = useState(false)

  const handleSave = useCallback(() => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }, [])

  return (
    <div className="space-y-6">
      <RadioGroup
        label="Método de recebimento"
        value={method}
        onChange={setMethod}
        options={[
          { value: 'pix', label: 'Pix', description: 'Receba instantaneamente via chave Pix' },
          { value: 'ted', label: 'TED', description: 'Transferência bancária em até 1 dia útil' },
          { value: 'paypal', label: 'PayPal', description: 'Receba via PayPal em dólar ou real' },
        ]}
      />

      {method === 'pix' && (
        <InputField
          label="Chave Pix"
          value={pixKey}
          onChange={setPixKey}
          placeholder="CPF, CNPJ, e-mail ou telefone"
        />
      )}

      {method === 'ted' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <InputField label="Banco" value={bank} onChange={setBank} />
          <InputField label="Agência" value={agency} onChange={setAgency} />
          <InputField label="Conta" value={account} onChange={setAccount} />
        </div>
      )}

      {method === 'paypal' && (
        <InputField
          label="E-mail PayPal"
          value={paypalEmail}
          onChange={setPaypalEmail}
          type="email"
          placeholder="seu@email.com"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField
          label="Limite mínimo para saque (R$)"
          value={threshold}
          onChange={setThreshold}
          type="number"
        />
        <SelectField
          label="Frequência de pagamento"
          value={schedule}
          onChange={setSchedule}
          options={[
            { value: 'daily', label: 'Diário' },
            { value: 'weekly', label: 'Semanal' },
            { value: 'monthly', label: 'Mensal' },
          ]}
        />
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
      >
        {saved ? <Check size={16} /> : <Save size={16} />}
        {saved ? 'Salvo!' : 'Salvar informações'}
      </button>
    </div>
  )
}

function AccountTab() {
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [twoFactor, setTwoFactor] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [pwError, setPwError] = useState('')
  const [saved, setSaved] = useState(false)

  const handleChangePassword = useCallback(() => {
    setPwError('')
    if (newPw && newPw !== confirmPw) {
      setPwError('As senhas não conferem')
      return
    }
    if (newPw && newPw.length < 6) {
      setPwError('A senha deve ter pelo menos 6 caracteres')
      return
    }
    setSaved(true)
    setCurrentPw('')
    setNewPw('')
    setConfirmPw('')
    setTimeout(() => setSaved(false), 2500)
  }, [newPw, confirmPw])

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Informações da conta</h3>
        <div className="bg-surface rounded-lg border border-border px-4 py-3">
          <p className="text-xs text-text-secondary">E-mail</p>
          <p className="text-sm font-medium text-text-primary">maria@stayflow.com</p>
        </div>
        <div className="bg-surface rounded-lg border border-border px-4 py-3">
          <p className="text-xs text-text-secondary">Membro desde</p>
          <p className="text-sm font-medium text-text-primary">Janeiro de 2024</p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Alterar senha</h3>
        <div className="space-y-4">
          <div className="relative">
            <InputField
              label="Senha atual"
              value={currentPw}
              onChange={setCurrentPw}
              type={showPw ? 'text' : 'password'}
              placeholder="••••••••"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="relative">
              <InputField
                label="Nova senha"
                value={newPw}
                onChange={setNewPw}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                error={pwError}
              />
            </div>
            <div className="relative">
              <InputField
                label="Confirmar nova senha"
                value={confirmPw}
                onChange={setConfirmPw}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
            {showPw ? 'Ocultar senhas' : 'Mostrar senhas'}
          </button>
        </div>
        <button
          onClick={handleChangePassword}
          disabled={!currentPw || !newPw || !confirmPw}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {saved ? <Check size={16} /> : <Save size={16} />}
          {saved ? 'Senha alterada!' : 'Alterar senha'}
        </button>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Segurança</h3>
        <div className="divide-y divide-border">
          <Toggle
            checked={twoFactor}
            onChange={setTwoFactor}
            label="Autenticação de dois fatores (2FA)"
            description="Adicione uma camada extra de segurança à sua conta"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-text-primary">Zona de perigo</h3>
        <div className="rounded-xl border border-error/30 bg-error/5 p-5 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="text-error flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-text-primary">Excluir conta</p>
              <p className="text-xs text-text-secondary mt-0.5">
                Esta ação é irreversível. Todos os seus dados, imóveis e configurações serão removidos permanentemente.
              </p>
            </div>
          </div>
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors"
            >
              <Trash2 size={16} />
              Excluir minha conta
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-medium text-error">Tem certeza? Esta ação não pode ser desfeita.</p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-4 py-2 rounded-lg border border-border bg-card text-text-secondary text-sm font-medium hover:bg-surface transition-colors"
                >
                  Cancelar
                </button>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-error text-white text-sm font-medium hover:bg-error/90 transition-colors">
                  <Trash2 size={16} />
                  Sim, excluir permanentemente
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profile')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const ActiveIcon = tabs.find((t) => t.key === activeTab)?.icon ?? User

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Configurações</h1>
        <p className="text-sm text-text-secondary">Gerencie sua conta e preferências</p>
      </div>

      <div className="flex gap-1 overflow-x-auto scrollbar-none pb-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-150 ${
                isActive
                  ? 'bg-primary text-white'
                  : 'bg-card text-text-secondary border border-border hover:bg-surface hover:text-text-primary'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {mounted && (
        <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'notifications' && <NotificationsTab />}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'account' && <AccountTab />}
        </div>
      )}
    </div>
  )
}
