export interface StatCard {
  label: string
  value: string
  change: number
  icon: string
  trend: 'up' | 'down'
}

export interface Booking {
  id: string
  guest: string
  property: string
  propertyId: string
  checkIn: string
  checkOut: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  amount: number
  avatar: string
}

export interface MonthlyRevenue {
  month: string
  revenue: number
}

export interface UpcomingEvent {
  id: string
  guest: string
  property: string
  propertyId: string
  date: string
  type: 'checkin' | 'checkout'
}

export interface Property {
  id: string
  name: string
  location: string
  type: string
  image: string
  description: string
  pricePerNight: number
  maxGuests: number
  bedrooms: number
  bathrooms: number
  revenue: number
  bookings: number
  rating: number
  status: 'active' | 'inactive'
}

export const statsCards: StatCard[] = [
  { label: 'Receita Total', value: 'R$ 28.420', change: 12.5, icon: 'trending-up', trend: 'up' },
  { label: 'Reservas Ativas', value: '12', change: -3.2, icon: 'calendar-check', trend: 'down' },
  { label: 'Taxa de Ocupação', value: '78%', change: 5.1, icon: 'home', trend: 'up' },
  { label: 'Avaliações Pendentes', value: '4', change: -1, icon: 'message-square', trend: 'down' },
]

export const monthlyRevenue: MonthlyRevenue[] = [
  { month: 'Dez', revenue: 18200 },
  { month: 'Jan', revenue: 22400 },
  { month: 'Fev', revenue: 19800 },
  { month: 'Mar', revenue: 25600 },
  { month: 'Abr', revenue: 21200 },
  { month: 'Mai', revenue: 28420 },
]

export const upcomingEvents: UpcomingEvent[] = [
  { id: '1', guest: 'Carlos Silva', property: 'Casa na Praia', propertyId: 'P1', date: '2026-05-25', type: 'checkin' },
  { id: '2', guest: 'Ana Souza', property: 'Apartamento Centro', propertyId: 'P2', date: '2026-05-26', type: 'checkin' },
  { id: '3', guest: 'Pedro Lima', property: 'Chalé Montanha', propertyId: 'P3', date: '2026-05-27', type: 'checkout' },
  { id: '4', guest: 'Marina Rocha', property: 'Cobertura Luxo', propertyId: 'P4', date: '2026-05-28', type: 'checkin' },
  { id: '5', guest: 'João Santos', property: 'Casa na Praia', propertyId: 'P1', date: '2026-05-29', type: 'checkout' },
]

