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

routes.use('/appeals', appeals);
routes.use('/local-planning-authorities', lpas);
routes.use('/api-docs', apidocs);

module.exports = routes;
