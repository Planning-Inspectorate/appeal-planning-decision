const express = require('express');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const confirmAnswersController = require('../controllers/confirm-answers');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/confirm-answers',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  confirmAnswersController
);

module.exports = router;
