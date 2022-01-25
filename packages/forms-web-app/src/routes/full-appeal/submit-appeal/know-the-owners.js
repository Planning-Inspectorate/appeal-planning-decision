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
const errorMessage = require('../../../lib/full-appeal/error-message/know-the-owners');

const router = express.Router();

router.get('/submit-appeal/know-the-owners', [fetchExistingAppealMiddleware], getKnowTheOwners);
router.post(
  '/submit-appeal/know-the-owners',
  optionsValidationRules({
    fieldName: 'know-the-owners',
    validOptions: Object.values(KNOW_THE_OWNERS),
    emptyError: errorMessage,
  }),
  validationErrorHandler,
  postKnowTheOwners
);

module.exports = router;
