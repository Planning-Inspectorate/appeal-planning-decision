FROM node:12-alpine as builder
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ADD . .
RUN npm ci && npm run compile
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
USER node

FROM node:12-alpine
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
COPY --from=builder /opt/app/package.json .
COPY --from=builder /opt/app/package-lock.json .
COPY --from=builder /opt/app/dist/ ./dist
COPY --from=builder /opt/app/node_modules/ ./node_modules
RUN npm prune --production
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
ENV NODE_ENV=production
ENV NODE_PORT=3000
EXPOSE 3000
CMD [ "npm", "start" ]
