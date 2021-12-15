const express = require('express');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');

const checkAnswersController = require('../../../controllers/full-planning/full-appeal/check-answers');

const router = express.Router();

router.get(
  '/check-answers',
  [fetchExistingAppealMiddleware],
  checkAnswersController.getCheckAnswers
);

module.exports = router;
