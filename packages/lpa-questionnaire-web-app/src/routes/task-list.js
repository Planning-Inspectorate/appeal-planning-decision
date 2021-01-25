const express = require('express');
const taskListController = require('../controllers/task-list');

const router = express.Router();

router.get('/task-list', taskListController.getTaskList);

module.exports = router;
