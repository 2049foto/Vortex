# Environment Variables Guide

**Vortex Protocol** - Complete environment variables reference

---

## 📋 Overview

Vortex Protocol uses environment variables for configuration. The app supports both:
- **Vite format**: `VITE_*` (recommended for frontend)
- **Next.js format**: `NEXT_PUBLIC_*` (for compatibility)

Backend uses standard `process.env.*` variables.

---

## 🔧 Setup

### 1. Create `.env.local` file

Copy the template and fill in your values:

```bash
cp .env.example .env.local
```

### 2. Required Variables

**Minimum required for app to run:**

```env
# Database
DATABASE_URL=postgresql://...

# Redis
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...

# Auth
JWT_SECRET=your_secret_min_32_chars

# GoPlus (Token Security)
GOPLUS_API_KEY=...
```

---

## 📦 Variable Categories

### 🌐 App Identity & Core Config

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_APP_NAME` | App name | `Vortex Protocol` |
| `NEXT_PUBLIC_APP_URL` | Production URL | `https://vortex-protocol.vercel.app` |
| `NODE_ENV` | Environment | `development` |
| `NEXT_PUBLIC_ADMIN_WALLET` | Admin wallet address | - |

---

### 🔐 Authentication & Security

| Variable | Description | Required |
|----------|-------------|----------|
| `JWT_SECRET` | JWT signing secret (min 32 chars) | ✅ Yes |
| `NEXTAUTH_SECRET` | NextAuth secret (optional) | No |
| `NEXTAUTH_URL` | NextAuth callback URL | No |

**Generate JWT_SECRET:**
```bash
openssl rand -base64 32
```

---

### 🗄️ Database - Neon PostgreSQL

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |
| `NEON_API_URL` | Neon REST API (optional) | No |

**Format:**
```
postgresql://user:password@host/database?sslmode=require
```

---

### ⚡ Cache - Upstash Redis

| Variable | Description | Required |
|----------|-------------|----------|
| `UPSTASH_REDIS_REST_URL` | Redis REST API URL | ✅ Yes |
| `UPSTASH_REDIS_REST_TOKEN` | Redis API token | ✅ Yes |

**Free Tier**: 10,000 commands/day

---

### 🔗 RPC Infrastructure

#### QuickNode (Primary)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_QUICKNODE_BASE_HTTPS` | Base mainnet HTTPS |
| `NEXT_PUBLIC_QUICKNODE_BASE_WSS` | Base mainnet WebSocket |
| `NEXT_PUBLIC_QUICKNODE_SOLANA_HTTPS` | Solana mainnet HTTPS |
| `NEXT_PUBLIC_QUICKNODE_SOLANA_WSS` | Solana mainnet WebSocket |

**Free Tier**: 50,000 requests/day

#### Alchemy (Backup)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_ALCHEMY_API_KEY` | Alchemy API key |
| `ALCHEMY_API_KEY` | Same as above |
| `NEXT_PUBLIC_ALCHEMY_BASE_RPC` | Base mainnet RPC |
| `NEXT_PUBLIC_ALCHEMY_SOLANA_RPC` | Solana mainnet RPC |

**Free Tier**: 30M compute units/month

#### Infura (Fallback)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_INFURA_PROJECT_ID` | Infura project ID |
| `INFURA_API_KEY` | Infura API key |
| `INFURA_API_KEY_SECRET` | Infura secret |
| `NEXT_PUBLIC_INFURA_BASE_HTTPS` | Base mainnet HTTPS |

**Free Tier**: 100,000 requests/day

#### Helius (Solana Primary)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_HELIUS_API_KEY` | Helius API key |
| `NEXT_PUBLIC_HELIUS_RPC` | Helius RPC URL |
| `NEXT_PUBLIC_HELIUS_MAINNET` | Helius mainnet URL |

**Free Tier**: Unlimited

---

### 🛡️ Token Security APIs

| Variable | Description | Required |
|----------|-------------|----------|
| `GOPLUS_API_KEY` | GoPlus Labs API key | ✅ Yes |
| `NEXT_PUBLIC_GOPLUS_API_URL` | GoPlus API URL | No |
| `NEXT_PUBLIC_RUGCHECK_API_URL` | Rugcheck API (no key) | No |
| `NEXT_PUBLIC_BLOCKAID_API_KEY` | Blockaid API key | No |

**GoPlus**: Free, no rate limit

---

### 💱 Swap Aggregators

| Service | Variable | Description |
|---------|----------|-------------|
| 1inch | `ONEINCH_API_KEY` | 1inch API key |
| 0x | `ZEROX_API_KEY` | 0x Protocol API key |
| OpenOcean | `NEXT_PUBLIC_OPENOCEAN_API_URL` | OpenOcean API URL |
| Rango | `NEXT_PUBLIC_RANGO_API_KEY` | Rango API key |
| Li.Fi | `NEXT_PUBLIC_LIFI_API_URL` | Li.Fi API URL |
| CoW Swap | `NEXT_PUBLIC_COW_API_URL` | CoW Swap API URL |
| Jupiter | `JUPITER_API_KEY` | Jupiter API key (Solana) |

**All**: Free tier available

---

### ⛽ Gas Sponsorship / Account Abstraction

