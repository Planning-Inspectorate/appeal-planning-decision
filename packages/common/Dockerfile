FROM node:14-alpine
WORKDIR /opt/app
ADD src src
ADD webpack.common.js webpack.common.js
ADD webpack.dev.js webpack.dev.js
ADD webpack.prod.js webpack.prod.js
ADD package.json package.json
ADD package-lock.json package-lock.json
# Install everything, and run the build to ensure the webpack build process runs and generates the needed files
RUN npm install && npm run build
# The `npm ci` command will then wipe out the `node_modules` dir, and reinstall without the development dependencies
RUN npm ci --production
USER node
