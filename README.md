# SneakerHead Platform

Monorepo for the SneakerHead e-commerce platform.

## Stack

- **Customer app:** Next.js (`apps/web`) — port 3000
- **Admin app:** Next.js (`apps/admin`) — port 3002
- **API:** NestJS (`apps/api`) — port 3001
- **Database:** PostgreSQL + Prisma
- **Cache:** Redis (rate limiting)

## Phase 1 — Auth & Users

Implemented features:

- Customer registration, login, logout, refresh tokens
- Forgot / reset password flow
- Customer account profile management
- Admin login with role guard (`ADMIN`, `SUPER_ADMIN`)
- Admin dashboard shell with stats placeholder
- JWT auth with refresh token rotation
- Redis-backed auth rate limiting
- Admin login audit logging

## Getting started

### Prerequisites

- Node.js 20+
- pnpm 10+
- PostgreSQL 16
- Redis 7

Or use Docker Compose:

```bash
docker compose up -d
```

### Setup

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example apps/api/.env
cp .env.example apps/web/.env.local
cp .env.example apps/admin/.env.local

# Create database user/db (if not using Docker)
sudo -u postgres psql -c "CREATE USER sneakerhead WITH PASSWORD 'sneakerhead';"
sudo -u postgres psql -c "CREATE DATABASE sneakerhead OWNER sneakerhead;"

# Run migrations and seed admin user
pnpm db:migrate
pnpm db:seed

# Start all apps
pnpm dev
```

### Default admin credentials

- Email: `admin@sneakerhead.com`
- Password: `Admin123!`

### URLs

| App | URL |
|-----|-----|
| Customer | http://localhost:3000 |
| Admin | http://localhost:3002 |
| API | http://localhost:3001 |
| Swagger | http://localhost:3001/docs |

## Project structure

```
apps/
  api/      NestJS backend
  web/      Customer Next.js app
  admin/    Admin Next.js app
packages/
  types/    Shared TypeScript types
```
