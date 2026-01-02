# Vortex Protocol - API Reference

**Base URL**: `https://vortex-protocol.vercel.app/api`

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

---

## Endpoints

### Health Check

#### GET /api/health

Check API health and service status.

**Response**
```json
{
  "status": "ok",
  "timestamp": "2026-01-02T12:00:00.000Z",
  "version": "1.0.0",
  "uptime": 3600,
  "services": {
    "database": "connected",
    "cache": "connected"
  }
}
```

#### GET /api/health/ready

Readiness probe for orchestration.

**Response**
```json
{
  "ready": true,
  "timestamp": "2026-01-02T12:00:00.000Z"
}
```

#### GET /api/health/live

Liveness probe.

**Response**
```json
{
  "alive": true,
  "timestamp": "2026-01-02T12:00:00.000Z"
}
```

---

### Authentication

#### POST /api/auth/message

Get a message for wallet signing.

**Rate Limit**: 5 requests/minute

**Request**
```json
{
  "address": "0x1234567890abcdef1234567890abcdef12345678"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "message": "Sign this message to authenticate...",
    "nonce": "abc123def456",
    "timestamp": 1704196800000
  }
}
```

#### POST /api/auth/login

Login with signed message.

**Rate Limit**: 5 requests/minute

**Request**
```json
{
  "address": "0x1234567890abcdef1234567890abcdef12345678",
  "signature": "0xabc123...",
  "message": "Sign this message..."
}
```

**Response**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "clxxxxxxxxxx",
    "walletAddress": "0x1234...",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-02T12:00:00.000Z"
  },
  "expiresAt": "2026-01-09T12:00:00.000Z"
}
```

#### POST /api/auth/verify

Verify JWT token validity.

**Headers**: Authorization: Bearer <token>

**Response**
```json
{
  "valid": true,
  "user": {
    "id": "clxxxxxxxxxx",
    "walletAddress": "0x1234..."
  },
  "expiresAt": "2026-01-09T12:00:00.000Z"
}
```

---

### Token Scanner

#### POST /api/scan

Scan a token for security risks.

**Rate Limit**: 10 requests/minute

**Request**
```json
{
  "tokenAddress": "0x6982508145454ce325ddbe47a25d4ec3d2311933",
  "chain": "ethereum"
}
```

**Response**
```json
{
  "success": true,
  "data": {
    "token": {
      "address": "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      "symbol": "PEPE",
      "name": "Pepe",
      "chain": "ethereum"
    },
    "risk": {
      "riskScore": 35,
      "riskLevel": "WARNING",
      "safe": false,
      "honeypot": false,
      "rugpull": false,
      "transferability": true,
      "risks": [
        {
          "name": "High Concentration",
          "description": "Top holders own significant supply",
          "result": false,
          "severity": "medium"
        }
      ]
    },
    "cachedAt": "2026-01-02T12:00:00.000Z",
    "expiresAt": "2026-01-02T13:00:00.000Z"
  }
}
```

**Supported Chains**: ethereum, base, arbitrum, optimism, polygon, bsc, avalanche

---

### Portfolio

#### GET /api/portfolio/:address

Get portfolio holdings for a wallet.

**Rate Limit**: 30 requests/minute

**Parameters**
- `address` (path): Wallet address
- `chain` (query, optional): Filter by chain

**Response**
```json
{
  "success": true,
  "data": {
    "address": "0x1234...",
    "totalValueUSD": 14500.83,
    "change24hUSD": 234.20,
    "change24hPercent": 1.64,
    "tokens": [
      {
        "address": "0x4200...",
        "symbol": "WETH",
        "name": "Wrapped Ether",
        "decimals": 18,
        "balance": "2500000000000000000",
        "balanceFormatted": 2.5,
        "priceUSD": 3200.45,
        "valueUSD": 8001.13,
        "change24h": 234.50,
        "change24hPercent": 3.02
      }
    ],
    "lastUpdated": "2026-01-02T12:00:00.000Z"
  }
}
```

---

### Watchlist

**All watchlist endpoints require authentication.**

#### GET /api/watchlist

Get user's watchlist.

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxxxxxxxx",
      "userId": "clyyyyyyyyy",
      "tokenAddress": "0x4200...",
      "chain": "base",
      "symbol": "WETH",
      "name": "Wrapped Ether",
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/watchlist

Add token to watchlist.

**Request**
```json
{
  "tokenAddress": "0x6982508145454ce325ddbe47a25d4ec3d2311933",
  "chain": "ethereum",
  "symbol": "PEPE",
  "name": "Pepe"
}
```

**Response** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxxxxxx",
    "tokenAddress": "0x6982...",
    "chain": "ethereum",
    "symbol": "PEPE",
    "name": "Pepe",
    "createdAt": "2026-01-02T12:00:00.000Z"
  }
}
```

#### DELETE /api/watchlist/:id

Remove token from watchlist.

**Response**
```json
{
  "success": true,
  "message": "Token removed from watchlist"
}
```

---

### Alerts

**All alerts endpoints require authentication.**

#### GET /api/alerts

Get user's alerts.

**Response**
```json
{
  "success": true,
  "data": [
    {
      "id": "clxxxxxxxxxx",
      "userId": "clyyyyyyyyy",
      "type": "price",
      "token": "0x4200...",
      "condition": "above",
      "value": 4000,
      "enabled": true,
      "createdAt": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/alerts

Create new alert.

**Request**
```json
{
  "type": "price",
  "token": "0x4200000000000000000000000000000000000006",
  "condition": "above",
  "value": 4000
}
```

**Alert Types**: price, risk, volume  
**Conditions**: above, below, equals

**Response** (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "clxxxxxxxxxx",
    "type": "price",
    "token": "0x4200...",
    "condition": "above",
    "value": 4000,
    "enabled": true,
    "createdAt": "2026-01-02T12:00:00.000Z"
  }
}
```

#### PATCH /api/alerts/:id

Update an alert.

**Request**
```json
{
  "enabled": false,
  "value": 5000
}
```

**Response**
```json
{
  "success": true,
  "data": { ... }
}
```

#### DELETE /api/alerts/:id

Delete an alert.

**Response**
```json
{
  "success": true,
  "message": "Alert deleted"
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE",
  "status": 400,
  "timestamp": "2026-01-02T12:00:00.000Z"
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| VALIDATION_ERROR | 400 | Invalid request data |
| INVALID_ADDRESS | 400 | Invalid wallet/token address |
| INVALID_CHAIN | 400 | Unsupported chain |
| UNAUTHORIZED | 401 | Missing or invalid token |
| INVALID_SIGNATURE | 401 | Signature verification failed |
| TOKEN_EXPIRED | 401 | JWT token expired |
| NOT_FOUND | 404 | Resource not found |
| ALREADY_EXISTS | 409 | Resource already exists |
| RATE_LIMITED | 429 | Too many requests |
| GOPLUS_ERROR | 503 | GoPlus API error |
| INTERNAL_ERROR | 500 | Server error |

---

## Rate Limits

| Endpoint | Limit | Window |
|----------|-------|--------|
| /api/auth/* | 5 | 1 minute |
| /api/scan | 10 | 1 minute |
| /api/portfolio/* | 30 | 1 minute |
| Other endpoints | 100 | 1 minute |

Rate limit headers are included in all responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Requests remaining
- `X-RateLimit-Reset`: Unix timestamp when limit resets
- `Retry-After`: Seconds to wait (only on 429)

