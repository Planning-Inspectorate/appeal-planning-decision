const express = require('express');
const {
  validators: { validationErrorHandler },
} = require('@pins/common');
const otherAppealsController = require('../controllers/other-appeals');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const fetchAppealMiddleware = require('../middleware/fetch-appeal');
const { rules: otherAppealsValidationRules } = require('../validators/other-appeals');

const router = express.Router();

router.get(
  '/:id/other-appeals',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware],
  otherAppealsController.getOtherAppeals
);

router.post(
  '/:id/other-appeals',
  otherAppealsValidationRules(),
  validationErrorHandler,
  otherAppealsController.postOtherAppeals
);

module.exports = router;
