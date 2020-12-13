const { Router } = require('express');
const appealsController = require('../controllers/appeals');
const validateDto = require('../middleware/validateDto');
const existingAppealDto = require('../dto/updateAppeal');
const insertAppealDto = require('../dto/insertAppeal');

const routes = new Router();

routes.get('/', appealsController.create);

routes.get('/:id', appealsController.get);

routes.post('/', validateDto(insertAppealDto), appealsController.insert);

routes.put('/:id', validateDto(existingAppealDto), appealsController.update);

module.exports = routes;
