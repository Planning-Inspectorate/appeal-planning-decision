const express = require('express');
const otherAppealsController = require('../controllers/other-appeals');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: otherAppealsValidationRules } = require('../validators/other-appeals');

const router = express.Router();

router.get(
  '/:id/other-appeals',
  [fetchExistingAppealReplyMiddleware],
  otherAppealsController.getOtherAppeals
);

router.post(
  '/:id/other-appeals',
  otherAppealsValidationRules(),
  validationErrorHandler,
  otherAppealsController.postOtherAppeals
);

module.exports = router;
