FROM node:14-alpine
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
# Do not rely on NODE_ENV - exists for performance reasons only
ENV NODE_ENV=production
ENV PORT=3000
# This must be built locally from the common package
COPY --from=pinscommonukscontainers3887default.azurecr.io/common:latest /opt/app ../common
ADD package.json package.json
ADD package-lock.json package-lock.json
ADD src src
ADD __tests__ __tests__
ADD jest.config.js jest.config.js

RUN npm prune --production \
  && npm rebuild \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true

RUN npm run documentation; echo $? > /npm.exitcode

EXPOSE 3000
USER node
CMD [ "npm", "start" ]
