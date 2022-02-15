const express = require('express');

const procedureTypeController = require('../../controllers/full-appeal/procedure-type');
const fetchAppealMiddleware = require('../../middleware/common/fetch-appeal');
const fetchExistingAppealReplyMiddleware = require('../../middleware/common/fetch-existing-appeal-reply');
const alreadySubmittedMiddleware = require('../../middleware/already-submitted');
const { validationErrorHandler } = require('../../validators/validation-error-handler');
const {
  rules: procedureTypeValidationRules,
} = require('../../validators/full-appeal/procedure-type');

const router = express.Router();

router.get(
  '/full-appeal/:id/procedure-type',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
  procedureTypeController.getProcedureType
);

router.post(
  '/full-appeal/:id/procedure-type',
  [fetchAppealMiddleware, fetchExistingAppealReplyMiddleware, alreadySubmittedMiddleware],
  procedureTypeValidationRules(),
  validationErrorHandler,
  procedureTypeController.postProcedureType
);

module.exports = router;
