FROM node:22-alpine3.22

#COPY ZscalerRootCA.crt /usr/local/share/ca-certificates/ZscalerRootCA.crt
#ENV NODE_EXTRA_CA_CERTS=/usr/local/share/ca-certificates/ZscalerRootCA.crt
#RUN cat /usr/local/share/ca-certificates/ZscalerRootCA.crt >> /etc/ssl/certs/ca-certificates.crt

# add chromium
RUN apk add --no-cache \
    chromium \
    freetype \
    harfbuzz \
    ttf-freefont
    # perhaps needed if we do web requests?
    # ca-certificates \
    # nss \

WORKDIR /opt

# Copy deps
COPY packages/pdf-service-api/package*.json ./packages/pdf-service-api/
COPY package*.json ./

# Install
RUN npm ci --workspaces --if-present --omit=dev --ignore-scripts

# Copy app
WORKDIR /opt/packages/pdf-service-api
COPY packages/pdf-service-api/src ./src

ARG GIT_SHA
ENV GIT_SHA=$GIT_SHA

EXPOSE 3000

USER node

CMD ["npm", "start"]

