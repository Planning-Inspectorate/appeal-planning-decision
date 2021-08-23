FROM node:14
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ENV APP_NAME=“${APP_NAME}”
ENV BUILD_ID=“${BUILD_ID}”
ENV VERSION=“${VERSION}”
# Do not rely on NODE_ENV - exists for performance reasons only
ENV NODE_ENV=production
ENV PORT=3000
# This must be built locally from the common package
COPY --from=pinscommonukscontainers3887default.azurecr.io/planninginspectorateappealplanningdecision:960-commons-image /opt/app ../common
#ADD dist dist
#ADD node_modules node_modules
ADD src src
ADD __tests__ __tests__
ADD package.json package.json
ADD package-lock.json package-lock.json
#RUN npm i --production
RUN npm i
RUN npm run build
RUN npm prune --production \
  && npm rebuild \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true
ENV ALLOW_APPEAL_REPLY_CREATE=“true”
ENV APPEALS_SERVICE_API_URL=“https://appeals-service-api.azurewebsites.net”
ENV PDF_SERVICE_API_URL=“https://dev-pdfserviceapi.azurewebsites.net”
ENV APPEAL_REPLY_SERVICE_API_URL=“https://dev-appealsreplyserviceapi.azurewebsites.net”
ENV DOCUMENTS_SERVICE_API_URL=“https://documentserviceapi.azurewebsites.net”
ENV FILE_UPLOAD_DEBUG=“false”
ENV FILE_UPLOAD_MAX_FILE_SIZE_BYTES=“15000000“
ENV FILE_UPLOAD_USE_TEMP_FILES=“true”
ENV FILE_UPLOAD_TMP_PATH=“/tmp”
#ENV SESSION_MONGODB_URL: mongodb://mongodb:27017/lpa-sessions’
ENV SESSION_MONGODB_URL=“mongodb://pins-uks-mongodb-9475-dev:u5K6MuXfg1SjUF2iorpYua1j8xFcvl2x566WF9aMzNZpDYw52HGrZd9djdOLGfEui7WZrnJ1l9En5n1NwgAKjA==@pins-uks-mongodb-9475-dev.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@pins-uks-mongodb-9475-dev@”
ENV SESSION_KEY=“some_secure_key_goes_here”
ENV USE_SECURE_SESSION_COOKIES=“false”
#RUN npm prune --production
#  && npm rebuild \
#  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true

RUN npm install; npm run documentation; echo $? > /npm.exitcode

EXPOSE 3000
USER node
CMD ["npm", "run", "start" ]
#CMD [ “npm”,“run”,“start” ]

