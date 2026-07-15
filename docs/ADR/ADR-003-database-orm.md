# ADR-003: Database ORM Selection

**Status:** Accepted  
**Date:** 2026-07-15  
**Authors:** Engineering Team

---

## Context

We need a database access layer that:

- Provides type-safe queries from TypeScript
- Manages schema migrations
- Supports PostgreSQL 16 features
- Is maintainable and well-documented

## Decision

Use **Prisma 5** as the ORM with the following conventions:

### Schema Conventions (to be implemented in Phase 2)

- **Primary keys:** UUID (`@default(uuid())`)
- **Column naming:** snake_case in DB (`@map("column_name")`), camelCase in TypeScript
- **Table naming:** snake_case (`@@map("table_name")`)
- **Timestamps:** `createdAt DateTime @default(now())`
- **Indexes:** `@@index([column])` on all foreign keys and frequently queried fields
- **Relations:** Explicit foreign keys with `@relation(fields: [...], references: [...])`

### Design from PROJECT_BLUEPRINT.md

```
Users (1) ─────< Registrations (Many)
  id UUID PK           id UUID PK
  name VARCHAR(100)    fullName VARCHAR(100)
  email VARCHAR(255) UK email VARCHAR(255)
  passwordHash TEXT    department VARCHAR(100)
  createdAt TIMESTAMP  createdBy UUID FK → users.id
                       createdAt TIMESTAMP
```

## Rationale

### Prisma over TypeORM

- TypeORM has frequent breaking changes and decorator-based API
- Prisma's schema-first approach generates type definitions automatically
- Prisma Migrate is more reliable than TypeORM migrations

### Prisma over Sequelize

- Sequelize has weak TypeScript support (retrofitted, not native)
- Prisma was built TypeScript-first

### UUIDs over auto-increment integers

- Safe to expose in URLs (no sequential enumeration)
- Works across distributed systems
- Consistent with industry best practices for new systems

## Consequences

**Positive:**

- Auto-generated Prisma client types align perfectly with database schema
- Migrations are version-controlled and reproducible

**Negative:**

- `prisma generate` must run after every schema change (added to CI)
- Prisma doesn't support all PostgreSQL-specific features (workaround: raw queries)

## Alternatives Considered

| Alternative             | Reason Rejected                                  |
| ----------------------- | ------------------------------------------------ |
| TypeORM                 | Brittle decorator API; weaker TypeScript support |
| Sequelize               | Retrofitted TypeScript support                   |
| Knex.js (query builder) | No type generation; manual type maintenance      |
| Raw SQL (pg)            | No migration management; no type safety          |
