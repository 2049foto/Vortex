# Vortex Protocol - Testing Guide

## Overview

Vortex Protocol uses a comprehensive testing strategy with unit, integration, and E2E tests.

**Target Coverage**: 80%+

## Backend Tests (Bun Test)

### Running Tests

```bash
cd packages/backend

# Run all tests
bun test

# Run with coverage
bun test --coverage

# Run specific file
bun test tests/unit/jwt.test.ts

# Run tests matching pattern
bun test --grep "JWT"

# Watch mode
bun test --watch
```

### Test Structure

```
packages/backend/tests/
├── unit/
│   ├── jwt.test.ts           # JWT generation/verification
│   ├── signature.test.ts     # Web3 signature verification
│   ├── validators.test.ts    # Zod schema tests
│   ├── scanner.test.ts       # Token scanner logic
│   └── cache.test.ts         # Redis cache tests
│
├── integration/
│   ├── auth.integration.test.ts      # Full auth flow
│   ├── scan.integration.test.ts      # Scan endpoint
│   ├── watchlist.integration.test.ts # CRUD operations
│   └── alerts.integration.test.ts    # Alert management
│
└── setup.ts                  # Test configuration
```

### Unit Test Examples

```typescript
// tests/unit/jwt.test.ts
import { describe, it, expect, beforeAll } from 'bun:test';
import { generateJWT, verifyJWT } from '../../src/lib/auth/jwt';

describe('JWT', () => {
  it('should generate a valid token', async () => {
    const token = await generateJWT('user-123', '0x1234...');
    expect(token).toBeDefined();
    expect(token.split('.')).toHaveLength(3);
  });

  it('should verify a valid token', async () => {
    const token = await generateJWT('user-123', '0x1234...');
    const payload = await verifyJWT(token);
    
    expect(payload).not.toBeNull();
    expect(payload?.userId).toBe('user-123');
  });

  it('should reject expired token', async () => {
    // Create token that's already expired
    const payload = await verifyJWT('expired.token.here');
    expect(payload).toBeNull();
  });
});
```

### Integration Test Examples

```typescript
// tests/integration/auth.integration.test.ts
import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { app } from '../../src/server';

describe('Auth Flow', () => {
  let testAddress = '0x1234567890abcdef1234567890abcdef12345678';
  
  it('should return signing message', async () => {
    const res = await app.request('/api/auth/message', {
      method: 'POST',
      body: JSON.stringify({ address: testAddress }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.message).toContain(testAddress);
    expect(data.data.nonce).toBeDefined();
  });

  it('should reject invalid address', async () => {
    const res = await app.request('/api/auth/message', {
      method: 'POST',
      body: JSON.stringify({ address: 'invalid' }),
      headers: { 'Content-Type': 'application/json' },
    });
    
    expect(res.status).toBe(400);
  });
});
```

### Mocking External Services

```typescript
// tests/mocks/goplus.ts
import { mock } from 'bun:test';

export const mockGoPlusResponse = {
  code: 1,
  message: 'OK',
  result: {
    '0x1234...': {
      is_honeypot: '0',
      is_open_source: '1',
      can_take_back_ownership: '0',
    },
  },
};

// In test file
import { mockGoPlusResponse } from '../mocks/goplus';

mock.module('../../src/lib/scanner/goplusClient', () => ({
  scanTokenSecurity: async () => mockGoPlusResponse,
}));
```

## Frontend Tests (Vitest)

### Running Tests

```bash
cd packages/frontend

# Run all tests
bun test run

# Run with coverage
bun test run --coverage

# Watch mode
bun test

# UI mode
bun test --ui
```

### Test Structure

```
packages/frontend/tests/
├── unit/
│   ├── hooks/
│   │   ├── useAuth.test.tsx
│   │   └── useApi.test.tsx
│   ├── stores/
│   │   ├── auth.test.ts
│   │   └── portfolio.test.ts
│   └── lib/
│       ├── format.test.ts
│       └── validators.test.ts
│
├── integration/
│   ├── Scanner.test.tsx
│   ├── Portfolio.test.tsx
│   └── Watchlist.test.tsx
│
└── setup.ts
```

