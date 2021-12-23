const express = require('express');

const router = express.Router();

const taskListRouter = require('./task-list');
const checkAnswersRouter = require('./check-answers');
const contactDetailsRouter = require('./contact-details');

router.use(taskListRouter);
router.use(checkAnswersRouter);
router.use(contactDetailsRouter);

module.exports = router;
