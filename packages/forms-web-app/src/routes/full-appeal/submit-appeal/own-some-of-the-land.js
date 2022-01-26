const express = require('express');
const {
  getOwnSomeOfTheLand,
  postOwnSomeOfTheLand,
} = require('../../../controllers/full-appeal/submit-appeal/own-some-of-the-land');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get(
  '/submit-appeal/own-some-of-the-land',
  [fetchExistingAppealMiddleware],
  getOwnSomeOfTheLand
);
router.post(
  '/submit-appeal/own-some-of-the-land',
  optionsValidationRules({
    fieldName: 'own-some-of-the-land',
    emptyError: 'Select yes if you own some of the land involved in the appeal',
  }),
  validationErrorHandler,
  postOwnSomeOfTheLand
);

module.exports = router;
