const express = require('express');
const otherAppealsController = require('../controllers/other-appeals');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: otherAppealsValidationRules } = require('../validators/other-appeals');
const authenticate = require('../middleware/authenticate');

const router = express.Router();

router.get(
  '/:id/other-appeals',
  [authenticate, fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  otherAppealsController.getOtherAppeals
);

router.post(
  '/:id/other-appeals',
  authenticate,
  otherAppealsValidationRules(),
  validationErrorHandler,
  otherAppealsController.postOtherAppeals
);

module.exports = router;
