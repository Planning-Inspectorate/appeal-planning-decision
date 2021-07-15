FROM node:14-alpine
WORKDIR /opt/app
ADD . .
RUN npm ci
CMD [ "npm", "start" ]
