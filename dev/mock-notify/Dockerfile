FROM node:20-alpine

# copy app
WORKDIR /opt/dev/mock-notify
ADD dev/mock-notify .

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/

# install from root
WORKDIR /opt
RUN npm ci --omit=dev

WORKDIR /opt/dev/mock-notify

CMD [ "npm", "start" ]
