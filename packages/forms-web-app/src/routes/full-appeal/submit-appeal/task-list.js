const express = require('express');
const taskListController = require('../../../controllers/full-appeal/submit-appeal/task-list');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get(
  '/submit-appeal/task-list',
  [fetchExistingAppealMiddleware],
  taskListController.getTaskList
);

module.exports = router;
