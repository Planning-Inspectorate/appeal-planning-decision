const { Router } = require('express');
const replyController = require('../controllers/reply');

const routes = new Router();

routes.post('/', replyController.create);
routes.get('/:id', replyController.get);
routes.put('/:id', replyController.update);

routes.get('/appeal/:id', replyController.getByAppeal);

module.exports = routes;
