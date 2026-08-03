# syntax=docker/dockerfile:1

# Stage 1/3: Base
FROM node:22-alpine3.24 AS base

# Stage 2/3: Dependencies
FROM base AS deps

WORKDIR /opt

# Copy deps
COPY packages/pdf-service-api/package.json ./packages/pdf-service-api/package.json
COPY package*.json ./

# Install
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --workspaces --if-present --omit=dev --ignore-scripts

# Stage 3/3: App Run
FROM base AS app

WORKDIR /opt

RUN apk add --no-cache \
    chromium \
    freetype \
    harfbuzz \
    ttf-freefont

COPY --from=deps /opt/node_modules ./node_modules
COPY package*.json ./
COPY packages/pdf-service-api/package.json ./packages/pdf-service-api/package.json
COPY packages/pdf-service-api/src ./packages/pdf-service-api/src

# remove npm/npx from final image
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

WORKDIR /opt/packages/pdf-service-api

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

USER node

CMD ["node", "./src/main.js"]
