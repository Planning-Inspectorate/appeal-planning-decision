ARG WATCHDOG_VERSION="0.8.2"
ARG NODE_VERSION=14-alpine
FROM --platform=${TARGETPLATFORM:-linux/amd64} openfaas/of-watchdog:${WATCHDOG_VERSION} as watchdog

FROM node:${NODE_VERSION}
COPY --from=watchdog /fwatchdog /usr/bin/fwatchdog
WORKDIR /home/node
COPY . .
RUN npm ci --production
WORKDIR /home/node/function
COPY function .
RUN npm ci --production
WORKDIR /home/node
RUN chown node:node -R /home/node \
  && chmod 777 /tmp
ENV NPM_CONFIG_LOGLEVEL warn
ENV cgi_headers="true"
ENV fprocess="node index.js"
ENV mode="http"
ENV upstream_url="http://127.0.0.1:3000"
ENV exec_timeout="10s"
ENV write_timeout="15s"
ENV read_timeout="15s"
ENV prefix_logs="false"
ENV LOGGER_LEVEL=trace
USER node
HEALTHCHECK --interval=3s CMD [ -e /tmp/.lock ] || exit 1
CMD ["fwatchdog"]
