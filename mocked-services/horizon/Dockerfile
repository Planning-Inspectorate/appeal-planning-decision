FROM node:18-alpine

WORKDIR /opt/mocked-services/horizon
ADD mocked-services/horizon .

# copy workspace deps
COPY ../../package.json /opt/
COPY ../../package-lock.json /opt/

# install from root
WORKDIR /opt
RUN npm ci --omit=dev --workspace=horizon

WORKDIR /opt/mocked-services/horizon

CMD [ "npm", "start" ]