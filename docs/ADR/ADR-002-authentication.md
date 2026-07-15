# ADR-002: Authentication Strategy

**Status:** Accepted  
**Date:** 2026-07-15  
**Authors:** Engineering Team

---

## Context

The system must authenticate users to protect registration data. We need a strategy that:

- Is stateless and scalable (no server-side session storage)
- Securely stores passwords
- Works with a React SPA and REST API

## Decision

Use **JWT (JSON Web Tokens)** for stateless authentication and **bcrypt** for password hashing.

### JWT Configuration

- Token signed with `HS256` algorithm
- Expiry: `7d` (configurable via `JWT_EXPIRES_IN` env var)
- Stored in `localStorage` (frontend)
- Transmitted via `Authorization: Bearer <token>` header

### Password Hashing

- bcrypt with **12 salt rounds** (balances security and performance)
- Passwords **never stored in plain text** (enforced by AppError on any attempt)

## Rationale

### JWT over sessions

- Stateless: the server doesn't need to store session data
- Scales horizontally without sticky sessions
- Works naturally with SPA + REST API architecture

### localStorage over httpOnly cookies

- Simpler implementation for this phase
- SPA can directly access the token for Axios interceptors
- **Trade-off:** Vulnerable to XSS if malicious scripts run. Mitigated by:
  - Content Security Policy headers (via Helmet)
  - Input sanitization

### bcrypt over argon2 / scrypt

- bcrypt is widely supported and battle-tested
- `@types/bcrypt` has excellent TypeScript support
- Argon2 is theoretically more secure but adds native binary dependencies

## Consequences

**Positive:**

- Simple token-based auth works well for this system scope
- bcrypt is industry standard for web applications

**Negative:**

- JWTs cannot be invalidated before expiry (logout is client-side only)
- **Future improvement:** Add token revocation via a denylist in Redis

## Alternatives Considered

| Alternative                | Reason Rejected                                             |
| -------------------------- | ----------------------------------------------------------- |
| Sessions (express-session) | Requires server state; doesn't scale without Redis          |
| OAuth2 / Passport.js       | Over-engineering for internal employee system               |
| httpOnly cookies           | More complex CSRF handling; localStorage is sufficient here |
| argon2                     | Binary dependency; bcrypt is adequate for this scale        |
