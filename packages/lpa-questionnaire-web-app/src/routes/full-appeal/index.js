const express = require('express');

const router = express.Router({ mergeParams: true });

const taskListRouter = require('./task-list');
const procedureTypeRouter = require('./procedure-type');

router.use(taskListRouter);
router.use(procedureTypeRouter);

module.exports = router;
