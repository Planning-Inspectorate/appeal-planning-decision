const express = require('express');
const {
  getOwnAllTheLand,
  postOwnAllTheLand,
} = require('../../../controllers/full-appeal/submit-appeal/own-all-the-land');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: optionsValidationRules } = require('../../../validators/common/options');

const router = express.Router();

router.get('/submit-appeal/own-all-the-land', [fetchExistingAppealMiddleware], getOwnAllTheLand);
router.post(
  '/submit-appeal/own-all-the-land',
  optionsValidationRules({
    fieldName: 'own-all-the-land',
    emptyError: 'Select yes if you own all the land involved in the appeal',
  }),
  validationErrorHandler,
  postOwnAllTheLand
);

module.exports = router;
