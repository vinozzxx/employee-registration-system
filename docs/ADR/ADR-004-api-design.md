# ADR-004: API Design

**Status:** Accepted  
**Date:** 2026-07-15  
**Authors:** Engineering Team

---

## Context

We need to define the API design contract between the frontend and backend, covering:

- URL structure and naming conventions
- HTTP method usage
- Response format
- Error handling
- Documentation

## Decision

Use **REST** with a standardized JSON response envelope.

### Endpoints (from PROJECT_BLUEPRINT.md)

| Method | Path                     | Auth | Purpose               |
| ------ | ------------------------ | ---- | --------------------- |
| POST   | `/api/auth/signup`       | No   | Create account        |
| POST   | `/api/auth/login`        | No   | Login and receive JWT |
| GET    | `/api/registrations`     | Yes  | List registrations    |
| POST   | `/api/registrations`     | Yes  | Create registration   |
| DELETE | `/api/registrations/:id` | Yes  | Delete registration   |

### URL Conventions

- Prefix: `/api`
- Plural nouns: `/registrations`, `/users`
- No verbs in URLs (`/api/auth/login` not `/api/loginUser`)
- Lowercase and hyphenated (kebab-case)

### Standardized Response Envelope

Every response (success and error) follows this shape:

```json
{
  "success": true | false,
  "message": "Human-readable message",
  "data": { ... } | null,
  "statusCode": 200,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### HTTP Status Code Usage

- `200` — GET success, DELETE success
- `201` — POST (resource created)
- `400` — Bad request / malformed input
- `401` — Missing or invalid JWT
- `403` — Authenticated but not authorized
- `404` — Resource not found
- `422` — Validation error (Zod schema failed)
- `500` — Unexpected server error

### Documentation

Swagger/OpenAPI 3.0 spec, accessible at `/api-docs` in development.

## Rationale

### REST over GraphQL

- GraphQL adds significant complexity for 5 endpoints
- REST is simpler to cache, document, and test
- Postman collections cover REST naturally

### Standardized envelope over ad-hoc responses

- Frontend can always check `response.data.success` without per-endpoint parsing
- Error handling in Axios interceptors becomes uniform
- Swagger schema reuse is easier with a fixed shape

### `/api` prefix

- Allows Nginx to proxy frontend and backend from the same domain in Phase 7
- Separates API routes from static file routes cleanly

## Consequences

**Positive:**

- Frontend and backend agree on a strict contract
- Swagger UI serves as living documentation
- Uniform error handling reduces frontend defensive code

**Negative:**

- Response envelope adds minimal overhead per request
- `422` vs `400` distinction requires discipline in controllers

## Alternatives Considered

| Alternative            | Reason Rejected                               |
| ---------------------- | --------------------------------------------- |
| GraphQL                | Over-engineering for 5 endpoints              |
| JSON:API spec          | Too verbose and opinionated for this scale    |
| Ad-hoc response shapes | Leads to inconsistent frontend error handling |
