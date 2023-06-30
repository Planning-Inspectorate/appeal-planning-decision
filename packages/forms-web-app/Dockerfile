# Stage 1/2: Build
FROM node:18-alpine AS build


WORKDIR /opt/app

COPY packages/common ../common
COPY packages/business-rules ../business-rules

COPY packages/forms-web-app/package*.json ./
COPY packages/forms-web-app/webpack*.js ./
COPY packages/forms-web-app/src ./src
COPY packages/forms-web-app/patches ./patches

RUN npm ci
RUN npm run build

# Stage 2/2: App Run
FROM node:18-alpine AS app

WORKDIR /opt/app

COPY --from=build /opt/app ./
COPY --from=build /opt/common ../common
COPY --from=build /opt/business-rules ../business-rules

RUN npm prune --omit=dev && npm rebuild --ignore-scripts

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
