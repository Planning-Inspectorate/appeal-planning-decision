FROM node:20-alpine

# copy app
WORKDIR /opt/app/data
ADD dev/data .

# copy workspace deps
WORKDIR /opt/app
ADD package.json .
ADD package-lock.json .

# install from root
RUN npm ci --omit=dev

WORKDIR /opt/app/data

CMD [ "npm", "start" ]
