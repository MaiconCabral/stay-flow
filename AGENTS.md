# StayFlow - Project Rules

- We are a dedicated booking platform for vacation rental properties, similar to Airbnb.

- Our focus is to enable owners to independently advertise and receive bookings for their properties.

## Stack

- Laravel 12
- Inertia.js
- React
- Javascript
- CSS
- SASS
- MySQL
- Redis
- SQS
- Vite

## Commands

- `composer test` - PHPUnit tests
- `npm run dev` - Vite dev server
- `php artisan serve` - Laravel dev server

## Conventions

- Controllers: `app/Http/Controllers/`
- Models: `app/Models/`
- Views: `resources/views/`
- Routes: `routes/web.php`
- Migrations: `database/migrations/`
- Tests: `tests/Feature/` and `tests/Unit/`

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
