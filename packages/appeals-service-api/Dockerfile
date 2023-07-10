# Stage 1/2: Build
FROM node:18-alpine AS build


WORKDIR /opt/app

COPY packages/common ../common
RUN cd ../common && npm ci --workspaces=false
COPY packages/business-rules ../business-rules
RUN cd ../business-rules && npm ci --workspaces=false

RUN cd ../app
COPY packages/appeals-service-api/package*.json ./
COPY packages/appeals-service-api/data/lpa-trialists.json ./data/lpa-trialists.json
COPY packages/appeals-service-api/data/lpa-list.csv ./data/lpa-list.csv
COPY packages/appeals-service-api/api ./api
COPY packages/appeals-service-api/src ./src

RUN npm ci --omit=dev --workspaces=false


# Stage 2/2: App Run
FROM build AS app

WORKDIR /opt/app



EXPOSE 3000

USER node

CMD [ "npm", "start" ]
