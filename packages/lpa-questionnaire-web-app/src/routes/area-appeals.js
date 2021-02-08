const express = require('express');
const areaAppealsController = require('../controllers/area-appeals');
const fetchExistingAppealReplyMiddleware = require('../middleware/fetch-existing-appeal-reply');
const { validationErrorHandler } = require('../validators/validation-error-handler');
const { rules: applicantNameValidationRules } = require('../validators/area-appeals');

const router = express.Router();

router.get(
  '/other-appeals',
  [fetchExistingAppealReplyMiddleware],
  areaAppealsController.getAreaAppeals
);

router.post(
  '/other-appeals',
  applicantNameValidationRules(),
  validationErrorHandler,
  areaAppealsController.postAreaAppeals
);

module.exports = router;
