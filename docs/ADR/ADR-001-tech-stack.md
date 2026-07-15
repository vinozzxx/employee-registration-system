# ADR-001: Technology Stack Selection

**Status:** Accepted  
**Date:** 2026-07-15  
**Authors:** Engineering Team

---

## Context

The Employee Registration Management System requires a full-stack web application. We need to select a technology stack that:

- Enables rapid development with type safety
- Supports scalable REST API design
- Provides a modern, responsive frontend
- Integrates with a reliable relational database
- Is maintainable by a small to medium engineering team

## Decision

We adopt the following stack, as specified in `docs/PROJECT_BLUEPRINT.md`:

| Layer       | Technology                     | Version    |
| ----------- | ------------------------------ | ---------- |
| Frontend    | React + Vite + TypeScript      | 18 / 5 / 5 |
| Styling     | Tailwind CSS                   | 3          |
| Forms       | React Hook Form                | 7          |
| Routing     | React Router                   | 6          |
| HTTP Client | Axios                          | 1          |
| Backend     | Node.js + Express + TypeScript | 22 / 4 / 5 |
| ORM         | Prisma                         | 5          |
| Database    | PostgreSQL                     | 16         |
| Auth        | JWT + bcrypt                   | —          |
| Logging     | Pino                           | 9          |
| Validation  | Zod                            | 3          |
| API Docs    | Swagger/OpenAPI                | 3.0        |

## Rationale

### React + Vite over Next.js

- This is a **SPA** (no SSR/SSG needed for a management system)
- Vite offers significantly faster HMR than CRA
- Simpler deployment (static files + separate API)

### PostgreSQL over MySQL/MongoDB

- Relational structure fits the Users → Registrations relationship perfectly
- Strong ACID compliance required for employee data integrity
- PostgreSQL 16 adds performance improvements over earlier versions

### Prisma over TypeORM / Sequelize

- Type-safe queries generated from schema (no raw query strings)
- Migration system is first-class
- Excellent TypeScript integration (auto-generated types)

### Pino over Winston / Morgan

- Pino is the fastest Node.js logger (~5x faster than Winston)
- Structured JSON output integrates with modern log aggregators
- Low memory overhead

### Zod over Joi / class-validator

- Native TypeScript integration with type inference
- Schema types can be shared or adapted across frontend/backend
- Composable and chainable API

## Consequences

**Positive:**

- Full TypeScript end-to-end reduces runtime type errors
- Prisma auto-generates types aligned with the DB schema
- Tailwind eliminates the need for a component library in Phase 1

**Negative:**

- Prisma adds a build step (`prisma generate`) that must run after schema changes
- Vite path aliases require mirroring in tsconfig.json

## Alternatives Considered

| Alternative     | Reason Rejected                                          |
| --------------- | -------------------------------------------------------- |
| Next.js         | SSR not needed; adds unnecessary complexity              |
| MongoDB         | Schema-less doesn't suit structured employee data        |
| GraphQL         | REST is sufficient; GraphQL adds overhead for this scope |
| class-validator | Requires decorators; Zod is simpler and more composable  |
