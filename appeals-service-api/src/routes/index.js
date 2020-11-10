/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const { Router } = require('express');
const appeals = require('./appeals');
const lpas = require('./localPlanningAuthorities');

const routes = Router();

routes.use('/appeals', appeals).use('/local-planning-authorities', lpas);

module.exports = routes;
