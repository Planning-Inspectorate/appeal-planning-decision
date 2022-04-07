FROM node:14
ARG APP_NAME
ARG BUILD_ID
ARG VERSION
WORKDIR /opt/app
ENV APP_NAME="${APP_NAME}"
ENV BUILD_ID="${BUILD_ID}"
ENV VERSION="${VERSION}"

# This must be built locally from the common package
COPY ../common ../common
ADD src src
ADD test test
ADD jest.config.js jest.config.js

ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm i

RUN npm run documentation; echo $? > /npm.exitcode

EXPOSE 4000
USER node
CMD [ "npm", "start" ]
