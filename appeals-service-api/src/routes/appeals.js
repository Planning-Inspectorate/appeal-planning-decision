const { Router } = require('express');
const appealsController = require('../controllers/appeals');
const validateDto = require('../middleware/validateDto');
const appealDto = require('../dto/updateAppeal');

const routes = new Router();

routes.post('/', appealsController.create);

routes.get('/:id', appealsController.get);

routes.put('/:id', validateDto(appealDto), appealsController.update);

module.exports = routes;
