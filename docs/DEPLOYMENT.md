# Vortex Protocol - Deployment Guide

## Prerequisites

- [Bun](https://bun.sh) v1.2+
- [Git](https://git-scm.com/)
- [Vercel CLI](https://vercel.com/cli) (optional)
- PostgreSQL database ([Neon](https://neon.tech) recommended)
- Redis instance ([Upstash](https://upstash.com) recommended)

## Environment Setup

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/vortex.git
cd vortex
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Configure Environment

Create `.env.local` in the root directory:

```bash
# Required
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxx
JWT_SECRET=your-secret-key-at-least-32-characters

# External APIs
GOPLUS_API_KEY=xxx
NEXT_PUBLIC_QUICKNODE_BASE_HTTPS=https://xxx.quiknode.pro/xxx

# Optional
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=xxx
NEXT_PUBLIC_SENTRY_DSN=https://xxx@sentry.io/xxx
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
```

### 4. Setup Database

```bash
cd packages/backend

# Generate Prisma client
bunx prisma generate

# Run migrations
bunx prisma migrate deploy

# Seed test data (optional)
bun run db:seed
```

## Local Development

### Start Both Servers

```bash
# From root directory
bun run dev
```

Or separately:

```bash
# Terminal 1: Backend (http://localhost:3001)
bun run dev:backend

# Terminal 2: Frontend (http://localhost:5173)
bun run dev:frontend
```

### Verify Setup

1. Backend health: http://localhost:3001/api/health
2. Frontend: http://localhost:5173

## Production Build

### Build Both Packages

```bash
# Build frontend
cd packages/frontend
bun run build

# Build backend (optional for Vercel)
cd ../backend
bun build src/server.ts --outdir dist --target bun
```

### Verify Build

```bash
# Check frontend build
ls -la packages/frontend/dist/
# Should contain: index.html, assets/

# Test frontend locally
cd packages/frontend
bunx serve dist -l 5173
```

## Vercel Deployment

### Option 1: Vercel Dashboard (Recommended)

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Configure:
   - **Framework**: Other
   - **Build Command**: `bun install && cd packages/frontend && bun run build`
   - **Output Directory**: `packages/frontend/dist`
   - **Install Command**: `bun install`
6. Add environment variables (see below)
7. Deploy

### Option 2: Vercel CLI

```bash
# Install Vercel CLI
bun add -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

### Environment Variables on Vercel

Go to **Project Settings → Environment Variables** and add:

| Variable | Value | Environment |
|----------|-------|-------------|
| DATABASE_URL | postgresql://... | Production |
| UPSTASH_REDIS_REST_URL | https://... | Production |
| UPSTASH_REDIS_REST_TOKEN | xxx | Production |
| JWT_SECRET | (generate secure key) | Production |
| GOPLUS_API_KEY | xxx | Production |
| NODE_ENV | production | Production |

## Database Migrations

### Apply Migrations

```bash
cd packages/backend

# Preview migration
bunx prisma migrate dev --preview

# Apply migration (production)
bunx prisma migrate deploy
```

### Create New Migration

```bash
# After modifying schema.prisma
bunx prisma migrate dev --name description_of_change
```

### Reset Database (⚠️ Destructive)

```bash
bunx prisma migrate reset
```

## Monitoring

### Health Checks

- **Endpoint**: `GET /api/health`
- **Readiness**: `GET /api/health/ready`
- **Liveness**: `GET /api/health/live`

Configure in Vercel or your monitoring tool:

```json
{
  "healthChecks": [
    {
      "path": "/api/health",
      "interval": 60
    }
  ]
}
```

### Error Tracking (Sentry)

1. Create project at [sentry.io](https://sentry.io)
2. Add DSN to environment variables
3. Errors are automatically captured

### Analytics (PostHog)

1. Create project at [posthog.com](https://posthog.com)
2. Add API key to environment variables
3. Events tracked automatically

## Rollback

### Vercel

1. Go to Deployments in Vercel dashboard
2. Find the last working deployment
3. Click "..." → "Promote to Production"

### Database

```bash
# View migration history
bunx prisma migrate status

# Rollback (manual, write down migration)
bunx prisma migrate resolve --rolled-back <migration_name>
```

## Troubleshooting

### Build Fails

```bash
# Clear caches
rm -rf node_modules packages/*/node_modules
rm -rf packages/*/dist .vercel

# Reinstall
bun install
```

### Database Connection Issues

1. Verify `DATABASE_URL` is correct
2. Check Neon dashboard for connection limits
3. Ensure SSL mode is enabled: `?sslmode=require`

### Redis Connection Issues

1. Verify Upstash credentials
2. Check Upstash dashboard for quota
3. Ensure REST API is enabled (not native Redis)

### CORS Errors

1. Verify frontend URL is in allowed origins
2. Check `packages/backend/src/middleware/cors.ts`
3. Add your domain to the whitelist

## Security Checklist

Before going live:

- [ ] Change JWT_SECRET to secure random value
- [ ] Verify CORS whitelist only contains your domains
- [ ] Enable Vercel DDoS protection
- [ ] Set up monitoring alerts
- [ ] Configure Sentry error tracking
- [ ] Review rate limiting configuration
- [ ] Enable Vercel password protection for staging

