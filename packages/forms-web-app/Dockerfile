# Stage 1/3: Base
FROM node:22-alpine3.24 AS base

# Stage 2/3: Build
FROM base AS build

WORKDIR /opt

# copy deps
COPY package*.json /opt/
COPY packages/forms-web-app/package.json /opt/packages/forms-web-app/package.json

# install from root
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --workspaces --if-present --include=dev --ignore-scripts

WORKDIR /opt/packages/forms-web-app

# copy required src for web build
COPY packages/forms-web-app/webpack*.js ./
COPY packages/forms-web-app/src ./src

# build web
RUN npm run build

# Stage 3/3: App Run
FROM base AS app

WORKDIR /opt

# copy dependency manifests
COPY package*.json /opt/
COPY packages/forms-web-app/package.json /opt/packages/forms-web-app/package.json
COPY packages/business-rules/package.json /opt/packages/business-rules/package.json
COPY packages/common/package.json /opt/packages/common/package.json
COPY packages/dynamic-forms/package.json /opt/packages/dynamic-forms/package.json

# install from cache, remove npm/npx from final image
RUN --mount=type=cache,target=/root/.npm,sharing=locked \
    npm ci --workspaces --if-present --omit=dev --omit=optional --ignore-scripts --prefer-offline \
    &&  rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

# copy built web app and shared source after dependency installation
COPY --from=build /opt/packages/forms-web-app/dist /opt/packages/forms-web-app/dist
COPY packages/business-rules/src /opt/packages/business-rules/src
COPY packages/common/src /opt/packages/common/src
COPY packages/dynamic-forms/src /opt/packages/dynamic-forms/src

WORKDIR /opt/packages/forms-web-app

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

USER node

CMD [ "node", "--conditions=production", "./dist/server.js" ]
