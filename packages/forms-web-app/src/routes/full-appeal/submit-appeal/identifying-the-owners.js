const express = require('express');
const {
  constants: { I_AGREE },
} = require('@pins/business-rules');
const {
  getIdentifyingTheOwners,
  postIdentifyingTheOwners,
} = require('../../../controllers/full-appeal/submit-appeal/identifying-the-owners');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

const controllerUrl = '/submit-appeal/identifying-the-owners';

router.get(controllerUrl, [fetchExistingAppealMiddleware], getIdentifyingTheOwners);
router.post(
  controllerUrl,
  optionsValidationRules({
    fieldName: 'identifying-the-owners',
    validOptions: [I_AGREE],
    emptyError: `Confirm if you've attempted to identify the landowners`,
  }),
  validationErrorHandler,
  postIdentifyingTheOwners
);

module.exports = router;
