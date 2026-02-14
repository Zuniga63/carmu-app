# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sistema POS (Point of Sale) built with Next.js 14. Manages customer accounts, cashbox operations, product administration, categories, invoicing, layaways, and credits. The entire UI is in Spanish.

## Commands

- **Package manager**: `pnpm` (enforced via `preinstall` script, do NOT use npm/yarn)
- **Dev server**: `pnpm dev`
- **Build**: `pnpm build`
- **Lint**: `pnpm lint` (ESLint), `pnpm lint:prettier` (Prettier), `pnpm lint:ts` (TypeScript check)

## Architecture

### Dual Routing (Migration in Progress)

The app uses **both** Next.js routing systems simultaneously:

- **App Router** (`src/app/`): New pages — dashboard, app-config, auth (signin/signup). Uses route groups: `(app)` for authenticated pages.
- **Pages Router** (`src/pages/`): Legacy pages — admin/boxes, admin/categories, admin/customers, admin/invoices, admin/products, admin/profile, admin/config.

Each router has its own provider setup: `src/app/providers.tsx` (App Router) and `src/pages/_app.tsx` (Pages Router).

### Module Structure (`src/modules/`)

Feature modules follow this convention:
```
modules/<feature>/
  ├── components/     # React components
  ├── services/       # API calls + adapters for data transformation
  ├── interfaces/     # TypeScript interfaces (API shapes)
  ├── schemas/        # Zod validation schemas
  ├── hooks/          # Module-specific custom hooks
  ├── config/         # Constants, enums
  ├── adapters/       # Data transformation functions
  ├── store/          # Zustand store (if needed)
  └── utils/          # Helper functions
```

Active modules: `auth`, `products`, `premise-store`, `cashboxes`, `dashboar`, `app-config`.

### State Management

- **Zustand** for client state — two store locations:
  - `src/store/` — Page-level stores (auth-store, config-store, invoices-page, boxes-page, categories, customer)
  - `src/stores/` — Global app store (user, accessToken)
  - Module stores: `src/modules/<feature>/store/`
- **React Query** (`@tanstack/react-query`) for server state — query hooks in `src/hooks/react-query/`
  - Query keys centralized in `src/config/server-state-key.enum.ts`

### API Communication

- **Axios** instances per domain in `src/services/` (invoices, boxes, categories, customers, etc.)
- Bearer token applied globally via `src/logic/auth-logic.ts` → `setAccesToken()`
- Two API base URLs: `NEXT_PUBLIC_URL_API` (legacy) and `NEXT_PUBLIC_URL_NEW_API`
- Services include **adapter functions** that normalize API responses to app format

### Authentication

- **NextAuth.js v4** with Credentials (email/password) + Google OAuth providers
- Config: `src/modules/auth/config/auth-options.ts`
- Middleware (`src/middleware.ts`): Protects all routes except `/auth/signin` and `/auth/signup`
- Session synced to Zustand stores on mount

### UI Stack

- **Tailwind CSS** with custom theme (CSS variables for colors, dark mode via `class` strategy)
- **Radix UI** primitives wrapped in `src/components/ui/` (shadcn/ui pattern)
- **Mantine v5** for some legacy components (dates, theme provider via `src/context/CustomThemeProvider.tsx`)
- Forms: **react-hook-form** + **zod** (via `@hookform/resolvers`)
- Charts: **chart.js** + **react-chartjs-2**

## Path Aliases

- `@/*` → `./src/*`
- `@/modules/*` → `./src/modules/*`

## Code Conventions

- Prettier: single quotes, trailing commas, 120 char print width, no semicolons omission, LF line endings
- `cn()` utility from `src/utils/cn.ts` (clsx + tailwind-merge) for conditional class names
- Data normalization via `normalizeText()` from `src/utils/` (trim, lowercase, NFD decomposition)
- Domain components organized by page in `src/components/<PageName>/`
- Sensitive data protected via password in config store (`unlockSensitiveInformation`)

## Environment Variables

See `.env.example` for required variables: API URLs, NextAuth secret/URL, Google OAuth credentials, app name, brand logo URL, graph password.
