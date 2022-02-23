const express = require('express');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const {
  getCheckYourAnswers,
} = require('../../../controllers/full-appeal/submit-appeal/check-your-answers');

const router = express.Router();

router.get(
  '/submit-appeal/check-your-answers',
  [fetchExistingAppealMiddleware],
  getCheckYourAnswers
);

module.exports = router;
