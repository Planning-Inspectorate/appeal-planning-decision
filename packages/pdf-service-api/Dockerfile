# Stage 1/2: Build
FROM node:20 AS build

WORKDIR /puppeteer

RUN apt-get update && \
    apt-get install -y fonts-liberation gconf-service libappindicator1 \
    libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgbm-dev \
    libgdk-pixbuf2.0-0 libgtk-3-0 libicu-dev libjpeg-dev libnspr4 \
    libnss3 libpango-1.0-0 libpangocairo-1.0-0 libpng-dev libx11-6 \
    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
    libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 xdg-utils

WORKDIR /opt/packages/pdf-service-api

# copy app
COPY packages/pdf-service-api/package*.json ./
COPY packages/pdf-service-api/src ./src

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/

# install from root
WORKDIR /opt
RUN npm ci --omit=dev
RUN chmod -R o+rwx /opt/packages/pdf-service-api/node_modules/puppeteer/.local-chromium

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/packages/pdf-service-api

EXPOSE 3000

USER node

CMD ["npm", "start"]
