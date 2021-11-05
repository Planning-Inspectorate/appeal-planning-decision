FROM node:14-alpine

WORKDIR /opt/app

ADD src src
ADD package.json package.json
ADD package-lock.json package-lock.json
ADD jest.config.js jest.config.js

RUN npm ci --production
RUN npm run documentation; echo $? > /npm.exitcode

USER node
