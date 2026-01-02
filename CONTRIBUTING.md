# Contributing to Vortex Protocol

Thank you for your interest in contributing to Vortex Protocol! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and constructive. We're all here to build something great together.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) v1.2+
- [Git](https://git-scm.com/)
- PostgreSQL database
- Redis instance

### Setup

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/yourusername/vortex.git
   cd vortex
   ```
3. Install dependencies:
   ```bash
   bun install
   ```
4. Copy environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```
5. Setup database:
   ```bash
   cd packages/backend
   bunx prisma migrate dev
   bun run db:seed
   ```
6. Start development:
   ```bash
   bun run dev
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Tests

Example: `feature/add-token-alerts`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat(scanner): add Solana token support`
- `fix(auth): handle expired nonce error`
- `docs(api): update endpoint documentation`

### Code Style

- TypeScript strict mode
- No `any` types
- No `console.log` in production code
- Use the logger for logging
- Zod for input validation
- Prisma for database queries

### Testing

Write tests for:
- All new features
- Bug fixes (regression tests)
- Edge cases

Run tests:
```bash
cd packages/backend
bun test
```

### Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests
4. Ensure all tests pass
5. Update documentation if needed
6. Create a pull request

### PR Checklist

- [ ] Tests pass locally
- [ ] No TypeScript errors
- [ ] No linter errors
- [ ] Documentation updated
- [ ] Changelog updated (for features)

## Project Structure

```
vortex/
├── packages/
│   ├── frontend/    # React app
│   └── backend/     # Hono API
├── docs/            # Documentation
└── .github/         # GitHub config
```

## Questions?

Open a discussion on GitHub or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

