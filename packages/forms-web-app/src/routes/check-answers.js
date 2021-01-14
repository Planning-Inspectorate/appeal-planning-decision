const express = require('express');
const fetchExistingAppealMiddleware = require('../middleware/fetch-existing-appeal');

const checkAnswersController = require('../controllers/check-answers');

const router = express.Router();

router.get('/', [fetchExistingAppealMiddleware], checkAnswersController.getCheckAnswers);

module.exports = router;
