# Stage 1/3: base image and deps
FROM node:20 AS base

WORKDIR /puppeteer

RUN apt-get update && \
    apt-get install -y fonts-liberation gconf-service libappindicator1 \
    libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgbm-dev \
    libgdk-pixbuf2.0-0 libgtk-3-0 libicu-dev libjpeg-dev libnspr4 \
    libnss3 libpango-1.0-0 libpangocairo-1.0-0 libpng-dev libx11-6 \
    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
    libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 xdg-utils

# Stage 2/3: node deps
FROM base AS build

WORKDIR /opt/packages/pdf-service-api

# copy deps
COPY packages/pdf-service-api/package*.json ./
COPY package*.json /opt/

# install
WORKDIR /opt
RUN npm ci --workspaces --if-present --omit=dev
RUN chmod -R o+rwx ./node_modules/puppeteer/.local-chromium

# Stage 3/3
FROM build AS app
WORKDIR /opt/packages/pdf-service-api
COPY packages/pdf-service-api/src ./src

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

USER node

CMD ["npm", "start"]
