FROM node:22-alpine

# copy app
WORKDIR /opt/dev/data
COPY dev/data .

# copy workspace deps
WORKDIR /opt
COPY package.json .
COPY package-lock.json .

# install from root
RUN npm ci --workspaces --if-present --omit=dev --ignore-scripts

WORKDIR /opt/app/data

CMD [ "npm", "start" ]
