const express = require('express');

const taskListController = require('../controllers/task-list');

const router = express.Router();

router.get('/', taskListController.getTaskList);

module.exports = router;
