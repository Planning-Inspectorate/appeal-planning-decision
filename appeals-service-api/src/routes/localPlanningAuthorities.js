const { Router } = require('express');
const lpaController = require('../controllers/localPlanningAuthorities');

const routes = new Router();

routes.route('/').get(lpaController.list);

routes.route('/:id').get(lpaController.get);

module.exports = routes;
