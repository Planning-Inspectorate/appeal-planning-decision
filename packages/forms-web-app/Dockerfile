# Stage 1/2: Build
FROM node:20-alpine3.20 AS build

WORKDIR /opt/packages/forms-web-app

# copy app
COPY packages/forms-web-app/package*.json ./
COPY packages/forms-web-app/webpack*.js ./
COPY packages/forms-web-app/src ./src

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/
COPY packages/common /opt/packages/common
COPY packages/business-rules /opt/packages/business-rules

# install from root
WORKDIR /opt
RUN npm ci --workspaces --if-present

# build web
WORKDIR /opt/packages/forms-web-app
RUN npm run build

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/packages/forms-web-app

RUN npm prune --omit=dev && npm rebuild --ignore-scripts

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
