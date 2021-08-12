FROM node:14-alpine
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
RUN mkdir -p /opt/app/data
COPY data/lpa-trialists.json /opt/app/data/
COPY data/lpa-list.csv /opt/app/data/
ENV LPA_DATA_PATH='/opt/app/data/lpa-list.csv'
ENV LPA_TRIALIST_DATA_PATH='/opt/app/data/lpa-trialists.json'

ENV  MONGODB_AUTO_INDEX='true'
ENV  MONGODB_DB_NAME='appeals-service-api'
ENV  MONGODB_URL='mongodb://pins-uks-mongodb-9475-dev:u5K6MuXfg1SjUF2iorpYua1j8xFcvl2x566WF9aMzNZpDYw52HGrZd9djdOLGfEui7WZrnJ1l9En5n1NwgAKjA==@pins-uks-mongodb-9475-dev.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@pins-uks-mongodb-9475-dev@'
ENV DOCS_API_PATH=/opt/app/api
# Do not rely on NODE_ENV - exists for performance reasons only
ENV NODE_ENV=production
ENV SERVER_PORT=3000
# This must be built locally from the common package
COPY --from=pinscommonukscontainers3887default.azurecr.io/planninginspectorateappealplanningdecision:960-commons-image /opt/app ../common
ADD api api
ADD src src
ADD __tests__ __tests__

# ADD node_modules node_modules
ADD package.json package.json
ADD package-lock.json package-lock.json
RUN npm prune --production \
  && npm rebuild \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true
RUN npm install; npm run documentation; echo $? > /npm.exitcode
EXPOSE 3000
USER node
#VOLUME [ "data" ]
CMD [ "npm", "start" ]