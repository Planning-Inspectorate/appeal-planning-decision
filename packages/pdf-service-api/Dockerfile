# Stage 1/3: Build
FROM node:14 AS build

WORKDIR /puppeteer
RUN apt-get update && \
    apt-get install -y fonts-liberation gconf-service libappindicator1 \
    libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgbm-dev \
    libgdk-pixbuf2.0-0 libgtk-3-0 libicu-dev libjpeg-dev libnspr4 \
    libnss3 libpango-1.0-0 libpangocairo-1.0-0 libpng-dev libx11-6 \
    libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 \
    libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 xdg-utils

WORKDIR /opt/app

COPY packages/pdf-service-api/package*.json ./
COPY packages/pdf-service-api/src ./src

RUN npm i --production
RUN chmod -R o+rwx node_modules/puppeteer/.local-chromium

# Stage 2/3: Run Tests
FROM node:14-alpine AS test

WORKDIR /opt/app 

COPY --from=build /opt/app ./

COPY packages/pdf-service-api/test ./test
COPY packages/pdf-service-api/jest.config.js ./jest.config.js

RUN npm run documentation; echo $? > /npm.exitcode

# Stage 3/3: App Run
FROM node:14-alpine AS app

WORKDIR /opt/app 

COPY --from=build /opt/app ./

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
