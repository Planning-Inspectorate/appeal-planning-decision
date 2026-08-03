# Stage 1/3: Base
FROM node:22-alpine3.24 AS base

# add chromium
RUN apk add --no-cache \
    chromium \
    freetype \
    harfbuzz \
    ttf-freefont
# perhaps needed if we do web requests?
# ca-certificates \
# nss \

# Stage 2/3: Build
FROM base AS build

WORKDIR /opt

# Copy deps
COPY packages/pdf-service-api/package.json ./packages/pdf-service-api/package.json
COPY package*.json ./

# Install
RUN npm ci --workspaces --if-present --omit=dev --ignore-scripts

# Copy app
WORKDIR /opt/packages/pdf-service-api
COPY packages/pdf-service-api/src ./src

# Stage 3/3: App Run
FROM base AS app

WORKDIR /opt

COPY --from=build /opt/node_modules ./node_modules
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