### Component Test Examples

```typescript
// tests/integration/Scanner.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TokenScanner } from '../../src/components/features/TokenScanner';

describe('TokenScanner', () => {
  it('renders input and button', () => {
    render(<TokenScanner />);
    
    expect(screen.getByPlaceholderText(/token address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /scan/i })).toBeInTheDocument();
  });

  it('shows loading state during scan', async () => {
    render(<TokenScanner />);
    
    const input = screen.getByPlaceholderText(/token address/i);
    const button = screen.getByRole('button', { name: /scan/i });
    
    fireEvent.change(input, { target: { value: '0x1234...' } });
    fireEvent.click(button);
    
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('displays risk score after scan', async () => {
    render(<TokenScanner />);
    
    // ... trigger scan ...
    
    await waitFor(() => {
      expect(screen.getByText(/risk score/i)).toBeInTheDocument();
    });
  });
});
```

### Hook Test Examples

```typescript
// tests/unit/hooks/useAuth.test.tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../../src/stores/auth';

describe('useAuthStore', () => {
  beforeEach(() => {
    useAuthStore.setState({ isAuthenticated: false, user: null });
    localStorage.clear();
  });

  it('initial state is unauthenticated', () => {
    const { result } = renderHook(() => useAuthStore());
    
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('login sets user and token', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.login('test-token', { id: '123', walletAddress: '0x...' });
    });
    
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.id).toBe('123');
  });
});
```

## E2E Tests (Playwright)

### Running Tests

```bash
cd packages/frontend

# Install browsers (first time)
bunx playwright install

# Run all E2E tests
bunx playwright test

# Run with UI
bunx playwright test --ui

# Run specific test
bunx playwright test auth.spec.ts

# Run in headed mode
bunx playwright test --headed
```

### Test Structure

```
packages/frontend/tests/e2e/
├── auth.spec.ts        # Authentication flows
├── scanner.spec.ts     # Token scanning
├── watchlist.spec.ts   # Watchlist management
├── portfolio.spec.ts   # Portfolio display
└── mobile.spec.ts      # Mobile responsiveness
```

### E2E Test Examples

```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show connect wallet button on home', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByRole('button', { name: /connect wallet/i })).toBeVisible();
  });

  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('button', { name: /connect wallet/i })).toBeVisible();
  });

  test('should show dashboard after login', async ({ page }) => {
    // Mock wallet connection
    await page.goto('/');
    
    // ... wallet connection steps ...
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByTestId('dashboard-header')).toBeVisible();
  });
});

test.describe('Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.goto('/');
    
    await expect(page.getByTestId('mobile-menu-button')).toBeVisible();
    await expect(page.getByTestId('desktop-nav')).not.toBeVisible();
  });

  test('touch targets should be at least 44x44px', async ({ page }) => {
    await page.goto('/');
    
    const buttons = await page.getByRole('button').all();
    
    for (const button of buttons) {
      const box = await button.boundingBox();
      expect(box?.width).toBeGreaterThanOrEqual(44);
      expect(box?.height).toBeGreaterThanOrEqual(44);
    }
  });
});
```

## Test Configuration

### Backend (bunfig.toml)

```toml
[test]
preload = ["./tests/setup.ts"]
coverage = true
coverageReporter = ["text", "lcov"]
```

### Frontend (vitest.config.ts)

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: ['node_modules', 'tests'],
    },
  },
});
```

### Playwright (playwright.config.ts)

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'] } },
  ],
  webServer: {
    command: 'bun run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Best Practices

### Do
- Test behavior, not implementation
- Use descriptive test names
- Keep tests independent
- Mock external services
- Test edge cases and error paths

### Don't
- Use `.only` or `.skip` in committed code
- Test private implementation details
- Write flaky tests
- Ignore failing tests
- Mix unit and integration concerns