export const recentBookings: Booking[] = [
  { id: 'B001', guest: 'Carlos Silva', property: 'Casa na Praia', propertyId: 'P1', checkIn: '22/05', checkOut: '26/05', status: 'confirmed', amount: 3200, avatar: 'CS' },
  { id: 'B002', guest: 'Ana Souza', property: 'Apartamento Centro', propertyId: 'P2', checkIn: '23/05', checkOut: '28/05', status: 'confirmed', amount: 2100, avatar: 'AS' },
  { id: 'B003', guest: 'Pedro Lima', property: 'Chalé Montanha', propertyId: 'P3', checkIn: '24/05', checkOut: '27/05', status: 'pending', amount: 4500, avatar: 'PL' },
  { id: 'B004', guest: 'Marina Rocha', property: 'Cobertura Luxo', propertyId: 'P4', checkIn: '25/05', checkOut: '30/05', status: 'confirmed', amount: 8900, avatar: 'MR' },
  { id: 'B005', guest: 'João Santos', property: 'Casa na Praia', propertyId: 'P1', checkIn: '20/05', checkOut: '22/05', status: 'completed', amount: 2800, avatar: 'JS' },
  { id: 'B006', guest: 'Fernanda Costa', property: 'Casa na Praia', propertyId: 'P1', checkIn: '10/05', checkOut: '14/05', status: 'completed', amount: 3100, avatar: 'FC' },
  { id: 'B007', guest: 'Rafael Oliveira', property: 'Casa na Praia', propertyId: 'P1', checkIn: '01/05', checkOut: '05/05', status: 'completed', amount: 2900, avatar: 'RO' },
  { id: 'B008', guest: 'Juliana Mendes', property: 'Chalé Montanha', propertyId: 'P3', checkIn: '15/05', checkOut: '18/05', status: 'completed', amount: 4200, avatar: 'JM' },
  { id: 'B009', guest: 'Thiago Barbosa', property: 'Studio Vila Olímpia', propertyId: 'P5', checkIn: '18/05', checkOut: '21/05', status: 'confirmed', amount: 1800, avatar: 'TB' },
  { id: 'B010', guest: 'Luciana Torres', property: 'Sítio Paraíso', propertyId: 'P6', checkIn: '26/05', checkOut: '30/05', status: 'confirmed', amount: 7200, avatar: 'LT' },
  { id: 'B011', guest: 'Gabriel Nunes', property: 'Cobertura Luxo', propertyId: 'P4', checkIn: '12/05', checkOut: '16/05', status: 'completed', amount: 7800, avatar: 'GN' },
  { id: 'B012', guest: 'Patrícia Alves', property: 'Flat Paulista', propertyId: 'P7', checkIn: '05/05', checkOut: '08/05', status: 'cancelled', amount: 2400, avatar: 'PA' },
  { id: 'B013', guest: 'Ricardo Campos', property: 'Casa Campo Belo', propertyId: 'P8', checkIn: '28/05', checkOut: '31/05', status: 'pending', amount: 3800, avatar: 'RC' },
  { id: 'B014', guest: 'Amanda Farias', property: 'Apartamento Centro', propertyId: 'P2', checkIn: '02/06', checkOut: '06/06', status: 'pending', amount: 2400, avatar: 'AF' },
  { id: 'B015', guest: 'Bruno Xavier', property: 'Casa na Praia', propertyId: 'P1', checkIn: '01/06', checkOut: '05/06', status: 'confirmed', amount: 3400, avatar: 'BX' },
  { id: 'B016', guest: 'Camila Rios', property: 'Chalé Montanha', propertyId: 'P3', checkIn: '05/06', checkOut: '08/06', status: 'pending', amount: 4800, avatar: 'CR' },
  { id: 'B017', guest: 'Daniel Martins', property: 'Studio Vila Olímpia', propertyId: 'P5', checkIn: '08/05', checkOut: '11/05', status: 'completed', amount: 1600, avatar: 'DM' },
  { id: 'B018', guest: 'Elisa Fontes', property: 'Sítio Paraíso', propertyId: 'P6', checkIn: '10/06', checkOut: '14/06', status: 'confirmed', amount: 8500, avatar: 'EF' },
  { id: 'B019', guest: 'Fábio Henriques', property: 'Cobertura Luxo', propertyId: 'P4', checkIn: '15/06', checkOut: '20/06', status: 'pending', amount: 9200, avatar: 'FH' },
  { id: 'B020', guest: 'Giovana Lopes', property: 'Casa Campo Belo', propertyId: 'P8', checkIn: '12/05', checkOut: '15/05', status: 'completed', amount: 3200, avatar: 'GL' },
  { id: 'B021', guest: 'Hélio Pereira', property: 'Flat Paulista', propertyId: 'P7', checkIn: '20/05', checkOut: '23/05', status: 'cancelled', amount: 2600, avatar: 'HP' },
  { id: 'B022', guest: 'Isabela Castro', property: 'Apartamento Centro', propertyId: 'P2', checkIn: '15/06', checkOut: '18/06', status: 'confirmed', amount: 2300, avatar: 'IC' },
  { id: 'B023', guest: 'Jorge Andrade', property: 'Casa na Praia', propertyId: 'P1', checkIn: '18/06', checkOut: '22/06', status: 'confirmed', amount: 3600, avatar: 'JA' },
  { id: 'B024', guest: 'Karine Dias', property: 'Chalé Montanha', propertyId: 'P3', checkIn: '20/06', checkOut: '24/06', status: 'pending', amount: 5100, avatar: 'KD' },
]

export const properties: Property[] = [
  { id: 'P1', name: 'Casa na Praia', location: 'Ubatuba, SP', type: 'Casa', image: 'CP', description: 'Linda casa com vista para o mar, pé na areia, ideal para famílias. Completamente reformada e equipada com tudo que você precisa para uma temporada inesquecível.', pricePerNight: 450, maxGuests: 8, bedrooms: 3, bathrooms: 2, revenue: 35200, bookings: 8, rating: 4.8, status: 'active' },
  { id: 'P2', name: 'Apartamento Centro', location: 'São Paulo, SP', type: 'Apartamento', image: 'AC', description: 'Apartamento moderno no coração da cidade, próximo a restaurantes, museus e transporte público. Perfect para viagens a trabalho ou lazer.', pricePerNight: 280, maxGuests: 4, bedrooms: 2, bathrooms: 1, revenue: 28400, bookings: 12, rating: 4.6, status: 'active' },
  { id: 'P3', name: 'Chalé Montanha', location: 'Campos do Jordão, SP', type: 'Chalé', image: 'CM', description: 'Chalé aconchegante com lareira, hidromassagem e vista deslumbrante para a serra. O refúgio perfeito para casais que buscam tranquilidade e romance.', pricePerNight: 750, maxGuests: 6, bedrooms: 3, bathrooms: 2, revenue: 42100, bookings: 6, rating: 4.9, status: 'active' },
  { id: 'P4', name: 'Cobertura Luxo', location: 'Rio de Janeiro, RJ', type: 'Cobertura', image: 'CL', description: 'Cobertura duplex com piscina privativa e vista 360° para o Cristo Redentor, Pão de Açúcar e praias. Experiência cinco estrelas no Rio.', pricePerNight: 1200, maxGuests: 10, bedrooms: 4, bathrooms: 3, revenue: 68300, bookings: 5, rating: 4.7, status: 'active' },
  { id: 'P5', name: 'Studio Vila Olímpia', location: 'São Paulo, SP', type: 'Studio', image: 'SV', description: 'Studio compacto e funcional na melhor região corporativa de SP. Ideal para profissionais em viagem com academia e coworking no prédio.', pricePerNight: 220, maxGuests: 2, bedrooms: 1, bathrooms: 1, revenue: 15800, bookings: 15, rating: 4.5, status: 'active' },
  { id: 'P6', name: 'Sítio Paraíso', location: 'Atibaia, SP', type: 'Casa', image: 'SP', description: 'Sítio com amplo jardim, piscina, churrasqueira e campo de futebol. Perfeito para eventos familiares e grupos grandes que buscam contato com a natureza.', pricePerNight: 980, maxGuests: 14, bedrooms: 5, bathrooms: 3, revenue: 51200, bookings: 4, rating: 4.9, status: 'active' },
  { id: 'P7', name: 'Flat Paulista', location: 'São Paulo, SP', type: 'Apartamento', image: 'FP', description: 'Flat elegante na Avenida Paulista com serviço de hotel, academia e restaurante. Ótima opção para quem busca conforto e localização privilegiada.', pricePerNight: 320, maxGuests: 3, bedrooms: 1, bathrooms: 1, revenue: 19600, bookings: 10, rating: 4.4, status: 'inactive' },
  { id: 'P8', name: 'Casa Campo Belo', location: 'Campo Belo, MG', type: 'Casa', image: 'CB', description: 'Casa colonial reformada em cidade histórica, com jardim florido, varanda e vista para as montanhas. Tranquilidade e charme em Minas Gerais.', pricePerNight: 580, maxGuests: 8, bedrooms: 3, bathrooms: 2, revenue: 27400, bookings: 7, rating: 4.6, status: 'active' },
]

