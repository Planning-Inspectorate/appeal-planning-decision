FROM ubuntu:14.04 AS build
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_14.x | sudo bash -
RUN apt-get install --yes --force-yes nodejs
RUN apt-get install --yes --force-yes build-essential
COPY --from=pinscommonukscontainers3887default.azurecr.io/common:latest /opt/app ../common
COPY package*.json ./
RUN npm i
COPY . ./
RUN npm run build

FROM ubuntu:14.04 AS dependencies
RUN apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_14.x | sudo bash -
RUN apt-get install --yes --force-yes nodejs
RUN apt-get install --yes --force-yes build-essential
COPY package*.json ./
RUN npm i --only=production

FROM node:12.18.1-alpine3.11 AS release
COPY --from=pinscommonukscontainers3887default.azurecr.io/common:latest /opt/app ../app/common
COPY --from=build /dist /app
COPY --from=dependencies /node_modules /app/node_modules
WORKDIR /app
ENV NODE_ENV=production
RUN npm run documentation; echo $? > /npm.exitcode
CMD ["node", "server.js"]

