FROM node:18-alpine
WORKDIR /opt/app/data
ADD . .
WORKDIR /opt/app
ADD package-lock.json .

RUN npm ci --omit=dev

WORKDIR /opt/app/data

CMD [ "npm", "start" ]
