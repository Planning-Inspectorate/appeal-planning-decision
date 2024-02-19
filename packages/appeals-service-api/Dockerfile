# Stage 1/2: Build
FROM node:18-alpine AS build

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

# install from root
WORKDIR /opt
RUN npm ci --omit=dev
# generate prisma client
WORKDIR /opt/packages/appeals-service-api
RUN npm run db:generate

# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/packages/appeals-service-api

EXPOSE 3000

USER node

CMD [ "npm", "start" ]
