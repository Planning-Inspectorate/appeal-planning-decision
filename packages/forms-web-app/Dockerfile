FROM node:14
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"
# Do not rely on NODE_ENV - exists for performance reasons only
ENV PORT=3000
# This must be built locally from the common package
COPY --from=pinscommonukscontainers3887default.azurecr.io/planninginspectorateappealplanningdecision:960-commons-image /opt/app ../common
COPY package*.json ./
ADD __tests__ __tests__
RUN npm i
COPY . ./

RUN npm run build
RUN npm prune --production \
  && npm rebuild \
  && npm version ${VERSION} --no-git-tag-version --allow-same-version || true

RUN npm install; npm run documentation; echo $? > /npm.exitcode
EXPOSE 3000

ENV APPEALS_SERVICE_API_URL="https://dev-appealsserviceapi.azurewebsites.net"
ENV DOCUMENTS_SERVICE_API_URL="https://documentserviceapi.azurewebsites.net"
ENV PDF_SERVICE_API_URL="https://dev-pdfserviceapi.azurewebsites.net"
ENV FILE_UPLOAD_DEBUG='false'
ENV FILE_UPLOAD_MAX_FILE_SIZE_BYTES="15000000"
ENV FILE_UPLOAD_USE_TEMP_FILES='true'
ENV FILE_UPLOAD_TMP_PATH='/tmp'
ENV GOOGLE_ANALYTICS_ID="G-TZBWMVPTHV"
ENV SESSION_MONGODB_URL='mongodb://pins-uks-mongodb-9475-dev:u5K6MuXfg1SjUF2iorpYua1j8xFcvl2x566WF9aMzNZpDYw52HGrZd9djdOLGfEui7WZrnJ1l9En5n1NwgAKjA==@pins-uks-mongodb-9475-dev.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@pins-uks-mongodb-9475-dev@/lpa-sessions'
ENV SESSION_KEY="some_secure_key_goes_here"
# please override this locally if using not using localhost or ip address to browse the site in dev.
# SUBDOMAIN_OFFSET: 0
ENV USE_SECURE_SESSION_COOKIES='false'

CMD [ "npm", "run", "start" ]

