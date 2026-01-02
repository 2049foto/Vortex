# Vortex Protocol - Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  React 19 + TypeScript + TailwindCSS + Zustand             ││
│  │  - 6 Pages: Home, Dashboard, Portfolio, Token, Watchlist   ││
│  │  - 30+ Components                                           ││
│  │  - Lazy Loading + Code Splitting                            ││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────────┬─────────────────────────────────┘
                                │ HTTPS
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                          API LAYER                               │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │  Bun + Hono Framework                                        ││
│  │  - CORS, Auth, Rate Limit, Logger Middleware                ││
│  │  - 11 REST Endpoints                                         ││
│  │  - Zod Input Validation                                      ││
│  │  - Structured Error Handling                                 ││
│  └─────────────────────────────────────────────────────────────┘│
└───────────────────────────────┬─────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Database   │       │    Cache     │       │  External    │
│  PostgreSQL  │       │    Redis     │       │    APIs      │
│    (Neon)    │       │  (Upstash)   │       │              │
│              │       │              │       │  - GoPlus    │
│  - Users     │       │  - Sessions  │       │  - QuickNode │
│  - Tokens    │       │  - Nonces    │       │  - Alchemy   │
│  - Alerts    │       │  - Rate Limit│       │              │
│  - Watchlist │       │  - Token     │       │              │
│              │       │    Cache     │       │              │
└──────────────┘       └──────────────┘       └──────────────┘
```

## Component Architecture

### Frontend Structure

```
packages/frontend/
├── src/
│   ├── pages/              # Route pages
│   │   ├── Home.tsx        # Landing page
│   │   ├── Dashboard.tsx   # Main app page
│   │   ├── Portfolio.tsx   # Holdings display
│   │   ├── TokenDetail.tsx # Token analysis
│   │   ├── Watchlist.tsx   # Saved tokens
│   │   └── Settings.tsx    # User preferences
│   │
│   ├── components/
│   │   ├── ui/             # Design system
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   │
│   │   ├── layout/         # Page structure
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Layout.tsx
│   │   │
│   │   └── features/       # Business logic
│   │       ├── TokenScanner.tsx
│   │       ├── PortfolioCard.tsx
│   │       └── HoldingsTable.tsx
│   │
│   ├── hooks/              # React hooks
│   │   ├── useAuth.ts
│   │   ├── useApi.ts
│   │   ├── useWallet.ts
│   │   └── usePortfolio.ts
│   │
│   ├── stores/             # Zustand state
│   │   ├── auth.ts
│   │   ├── ui.ts
│   │   ├── portfolio.ts
│   │   └── alerts.ts
│   │
│   ├── lib/                # Utilities
│   │   ├── api.ts          # HTTP client
│   │   ├── format.ts       # Formatters
│   │   └── validators.ts   # Client validation
│   │
│   └── types/              # TypeScript
│       ├── index.ts
│       └── api.ts
```

### Backend Structure

```
packages/backend/
├── src/
│   ├── server.ts           # Entry point
│   │
│   ├── api/                # Route handlers
│   │   ├── auth/
│   │   ├── scan/
│   │   ├── portfolio/
│   │   ├── watchlist/
│   │   ├── alerts/
│   │   └── health/
│   │
│   ├── middleware/         # HTTP middleware
│   │   ├── cors.ts
│   │   ├── auth.ts
│   │   ├── rateLimit.ts
│   │   ├── logger.ts
│   │   └── errorHandler.ts
│   │
│   └── lib/                # Core libraries
│       ├── config.ts       # Environment
│       ├── db.ts           # Prisma client
│       ├── cache.ts        # Redis client
│       ├── logger.ts       # Logging
│       ├── errors.ts       # Error classes
│       │
│       ├── auth/
│       │   ├── jwt.ts
│       │   ├── signature.ts
│       │   └── nonce.ts
│       │
│       └── scanner/
│           ├── goplusClient.ts
│           └── tokenScanner.ts
│
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Test data
│
└── tests/
    ├── unit/
    └── integration/
```

## Data Flow

### Authentication Flow

```
1. User clicks "Connect Wallet"
2. Frontend calls POST /api/auth/message
3. Backend generates nonce, stores in Redis
4. User signs message in wallet
5. Frontend calls POST /api/auth/login
6. Backend verifies signature + consumes nonce
7. Backend creates/finds user in DB
8. Backend generates JWT with JTI
9. Frontend stores token, updates state
```

### Token Scan Flow

```
1. User enters token address
2. Frontend calls POST /api/scan
3. Backend checks Redis cache
4. If cache miss:
   a. Backend calls GoPlus API
   b. Backend parses risk factors
   c. Backend stores in Redis (1h TTL)
   d. Backend stores in DB
5. Return risk analysis to frontend
```

## Security Measures

| Layer | Protection |
|-------|------------|
| Transport | HTTPS only |
| CORS | Strict whitelist |
| Auth | JWT + Nonce + Rate limit |
| Input | Zod validation |
| Database | Parameterized queries |
| Secrets | Environment variables |
| XSS | No dangerouslySetInnerHTML |
| CSRF | SameSite cookies |

## Performance Optimizations

| Area | Optimization |
|------|--------------|
| Frontend | Code splitting, lazy routes |
| Bundle | <500KB gzipped |
| API | Redis caching |
| Database | Indexed queries |
| Network | Retry with backoff |

