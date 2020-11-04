const { Router } = require('express');
const appealsController = require('../controllers/appeals');

const routes = new Router();

routes.route('/').post(appealsController.create).get(appealsController.list);

routes
  .route('/:uuid')
  .delete(appealsController.delete)
  .get(appealsController.get)
  .put(appealsController.update);

module.exports = routes;
