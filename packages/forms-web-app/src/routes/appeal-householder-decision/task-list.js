const express = require('express');
const { getTaskList } = require('../../controllers/appeal-householder-decision/task-list');
const fetchExistingAppealMiddleware = require('../../middleware/fetch-existing-appeal');

const router = express.Router();

router.get('/task-list', [fetchExistingAppealMiddleware], getTaskList);

module.exports = router;
