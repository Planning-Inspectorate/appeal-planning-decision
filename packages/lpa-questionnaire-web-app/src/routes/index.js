const express = require('express');

const router = express.Router();

const homeRouter = require('./home');
const taskListRouter = require('./task-list');
const otherAppealsRouter = require('./other-appeals');
const placeholderRouter = require('./placeholder');

router.use(homeRouter);
router.use(taskListRouter);
router.use(otherAppealsRouter);
router.use(placeholderRouter);

module.exports = router;
