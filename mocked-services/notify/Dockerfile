FROM node:18-alpine
WORKDIR /opt/mocked-services/notify
ADD mocked-services/notify .

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/

# install from root
WORKDIR /opt
RUN npm ci --omit=dev --workspace=notify

WORKDIR /opt/mocked-services/notify

CMD [ "npm", "start" ]
