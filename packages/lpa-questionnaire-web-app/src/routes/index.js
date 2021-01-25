const express = require('express');

const router = express.Router();

const homeRouter = require('./home');
const taskListRouter = require('./task-list');

router.use(homeRouter);
router.use(taskListRouter);

module.exports = router;
