const express = require('express');

const router = express.Router();

const homeRouter = require('./home');
const taskListRouter = require('./task-list');
const placeholderRouter = require('./placeholder');

router.use(homeRouter);
router.use(taskListRouter);
router.use(placeholderRouter);

module.exports = router;
