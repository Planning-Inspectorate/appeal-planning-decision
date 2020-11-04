/**
 * Routes
 *
 * This puts all the endpoints into the application.
 */

const { Router } = require('express');
const appeals = require('./appeals');

const routes = Router();

routes.use('/appeals', appeals);

module.exports = routes;
