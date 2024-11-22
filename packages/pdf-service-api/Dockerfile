# Stage 1/3: Build
FROM ghcr.io/puppeteer/puppeteer:23.9.0 AS base

# Stage 2/3: Build app
FROM base AS build

USER root

WORKDIR /opt/packages/pdf-service-api

# copy app
COPY packages/pdf-service-api/package*.json ./
COPY packages/pdf-service-api/src ./src

# copy workspace deps
COPY package.json package-lock.json /opt/

# install from root
WORKDIR /opt
RUN npm ci --workspaces --if-present --omit=dev

# Stage 3/3: App Run
FROM build AS app

# use puppeteer user
USER pptruser

WORKDIR /opt/packages/pdf-service-api

EXPOSE 3000

USER node

CMD ["npm", "start"]
