const express = require('express');
const { renderTaskList } = require('../controller');

const router = express.Router();

router.get('/questionnaire/:caseRef', renderTaskList);

module.exports = router;
