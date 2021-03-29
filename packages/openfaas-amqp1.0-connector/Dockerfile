ARG ARCH="amd64"
FROM ${ARCH}/node:14-alpine
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
ADD dist dist
ADD node_modules node_modules
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm prune --production \
  && npm rebuild \
  && npm dedupe \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true
USER node
CMD [ "npm", "start" ]
