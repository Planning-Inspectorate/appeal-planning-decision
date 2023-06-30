FROM node:18-alpine
WORKDIR /opt/app
ADD . .
RUN npm ci --omit=dev
CMD [ "npm", "start" ]
