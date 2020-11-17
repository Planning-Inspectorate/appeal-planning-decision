const config = require('../lib/config');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Appeals Service API Documentation',
    version: '1.0.0',
    license: {
      name: 'www.foundry4.com',
      url: '',
    },
  },
  servers: [
    {
      url: `http://localhost:${config.server.port}/`,
    },
  ],
};

module.exports = swaggerDef;
