const express = require('express');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const taskListController = require('../controllers/task-list');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/task-list',
  [fetchExistingAppealReplyMiddleware],
  taskListController.getTaskList
);

module.exports = router;
