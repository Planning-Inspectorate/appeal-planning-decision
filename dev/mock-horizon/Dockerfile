FROM node:18-alpine

# copy app
WORKDIR /opt/dev/mock-horizon
ADD dev/mock-horizon .

# copy workspace deps
COPY package.json /opt/
COPY package-lock.json /opt/

# install from root
WORKDIR /opt
RUN npm ci --omit=dev

WORKDIR /opt/dev/mock-horizon

CMD [ "npm", "start" ]