import Link from 'next/link'

const quickLinks = [
  { href: '/descobrir', label: 'Descobrir' },
  { href: '/destinos', label: 'Destinos Populares' },
  { href: '#', label: 'Para Anfitriões' },
  { href: '#', label: 'Central de Ajuda' },
]

const hostLinks = [
  { href: '#', label: 'Anunciar Imóvel' },
  { href: '#', label: 'Centro de Recursos' },
  { href: '#', label: 'Comunidade' },
  { href: '#', label: 'Blog' },
]

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

const socialLinks = [
  { href: '#', label: 'Instagram', icon: InstagramIcon },
  { href: '#', label: 'Twitter', icon: TwitterIcon },
  { href: '#', label: 'Facebook', icon: FacebookIcon },
  { href: '#', label: 'LinkedIn', icon: LinkedinIcon },
]

export default function PublicFooter() {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center text-white text-sm font-bold">
                S
              </div>
              <span className="font-semibold text-lg">StayFlow</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              A plataforma completa para encontrar e alugar imóveis de temporada em todo o Brasil. Sua próxima aventura começa aqui.
            </p>
            <div className="flex items-center gap-2 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <Link
                    key={social.label}
                    href={social.href}
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon />
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/50">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/50">Para Anfitriões</h4>
            <ul className="space-y-3">
              {hostLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-white/70 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/50">Fale Conosco</h4>
            <ul className="space-y-3">
              <li className="text-sm text-white/70">suporte@stayflow.com</li>
              <li className="text-sm text-white/70">+55 (11) 3000-0000</li>
              <li className="text-sm text-white/70">Seg a Sex, 9h às 18h</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 lg:mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/50">
          <p>&copy; 2026 StayFlow. Todos os direitos reservados.</p>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-white transition-colors">Termos</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
