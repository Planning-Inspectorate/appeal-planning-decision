const express = require('express');
const taskListController = require('../../controllers/appellant-submission/task-list');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get('/details', [fetchExistingAppealMiddleware], taskListController.getTaskList);

module.exports = router;
