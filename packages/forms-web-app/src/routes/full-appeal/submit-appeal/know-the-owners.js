const express = require('express');
const {
  constants: { KNOW_THE_OWNERS },
} = require('@pins/business-rules');
const {
  getKnowTheOwners,
  postKnowTheOwners,
} = require('../../../controllers/full-appeal/submit-appeal/know-the-owners');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get('/submit-appeal/know-the-owners', [fetchExistingAppealMiddleware], getKnowTheOwners);
router.post(
  '/submit-appeal/know-the-owners',
  optionsValidationRules(
    'know-the-owners',
    'Select if you know who owns the rest of the land involved in the appeal',
    Object.values(KNOW_THE_OWNERS)
  ),
  validationErrorHandler,
  postKnowTheOwners
);

module.exports = router;
