FROM node:14-alpine
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
ENV DOCS_API_PATH=/opt/app/api
# Do not rely on NODE_ENV - exists for performance reasons only
ENV NODE_ENV=production
ENV SERVER_PORT=3000
# This must be built locally from the common package
COPY --from=common:latest /opt/app ../common
ADD api api
ADD src src
ADD node_modules node_modules
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm prune --production \
  && npm rebuild \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true
EXPOSE 3000
USER node
VOLUME [ "data" ]
CMD [ "npm", "start" ]
