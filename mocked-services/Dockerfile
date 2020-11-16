FROM node:alpine
WORKDIR /opt/app
ADD . .
RUN npm ci
CMD [ "npm", "start" ]
