# Employee Registration Management System (ERMS)

![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

An enterprise-grade, production-ready system for HR administrators to manage employee registrations. Built with a focus on Clean Architecture, Security, and Scalability.

## 🚀 Features

- **Authentication:** Secure JWT-based auth with Bcrypt password hashing.
- **Tenant Isolation:** Users can only view and manage registrations they created.
- **Dashboard UI:** Modern React frontend with Shadcn UI, TanStack Query, and pagination.
- **Performance:** B-Tree indexed PostgreSQL tables for rapid searches.
- **Resilience:** Rate limiting to prevent brute force, centralized error handling.
- **Containerized:** Multi-stage Dockerfiles for seamless production deployments.

## 🏗 Architecture

The system strictly follows Clean Architecture principles:

```mermaid
graph TD
    subgraph Frontend [React SPA]
        Pages --> Components
        Components --> Hooks
        Hooks --> Services[Axios API Client]
    end

    subgraph Backend [Node.js / Express API]
        Router[API Routes] --> Controller[Thin Controllers]
        Controller --> Service[Business Logic]
        Service --> Repository[Data Access Layer]
        Repository --> Prisma[Prisma ORM]
    end

    subgraph Database [PostgreSQL]
        Prisma --> DB[(Employee DB)]
    end

    Frontend -- HTTP/JSON (JWT) --> Backend
```

### Design Decisions

- **Repository Pattern:** Isolates database queries from business logic.
- **TanStack Query:** Manages server state on the frontend, ensuring cache invalidation and loading states are handled out-of-the-box.
- **JWT in localStorage:** Trade-off chosen for ease of frontend integration without needing a backend-for-frontend (BFF) to handle cookies. Mitigated against XSS via strict input validation and React's DOM auto-escaping.
- **Zod Validation:** Guarantees runtime type safety at the API boundaries (both Express and React Hook Form).

## 🛠 Technology Stack

**Frontend:** React 18, Vite, TypeScript, Tailwind CSS, Shadcn UI, React Query.
**Backend:** Node.js 22, Express, TypeScript, Zod, Pino.
**Database:** PostgreSQL 16, Prisma ORM.
**DevOps:** Docker, Docker Compose, Vitest, Husky.

## 🗃 Database Schema

```mermaid
erDiagram
    User {
        String id PK
        String name
        String email UK
        String passwordHash
        DateTime createdAt
        DateTime updatedAt
    }
    Registration {
        String id PK
        String fullName "Indexed"
        String email UK
        String department "Indexed"
        String createdBy FK
        DateTime createdAt
        DateTime updatedAt
    }
    User ||--o{ Registration : creates
```

## 🔐 Security Considerations

- **Rate Limiting:** `express-rate-limit` secures auth routes against brute-force attacks.
- **Password Storage:** Bcrypt hashing (factor 12) prevents rainbow table attacks.
- **Data Isolation:** `createdBy` foreign keys are strictly enforced at the backend service layer using the authenticated user's ID.
- **Payload Limits:** Request sizes are limited to 10MB to prevent DoS via large payloads.
- **Helmet:** Sets HTTP response headers to defend against common web vulnerabilities (XSS, Clickjacking).

## 📡 Observability & Logging Strategy

- **Tool:** Pino (lightweight, high-performance JSON logger).
- **Request Logging:** Successful requests and handled client errors (4xx) are logged at `info` and `warn` levels.
- **Error Logging:** Unhandled exceptions and 500s are logged at `error` level with full stack traces.
- **Audit Logging:** Auth events (login, signup) and destructive actions (deletes) include the `userId` for traceability.
- **Redaction:** **NEVER log passwords, JWTs, or environment variables.**

## 💻 Local Development Setup

### Prerequisites

- Node.js >= 20.x
- Docker & Docker Compose

### 1. Environment Variables

Create `.env` files in both `frontend` and `backend`:

```bash
# backend/.env
DATABASE_URL="postgresql://admin:adminpassword@localhost:5433/employee_registration?schema=public"
JWT_SECRET="dev_secret_key"
PORT=5000

# frontend/.env
VITE_API_URL="http://localhost:5000"
```

### 2. Start the Database

```bash
docker compose up -d erms-db
cd backend && npx prisma db push
```

### 3. Run Development Servers

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

## 🐳 Production Deployment

Run the entire system in isolated production containers:

```bash
docker compose build
docker compose up -d
```

- Frontend: `http://localhost:80`
- Backend: `http://localhost:5000`
- Database: `localhost:5433`

## 🧪 Testing

Both backend and frontend are tested using Vitest and React Testing Library.

```bash
# Run backend tests
cd backend && npm run test

# Run frontend tests
cd frontend && npm run test
```
