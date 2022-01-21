const express = require('express');
const {
  getOwnAllTheLand,
  postOwnAllTheLand,
} = require('../../../controllers/full-appeal/submit-appeal/own-all-the-land');
const fetchExistingAppealMiddleware = require('../../../middleware/fetch-existing-appeal');
const { validationErrorHandler } = require('../../../validators/validation-error-handler');
const { rules: yesNoValidationRules } = require('../../../validators/common/yes-no');

const router = express.Router();

router.get('/submit-appeal/own-all-the-land', [fetchExistingAppealMiddleware], getOwnAllTheLand);
router.post(
  '/submit-appeal/own-all-the-land',
  yesNoValidationRules(
    'own-all-the-land',
    'Select yes if you own all the land involved in the appeal'
  ),
  validationErrorHandler,
  postOwnAllTheLand
);

module.exports = router;
