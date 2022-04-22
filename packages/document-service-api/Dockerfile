# Stage 1/3: Build
FROM node:14-alpine AS build

WORKDIR /opt/app

COPY packages/common ../common
COPY packages/document-service-api/package*.json ./
COPY packages/document-service-api/src ./src

RUN npm i --production

# Stage 2/3: Run Tests
FROM node:14 AS test

WORKDIR /opt/app 

COPY --from=build /opt/app ./

COPY packages/document-service-api/test ./test
COPY packages/document-service-api/jest.config.js ./jest.config.js

RUN npm run documentation; echo $? > /npm.exitcode

# Stage 3/3: App Run
FROM node:14-alpine AS app

WORKDIR /opt/app 

COPY --from=build /opt/app ./

EXPOSE 4000

USER node

CMD [ "npm", "start" ]
