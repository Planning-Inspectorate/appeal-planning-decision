# Stage 1/2: Build
FROM node:22-alpine3.20 AS build

WORKDIR /opt/packages/auth-server

# copy app
COPY packages/auth-server/package.json ./
COPY packages/auth-server/src ./src

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/
COPY packages/common /opt/packages/common
COPY packages/database /opt/packages/database

# install from root
WORKDIR /opt
RUN npm ci --workspaces --if-present --omit=dev
# generate prisma client
WORKDIR /opt/packages/auth-server
RUN npm run db:generate

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/packages/auth-server

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
