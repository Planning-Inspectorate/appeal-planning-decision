/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const { Router } = require('express');
const apidocs = require('./api-docs');

const routes = Router();

routes.use('/api-docs', apidocs);

module.exports = routes;
