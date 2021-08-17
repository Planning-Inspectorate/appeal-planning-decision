const express = require('express');
const otherAppealsController = require('../controllers/other-appeals');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: otherAppealsValidationRules } = require('../validators/other-appeals');
const alreadySubmittedMiddleware = require('../middleware/already-submitted');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get(
  '/appeal-questionnaire/:id/other-appeals',
  [
    authenticate,
    fetchAppealMiddleware,
    fetchExistingAppealReplyMiddleware,
    alreadySubmittedMiddleware,
  ],
  otherAppealsController.getOtherAppeals
);

router.post(
  '/appeal-questionnaire/:id/other-appeals',
  authenticate,
  otherAppealsValidationRules(),
  validationErrorHandler,
  otherAppealsController.postOtherAppeals
);

module.exports = router;