export const propertySummaries: Property[] = properties

export const propertyRevenue: Record<string, MonthlyRevenue[]> = {
  P1: [
    { month: 'Dez', revenue: 5400 },
    { month: 'Jan', revenue: 7200 },
    { month: 'Fev', revenue: 4800 },
    { month: 'Mar', revenue: 6300 },
    { month: 'Abr', revenue: 5100 },
    { month: 'Mai', revenue: 6400 },
  ],
  P2: [
    { month: 'Dez', revenue: 3900 },
    { month: 'Jan', revenue: 5100 },
    { month: 'Fev', revenue: 4800 },
    { month: 'Mar', revenue: 4200 },
    { month: 'Abr', revenue: 5400 },
    { month: 'Mai', revenue: 5000 },
  ],
  P3: [
    { month: 'Dez', revenue: 8200 },
    { month: 'Jan', revenue: 7500 },
    { month: 'Fev', revenue: 6800 },
    { month: 'Mar', revenue: 7100 },
    { month: 'Abr', revenue: 5900 },
    { month: 'Mai', revenue: 6600 },
  ],
  P4: [
    { month: 'Dez', revenue: 10800 },
    { month: 'Jan', revenue: 12000 },
    { month: 'Fev', revenue: 9600 },
    { month: 'Mar', revenue: 11000 },
    { month: 'Abr', revenue: 12400 },
    { month: 'Mai', revenue: 12500 },
  ],
  P5: [
    { month: 'Dez', revenue: 2400 },
    { month: 'Jan', revenue: 3200 },
    { month: 'Fev', revenue: 2800 },
    { month: 'Mar', revenue: 2600 },
    { month: 'Abr', revenue: 2400 },
    { month: 'Mai', revenue: 2400 },
  ],
  P6: [
    { month: 'Dez', revenue: 9800 },
    { month: 'Jan', revenue: 8900 },
    { month: 'Fev', revenue: 7600 },
    { month: 'Mar', revenue: 8400 },
    { month: 'Abr', revenue: 7800 },
    { month: 'Mai', revenue: 8700 },
  ],
  P7: [
    { month: 'Dez', revenue: 3200 },
    { month: 'Jan', revenue: 3600 },
    { month: 'Fev', revenue: 2800 },
    { month: 'Mar', revenue: 3400 },
    { month: 'Abr', revenue: 3000 },
    { month: 'Mai', revenue: 3600 },
  ],
  P8: [
    { month: 'Dez', revenue: 4600 },
    { month: 'Jan', revenue: 5200 },
    { month: 'Fev', revenue: 3800 },
    { month: 'Mar', revenue: 4800 },
    { month: 'Abr', revenue: 4200 },
    { month: 'Mai', revenue: 4800 },
  ],
}

export const statusStyles: Record<string, string> = {
  confirmed: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  cancelled: 'bg-error/10 text-error',
  completed: 'bg-primary-light text-primary-dark',
}

