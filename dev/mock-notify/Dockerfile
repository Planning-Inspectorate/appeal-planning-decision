FROM node:22-alpine

# copy app
WORKDIR /opt/dev/mock-notify
ADD dev/mock-notify .

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/

# install from root
WORKDIR /opt
RUN npm ci --workspaces --if-present --omit=dev

WORKDIR /opt/dev/mock-notify

CMD [ "npm", "start" ]
