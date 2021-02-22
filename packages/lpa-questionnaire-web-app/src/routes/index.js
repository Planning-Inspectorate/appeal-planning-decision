const express = require('express');

const router = express.Router();

const homeRouter = require('./home');
const taskListRouter = require('./task-list');
const otherAppealsRouter = require('./other-appeals');
const placeholderRouter = require('./placeholder');
const extraConditionsRouter = require('./extra-conditions');

router.use(homeRouter);
router.use(taskListRouter);
router.use(otherAppealsRouter);
router.use(placeholderRouter);
router.use(extraConditionsRouter);

module.exports = router;
