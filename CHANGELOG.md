# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-01-02

### Added
- **Token Security Scanner** with GoPlus API integration
  - Honeypot detection
  - Rug pull risk analysis
  - Contract security checks
  - Risk scoring (0-100)
  
- **Web3 Authentication**
  - Wallet connection (WalletConnect, Coinbase)
  - Message signing with nonce verification
  - JWT token management
  - One-time nonce protection

- **Portfolio Management**
  - Multi-chain portfolio view
  - Real-time token balances
  - USD value calculation
  - 24h change tracking

- **Watchlist Feature**
  - Add/remove tokens
  - Quick access to watched tokens
  - Persistent storage

- **Alert System**
  - Price alerts (above/below)
  - Risk change alerts
  - Volume alerts
  - Enable/disable toggle

- **Multi-Chain Support**
  - Base (Primary)
  - Ethereum
  - Arbitrum
  - Optimism
  - Polygon
  - BSC
  - Avalanche
  - Solana

- **UI/UX**
  - Dark mode by default
  - Responsive design (mobile-first)
  - Smooth animations
  - Loading skeletons
  - Error states

- **Security**
  - Rate limiting (Redis-based)
  - CORS whitelist
  - Input validation (Zod)
  - Parameterized queries
  - JWT with JTI

- **Developer Experience**
  - TypeScript strict mode
  - Comprehensive test suite
  - API documentation
  - Deployment guides

### Infrastructure
- Bun runtime for frontend and backend
- Hono web framework
- Prisma ORM with PostgreSQL (Neon)
- Redis caching (Upstash)
- Vercel deployment ready

---

## [Unreleased]

### Planned
- Token swap integration
- Gas sponsorship (account abstraction)
- Social features
- Advanced portfolio analytics
- Mobile app (React Native)

