const express = require('express');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const taskListController = require('../controllers/task-list');
const alreadySubmittedMiddleware = require('../middleware/already-submitted');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/task-list',
  [fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
  taskListController.getTaskList
);

module.exports = router;
