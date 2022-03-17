
FROM node:14

ARG VERSION
ENV VERSION="${VERSION}"

WORKDIR /opt/app

RUN mkdir -p /opt/app/data

COPY data/lpa-trialists.json /opt/app/data/
COPY data/lpa-list.csv /opt/app/data/

# This must be built locally from the common package
COPY --from=pinscrsharedtoolinguks.azurecr.io/appeal-planning-decision/common:latest /opt/app ../common
COPY --from=pinscrsharedtoolinguks.azurecr.io/appeal-planning-decision/business-rules:latest /opt/app ../business-rules

ADD api api
ADD src src
ADD __tests__ __tests__
ADD jest.config.js jest.config.js
ADD data data
ADD package.json package.json
ADD package-lock.json package-lock.json

RUN npm i --production
RUN npm run documentation; echo $? > /npm.exitcode

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
