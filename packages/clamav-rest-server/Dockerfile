# Stage 1/2: Build
FROM node:18-alpine AS build


WORKDIR /opt/app

COPY packages/common ../common
COPY packages/clamav-rest-server/package*.json ./
COPY packages/clamav-rest-server/src ./src

RUN npm ci --omit=dev --workspaces=false

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/app



EXPOSE 3000

USER node

CMD [ "npm", "start" ]
