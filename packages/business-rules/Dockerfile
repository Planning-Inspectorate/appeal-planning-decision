# Stage 1/3: Build
FROM node:14-alpine AS build

WORKDIR /opt/app

COPY packages/business-rules/src ./src
COPY packages/business-rules/package*.json ./

RUN npm ci --production

# Stage 2/3: Run Tests
FROM node:14 AS test

WORKDIR /opt/app 

COPY --from=build /opt/app ./

COPY packages/business-rules/test ./test
COPY packages/business-rules/jest.config.js ./jest.config.js

RUN npm run documentation; echo $? > /npm.exitcode

# Stage 3/3: Final image
FROM node:14-alpine AS app

WORKDIR /opt/app 

USER node
