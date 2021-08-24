FROM node:14
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
ENV GOTENBURG_URL="http://gotenberg:4000"
# This must be built locally from the common package
COPY --from=pinscommonukscontainers3887default.azurecr.io/planninginspectorateappealplanningdecision:960-commons-image /opt/app ../common
ADD api api
ADD src src
ADD package.json package.json
ADD package-lock.json package-lock.json
ADD __tests__ __tests__
ADD jest.config.js jest.config.js

RUN npm ci
RUN npm prune --production \
  && npm rebuild \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true

RUN npm run documentation; echo $? > /npm.exitcode

EXPOSE 3000
USER node
#VOLUME [ "data" ]
CMD [ "npm", "start" ]
