# StayFlow - Project Rules

- We are a dedicated booking platform for vacation rental properties, similar to Airbnb.

- Our focus is to enable owners to independently advertise and receive bookings for their properties.

## Stack

- Laravel 12 (`backend/`)
- Next.js + React (`frontend/`)
- JavaScript / TypeScript
- CSS / Tailwind CSS
- MySQL
- Redis
- SQS

## Monorepo Structure

```
/
├── backend/          # Laravel API (PHP)
├── frontend/         # Next.js app (React)
├── .gitignore
└── AGENTS.md
```

## Commands

### Backend (`cd backend/`)
- `composer test` - PHPUnit tests
- `npm run dev` - Vite dev server (Laravel assets)
- `php artisan serve` - Laravel dev server

### Frontend (`cd frontend/`)
- `npm run dev` - Next.js dev server
- `npm run build` - Next.js build

## Conventions

### Backend
- Controllers: `backend/app/Http/Controllers/`
- Models: `backend/app/Models/`
- Views: `backend/resources/views/`
- Routes: `backend/routes/web.php`
- Migrations: `backend/database/migrations/`
- Tests: `backend/tests/Feature/` and `backend/tests/Unit/`

### Frontend
- Components: `frontend/src/components/`
- Pages: `frontend/src/app/` (App Router)
- Hooks: `frontend/src/hooks/`
- Lib: `frontend/src/lib/`

# Backend Rules

Architecture:

- Controllers thin
- Business logic in Services/Actions
- DTOs for complex payloads
- FormRequest for validation
- Queues for async processing
- Repository pattern only when needed

## Patterns

- SOLID
- Feature based organization
- Avoid fat models
- Prefer readonly DTOs
- Use policies for authorization

# Frontend Rules

Patterns:

- Reusable components
- Smart/container separation
- Hooks for business logic
- Memoization when needed

Performance:

- Avoid unnecessary rerenders
- Use lazy loading
- Virtualize large lists
- Debounce expensive operations

## Important

- Use `php artisan` for database operations
- Do not commit .env files
- Keep dependencies updated
- Run tests before commits

# Reservation Module Integration Status

## Integrated (Working)

### Public Booking Flow
- `src/lib/availability.ts` — full CRUD + availability check API
- `src/lib/reservation.ts` — added `updateReservation()`, `deleteReservation()`
- `src/app/imoveis/[id]/page.tsx` — "Reservar" button now calls `createReservation()`; auth guard redirects to login; `checkAvailability()` validates dates in real-time; loading/error/success states; price computed client-side (backend auto-calculates on submit)

### Dashboard — Imóvel Detail
- `src/app/dashboard/imoveis/[id]/page.tsx` — fetches reservations via `fetchReservations({ property_id })`; real stats (receita, reservas, ocupação 30d); upcoming events (check-in/check-out); revenue chart (6 months); bookings table

### Dashboard — Ganhos
- `src/app/dashboard/ganhos/page.tsx` — fetches reservations + properties; computes total/net revenue, average ticket, pending payouts; monthly gross/net chart; revenue by property; transactions table with search

### Dashboard — Reservas
- `src/app/dashboard/reservas/page.tsx` — FullCalendar + list view; real data; cancel flow in modal (via `cancelReservation`)

### Dashboard — Overview
- `src/app/dashboard/page.tsx` — real stats from reservations/properties API (receita, reservas ativas, ocupação, imóveis ativos); revenue chart; recent bookings; upcoming events; property performance

## Pending / Not Yet Built

### Availability Management UI (property form)
- Backend has full CRUD at `/api/availabilities`
- No frontend UI to block/unblock dates for a property
- Future: add calendar picker in property detail or property form

### Earnings Export
- "Exportar" button in `ganhos/page.tsx` is decorative
- Future: CSV/PDF export

### Pagination
- Reservations and earnings pages fetch `per_page: 100`/`200` with no pagination UI
- Future: add page controls or infinite scroll
