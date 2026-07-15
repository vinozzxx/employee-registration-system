# Build Stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies first (leverage Docker cache)
RUN apk add --no-cache openssl
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci

# Copy source code and build
COPY tsconfig.json ./
COPY src ./src/
RUN npm run build

# Production Stage
FROM node:22-alpine

WORKDIR /app

# Install openssl for Prisma
RUN apk add --no-cache openssl

# Only copy the built artifacts and package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Install ONLY production dependencies
RUN npm ci --only=production

# Generate Prisma Client for production
RUN npx prisma generate

# Expose port 5000
EXPOSE 5000

# Health check to ensure the API is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/api/auth/login || exit 1

# Start the server (will run prisma migrate implicitly or via entrypoint, but here we just start)
CMD ["node", "dist/server.js"]
