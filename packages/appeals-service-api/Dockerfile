# Stage 1/2: Build
FROM node:22-alpine3.22 AS build

WORKDIR /opt/packages/appeals-service-api

# copy app
COPY packages/appeals-service-api/package.json ./
COPY packages/appeals-service-api/data/lpa-trialists.json ./data/lpa-trialists.json
COPY packages/appeals-service-api/data/lpa-list.csv ./data/lpa-list.csv
COPY packages/appeals-service-api/api ./api
COPY packages/appeals-service-api/src ./src

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/
COPY packages/common /opt/packages/common
COPY packages/business-rules /opt/packages/business-rules
COPY packages/database /opt/packages/database
COPY packages/dynamic-forms /opt/packages/dynamic-forms

# install from root
WORKDIR /opt
RUN npm ci --workspaces --if-present --omit=dev
# generate prisma client
WORKDIR /opt/packages/appeals-service-api
RUN npm run db:generate

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/packages/appeals-service-api

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
