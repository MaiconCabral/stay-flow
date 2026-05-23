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