export function parseCheckIn(dateStr: string): string {
  const [day, month] = dateStr.split('/')
  return `2026-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
}

export function parseCheckOut(dateStr: string): string {
  const [day, month] = dateStr.split('/')
  const d = parseInt(day) + 1
  return `2026-${month.padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export interface Message {
  id: string
  senderId: 'guest' | 'host'
  content: string
  createdAt: string
  read: boolean
}

export interface Conversation {
  id: string
  guestName: string
  guestAvatar: string
  propertyName: string
  propertyId: string
  lastMessage: string
  lastMessageAt: string
  unread: number
  messages: Message[]
}

export const conversations: Conversation[] = [
  {
    id: 'C1',
    guestName: 'Carlos Silva',
    guestAvatar: 'CS',
    propertyName: 'Casa na Praia',
    propertyId: 'P1',
    lastMessage: 'Obrigado pela recepção! Voltaremos com certeza.',
    lastMessageAt: '2026-05-22T14:30:00',
    unread: 2,
    messages: [
      { id: 'M1', senderId: 'guest', content: 'Olá! Gostaria de saber se o check-in pode ser mais cedo.', createdAt: '2026-05-20T08:00:00', read: true },
      { id: 'M2', senderId: 'host', content: 'Olá Carlos! Podemos adiantar para às 13h sem custo adicional.', createdAt: '2026-05-20T08:15:00', read: true },
      { id: 'M3', senderId: 'guest', content: 'Perfeito! Vou chegar por volta das 14h então.', createdAt: '2026-05-20T09:00:00', read: true },
      { id: 'M4', senderId: 'host', content: 'Combinado. Estaremos esperando por você!', createdAt: '2026-05-20T09:10:00', read: true },
      { id: 'M5', senderId: 'guest', content: 'A casa estava maravilhosa. Amei tudo!', createdAt: '2026-05-22T14:25:00', read: true },
      { id: 'M6', senderId: 'guest', content: 'Obrigado pela recepção! Voltaremos com certeza.', createdAt: '2026-05-22T14:30:00', read: false },
      { id: 'M7', senderId: 'guest', content: 'Poderia me enviar o contato da diarista que arrumou a casa?', createdAt: '2026-05-22T14:32:00', read: false },
    ],
  },
  {
    id: 'C2',
    guestName: 'Ana Souza',
    guestAvatar: 'AS',
    propertyName: 'Apartamento Centro',
    propertyId: 'P2',
    lastMessage: 'O wi-fi está com problemas, pode verificar?',
    lastMessageAt: '2026-05-22T10:00:00',
    unread: 0,
    messages: [
      { id: 'M8', senderId: 'guest', content: 'O wi-fi está com problemas, pode verificar?', createdAt: '2026-05-22T10:00:00', read: true },
      { id: 'M9', senderId: 'host', content: 'Vou enviar um técnico ainda hoje. Desculpe pelo transtorno!', createdAt: '2026-05-22T10:30:00', read: true },
    ],
  },
  {
    id: 'C3',
    guestName: 'Pedro Lima',
    guestAvatar: 'PL',
    propertyName: 'Chalé Montanha',
    propertyId: 'P3',
    lastMessage: 'Qual o melhor restaurante nas redondezas?',
    lastMessageAt: '2026-05-21T18:00:00',
    unread: 1,
    messages: [
      { id: 'M10', senderId: 'guest', content: 'Acabamos de chegar, o chalé é lindo demais!', createdAt: '2026-05-21T15:00:00', read: true },
      { id: 'M11', senderId: 'host', content: 'Que bom que gostou! Aproveitem a lareira :)', createdAt: '2026-05-21T15:30:00', read: true },
      { id: 'M12', senderId: 'guest', content: 'Qual o melhor restaurante nas redondezas?', createdAt: '2026-05-21T18:00:00', read: false },
    ],
  },
  {
    id: 'C4',
    guestName: 'Marina Rocha',
    guestAvatar: 'MR',
    propertyName: 'Cobertura Luxo',
    propertyId: 'P4',
    lastMessage: 'Podemos estender o check-out até às 16h?',
    lastMessageAt: '2026-05-19T09:00:00',
    unread: 0,
    messages: [
      { id: 'M13', senderId: 'guest', content: 'A cobertura é espetacular! A vista é de tirar o fôlego.', createdAt: '2026-05-18T20:00:00', read: true },
      { id: 'M14', senderId: 'host', content: 'Ficamos felizes que está gostando!', createdAt: '2026-05-18T21:00:00', read: true },
      { id: 'M15', senderId: 'guest', content: 'Podemos estender o check-out até às 16h?', createdAt: '2026-05-19T09:00:00', read: true },
      { id: 'M16', senderId: 'host', content: 'Claro! Sem custo extra. Aproveitem a manhã na piscina.', createdAt: '2026-05-19T09:30:00', read: true },
    ],
  },
  {
    id: 'C5',
    guestName: 'Thiago Barbosa',
    guestAvatar: 'TB',
    propertyName: 'Studio Vila Olímpia',
    propertyId: 'P5',
    lastMessage: 'Tudo certo com o check-in, obrigado!',
    lastMessageAt: '2026-05-21T12:00:00',
    unread: 0,
    messages: [
      { id: 'M17', senderId: 'guest', content: 'Tudo certo com o check-in, obrigado!', createdAt: '2026-05-21T12:00:00', read: true },
    ],
  },
  {
    id: 'C6',
    guestName: 'Luciana Torres',
    guestAvatar: 'LT',
    propertyName: 'Sítio Paraíso',
    propertyId: 'P6',
    lastMessage: 'A churrasqueira funciona a carvão ou gás?',
    lastMessageAt: '2026-05-22T08:00:00',
    unread: 3,
    messages: [
      { id: 'M18', senderId: 'guest', content: 'Estamos muito animados para o fim de semana!', createdAt: '2026-05-21T10:00:00', read: true },
      { id: 'M19', senderId: 'guest', content: 'A churrasqueira funciona a carvão ou gás?', createdAt: '2026-05-22T08:00:00', read: false },
      { id: 'M20', senderId: 'guest', content: 'E tem lençóis extras disponíveis?', createdAt: '2026-05-22T08:05:00', read: false },
      { id: 'M21', senderId: 'guest', content: 'Quantos carros cabem na garagem?', createdAt: '2026-05-22T08:10:00', read: false },
    ],
  },
  {
    id: 'C7',
    guestName: 'Gabriel Nunes',
    guestAvatar: 'GN',
    propertyName: 'Cobertura Luxo',
    propertyId: 'P4',
    lastMessage: 'Foi uma experiência incrível! Super recomendo.',
    lastMessageAt: '2026-05-16T18:00:00',
    unread: 0,
    messages: [
      { id: 'M22', senderId: 'guest', content: 'Foi uma experiência incrível! Super recomendo.', createdAt: '2026-05-16T18:00:00', read: true },
      { id: 'M23', senderId: 'host', content: 'Que bom que gostou! Volte sempre :)', createdAt: '2026-05-16T19:00:00', read: true },
    ],
  },
  {
    id: 'C8',
    guestName: 'Fernanda Costa',
    guestAvatar: 'FC',
    propertyName: 'Casa na Praia',
    propertyId: 'P1',
    lastMessage: 'Esqueci um carregador no quarto, podem guardar?',
    lastMessageAt: '2026-05-15T11:00:00',
    unread: 2,
    messages: [
      { id: 'M24', senderId: 'guest', content: 'Esqueci um carregador no quarto, podem guardar?', createdAt: '2026-05-15T11:00:00', read: false },
      { id: 'M25', senderId: 'guest', content: 'É um carregador branco da Apple.', createdAt: '2026-05-15T11:02:00', read: false },
    ],
  },
  {
    id: 'C9',
    guestName: 'Ricardo Campos',
    guestAvatar: 'RC',
    propertyName: 'Casa Campo Belo',
    propertyId: 'P8',
    lastMessage: 'A cidade é muito charmosa! Obrigado pelas dicas.',
    lastMessageAt: '2026-05-20T09:00:00',
    unread: 0,
    messages: [
      { id: 'M26', senderId: 'guest', content: 'A cidade é muito charmosa! Obrigado pelas dicas.', createdAt: '2026-05-20T09:00:00', read: true },
      { id: 'M27', senderId: 'host', content: 'Fico feliz que aproveitou! Não deixe de visitar o centro histórico.', createdAt: '2026-05-20T10:00:00', read: true },
    ],
  },
  {
    id: 'C10',
    guestName: 'Camila Rios',
    guestAvatar: 'CR',
    propertyName: 'Chalé Montanha',
    propertyId: 'P3',
    lastMessage: 'A lareira está com dificuldade para acender, pode me ajudar?',
    lastMessageAt: '2026-05-22T09:00:00',
    unread: 1,
    messages: [
      { id: 'M28', senderId: 'guest', content: 'Chegamos no chalé, que lugar aconchegante!', createdAt: '2026-05-21T20:00:00', read: true },
      { id: 'M29', senderId: 'host', content: 'Que bom! Aproveitem o friozinho com a lareira.', createdAt: '2026-05-21T21:00:00', read: true },
      { id: 'M30', senderId: 'guest', content: 'A lareira está com dificuldade para acender, pode me ajudar?', createdAt: '2026-05-22T09:00:00', read: false },
    ],
  },
]

export interface Transaction {
  id: string
  bookingId: string
  guest: string
  guestAvatar: string
  property: string
  date: string
  grossAmount: number
  fee: number
  netAmount: number
  status: 'paid' | 'pending' | 'scheduled'
}

export interface EarningsSummary {
  month: string
  gross: number
  fees: number
  net: number
  bookingCount: number
}

export const earningsStats = {
  totalRevenue: 158420,
  netRevenue: 142578,
  averageTicket: 4530,
  pendingPayouts: 28400,
}

export const earningsByMonth: EarningsSummary[] = [
  { month: 'Dez', gross: 20200, fees: 2020, net: 18180, bookingCount: 8 },
  { month: 'Jan', gross: 24800, fees: 2480, net: 22320, bookingCount: 10 },
  { month: 'Fev', gross: 22000, fees: 2200, net: 19800, bookingCount: 9 },
  { month: 'Mar', gross: 28400, fees: 2840, net: 25560, bookingCount: 11 },
  { month: 'Abr', gross: 23600, fees: 2360, net: 21240, bookingCount: 9 },
  { month: 'Mai', gross: 31420, fees: 3142, net: 28278, bookingCount: 13 },
]

export const transactions: Transaction[] = [
  { id: 'T001', bookingId: 'B005', guest: 'João Santos', guestAvatar: 'JS', property: 'Casa na Praia', date: '22/05', grossAmount: 2800, fee: 280, netAmount: 2520, status: 'paid' },
  { id: 'T002', bookingId: 'B006', guest: 'Fernanda Costa', guestAvatar: 'FC', property: 'Casa na Praia', date: '14/05', grossAmount: 3100, fee: 310, netAmount: 2790, status: 'paid' },
  { id: 'T003', bookingId: 'B007', guest: 'Rafael Oliveira', guestAvatar: 'RO', property: 'Casa na Praia', date: '05/05', grossAmount: 2900, fee: 290, netAmount: 2610, status: 'paid' },
  { id: 'T004', bookingId: 'B008', guest: 'Juliana Mendes', guestAvatar: 'JM', property: 'Chalé Montanha', date: '18/05', grossAmount: 4200, fee: 420, netAmount: 3780, status: 'paid' },
  { id: 'T005', bookingId: 'B011', guest: 'Gabriel Nunes', guestAvatar: 'GN', property: 'Cobertura Luxo', date: '16/05', grossAmount: 7800, fee: 780, netAmount: 7020, status: 'paid' },
  { id: 'T006', bookingId: 'B017', guest: 'Daniel Martins', guestAvatar: 'DM', property: 'Studio Vila Olímpia', date: '11/05', grossAmount: 1600, fee: 160, netAmount: 1440, status: 'paid' },
  { id: 'T007', bookingId: 'B020', guest: 'Giovana Lopes', guestAvatar: 'GL', property: 'Casa Campo Belo', date: '15/05', grossAmount: 3200, fee: 320, netAmount: 2880, status: 'paid' },
  { id: 'T008', bookingId: 'B001', guest: 'Carlos Silva', guestAvatar: 'CS', property: 'Casa na Praia', date: '26/05', grossAmount: 3200, fee: 320, netAmount: 2880, status: 'scheduled' },
  { id: 'T009', bookingId: 'B002', guest: 'Ana Souza', guestAvatar: 'AS', property: 'Apartamento Centro', date: '28/05', grossAmount: 2100, fee: 210, netAmount: 1890, status: 'scheduled' },
  { id: 'T010', bookingId: 'B004', guest: 'Marina Rocha', guestAvatar: 'MR', property: 'Cobertura Luxo', date: '30/05', grossAmount: 8900, fee: 890, netAmount: 8010, status: 'scheduled' },
  { id: 'T011', bookingId: 'B009', guest: 'Thiago Barbosa', guestAvatar: 'TB', property: 'Studio Vila Olímpia', date: '21/05', grossAmount: 1800, fee: 180, netAmount: 1620, status: 'paid' },
  { id: 'T012', bookingId: 'B010', guest: 'Luciana Torres', guestAvatar: 'LT', property: 'Sítio Paraíso', date: '30/05', grossAmount: 7200, fee: 720, netAmount: 6480, status: 'scheduled' },
  { id: 'T013', bookingId: 'B013', guest: 'Ricardo Campos', guestAvatar: 'RC', property: 'Casa Campo Belo', date: '31/05', grossAmount: 3800, fee: 380, netAmount: 3420, status: 'pending' },
  { id: 'T014', bookingId: 'B015', guest: 'Bruno Xavier', guestAvatar: 'BX', property: 'Casa na Praia', date: '05/06', grossAmount: 3400, fee: 340, netAmount: 3060, status: 'pending' },
]

export const paymentStatusStyles: Record<string, string> = {
  paid: 'bg-success/10 text-success',
  pending: 'bg-warning/10 text-warning',
  scheduled: 'bg-secondary/10 text-secondary',
}

export const paymentStatusLabel: Record<string, string> = {
  paid: 'Pago',
  pending: 'Pendente',
  scheduled: 'Agendado',
}

export interface Review {
  id: string
  guestName: string
  guestAvatar: string
  date: string
  rating: number
  text: string
}

export interface PropertyAmenity {
  icon: string
  label: string
}

export function getPropertyById(id: string): Property | undefined {
  return properties.find((p) => p.id === id)
}

export const propertyAmenities: Record<string, PropertyAmenity[]> = {
  P1: [
    { icon: 'Wifi', label: 'Wi-Fi' },
    { icon: 'Waves', label: 'Piscina' },
    { icon: 'Snowflake', label: 'Ar-condicionado' },
    { icon: 'Car', label: 'Estacionamento' },
    { icon: 'Flame', label: 'Churrasqueira' },
    { icon: 'Utensils', label: 'Cozinha completa' },
    { icon: 'Tv', label: 'TV a cabo' },
    { icon: 'Shirt', label: 'Máquina de lavar' },
  ],
  P2: [
    { icon: 'Wifi', label: 'Wi-Fi' },
    { icon: 'Snowflake', label: 'Ar-condicionado' },
    { icon: 'Utensils', label: 'Cozinha' },
    { icon: 'Tv', label: 'Smart TV' },
    { icon: 'Building', label: 'Elevador' },
    { icon: 'Shirt', label: 'Lavanderia' },
    { icon: 'Shield', label: 'Portaria 24h' },
    { icon: 'Dumbbell', label: 'Academia' },
  ],
  P3: [
    { icon: 'Wifi', label: 'Wi-Fi' },
    { icon: 'Flame', label: 'Lareira' },
    { icon: 'Waves', label: 'Hidromassagem' },
    { icon: 'Car', label: 'Estacionamento' },
    { icon: 'Mountain', label: 'Vista montanha' },
    { icon: 'Utensils', label: 'Cozinha' },
    { icon: 'Tv', label: 'TV' },
    { icon: 'Snowflake', label: 'Aquecimento' },
  ],
  P4: [
    { icon: 'Wifi', label: 'Wi-Fi' },
    { icon: 'Waves', label: 'Piscina privativa' },
    { icon: 'Snowflake', label: 'Ar-condicionado' },
    { icon: 'Car', label: 'Estacionamento' },
    { icon: 'Tv', label: 'Smart TV 65"' },
    { icon: 'Speaker', label: 'Som ambiente' },
    { icon: 'Utensils', label: 'Cozina gourmet' },
    { icon: 'Shield', label: 'Segurança 24h' },
  ],
  P5: [
    { icon: 'Wifi', label: 'Wi-Fi 500mb' },
    { icon: 'Snowflake', label: 'Ar-condicionado' },
    { icon: 'Building', label: 'Coworking' },
    { icon: 'Dumbbell', label: 'Academia' },
    { icon: 'Shirt', label: 'Lavanderia' },
    { icon: 'Tv', label: 'Smart TV' },
    { icon: 'Utensils', label: 'Cozinha' },
    { icon: 'Shield', label: 'Portaria' },
  ],
  P6: [
    { icon: 'Wifi', label: 'Wi-Fi' },
    { icon: 'Waves', label: 'Piscina' },
    { icon: 'Flame', label: 'Churrasqueira' },
    { icon: 'Car', label: 'Garagem 4 carros' },
    { icon: 'Mountain', label: 'Área verde' },
    { icon: 'Utensils', label: 'Cozinha' },
    { icon: 'Tv', label: 'TV' },
    { icon: 'Volleyball', label: 'Campo futebol' },
  ],
  P7: [
    { icon: 'Wifi', label: 'Wi-Fi' },
    { icon: 'Snowflake', label: 'Ar-condicionado' },
    { icon: 'Building', label: 'Elevador' },
    { icon: 'Dumbbell', label: 'Academia' },
    { icon: 'Utensils', label: 'Cozinha' },
    { icon: 'Tv', label: 'Smart TV' },
    { icon: 'Shirt', label: 'Serviço quarto' },
    { icon: 'Shield', label: 'Portaria 24h' },
  ],
  P8: [
    { icon: 'Wifi', label: 'Wi-Fi' },
    { icon: 'Flame', label: 'Lareira' },
    { icon: 'Mountain', label: 'Vista montanha' },
    { icon: 'Car', label: 'Estacionamento' },
    { icon: 'Utensils', label: 'Cozinha' },
    { icon: 'Tv', label: 'TV' },
    { icon: 'Garden', label: 'Jardim' },
    { icon: 'Wind', label: 'Varanda' },
  ],
}

export const propertyReviews: Record<string, Review[]> = {
  P1: [
    { id: 'R1', guestName: 'Carlos Silva', guestAvatar: 'CS', date: 'mai 2026', rating: 5, text: 'Casa incrível! Localização perfeita, pé na areia. A casa é muito bem equipada e confortável. O anfitrião foi super atencioso. Voltaremos com certeza!' },
    { id: 'R2', guestName: 'Fernanda Costa', guestAvatar: 'FC', date: 'mai 2026', rating: 5, text: 'Tudo perfeito! A casa é exatamente como nas fotos. A vista é deslumbrante. Recomendo muito para famílias.' },
    { id: 'R3', guestName: 'Rafael Oliveira', guestAvatar: 'RO', date: 'abr 2026', rating: 4, text: 'Ótima experiência. A casa é ampla e bem localizada. Único ponto é que o check-in poderia ser um pouco mais flexível.' },
    { id: 'R4', guestName: 'Bruno Xavier', guestAvatar: 'BX', date: 'abr 2026', rating: 5, text: 'Melhor casa de praia que já alugamos! Tudo impecável.' },
  ],
  P2: [
    { id: 'R5', guestName: 'Ana Souza', guestAvatar: 'AS', date: 'mai 2026', rating: 5, text: 'Apartamento maravilhoso no centro de SP. Muito bem decorado e completo. Ótimo para trabalho e lazer.' },
    { id: 'R6', guestName: 'Amanda Farias', guestAvatar: 'AF', date: 'mai 2026', rating: 4, text: 'Localização excelente, perto de tudo. O apto é confortável e silencioso. Recomendo!' },
    { id: 'R7', guestName: 'Isabela Castro', guestAvatar: 'IC', date: 'abr 2026', rating: 5, text: 'Adorei a estadia! O prédio tem academia e o apartamento é muito aconchegante.' },
  ],
  P3: [
    { id: 'R8', guestName: 'Pedro Lima', guestAvatar: 'PL', date: 'mai 2026', rating: 5, text: 'Chalé dos sonhos! A lareira e a hidromassagem são o ponto alto. Lugar perfeito para casal.' },
    { id: 'R9', guestName: 'Juliana Mendes', guestAvatar: 'JM', date: 'abr 2026', rating: 5, text: 'Romântico e aconchegante. O visual das montanhas é de tirar o fôlego. Voltaremos todo ano!' },
    { id: 'R10', guestName: 'Camila Rios', guestAvatar: 'CR', date: 'abr 2026', rating: 4, text: 'Lugar lindo, porém a estrada de acesso é um pouco complicada. Mas vale cada minuto.' },
  ],
  P4: [
    { id: 'R11', guestName: 'Marina Rocha', guestAvatar: 'MR', date: 'mai 2026', rating: 5, text: 'Cobertura espetacular! A vista do Cristo é emocionante. A piscina na cobertura é um diferencial incrível.' },
    { id: 'R12', guestName: 'Gabriel Nunes', guestAvatar: 'GN', date: 'mar 2026', rating: 5, text: 'Experiência cinco estrelas. O apartamento é luxuoso e a localização é a melhor do Rio.' },
    { id: 'R13', guestName: 'Fábio Henriques', guestAvatar: 'FH', date: 'fev 2026', rating: 5, text: 'Simplesmente inesquecível. Perfeito para uma ocasião especial. Super recomendo!' },
  ],
  P5: [
    { id: 'R14', guestName: 'Thiago Barbosa', guestAvatar: 'TB', date: 'mai 2026', rating: 5, text: 'Studio compacto mas muito funcional. O coworking no prédio é ótimo para quem trabalha remoto.' },
    { id: 'R15', guestName: 'Daniel Martins', guestAvatar: 'DM', date: 'abr 2026', rating: 4, text: 'Ótimo custo-benefício. Localização estratégica em SP. Voltarei em outras viagens de trabalho.' },
  ],
  P6: [
    { id: 'R16', guestName: 'Luciana Torres', guestAvatar: 'LT', date: 'mai 2026', rating: 5, text: 'Sítio maravilhoso para reunir a família! O campo de futebol e a piscina fizeram o maior sucesso com as crianças.' },
    { id: 'R17', guestName: 'Elisa Fontes', guestAvatar: 'EF', date: 'mai 2026', rating: 5, text: 'Lugar perfeito para eventos. A infraestrutura é completa e o jardim é lindo. Superou expectativas.' },
  ],
  P7: [
    { id: 'R18', guestName: 'Patrícia Alves', guestAvatar: 'PA', date: 'abr 2026', rating: 4, text: 'Flat muito bom, localização excelente na Paulista. O serviço de hotel é um plus.' },
    { id: 'R19', guestName: 'Hélio Pereira', guestAvatar: 'HP', date: 'mar 2026', rating: 4, text: 'Bom custo-benefício para a região. Quarto confortável e limpo.' },
  ],
  P8: [
    { id: 'R20', guestName: 'Ricardo Campos', guestAvatar: 'RC', date: 'mai 2026', rating: 5, text: 'Casa charmosa em cidade histórica. O jardim é lindo e a varanda com vista para as montanhas é imperdível.' },
    { id: 'R21', guestName: 'Giovana Lopes', guestAvatar: 'GL', date: 'abr 2026', rating: 5, text: 'Uma viagem no tempo! A casa é linda, bem cuidada e a cidade é encantadora. Super recomendo.' },
  ],
}

const galleryColors: Record<string, string[]> = {
  P1: ['bg-sky-100 text-sky-700', 'bg-cyan-100 text-cyan-700', 'bg-blue-100 text-blue-700', 'bg-indigo-100 text-indigo-700'],
  P2: ['bg-rose-100 text-rose-700', 'bg-pink-100 text-pink-700', 'bg-red-100 text-red-700', 'bg-orange-100 text-orange-700'],
  P3: ['bg-emerald-100 text-emerald-700', 'bg-teal-100 text-teal-700', 'bg-green-100 text-green-700', 'bg-lime-100 text-lime-700'],
  P4: ['bg-violet-100 text-violet-700', 'bg-purple-100 text-purple-700', 'bg-fuchsia-100 text-fuchsia-700', 'bg-pink-100 text-pink-700'],
  P5: ['bg-amber-100 text-amber-700', 'bg-yellow-100 text-yellow-700', 'bg-orange-100 text-orange-700', 'bg-rose-100 text-rose-700'],
  P6: ['bg-green-100 text-green-700', 'bg-emerald-100 text-emerald-700', 'bg-teal-100 text-teal-700', 'bg-cyan-100 text-cyan-700'],
  P7: ['bg-slate-100 text-slate-700', 'bg-gray-100 text-gray-700', 'bg-zinc-100 text-zinc-700', 'bg-neutral-100 text-neutral-700'],
  P8: ['bg-stone-100 text-stone-700', 'bg-amber-100 text-amber-700', 'bg-yellow-100 text-yellow-700', 'bg-orange-100 text-orange-700'],
}

export function getGalleryColors(id: string): string[] {
  return galleryColors[id] ?? bgColors
}

const bgColors = [
  'bg-blue-100 text-blue-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-violet-100 text-violet-700',
  'bg-rose-100 text-rose-700',
  'bg-cyan-100 text-cyan-700',
  'bg-orange-100 text-orange-700',
  'bg-teal-100 text-teal-700',
]

export function getPropertyColor(index: number) {
  return bgColors[index % bgColors.length]
}
