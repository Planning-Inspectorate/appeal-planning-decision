const express = require('express');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const confirmAnswersController = require('../controllers/confirm-answers');
const alreadySubmittedMiddleware = require('../middleware/already-submitted');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/confirm-answers',
  [
    authenticate,
    fetchAppealMiddleware,
    fetchExistingAppealReplyMiddleware,
    alreadySubmittedMiddleware,
  ],
  confirmAnswersController
);

module.exports = router;
