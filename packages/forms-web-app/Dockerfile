# Stage 1/2: Build
FROM node:18-alpine AS build

WORKDIR /opt/packages/forms-web-app

# copy app
COPY packages/forms-web-app/package*.json ./
COPY packages/forms-web-app/webpack*.js ./
COPY packages/forms-web-app/src ./src

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/
COPY patches /opt/patches
COPY packages/common /opt/packages/common
COPY packages/business-rules /opt/packages/business-rules
COPY packages/database /opt/packages/database

# install from root
WORKDIR /opt
RUN npm ci

# build web
WORKDIR /opt/packages/forms-web-app
RUN npm run build

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/packages/forms-web-app

RUN npm prune --omit=dev && npm rebuild --ignore-scripts

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
