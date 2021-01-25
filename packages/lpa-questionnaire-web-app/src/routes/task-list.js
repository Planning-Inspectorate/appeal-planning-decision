const express = require('express');
const taskListController = require('../controllers/task-list');
const fetchExistingQuestionnaireMiddleware = require('../middleware/fetch-existing-questionnaire');

const router = express.Router();

router.get('/task-list', [fetchExistingQuestionnaireMiddleware], taskListController.getTaskList);

module.exports = router;
