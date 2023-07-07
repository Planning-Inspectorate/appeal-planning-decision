# Stage 1/2: Build
FROM node:18-alpine AS build


WORKDIR /opt/app

COPY packages/common ../common
COPY packages/document-service-api/package*.json ./
COPY packages/document-service-api/src ./src

RUN npm ci --omit=dev --workspaces=false

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/app



EXPOSE 4000

USER node

CMD [ "npm", "start" ]
