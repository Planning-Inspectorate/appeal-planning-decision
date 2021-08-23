FROM node:14-alpine
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
ENV SERVER_PORT=3009
ADD node_modules node_modules
ADD package.json package.json
ADD package-lock.json package-lock.json
ADD src src
# This must be built locally from the common package
COPY --from=common:latest /opt/app ../common
RUN npm prune --production \
  && npm rebuild \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true
EXPOSE 3009
USER node
CMD [ "npm", "start" ]
