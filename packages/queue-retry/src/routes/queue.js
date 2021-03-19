const { Router } = require('express');

const queueController = require('../controllers/queue');

const routes = Router({ mergeParams: true });

routes
  .get('/', queueController.listConnections)
  .get('/:connectionId', queueController.listQueues)
  .get('/:connectionId/:queueId', queueController.getMessagesOnQueue)
  .post('/:connectionId/:queueId/requeue', queueController.requeue);

module.exports = routes;
