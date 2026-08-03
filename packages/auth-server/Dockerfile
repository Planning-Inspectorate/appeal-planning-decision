# Stage 1/3: Base
FROM node:22-alpine3.24 AS base

WORKDIR /opt

# Stage 2/3: Build
FROM base AS build

WORKDIR /opt

# copy deps
COPY package*.json /opt/
COPY packages/auth-server/package.json /opt/packages/auth-server/package.json
COPY packages/common/package.json /opt/packages/common/package.json
COPY packages/database/package.json /opt/packages/database/package.json

# install from root
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --workspaces --if-present --omit=dev --ignore-scripts

# copy DB package
COPY packages/database /opt/packages/database

# generate prisma client
RUN npm run db:generate

# Stage 3/3: App Run
FROM base AS app

WORKDIR /opt

# copy dependency manifests
COPY package*.json ./
COPY packages/auth-server/package.json /opt/packages/auth-server/package.json
COPY packages/common/package.json /opt/packages/common/package.json
COPY packages/database/package.json /opt/packages/database/package.json

# install from cache, remove npm/npx from final image
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --workspaces --if-present --omit=dev --omit=optional --ignore-scripts --prefer-offline \
    &&  rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# copy source and generated database client after dependency installation
COPY --from=build /opt/packages/database ./packages/database
COPY packages/auth-server/src /opt/packages/auth-server/src
COPY packages/common/src /opt/packages/common/src

WORKDIR /opt/packages/auth-server

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

USER node

CMD [ "node", "./src/main.js" ]
