const { Router } = require('express');
const appealsController = require('../controllers/appeals');
const validateDto = require('../middleware/validateDto');
const appealDto = require('../dto/updateAppeal');

const routes = new Router();

routes.get('/:id', appealsController.get);

routes.post('/', appealsController.create);

routes.put('/:id', validateDto(appealDto), appealsController.replace);

routes.patch('/:id', appealsController.update);

module.exports = routes;
