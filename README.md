# Vortex Protocol

<div align="center">
  <h3>🌀 Advanced DeFi Token Security Scanner & Portfolio Tracker</h3>
  <p>Protect your investments with real-time security analysis powered by GoPlus</p>
</div>

---

## 🚀 Features

- **Token Security Scanner** - Analyze any token for honeypots, rug pulls, and security risks
- **Portfolio Tracking** - Track holdings across 9+ chains with real-time prices
- **Watchlist Management** - Save and monitor your favorite tokens
- **Alert System** - Set price, risk, and volume alerts
- **Multi-Chain Support** - Base, Ethereum, Arbitrum, Optimism, Polygon, BSC, Avalanche, Solana
- **Dark Mode** - Beautiful dark-first design with smooth animations

## 🛠️ Tech Stack

### Frontend
- **Runtime**: Bun 1.2
- **Framework**: Vite 6.0 + React 19
- **Language**: TypeScript 5.8
- **Styling**: TailwindCSS 4.0
- **State**: Zustand + TanStack Query
- **Routing**: React Router v7

### Backend
- **Runtime**: Bun 1.2
- **Framework**: Hono 4.x
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 6.0
- **Cache**: Upstash Redis
- **Auth**: JWT + Web3 Signatures

### External APIs
- **Security**: GoPlus API
- **RPC**: QuickNode, Alchemy, Infura
- **Analytics**: PostHog, Sentry

## 📦 Project Structure

```
vortex/
├── packages/
│   ├── frontend/           # React frontend
│   │   ├── src/
│   │   │   ├── pages/      # 6 pages
│   │   │   ├── components/ # 30+ components
│   │   │   ├── hooks/      # Custom React hooks
│   │   │   ├── stores/     # Zustand stores
│   │   │   ├── lib/        # Utilities
│   │   │   └── types/      # TypeScript types
│   │   └── ...config files
│   │
│   └── backend/            # Hono API server
│       ├── src/
│       │   ├── api/        # API routes
│       │   ├── lib/        # Core libraries
│       │   └── middleware/ # HTTP middleware
│       ├── prisma/         # Database schema
│       └── tests/          # Unit + Integration tests
│
├── .env.local              # Environment variables
├── vercel.json             # Deployment config
└── package.json            # Workspace root
```

## 🏃 Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.2+
- PostgreSQL database (or use [Neon](https://neon.tech))
- Redis (or use [Upstash](https://upstash.com))

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/vortex.git
   cd vortex
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Setup database**
   ```bash
   cd packages/backend
   bunx prisma migrate dev --name init
   bunx prisma generate
   bun run db:seed
   ```

5. **Start development servers**
   ```bash
   # From root directory
   bun run dev
   
   # Or separately:
   bun run dev:frontend  # http://localhost:5173
   bun run dev:backend   # http://localhost:3001
   ```

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/message` | Get signing message |
| POST | `/api/auth/login` | Login with signature |
| POST | `/api/auth/verify` | Verify JWT token |

### Token Scanner
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scan` | Scan token for risks |
| GET | `/api/scan/:chain/:address` | Get cached scan |

### Portfolio
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/portfolio/:address` | Get portfolio |
| GET | `/api/portfolio/:address/transactions` | Get transactions |

### Watchlist (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get watchlist |
| POST | `/api/watchlist` | Add to watchlist |
| DELETE | `/api/watchlist/:id` | Remove from watchlist |

### Alerts (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/alerts` | Get all alerts |
| POST | `/api/alerts` | Create alert |
| PATCH | `/api/alerts/:id` | Update alert |
| DELETE | `/api/alerts/:id` | Delete alert |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health status |
| GET | `/api/health/ready` | Readiness check |
| GET | `/api/health/live` | Liveness check |

## 🧪 Testing

```bash
# Run all tests
cd packages/backend
bun test

# Run with coverage
bun test --coverage

# Run specific test file
bun test tests/unit/jwt.test.ts
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

```bash
vercel
```

### Manual Build

```bash
# Build frontend
cd packages/frontend
bun run build

# Build backend
cd packages/backend
bun run build
```

## 📊 Database Migrations

```bash
cd packages/backend

# Create migration
bunx prisma migrate dev --name migration_name

# Apply migrations
bunx prisma migrate deploy

# Reset database
bunx prisma migrate reset

# Open Prisma Studio
bunx prisma studio
```

## 🔒 Security

- All user inputs are validated with Zod
- JWT tokens expire after 7 days
- Parameterized queries prevent SQL injection
- CORS configured for allowed origins
- No secrets exposed in frontend code
- Rate limiting on API endpoints

## 📈 Performance

- Code splitting with React.lazy
- Redis caching for API responses
- Database indexes on frequently queried columns
- Optimized bundle size with tree shaking
- Lazy loading for routes
- Image optimization

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [GoPlus Labs](https://gopluslabs.io) - Token security API
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Upstash](https://upstash.com) - Serverless Redis
- [QuickNode](https://quicknode.com) - RPC infrastructure

---

<div align="center">
  <p>Built with 💜 for the DeFi community</p>
  <p>
    <a href="https://twitter.com/vortexprotocol">Twitter</a> •
    <a href="https://discord.gg/vortex">Discord</a> •
    <a href="https://docs.vortex.protocol">Docs</a>
  </p>
</div>

