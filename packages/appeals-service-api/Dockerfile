# Stage 1/3: Build
FROM node:14-alpine AS build

WORKDIR /opt/app 

COPY packages/common ../common
COPY packages/common ../business-rules
COPY packages/appeals-service-api/package*.json ./
COPY packages/appeals-service-api/data/lpa-trialists.json ./data/lpa-trialists.json
COPY packages/appeals-service-api/data/lpa-list.csv ./data/lpa-list.csv
COPY packages/appeals-service-api/api ./api
COPY packages/appeals-service-api/src ./src

RUN npm i --production

# Stage 2/3: Run Tests
FROM node:14 AS test

WORKDIR /opt/app 

COPY --from=build /opt/app ./

COPY packages/appeals-service-api/__tests__ ./__tests__
COPY packages/appeals-service-api/jest.config.js ./jest.config.js
COPY packages/appeals-service-api/jest-mongodb-config.js ./jest-mongodb-config.js

RUN npm run documentation; echo $? > /npm.exitcode

# Stage 3/3: App Run
FROM node:14-alpine AS app

WORKDIR /opt/app 

COPY --from=build /opt/app ./

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
