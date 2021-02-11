const { Router } = require('express');
const appealsController = require('../controllers/appeals');
const validateDto = require('../middleware/validateDto');
const putAppeal = require('../dto/putAppeal');
const patchAppeal = require('../dto/patchAppeal');

const routes = new Router();

routes.get('/:id', appealsController.get);

routes.post('/', appealsController.create);

routes.put('/:id', validateDto(putAppeal), appealsController.replace);

routes.patch('/:id', validateDto(patchAppeal), appealsController.update);

module.exports = routes;
