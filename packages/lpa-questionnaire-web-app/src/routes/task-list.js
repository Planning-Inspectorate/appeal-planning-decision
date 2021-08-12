const express = require('express');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const taskListController = require('../controllers/task-list');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get(
  '/:id/task-list',
  [authenticate, fetchExistingAppealReplyMiddleware],
  taskListController.getTaskList
);

module.exports = router;
