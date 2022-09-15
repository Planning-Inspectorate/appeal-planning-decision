#######################
### Stage 1 : Build ###
#######################

FROM mhart/alpine-node:14 AS build 
WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .

#########################
### Stage 2 : App Run ###
#########################

FROM mhart/alpine-node:slim-14
WORKDIR /app
COPY --from=0 /app .
COPY . .
EXPOSE 3000
CMD ["node", "src/main.js"]
