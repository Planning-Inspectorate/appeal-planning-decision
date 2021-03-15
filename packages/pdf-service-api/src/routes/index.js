const { Router } = require('express');
const apidocs = require('./api-docs');
const pdf = require('./pdf');

const routes = Router();

routes.use('/api-docs', apidocs);
routes.use('/api/v1/pdf', pdf);

module.exports = routes;
