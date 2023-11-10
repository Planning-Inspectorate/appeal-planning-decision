# Stage 1/2: Build
FROM node:18-alpine AS build

WORKDIR /opt/packages/clamav-rest-server

# copy app
COPY packages/clamav-rest-server/package.json ./
COPY packages/clamav-rest-server/src ./src

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/
COPY packages/common /opt/packages/common

# install from root
WORKDIR /opt
RUN npm ci --omit=dev

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/packages/clamav-rest-server

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
