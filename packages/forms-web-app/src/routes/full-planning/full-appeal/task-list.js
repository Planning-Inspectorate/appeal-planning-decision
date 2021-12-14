const express = require('express');
const taskListController = require('../../../controllers/full-planning/full-appeal/task-list');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get('/task-list', [fetchExistingAppealMiddleware], taskListController.getTaskList);

module.exports = router;
