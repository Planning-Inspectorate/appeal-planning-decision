const express = require('express');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const checkAnswersController = require('../../../controllers/full-appeal/submit-appeal/check-answers');

const router = express.Router();

router.get(
  '/submit-appeal/check-answers',
  [fetchExistingAppealMiddleware],
  checkAnswersController.getCheckAnswers
);

module.exports = router;
