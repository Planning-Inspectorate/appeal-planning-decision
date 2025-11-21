# Stage 1/2: Build
FROM node:22-alpine3.22 AS build

WORKDIR /opt/packages/document-service-api

# copy app
COPY packages/document-service-api/package.json ./
COPY packages/document-service-api/src ./src

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/
COPY packages/business-rules /opt/packages/business-rules
COPY packages/common /opt/packages/common
COPY packages/database /opt/packages/database

# install from root
WORKDIR /opt
RUN npm ci --workspaces --if-present --omit=dev
RUN npm run db:generate

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/packages/document-service-api

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 4000

USER node

CMD [ "npm", "start" ]
