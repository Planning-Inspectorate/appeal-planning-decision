const express = require('express');

const taskListController = require('../../controllers/full-appeal/task-list');

const router = express.Router({ mergeParams: true });

router.get('/task-list', taskListController.getTaskList);

module.exports = router;
