/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const { Router } = require('express');
const apidocs = require('./api-docs');
const application = require('./application');

const routes = Router({ mergeParams: true });

routes.use('/api-docs', apidocs);
routes.use('/api/v1/:applicationId', application);

console.log(process.env);

module.exports = routes;
