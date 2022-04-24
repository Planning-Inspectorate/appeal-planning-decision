# Stage 1/3: Build
FROM node:14-alpine AS build

WORKDIR /opt/app

COPY packages/common ../common
COPY packages/clamav-rest-server/package*.json ./
COPY packages/clamav-rest-server/src ./src

RUN npm i --production

# Stage 2/3: Run Tests
FROM node:14 AS test

WORKDIR /opt/app 

COPY --from=build /opt/app ./

COPY packages/clamav-rest-server/__tests__ ./__tests__
COPY packages/clamav-rest-server/jest.config.js ./jest.config.js

RUN npm run documentation; echo $? > /npm.exitcode

# Stage 3/3: App Run
FROM node:14-alpine AS app

WORKDIR /opt/app 

COPY --from=build /opt/app ./

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