| Service | Variable | Description |
|---------|----------|-------------|
| Pimlico | `PIMLICO_API_KEY` | Pimlico API key |
| Biconomy | `BICONOMY_API_KEY` | Biconomy API key |
| Coinbase CDP | `NEXT_PUBLIC_ONCHAINKIT_API_KEY` | OnchainKit key |
| ZeroDev | `NEXT_PUBLIC_ZERODEV_PROJECT_ID` | ZeroDev project ID |

**Pimlico**: 1,000 sponsors/month free

---

### 👛 Wallet Connection

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID` | WalletConnect project ID | ✅ Yes |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy app ID | No |

---

### 📊 Data Indexing & Portfolio

| Service | Variable | Description |
|---------|----------|-------------|
| Moralis | `MORALIS_API_KEY` | Moralis API key |
| TheGraph | `THEGRAPH_API_KEY` | TheGraph API key |
| Covalent | `COVALENT_API_KEY` | Covalent API key |

**Moralis**: 10,000 calls/month free

---

### 💰 Market Data & Pricing

| Service | Variable | Description |
|---------|----------|-------------|
| CoinGecko | `COINGECKO_API_URL` | CoinGecko API URL |
| DexScreener | `NEXT_PUBLIC_DEXSCREENER_API_URL` | DexScreener API URL |

**Both**: Free

---

### 🔒 Security & Simulation

| Service | Variable | Description |
|---------|----------|-------------|
| Tenderly | `TENDERLY_API_KEY` | Tenderly API key |
| Gitcoin Passport | `GITCOIN_PASSPORT_API_KEY` | Gitcoin Passport key |

---

### 📈 Analytics & Monitoring

| Service | Variable | Description |
|---------|----------|-------------|
| PostHog | `NEXT_PUBLIC_POSTHOG_KEY` | PostHog API key |
| Sentry | `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN |
| Dune | `DUNE_API_KEY` | Dune Analytics API key |

**PostHog**: 1M events/month free  
**Sentry**: 5K errors/month free

---

### 🚀 Feature Flags

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_ENABLE_ANALYTICS` | Enable analytics | `true` |
| `NEXT_PUBLIC_ENABLE_GASLESS` | Enable gasless transactions | `false` |
| `NEXT_PUBLIC_ENABLE_SESSION_KEYS` | Enable session keys | `false` |
| `NEXT_PUBLIC_ENABLE_AI_CLASSIFICATION` | Enable AI classification | `false` |
| `NEXT_PUBLIC_ENABLE_VOLATILITY_DETECTOR` | Enable volatility detector | `false` |
| `NEXT_PUBLIC_ENABLE_GREEN_OFFSET` | Enable green offset | `false` |
| `NEXT_PUBLIC_ENABLE_TOKENIZED_RECEIPTS` | Enable tokenized receipts | `false` |

---

### 💰 Fee Configuration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_PROTOCOL_FEE_PERCENT` | Protocol fee percentage | `0.8` |
| `NEXT_PUBLIC_MIN_FEE_PERCENT` | Minimum fee percentage | `0.2` |
| `NEXT_PUBLIC_MAX_FEE_PERCENT` | Maximum fee percentage | `0.6` |

---

### 🌍 Supported Chains

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPPORTED_CHAINS` | Comma-separated chain list | `base,arbitrum,optimism,polygon,ethereum,bsc,avalanche,solana` |
| `NEXT_PUBLIC_PRIMARY_CHAIN` | Primary chain | `base` |
| `NEXT_PUBLIC_CHAIN_ID` | Primary chain ID | `8453` |

---

### 🎨 AI & Advanced Features

| Variable | Description |
|----------|-------------|
| `BASE_AI_KIT_API_KEY` | Base AI Kit API key |
| `NEXT_PUBLIC_BASE_AI_KIT_URL` | Base AI Kit URL |
| `QUANTUM_RESIST_ENABLED` | Enable quantum resistance |
| `TOUCAN_API_KEY` | Toucan API key |
| `NEXT_PUBLIC_TOUCAN_API_URL` | Toucan API URL |

---

### 📝 Farcaster Integration

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_FARCASTER_HUB_URL` | Farcaster hub URL | `https://hub.farcaster.cast` |
| `FARCASTER_FRAMES_ENABLED` | Enable Farcaster frames | `true` |

---

## 🔄 Usage in Code

### Backend

```typescript
import { config } from './lib/config';

// Access config
const apiKey = config.goplus.apiKey;
const rpcUrl = config.rpc.base;
```

### Frontend

```typescript
import { config } from '@/lib/config';

// Access config
const walletConnectId = config.wallet.walletConnectProjectId;
const rpcUrl = config.rpc.quicknodeBase;
```

---

## ✅ Validation

Backend validates required environment variables on startup:

- ✅ `DATABASE_URL`
- ✅ `UPSTASH_REDIS_REST_URL`
- ✅ `UPSTASH_REDIS_REST_TOKEN`
- ✅ `JWT_SECRET` (min 32 characters)

Missing required variables will show an error in development.

---

## 🔒 Security Notes

1. **Never commit `.env.local`** - It's in `.gitignore`
2. **Use strong JWT_SECRET** - Generate with `openssl rand -base64 32`
3. **Rotate API keys regularly**
4. **Use different keys for dev/prod**

---

## 📚 Resources

- [Neon PostgreSQL](https://neon.tech)
- [Upstash Redis](https://upstash.com)
- [QuickNode](https://quicknode.com)
- [GoPlus Labs](https://gopluslabs.io)

---

**Last Updated**: January 2, 2026

