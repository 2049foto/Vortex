# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously at Vortex Protocol. If you discover a security vulnerability, please follow these steps:

### Do NOT

- Open a public GitHub issue
- Disclose the vulnerability publicly
- Exploit the vulnerability

### Do

1. **Email us directly** at security@vortex.protocol (or create a private security advisory on GitHub)
2. **Include details**:
   - Type of vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)
3. **Wait for our response** (usually within 48 hours)

## Security Measures

### Authentication
- Web3 wallet signatures with one-time nonces
- JWT tokens with 7-day expiration
- Unique token IDs (JTI) for revocation support
- Rate limiting on auth endpoints (5 req/min)

### Input Validation
- All inputs validated with Zod schemas
- Address format validation (EVM + Solana)
- Chain ID whitelist
- String length limits

### Data Protection
- No storage of private keys or seed phrases
- Parameterized database queries (Prisma)
- HTTPS-only in production
- Secure cookie settings

### API Security
- CORS whitelist (no wildcards)
- Rate limiting on all endpoints
- Request logging
- Error sanitization in production

## Bug Bounty

We currently do not have a formal bug bounty program, but we appreciate responsible disclosure and will acknowledge contributors in our security hall of fame.

## Contact

For security concerns, contact: security@vortex.protocol

