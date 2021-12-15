const express = require('express');

const router = express.Router();

const taskListRouter = require('./task-list');
const checkAnswersRouter = require('./check-answers');

router.use(taskListRouter);
router.use(checkAnswersRouter);

module.exports = router;
