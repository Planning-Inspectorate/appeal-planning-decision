FROM node:14

WORKDIR /opt/app

# This must be built locally from the common package
COPY --from=pinscrsharedtoolinguks.azurecr.io/appeal-planning-decision/common:latest /opt/app ../common

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
