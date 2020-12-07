/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const { Router } = require('express');
const appeals = require('./appeals');
const lpas = require('./localPlanningAuthorities');
const apidocs = require('./api-docs');

const routes = Router();

routes.use('/api/v1/appeals', appeals);
routes.use('/api/v1/local-planning-authorities', lpas);
routes.use('/api-docs', apidocs);

module.exports = routes;
