FROM node:20-alpine AS base

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy application code
COPY . .

# Build standalone application
RUN pnpm build
RUN cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

FROM node:20-alpine AS release

WORKDIR /app

# Copy standalone build
COPY --from=base /app/.next/standalone ./
COPY --from=base /app/.next/static ./.next/static
COPY --from=base /app/public ./public

ENV PORT 3000
ENV NODE_ENV production

EXPOSE 3000

# Start the application
CMD ["node", "server.js"]