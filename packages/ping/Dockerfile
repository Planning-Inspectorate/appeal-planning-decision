FROM node:14
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
ENV SERVER_PORT=3000
# Do not rely on NODE_ENV - exists for performance reasons only
ENV NODE_ENV=production
ADD . .
# Install cURL for debugging
RUN apk add --no-cache curl
RUN npm ci --production \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true
EXPOSE 3000
USER node
CMD [ "npm", "start" ]
